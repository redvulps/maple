import React, { useState, useEffect } from 'react';
import Redis from 'redis';

import { IRedisKey } from '../KeyTree';

export interface IKeyViewerProps {
  redisInstance: Redis.RedisClient;
  currentDatabase: number;
  currentKey: IRedisKey | null;
}

const KeyViewer = ({currentKey}: IKeyViewerProps) => {
  const [keyView, setKeyView] = useState<JSX.Element | null>(null);

  const renderKey = () => {
    if (keyView) {
      const Component = keyView;

      return (
        <Component />
      );
    } else {
      return (
        'Loading...'
      );
    }
  };

  useEffect(() => {
    if (currentKey) {

    }
  }, [currentKey]);

  return (
    <div>
      { currentKey ? renderKey() : "No key selected" }
    </div>
  );
}

export default KeyViewer;
