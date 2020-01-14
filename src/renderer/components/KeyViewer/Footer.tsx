import React from "react";

export interface IFooterProps {
  lengthType: "members" | "bytes";
  length: number;
  keyEncoding: string;
  onPageChange?: (page: number) => void;
  totalPages?: number;
}

const Footer = ({ keyEncoding, length, lengthType, onPageChange, totalPages }: IFooterProps) => {
  let paginator = null;
  const callPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    return onPageChange && onPageChange(parseInt(e.target.value));
  };

  if (onPageChange) {
    const pageOptions = Array(totalPages)
      .fill(0)
      .map((index) => (
        <option key={index} value={index + 1}>
          {index + 1}
        </option>
      ));

    paginator = (
      <div className="footer-paginator">
        Page
        <select onChange={callPageChange}>{pageOptions}</select>
      </div>
    );
  }

  return (
    <div className="keyviewer__footer">
      <div className="footer-size">
        {lengthType === "bytes" ? "Bytes" : "Members"}: {length}
      </div>
      <div className="footer-encoding">Encoding: {keyEncoding}</div>
      {onPageChange ? paginator : null}
    </div>
  );
};

export default Footer;
