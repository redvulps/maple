import React from "react";

import { IRedisKey } from ".";

export interface IKeyProps {
  redisKey: IRedisKey;
  deepness: number;
  onClick: (key: IRedisKey) => void;
}

const Key = ({ redisKey, deepness, onClick }: IKeyProps) => (
  <div style={{ marginLeft: `${deepness * 15}px` }}>
    <span onClick={() => onClick(redisKey)}>{redisKey.name}</span>
  </div>
);

export default Key;
