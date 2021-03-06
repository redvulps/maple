import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import SplitPane from "react-split-pane";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-json";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";
import { isJson } from "../../helpers/isJson";
import ListView from "../List";

const Set = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState<string[]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState<string | null>(null);
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
      .smembers(currentKey.path, (err, result) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setKeyValue(result);
          setKeyLoaded(true);
        }
      })
      .exec();
  }, [currentKey]);

  const renderResult = () => {
    const columns: JSX.Element[][] = [[]];
    const headers = [
      <div key="header.0">Member</div>
    ];

    keyValue.forEach((value, index) => {
      const handleClick = () => setMemberValue(value);

      columns[0].push(
        <div key={index} onClick={handleClick}>
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </div>
      );
    });

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
          setOptions={{ useWorker: false }}
        />
      );
    }

    return (
      <SplitPane split="vertical" defaultSize={200}>
        <ListView
          headers={headers}
          columns={columns}
        />
        {memberValueView}
      </SplitPane>
    );
  };

  return (
    <>
      <div className="keyviewer-content">{keyLoaded ? renderResult() : "Loading..."}</div>
      <Footer lengthType="members" length={keyValue.length} keyEncoding={keyEncoding} />
    </>
  );
};

export default Set;
