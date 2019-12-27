import React, { ReactNode } from "react";

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

  return (
    <>
      <a onClick={() => onToggleExpand(redisKey)} style={{ marginLeft: `${deepness * 15}px` }}>
        {expanded ? "-" : "+"}
        {redisKey.name}
      </a>
      {expanded ? childrenKeys : null}
    </>
  );
};

export default Folder;
