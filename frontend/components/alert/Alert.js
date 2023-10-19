import PropTypes from "prop-types";

const defaultClasses =
  "box-border px-3 py-2 flex items-center rounded-semi-sm font-sm font-bold text-white";
const bgClasses = {
  primary: "bg-primary",
  success: "bg-success",
  error: "bg-error",
};

const Alert = ({ className = "", message, type }) => {
  return (
    <div className={`${defaultClasses} ${bgClasses[type]} ${className}`}>
      <span>{message}</span>
    </div>
  );
};

Alert.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default Alert;
