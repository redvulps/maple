import React from 'react';
import Redis from 'redis';

export interface IKeyViewerProps {
  redisInstance: Redis.RedisClient;
}

const KeyViewer = (props: IKeyViewerProps) => (
  <div>
    keyviewer
  </div>
);

export default KeyViewer;
