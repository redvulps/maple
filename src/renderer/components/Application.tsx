import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import SplitPane from 'react-split-pane';

import './Application.sass';

import NewConnection from './NewConnection';
import DatabaseSelector from './DatabaseSelector';
import KeyTree from './KeyTree';
import KeyViewer from './KeyViewer';

import Redis from "redis";

let redisInstance: Redis.RedisClient;

const Application = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentDatabase, setCurrentDatabase] = useState(0);

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

  if (isConnected) {
    rootView = (
      <div className="main-container">
        <div className="main-toolbar">
          <DatabaseSelector
            redisInstance={redisInstance}
            currentDatabase={currentDatabase}
            onSelectDatabase={(databaseId) => setCurrentDatabase(databaseId)} />
          <div>
            TOOLBOX
          </div>
        </div>
        <div className="main-content">
          <SplitPane split="vertical">
            <KeyTree redisInstance={redisInstance} currentDatabase={currentDatabase} />
            <KeyViewer redisInstance={redisInstance} currentDatabase={currentDatabase} />
          </SplitPane>
        </div>
      </div>
    );
  } else {
    rootView = (
      <NewConnection onConnect={onConnect} isConnecting={isConnecting} />
    );
  }

  return rootView;
};

export default hot(Application);
