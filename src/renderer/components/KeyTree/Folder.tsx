import React, { ReactNode } from "react";
import Icon from "@mdi/react";
import { mdiFolderOpen, mdiFolder } from "@mdi/js";

import { IRedisKey } from ".";

export interface IFolderProps {
  childrenKeys: JSX.Element | JSX.Element[] | null;
  expanded: boolean;
  deepness: number;
  redisKey: IRedisKey;
  onToggleExpand: (key: IRedisKey) => void;
}

const Folder = (props: IFolderProps) => {
  const { childrenKeys, deepness, expanded, redisKey, onToggleExpand } = props;
  const handleToggleExpand = () => onToggleExpand(redisKey);

  return (
    <>
      <div className="keytree__folder" onClick={handleToggleExpand}>
        <span className="folder-icon" style={{ marginLeft: `${deepness * 24}px` }}>
          <Icon color="white" path={expanded ? mdiFolderOpen : mdiFolder} />
        </span>
        <span className="folder-description">{redisKey.name}</span>
      </div>
      {expanded ? childrenKeys : null}
    </>
  );
};

export default Folder;
