import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import SplitPane from "react-split-pane";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-json";

import Footer from "./Footer";
import ListView from "../List";
import { IBaseTypeProps } from "./IBaseTypeProps";
import { isJson } from "../../helpers/isJson";

const ZSet = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState<string[][]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState<string | null>(null);
  const [zsetLength, setZsetLength] = useState(0);
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
      .zcard(currentKey.path, (err, result: number) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setZsetLength(result);
        }
      })
      .zrange(currentKey.path, (page - 1) * 100, page * 100, "withscores", (err, result) => {
        if (err) {
          // TODO: Add error handler
        } else {
          setKeyLoaded(true);

          const fixedResult = Array(result.length / 2).fill(0).map((_, index) => {
            let currentIndex = index;

            if (currentIndex > 0) {
              currentIndex++;
            }

            return [result[index], result[index + 1]];
          });

          setKeyValue(fixedResult);
        }
      })
      .exec();
  }, [currentKey, page]);

  const totalPages = zsetLength > 100 ? Math.round(zsetLength / 100) : 1;
  const renderResult = () => {
    const columns: JSX.Element[][] = [[], []];
    const headers = [
      <div key="header.0">Key</div>,
      <div key="header.1">Value</div>
    ];

    keyValue.forEach((value, index) => {
      const handleMemberClick = () => setMemberValue(value[0]);

      columns[0].push(
        <div key={`0.${index}`} onClick={handleMemberClick}>
          <div>{value[1]}</div>
        </div>
      );

      columns[1].push(
        <div key={`1.${index}`} onClick={handleMemberClick}>
          <div>{value[0].length > 50 ? `${value[0].substring(0, 50)}...` : value[0]}</div>
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

  const handlePageChange = (page: number) => setPage(page);

  return (
    <>
      <div className="keyviewer-content">{keyLoaded ? renderResult() : "Loading..."}</div>
      <Footer
        lengthType="members"
        length={zsetLength}
        onPageChange={handlePageChange}
        keyEncoding={keyEncoding}
        totalPages={totalPages}
      />
    </>
  );
};

export default ZSet;
