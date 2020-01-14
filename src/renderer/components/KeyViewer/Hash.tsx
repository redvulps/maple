import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import SplitPane from "react-split-pane";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-json";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";
import { isJson } from "../../helpers/isJson";
import List from "../List";

const Hash = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyKeys, setKeyKeys] = useState<string[]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState<null | string>(null);
  const [hashLength, setHashLength] = useState(0);
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
      .hlen(currentKey.path, (err, result: number) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setHashLength(result);
        }
      })
      .hkeys(currentKey.path, (err, result) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setKeyLoaded(true);
          setKeyKeys(result);
        }
      })
      .exec();
  }, [currentKey]);

  const loadHashValue = (field: string) => {
    redisInstance
      .multi()
      .select(currentDatabase)
      .hget(currentKey.path, field, (err, result) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setMemberValue(result);
        }
      })
      .exec();
  }

  const renderResult = () => {
    const headers = [
      <div>Key</div>
    ];

    const memberList = keyKeys.map((value, index) => ([
      <div key={index} onClick={() => loadHashValue(value)}>
        {value.length > 50 ? `${value.substring(0, 50)}...` : value}
      </div>
    ]));

    let memberValueView: string | JSX.Element = "No member selected";

    if (memberValue !== null) {
      memberValueView = (
        <AceEditor
          mode={isJson(memberValue) ? "json" : "raw"}
          theme="github"
          enableBasicAutocompletion={true}
          value={memberValue}
          width="100%"
          height="100%"
        />
      );
    }

    return (
      <SplitPane split="vertical" defaultSize={200}>
        <List
          headers={headers}
          columns={memberList}
        />
        {memberValueView}
      </SplitPane>
    );
  };

  return (
    <>
      <div className="keyviewer-content">{keyLoaded ? renderResult() : "Loading..."}</div>
      <Footer lengthType="members" length={hashLength} keyEncoding={keyEncoding} />
    </>
  );
};

export default Hash;
