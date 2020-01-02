import React, { useEffect, useState } from "react";

import { IBaseTypeProps } from "./IBaseTypeProps";
import Footer from "./Footer";

const List = ({ redisInstance, currentDatabase, currentKey }: IBaseTypeProps) => {
  const [keyValue, setKeyValue] = useState<string[]>([]);
  const [keyEncoding, setKeyEncoding] = useState("");
  const [memberValue, setMemberValue] = useState("");
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
    const memberList = keyValue.map((value, index) => (
      <div key={index} onClick={() => setMemberValue(value)}>
        <div>{index}</div>
        <div>{value.substring(0, 100)}</div>
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
      <Footer
        lengthType="members"
        length={listLength}
        onPageChange={(page) => setPage(page)}
        keyEncoding={keyEncoding}
        totalPages={totalPages}
      />
    </div>
  );
};

export default List;
