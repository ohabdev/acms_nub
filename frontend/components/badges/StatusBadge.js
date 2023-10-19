import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";
import { capitalizeFirstLetter } from "@/utils/helpers/transformationHelper";

const defaultClasses =
  "box-border m-0 p-0 ps-2 pe-2 inline-flex items-center justify-center whitespace-nowrap rounded-semi-sm transition-all duration-200 h-auto max-w-[120px] text-[12px] border";
const statusClasses = {
  success: "bg-[#f0fff0] text-success border-[#d4ffd7]",
  error: "bg-[#fff3f0] text-error border-[#ffb7ab]",
  warning: "bg-[#fffbe6] text-[#faad14] border-[#ffe58f]",
  default: " bg-black/10 text-black/90 border-secondary",
};

const StatusBadge = ({ children, className, status, text }) => {
  const additionalClasses = children && text ? "gap-x-1 py-1" : "";

  return (
    <span
      className={twMerge(
        defaultClasses,
        statusClasses[status],
        additionalClasses,
        className,
      )}
    >
      {children}
      {capitalizeFirstLetter(text)}
    </span>
  );
};

StatusBadge.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  className: PropTypes.string,
  status: PropTypes.string,
  text: PropTypes.string,
};

export default StatusBadge;
