import React, { useEffect, useState } from "react";
import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";

const String = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState("");
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
  }, []);

  return (
    <div>
      <div>{keyLoaded ? keyValue : "Loading..."}</div>
      <Footer lengthType="bytes" length={Buffer.byteLength(keyValue, "utf-8")} keyEncoding={keyEncoding} />
    </div>
  );
};

export default String;
