import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const Card = ({ children, title, bodyClassName = "" }) => {
  return (
    <div className="max-w-full bg-white shadow ring-1 ring-gray-900/5">
      {title && (
        <div className="flex min-h-[50px] flex-col justify-center border-b border-b-secondary/50 px-5 py-0">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}
      <div className={twMerge("p-5", bodyClassName)}>{children}</div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Card;
