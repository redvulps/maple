import React, { useState } from "react";
import SplitPane from "react-split-pane";

const List = ({ headers, columns }: any) => {
  const [columnWidth, setColumnWidth] = useState(100);
  let rowList;

  if (!columns.length) {
    return null;
  }

  if (headers.length > 1) {
    const handleDrag = (newSize: number) => {
      setColumnWidth(newSize);
    };

    const rows = Array(columns[0].length).fill(0).map((_, rowIndex: number) => {
      const columnsInRow = columns.map((column: any) => column[rowIndex]);

      return columnsInRow.map((column: any, columnIndex: number) => (
        <div className="column" key={`${rowIndex}.${columnIndex}`} style={columnIndex === 0 ? { width: `${columnWidth}px` } : {}}>
          {column}
        </div>
      ));
    });

    rowList = rows.map((row, index) => {
      return (
        <div className="row" key={index}>
          {row}
        </div>
      );
    });

    return (
      <div className="list">
        <div className="list-header">
          <SplitPane split="vertical" onDragFinished={handleDrag} size={columnWidth}>
            {headers}
          </SplitPane>
        </div>
        <div className="list-content">
          {rowList}
        </div>
      </div>
    );
  }

  rowList = columns[0].map((column: any, index: number) => (
    <div className="row" key={index}>
      <div className="column">
        {column}
      </div>
    </div>
  ));

  return (
    <div className="list">
      <div className="list-header">
        {headers.map((header: any, index: number) => <div className="header" key={index}>{header}</div>)}
      </div>
      <div className="list-content">
        {rowList}
      </div>
    </div>
  );
};

export default List;
