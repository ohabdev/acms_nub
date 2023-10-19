import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Tooltip } from "antd";

const Truncate = ({ className, text, length = 30, terminus = "..." }) => {
  const [isTruncated, setIsTruncated] = useState(text?.length > length);
  const [truncated, setTruncated] = useState(text);

  useEffect(() => {
    if (text?.length > length) {
      setTruncated(`${text.slice(0, length)}${terminus}`);
      setIsTruncated(true);
    } else {
      setTruncated(text);
      setIsTruncated(false);
    }
  }, [text, length, terminus]);

  return isTruncated ? (
    <Tooltip placement="bottom" title={text}>
      <span className="break-words">{truncated}</span>
    </Tooltip>
  ) : (
    <span className={className}>{truncated}</span>
  );
};

Truncate.propTypes = {
  text: PropTypes.string,
  length: PropTypes.number,
  terminus: PropTypes.string,
};

export default Truncate;
