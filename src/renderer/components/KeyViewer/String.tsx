import React, { useEffect, useState } from "react";
import Ajv from 'ajv';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-json";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";

const String = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState<string | null>(null);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [keyLoaded, setKeyLoaded] = useState(false);

  useEffect(() => {
    redisInstance
      .multi()
      .select(currentDatabase)
      .object("encoding", currentKey.path, (err, result) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setKeyEncoding(result);
        }
      })
      .get(currentKey.path, (err, result: string) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setKeyLoaded(true);
          setKeyValue(result);
        }
      })
      .exec();
  }, [currentKey]);

  let keyEditor = null;

  if (keyLoaded && keyValue !== null) {
    const ajv = new Ajv({ allErrors: true, schemaId: 'auto' });
    const validate = ajv.compile(true);
    const valid = validate(keyValue);

    keyEditor = (
      <AceEditor
        mode={valid ? "json" : "raw"}
        theme="github"
        enableBasicAutocompletion={true}
        value={keyValue}
        width="100%"
        height="100%"
      />
    );
  }

  return (
    <>
      <div className="keyviewer-content">{keyLoaded ? keyEditor : "Loading..."}</div>
      <Footer
        lengthType="bytes"
        length={keyValue !== null && Buffer.byteLength(keyValue, "utf-8") || 0}
        keyEncoding={keyEncoding}
      />
    </>
  );
};

export default String;
