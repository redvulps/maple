import React from "react";

import { IRedisKey } from ".";

export interface IKeyProps {
  redisKey: IRedisKey;
  keyType: string;
  deepness: number;
  onClick: (key: IRedisKey, keyType: string) => void;
}

const Key = ({ deepness, keyType, onClick, redisKey }: IKeyProps) => (
  <div className="keytree__key" onClick={() => onClick(redisKey, keyType)}>
    <span
      className={`key-type ${keyType}`}
      style={{ marginLeft: `${deepness * 24}px` }}
    >
      {keyType.toUpperCase()[0]}
    </span>
    <span className="key-description">{redisKey.name}</span>
  </div>
);

export default Key;
