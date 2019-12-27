import React, { useEffect, useState } from 'react';
import Redis from 'redis';

export interface IDatabaseSelectorProps {
  redisInstance: Redis.RedisClient;
  currentDatabase: number;
  onSelectDatabase: (databaseId: number) => void;
}

const DatabaseSelector = (props: IDatabaseSelectorProps) => {
  const { currentDatabase, onSelectDatabase, redisInstance } = props;
  const [databaseCount, setDatabaseCount] = useState(0);

  useEffect(() => {
    redisInstance.config("get", "databases", (err, result: any) => {
      // TODO: Add error handler
      setDatabaseCount(parseInt(result[1]));
    });
  }, []);

  const databaseList = new Array(databaseCount).fill(0).map((_, index) => (
    <option key={index} value={index} defaultChecked={index === currentDatabase}>Database {index}</option>
  ));

  return (
    <div>
      <select onChange={(e) => onSelectDatabase(parseInt(e.target.value))}>
        { databaseList }
      </select>
    </div>
  );
};

export default DatabaseSelector;
