import React, { useState } from 'react';

interface INewConnectionProps {
  onConnect: (host:string, port:string) => void;
  saveFavorite: (favoriteId: string, favoriteName: string, host: string, port: string) => void;
  removeFavorite: (favoriteId: string) => void;
  favoriteId: string;
  favoriteName: string;
  isConnecting: boolean;
}

const NewConnection = (props: INewConnectionProps) => {
  const { onConnect, saveFavorite, removeFavorite, favoriteId, favoriteName } = props;
  const isFavorite = !!favoriteId;

  const [host, setHost] = useState("");
  const [port, setPort] = useState("");

  let favoriteActions;
  const saveFavoriteAction = () => {
    saveFavorite(favoriteId, favoriteName, host, port);
  };

  if (isFavorite) {
    favoriteActions = (
      <>
        <button type="button" onClick={saveFavoriteAction}>Save favorite</button>
        <button type="button" onClick={() => removeFavorite(favoriteId)}>Remove favorite</button>
      </>
    );
  } else {
    favoriteActions = (
      <button type="button" onClick={saveFavoriteAction}>Add to favorite</button>
    );
  }

  return (
    <div className="form vertical">
      <div className="field">
        <label>Host</label>
        <input value={host} onChange={(e) => setHost(e.target.value)} type="text" placeholder="127.0.0.1" />
      </div>
      <div className="field">
        <label>Port</label>
        <input value={port} onChange={(e) => setPort(e.target.value)} type="text" placeholder="6379" />
      </div>
      <div className="buttons">
        <button type="button" onClick={() => onConnect(host, port)}>Connect</button>
        { favoriteActions }
      </div>
    </div>
  );
};

export default NewConnection;
