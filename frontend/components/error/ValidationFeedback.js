import PropTypes from "prop-types";

const ValidationFeedback = ({ touched, error }) => {
  return (
    <>
      {touched && !!error && (
        <div className="mt-1 w-full">
          <span className="font-semibold text-error">{error}</span>
        </div>
      )}
    </>
  );
};

ValidationFeedback.propTypes = {
  error: PropTypes.string,
  touched: PropTypes.bool,
};

export default ValidationFeedback;
