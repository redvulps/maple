import React, { useEffect, useState } from "react";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";

const Hash = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyKeys, setKeyKeys] = useState<string[]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState("");
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
    const memberList = keyKeys.map((value, index) => (
      <div key={index} onClick={() => loadHashValue(value)}>
        {value}
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
      <Footer lengthType="members" length={hashLength} keyEncoding={keyEncoding} />
    </>
  );
};

export default Hash;
