import React from 'react';

const NewConnection = () => (
  <div className="form vertical">
    <div className="field">
      <label>Host</label>
      <input type="text" placeholder="127.0.0.1" />
    </div>
    <div className="field">
      <label>Port</label>
      <input type="text" placeholder="6379" />
    </div>
    <div className="buttons">
      <button type="button">Connect</button>
      <button type="button">Add to favorite</button>
    </div>
  </div>
);

export default NewConnection;
