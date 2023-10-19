import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const bgClasses = {
  primary: "before:bg-primary hover:before:bg-primary/80 after:bg-primary/20",
  success: "before:bg-success hover:before:bg-success/90 after:bg-success/20",
  error: "before:bg-error hover:before:bg-error/90 after:bg-error/20",
  default:
    "border border-secondary/75 bg-white before:bg-white hover:before:bg-default/90 hover:border-secondary active:after:bg-default after:bg-primary/20",
};

const sizeClasses = {
  default: "h-[32px] px-6 py-1 text-sm",
  small: "h-[24px] px-3 py-1 text-xs",
};

const defaultClasses =
  "[&:not(:active)]:after:animate-push relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-semi-sm align-middle text-white outline-0 transition duration-200 z-10";

const Button = ({
  children,
  className = "",
  disabled = false,
  onClick,
  size = "default",
  variant = "default",
  ...rest
}) => {
  return (
    <>
      <button
        className={twMerge(
          defaultClasses,
          sizeClasses[size],
          bgClasses[variant],
          className,
          "before:absolute before:inset-0 before:-z-[5] before:rounded-semi-sm before:transition-all after:absolute after:inset-0 after:-z-10 after:rounded-semi-sm",
        )}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    </>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  variant: PropTypes.string,
};

export default Button;
