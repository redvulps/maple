import React from "react";

import { IRedisKey } from ".";

export interface IKeyProps {
  redisKey: IRedisKey;
  deepness: number;
}

const Key = ({ redisKey, deepness }: IKeyProps) => (
  <div style={{ marginLeft: `${deepness * 15}px` }}>
    {redisKey.name}
  </div>
);

export default Key;
