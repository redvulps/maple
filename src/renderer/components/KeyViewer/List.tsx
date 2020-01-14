import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import SplitPane from "react-split-pane";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-json";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";
import { isJson } from "../../helpers/isJson";
import ListView from "../List";

const List = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState<string[]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState<null | string>(null);
  const [listLength, setListLength] = useState(0);
  const [keyLoaded, setKeyLoaded] = useState(false);
  const [page, setPage] = useState(1);

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
      .llen(currentKey.path, (err, result: number) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setListLength(result);
        }
      })
      .lrange(currentKey.path, (page - 1) * 100, page * 100, (err, result) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setKeyLoaded(true);
          setKeyValue(result);
        }
      })
      .exec();
  }, [currentKey, page]);

  const totalPages = listLength > 100 ? Math.round(listLength / 100) : 1;
  const renderResult = () => {
    const columns: JSX.Element[][] = [[], []];
    const memberList = keyValue.map((value, index) => {
      columns[0].push(
        <div key={index} onClick={() => setMemberValue(value)}>
          {index}
        </div>
      );

      columns[1].push(
        <div key={index} onClick={() => setMemberValue(value)}>
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
        />
      );
    }

    const headers = [
      <div>Index</div>,
      <div>Value</div>
    ];

    return (
      <SplitPane split="vertical" defaultSize={200}>
        <ListView
          headers={headers}
          columns={columns}
        />
        { memberValueView }
      </SplitPane>
    );
  };

  return (
    <>
      <div className="keyviewer-content">{keyLoaded ? renderResult() : "Loading..."}</div>
      <Footer
        lengthType="members"
        length={listLength}
        onPageChange={(page) => setPage(page)}
        keyEncoding={keyEncoding}
        totalPages={totalPages}
      />
    </>
  );
};

export default List;
