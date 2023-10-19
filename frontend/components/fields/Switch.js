import PropTypes from "prop-types";
import { DISABLED_CLASSNAME } from "@/constants/constants";

const Switch = ({ active, disabled, onChange }) => {
  return (
    <div className={`${disabled ? DISABLED_CLASSNAME : ""}`}>
      <div
        className={`relative h-3.5 w-8 cursor-pointer rounded-lg ${
          active === null
            ? "bg-[#facb1f]"
            : active
            ? "bg-success"
            : "bg-secondary"
        }`}
        onClick={onChange}
      >
        <div
          className={`${
            !active
              ? "right-5"
              : active === null
              ? "right-[8.5px]"
              : "right-0.5"
          } absolute top-2/4 h-2.5 w-2.5 -translate-y-2/4 rounded-[50%] bg-[white] transition-all duration-200 ease-[ease]`}
        ></div>
      </div>
    </div>
  );
};

Switch.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Switch;
