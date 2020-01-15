import React, { useEffect, useState, ChangeEvent } from "react";
import Redis from "redis";
import { promisify } from "util";

import Folder from "./Folder";
import Key from "./Key";

export interface IKeyTreeProps {
  redisInstance: Redis.RedisClient;
  currentDatabase: number;
  onSelectKey: (key: IRedisKey | null, keyType: string | null) => void;
}

export interface IRedisKey {
  name: string;
  path: string;
  expanded: boolean;
  children: Record<string, IRedisKey>;
}

interface KeyScanResult {
  keys: IRedisKey[];
  types: { [key: string]: string };
}

const KeyTree = (props: IKeyTreeProps) => {
  const { currentDatabase, redisInstance, onSelectKey } = props;

  const [keys, setKeys] = useState<IRedisKey[]>([]);
  const [filteredKeys, setFilteredKeys] = useState<IRedisKey[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [tree, setTree] = useState<Record<string, IRedisKey>>({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [keyTypes, setKeyTypes] = useState<{ [key: string]: string }>({});

  const scanForKeys = async (cursor = 0): Promise<KeyScanResult> => {
    return new Promise((accept, reject) => {
      redisInstance.multi()
        .select(currentDatabase)
        .scan(cursor.toString(), async (err, result: [string, string[]]) => {
          if (err) {
            // TODO: Add error handler
          } else {
            const nextCursor = parseInt(result[0]);
            const pipeline = redisInstance.multi();
            const typeAsync = promisify(pipeline.type).bind(pipeline);

            const newKeys: IRedisKey[] = result[1].map((key: string) => {
              const keyParts = key.split(":");
              typeAsync(key);

              return {
                name: keyParts[keyParts.length - 1],
                path: key,
                expanded: false,
                children: {}
              };
            });

            const typeList = await promisify(pipeline.exec).bind(pipeline)();
            const resultKeyTypes: { [key: string]: string } = result[1]
              .map((key: string, index) => ({ [key]: typeList[index] }))
              .reduce((acc, current: any) => {
                return { ...acc, ...current };
              }, {});

            if (nextCursor === 0) {
              accept({
                keys: newKeys,
                types: resultKeyTypes
              });
            } else {
              const scanResult = await scanForKeys(nextCursor);

              accept({
                keys: newKeys.concat(scanResult.keys),
                types: {
                  ...scanResult.types,
                  ...resultKeyTypes
                },
              });
            }
          }
        })
        .exec();
    });
  };

  const keysToTree = () => {
    const newTree: Record<string, IRedisKey> = {};
    let lastTree: Record<string, IRedisKey> = {};
    let lastKey = "";

    const subKeyToTree = (subkey: string) => {
      if (Object.keys(lastTree).indexOf(subkey) === -1) {
        lastTree[subkey] = {
          path: `${lastKey}${subkey}`,
          name: subkey,
          expanded: false,
          children: {}
        };
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
  };

  const toggleExpand = (key: IRedisKey) => {
    let newExpanded;
    const isExpanded = expanded.find((e) => e === key.path);

    if (isExpanded) {
      newExpanded = expanded.filter((e) => e !== key.path);
    } else {
      newExpanded = [key.path].concat(expanded);
    }

    setExpanded(newExpanded);
  };

  const renderTree = (keys: Record <string, IRedisKey>, deepness: number = 0) => {
    if (isScanning) {
      return (
        <div className="loading">
          Loading...
        </div>
      );
    }

    const keyTree = Object.keys(keys).map((keyName: string) => {
      const key: IRedisKey = keys[keyName];
      const childrenLength = Object.keys(key.children).length;
      const isExpanded = !!expanded.find((e) => e === key.path);

      let childrenContainer = null;

      if (childrenLength && expanded) {
        childrenContainer = renderTree(key.children, deepness + 1);
      }

      if (childrenLength > 0) {
        return (
          <Folder
            key={key.path}
            redisKey={key}
            childrenKeys={childrenContainer}
            expanded={isExpanded}
            onToggleExpand={toggleExpand}
            deepness={deepness}
          />
        );
      }

      return (
        <Key
          key={key.path}
          redisKey={key}
          keyType={keyTypes[key.path]}
          deepness={deepness}
          onClick={onSelectKey}
        />
      );
    });

    if (keyTree.length) {
      return keyTree;
    }

    return (
      <div className="empty">
        <div>Database is empty</div>
        <button>Add a key</button>
      </div>
    );
  };

  const renderSearch = () => {
    return filteredKeys.map((key) => (
      <Key
        key={key.path}
        redisKey={key}
        keyType={keyTypes[key.path]}
        deepness={0}
        onClick={onSelectKey}
      />
    ));
  };

  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value);

  useEffect(() => {
    if (keys.length) {
      keysToTree();
    }
  }, [keys]);

  useEffect(() => {
    setIsScanning(true);

    const getKeys = async () => {
      const scanResult = await scanForKeys();

      setKeys(scanResult.keys);
      setKeyTypes(scanResult.types);
      setIsScanning(false);
    };

    getKeys();
  }, []);

  useEffect(() => {
    if (searchKeyword.length) {
      setFilteredKeys(keys.filter((key) => key.path.match(new RegExp(searchKeyword, "ig")) !== null));
    } else {
      setFilteredKeys([]);
    }
  }, [searchKeyword]);

  return (
    <div className="keytree">
      <div className="keytree-filter">
        <input type="text" onChange={handleKeywordChange} />
      </div>
      <div className="keytree-list">
        {searchKeyword.length ? renderSearch() : renderTree(tree)}
      </div>
    </div>
  );
};

export default KeyTree;
