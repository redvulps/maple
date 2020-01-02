import { IRedisKey } from "../KeyTree";
import { RedisClient } from "redis";

export interface IBaseTypeProps {
  redisInstance: RedisClient;
  currentDatabase: number;
  currentKey: IRedisKey;
};
