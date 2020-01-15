import { hot } from "react-hot-loader/root";
import React, { useState } from "react";
import SplitPane from "react-split-pane";
import Redis from "redis";

import NewConnection from "./NewConnection";
import DatabaseSelector from "./DatabaseSelector";
import KeyTree, { IRedisKey } from "./KeyTree";
import KeyViewer from "./KeyViewer";
import FavoriteManager from "./FavoriteManager";
import Toolbar from "./Toolbar";

let redisInstance: Redis.RedisClient;

const Application = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentDatabase, setCurrentDatabase] = useState(0);
  const [currentKey, setCurrentKey] = useState<IRedisKey | null>(null);
  const [currentKeyType, setCurrentKeyType] = useState<string | null>(null);
  const [keyTreeKey, setKeyTreeKey] = useState((Math.random() * 16384).toString());

  let rootView = null;
  const onConnect = async (host: string, port:string) => {
    setIsConnecting(true);

    redisInstance = Redis.createClient({
      host,
      port: parseInt(port),
      retry_strategy: (options) => {
        if (options.error && options.error.code === "ECONNREFUSED") {
          setIsConnected(false);
          setIsConnecting(false);

          // TODO: Presente error message
          console.error("REFUSED");
        }

        if (options.attempt > 10) {
          return new Error("Retries exhausted");
        }

        return options.error || Math.min(options.attempt * 100, 3000);
      }
    });

    redisInstance.on("ready", () => {
      setIsConnected(true);
      setIsConnecting(false);
    });
  };

  const handleSelectdKey = (key: IRedisKey | null, keyType: string | null) => {
    setCurrentKey(key);
    setCurrentKeyType(keyType);
  };

  const handleSelectDatabase = (databaseId: number) => {
    setCurrentDatabase(databaseId);
    setKeyTreeKey((Math.random() * 16384).toString());
  };

  if (isConnected) {
    rootView = (
      <div className="app">
        <div className="app-content">
          <SplitPane split="vertical" defaultSize={200} pane2Style={{ display: "flex", flexDirection: "column" }}>
            <>
              <DatabaseSelector
                redisInstance={redisInstance}
                currentDatabase={currentDatabase}
                onSelectDatabase={handleSelectDatabase} />
              <KeyTree
                redisInstance={redisInstance}
                currentDatabase={currentDatabase}
                onSelectKey={handleSelectdKey}
                key={keyTreeKey}
              />
            </>
            <>
              <Toolbar />
              <KeyViewer
                redisInstance={redisInstance}
                currentDatabase={currentDatabase}
                currentKey={currentKey}
                currentKeyType={currentKeyType}
              />
            </>
          </SplitPane>
        </div>
      </div>
    );
  } else {
    rootView = (
      <SplitPane split="vertical" defaultSize={200}>
        <FavoriteManager />
        <NewConnection onConnect={onConnect} isConnecting={isConnecting} />
      </SplitPane>
    );
  }

  return rootView;
};

export default hot(Application);
