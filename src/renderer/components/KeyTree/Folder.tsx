import React, { ReactNode } from "react";
import Icon from '@mdi/react';
import { mdiFolderOpen, mdiFolder } from "@mdi/js";

import { IRedisKey } from ".";

import "./Folder.sass";

export interface IFolderProps {
  childrenKeys: JSX.Element | JSX.Element[] | null;
  expanded: boolean;
  deepness: number;
  redisKey: IRedisKey;
  onToggleExpand: (key: IRedisKey) => void;
}

const Folder = (props: IFolderProps) => {
  const { childrenKeys, deepness, expanded, redisKey, onToggleExpand } = props;

  return (
    <>
      <div className="folder-container highlight-hover" onClick={() => onToggleExpand(redisKey)}>
        <span className="folder-icon" style={{ marginLeft: `${deepness * 24}px` }}>
          <Icon size="18px" color="white" path={expanded ? mdiFolderOpen : mdiFolder} />
        </span>
        <span className="key-description">{redisKey.name}</span>
      </div>
      {expanded ? childrenKeys : null}
    </>
  );
};

export default Folder;
