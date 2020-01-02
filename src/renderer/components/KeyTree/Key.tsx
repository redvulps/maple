import React from "react";

import { IRedisKey } from ".";

import './Key.sass';

export interface IKeyProps {
  redisKey: IRedisKey;
  keyType: string;
  deepness: number;
  onClick: (key: IRedisKey) => void;
}

const Key = ({ deepness, keyType, onClick, redisKey }: IKeyProps) => (
  <div className="key-container" style={{ marginLeft: `${deepness * 15}px` }} onClick={() => onClick(redisKey)}>
    <span className={`key-type ${keyType}`}>{(keyType === "string" ? "str" : keyType).toUpperCase()}</span>
    <span>{redisKey.name}</span>
  </div>
);

export default Key;
