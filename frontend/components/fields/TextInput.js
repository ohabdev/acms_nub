import { useField } from "formik";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import ValidationFeedback from "@/components/error/ValidationFeedback";

const TextInput = ({
  className,
  disabled = false,
  inputType = "text",
  label,
  name,
  placeholder,
  postFieldValueChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (event) => {
    helpers.setValue(event.target.value);
    if (postFieldValueChange) {
      postFieldValueChange(name, event.target.value);
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
        {inputType === "password" ? (
          <Input.Password
            id={name}
            name={name}
            placeholder={placeholder}
            value={field.value}
            className={className}
            disabled={disabled}
            onChange={handleChange}
            onBlur={field.onBlur}
          />
        ) : (
          <Input
            id={name}
            name={name}
            placeholder={placeholder}
            value={field.value}
            className={className}
            disabled={disabled}
            onChange={handleChange}
            onBlur={field.onBlur}
          />
        )}
        <ValidationFeedback error={meta.error} touched={meta.touched} />
      </Form.Item>
    </>
  );
};

TextInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  inputType: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  postFieldValueChange: PropTypes.func,
};

export default TextInput;
