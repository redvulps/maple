import React, { ReactNode } from "react";

import { IRedisKey } from ".";

export interface IFolderProps {
  childrenKeys: JSX.Element | JSX.Element[] | null;
  expanded: boolean;
  deepness: number;
  redisKey: IRedisKey;
  toggleExpand: (key: IRedisKey) => void;
}

const Folder = (props: IFolderProps) => {
  const { childrenKeys, deepness, expanded, redisKey, toggleExpand } = props;

  return (
    <>
      <a onClick={() => toggleExpand(redisKey)} style={{ marginLeft: `${deepness * 15}px` }}>
        {expanded ? "-" : "+"}
        {redisKey.name}
      </a>
      {expanded ? childrenKeys : null}
    </>
  );
};

export default Folder;
