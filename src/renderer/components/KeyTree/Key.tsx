import React from "react";

import { IRedisKey } from ".";

export interface IKeyProps {
  redisKey: IRedisKey;
  keyType: string;
  deepness: number;
  onClick: (key: IRedisKey, keyType: string) => void;
}

const Key = ({ deepness, keyType, onClick, redisKey }: IKeyProps) => {
  const handleClick = () => onClick(redisKey, keyType);

  return (
    <div className="keytree__key" onClick={handleClick}>
      <span
        className={`key-type ${keyType}`}
        style={{ marginLeft: `${deepness * 24}px` }}
      >
        {keyType && keyType.toUpperCase()[0]}
      </span>
      <span className="key-description">{redisKey.name}</span>
    </div>
  );
};

export default Key;
