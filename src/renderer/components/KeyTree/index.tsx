import React, { useEffect, useState } from 'react';
import Redis from 'redis';
import Folder from './Folder';
import Key from './Key';

export interface IKeyTreeProps {
  redisInstance: Redis.RedisClient;
  currentDatabase: number;
  onSelectKey: (key: IRedisKey) => void;
}

export interface IRedisKey {
  name: string;
  path: string;
  expanded: boolean;
  children: Record<string, IRedisKey>;
}

const KeyTree = (props: IKeyTreeProps) => {
  const { currentDatabase, redisInstance, onSelectKey } = props;
  
  const [keys, setKeys] = useState<IRedisKey[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [tree, setTree] = useState<Record<string, IRedisKey>>({});

  const scanForKeys = (cursor = 0) => {
    setIsScanning(true);

    redisInstance.multi()
      .select(currentDatabase)
      .scan(cursor.toString(), (err, result: [string, string[]]) => {
        if (err) {
          // TODO: Add error handler
        } else {
          const nextCursor = parseInt(result[0]);

          const newKeys: Array<IRedisKey> = result[1].map((key: string) => {
            const keyParts = key.split(":");

            return {
              name: keyParts[keyParts.length - 1],
              path: key,
              expanded: false,
              children: {}
            };
          });

          if (newKeys.length) {
            setKeys(newKeys.concat(keys));

            if (nextCursor !== 0) {
              scanForKeys(nextCursor);
            }
          }

          if (nextCursor === 0) {
            setIsScanning(false);
          }
        }
      })
      .exec();
  };

  const keysToTree = () => {
    let lastTree: Record<string, IRedisKey> = {};
    let newTree: Record<string, IRedisKey> = {};
    let lastKey = "";
    
    const subKeyToTree = (subkey: string) => {
      if (Object.keys(lastTree).indexOf(subkey) === -1) {
        lastTree[subkey] = {
          path: `${lastKey}${subkey}`,
          name: subkey,
          expanded: false,
          children: {}
        }
      }
      
      lastKey += `${subkey}:`;
      lastTree = lastTree[subkey].children;
    };
    
    const keyToTree = (key: IRedisKey) => {
      lastTree = newTree;
      lastKey = "";
      
      key.path.split(":").forEach(subKeyToTree);
    };
    
    keys.forEach(keyToTree);
    
    setTree(newTree);
    setKeys([]);
  }

  const toggleExpand = (key: IRedisKey) => {
    let newExpanded;
    const isExpanded = expanded.find((e) => e == key.path);

    if (isExpanded) {
      newExpanded = expanded.filter((e) => e !== key.path);
    } else {
      newExpanded = [key.path].concat(expanded);
    }

    setExpanded(newExpanded);
  }

  const renderTree = (keys: Record <string, IRedisKey>, deepness: number = 0) => {
    const keyTree = Object.keys(keys).map((keyName: string) => {
      const key: IRedisKey = keys[keyName];
      const childrenLength = Object.keys(key.children).length;
      const isExpanded = !!expanded.find((e) => e == key.path);

      let childrenContainer = null;

      if (childrenLength && expanded) {
        childrenContainer = renderTree(key.children, deepness + 1);
      }

      // if (childrenLength && expanded) {
      //   expanderIcon = faFolderOpen;
      //   childrenContainer = this.renderTree(key.children, deepness + 15);
      // } else if (childrenLength && !expanded) {
      //   expanderIcon = faFolder;
      // } else {
      //   expanderIcon = faKey;
      // }

      // return (
      //   <div key={`db.${this.props.database}.${key.path}`}>
      //     <a href="#" style={{ marginLeft: margin }} onClick={() => childrenLength > 0 ? this.toggleExpand(key) : this.makeClick(key)}>
      //       <FontAwesomeIcon className="mr-2" icon={expanderIcon} />
      //       {key.name}
      //     </a>
      //     {childrenContainer}
      //   </div>
      // );

      if (childrenLength > 0) {
        return (
          <Folder
            key={key.path}
            redisKey={key}
            childrenKeys={childrenContainer}
            expanded={isExpanded}
            onToggleExpand={toggleExpand}
            deepness={deepness} />
        );
      } else {
        return (
          <Key key={key.path} redisKey={key} deepness={deepness} onClick={onSelectKey} />
        )
      }
    });

    if (keyTree.length) {
      return keyTree;
    } else {
      return (
        <div>
          <div>Database is empty</div>
          <button>Add a key</button>
        </div>
      );
    }
  }

  useEffect(() => {
    if (!isScanning) {
      keysToTree();
    }
  }, [isScanning]);

  useEffect(() => {
    scanForKeys();
  }, [currentDatabase]);

  return (
    <div>
      {renderTree(tree)}
    </div>
  );
};

export default KeyTree;
