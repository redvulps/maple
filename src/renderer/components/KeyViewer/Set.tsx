import React, { useEffect, useState } from "react";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";

const Set = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState<string[]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState("");
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
  }, []);

  const renderResult = () => {
    const memberList = keyValue.map((value, index) => (
      <div key={index} onClick={() => setMemberValue(value)}>
        {value.substring(0, 100)}
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
    <div>
      <div>{keyLoaded ? renderResult() : "Loading..."}</div>
      <Footer lengthType="members" length={keyValue.length} keyEncoding={keyEncoding} />
    </div>
  );
};

export default Set;
