import PropTypes from "prop-types";

const defaultClasses =
  "flex justify-center items-center box-border m-0 p-0 text-white text-sm relative inline-block overflow-hidden whitespace-nowrap text-center align-middle border border-transparent w-[32px] h-[32px]";

const sizes = {
  extraSmall: "h-[18px] w-[18px]",
  small: "h-[24px] w-[24px]",
  default: "h-[36px] w-[36px]",
  medium: "h-[48px] w-[48px]",
  large: "h-[60px] w-[60px]",
  extraLarge: "h-[72px] w-[72px]",
  doubleExtraLarge: "h-[96px] w-[96px]",
};

const Avatar = ({
  alt = "Avatar",
  children,
  className,
  hasFilePath,
  onClick = () => {},
  shape = "circle",
  size = "default",
  src,
}) => {
  const borderClasses = shape === "circle" ? "rounded-full" : "rounded";
  const sizeClasses = sizes[size];
  return (
    <span
      className={`${defaultClasses} ${sizeClasses} ${borderClasses} ${className}`}
      onClick={onClick}
    >
      {src && hasFilePath ? (
        <img src={src} alt={alt} className="h-auto max-w-full" />
      ) : (
        children
      )}
    </span>
  );
};

Avatar.propTypes = {
  alt: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  shape: PropTypes.string,
  size: PropTypes.string,
  src: PropTypes.string,
};

export default Avatar;
