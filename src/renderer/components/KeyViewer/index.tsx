import React, { useState, useEffect } from "react";
import { RedisClient } from "redis";

import { IRedisKey } from "../KeyTree";
import { IBaseTypeProps } from "./IBaseTypeProps";

import Set from "./Set";
import ZSet from "./ZSet";
import List from "./List";
import Hash from "./Hash";
import String from "./String";

import "./index.sass";

const viewComponent: { [key: string]: (props: IBaseTypeProps) => JSX.Element } = {
  string: String,
  hash: Hash,
  list: List,
  zset: ZSet,
  set: Set,
};

export interface IKeyViewerProps {
  redisInstance: RedisClient;
  currentDatabase: number;
  currentKey: IRedisKey | null;
}

const KeyViewer = ({currentKey, redisInstance, currentDatabase}: IKeyViewerProps) => {
  const [keyView, setKeyView] = useState<string | null>(null);

  const renderKey = () => {
    if (keyView) {
      const Component: any = viewComponent[keyView];

      return (
        <Component
          currentKey={currentKey}
          redisInstance={redisInstance}
          currentDatabase={currentDatabase}
        />
      );
    }

    return (
      "Loading..."
    );
  };

  useEffect(() => {
    if (currentKey) {
      redisInstance
        .multi()
        .select(currentDatabase)
        .type(currentKey.path, (err, result: string) => {
          if (err) {
            console.warn(err);
            // TODO: Add error handling
          } else {
            setKeyView(result);
          }
        })
        .exec();
    }
  }, [currentKey]);

  return (
    <div className="key-viewer-container">
      <div className="title">{currentKey?.path || "No key selected"}</div>
      { currentKey && renderKey() || null }
    </div>
  );
}

export default KeyViewer;
