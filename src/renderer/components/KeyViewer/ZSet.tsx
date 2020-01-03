import React, { useEffect, useState } from "react";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";

const ZSet = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState<string[][]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState("");
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
            if (index > 0) {
              index++;
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
    const memberList = keyValue.map((value, index) => (
      <div key={index} onClick={() => setMemberValue(value[0])}>
        <div>{value[1]}</div>
        <div>{value[0].substring(0, 100)}</div>
      </div>
    ));

    return (
      <div>
        <div>
          {memberList}
        </div>
        <div>
          {memberValue}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="keyviewer-content">{keyLoaded ? renderResult() : "Loading..."}</div>
      <Footer
        lengthType="members"
        length={zsetLength}
        onPageChange={(page) => setPage(page)}
        keyEncoding={keyEncoding}
        totalPages={totalPages}
      />
    </>
  );
};

export default ZSet;
