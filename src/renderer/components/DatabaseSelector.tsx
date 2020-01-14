import React, { useEffect, useState, ChangeEvent } from "react";
import Redis from "redis";

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

  const databaseList = Array(databaseCount).fill(0).map((_, index) => (
    <option key={index} value={index} defaultChecked={index === currentDatabase}>Database {index}</option>
  ));

  const handleSelectDatabase = (e: ChangeEvent<HTMLSelectElement>) => onSelectDatabase(parseInt(e.target.value));

  return (
    <div className="database-selector">
      <select onChange={handleSelectDatabase}>
        {databaseList}
      </select>
    </div>
  );
};

export default DatabaseSelector;
