import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import SplitPane from 'react-split-pane';

import './Application.sass';

import NewConnection from './NewConnection';
import DatabaseSelector from './DatabaseSelector';
import DatabaseTree from './DatabaseTree';
import KeyViewer from './KeyViewer';

const Application = () => {
  const [isConnected, setIsConnectted] = useState(false);

  let rootView = null;

  if (!isConnected) {
    rootView = (
      <div className="main-container">
        <div className="main-toolbar">
          <DatabaseSelector />
          <div>
            TOOLBOX
          </div>
        </div>
        <div className="main-content">
          <SplitPane split="vertical">
            <DatabaseTree />
            <KeyViewer />
          </SplitPane>
        </div>
      </div>
    );
  } else {
    rootView = (
      <NewConnection />
    );
  }

  return rootView;
};

export default hot(Application);
