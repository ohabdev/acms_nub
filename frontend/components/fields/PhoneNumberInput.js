import { useField } from "formik";
import PropTypes from "prop-types";
import { PatternFormat } from "react-number-format";
import { Form, Input } from "antd";
import ValidationFeedback from "@/components/error/ValidationFeedback";

const PhoneNumberInput = ({
  className = "",
  disabled = false,
  label,
  name,
  placeholder,
  postFieldValueChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleValueChange = (values) => {
    helpers.setValue(values?.value ?? "");
    if (postFieldValueChange) {
      postFieldValueChange(name, values?.value);
    }
  };

  return (
    <>
      <Form.Item
        label={label}
        className="mb-2"
        validateStatus={meta.error && meta.touched ? "error" : ""}
        htmlFor={name}
      >
        <PatternFormat
          id={name}
          name={name}
          value={field.value}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          customInput={Input}
          format="###-###-####"
          valueIsNumericString={true}
          onValueChange={handleValueChange}
          onBlur={field.onBlur}
        />
        <ValidationFeedback error={meta.error} touched={meta.touched} />
      </Form.Item>
    </>
  );
};

PhoneNumberInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  postFieldValueChange: PropTypes.func,
};

export default PhoneNumberInput;
