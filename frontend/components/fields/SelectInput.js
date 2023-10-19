import { useField } from "formik";
import PropTypes from "prop-types";
import { Form, Select } from "antd";
import { useMediaQuery } from "@/utils/hooks/useMediaQuery";
import ValidationFeedback from "@/components/error/ValidationFeedback";
import { filterOptions } from "@/utils/helpers/transformationHelper";

const SelectInput = ({
  className = "",
  canSearch = false,
  filterable = false,
  label,
  multiSelect = false,
  name,
  onSelect,
  options,
  placeholder,
  postFieldValueChange,
  ...rest
}) => {
  const [field, meta, helpers] = useField(name);
  const matches = useMediaQuery("(min-width: 992px)");

  const handleBlur = (event) => {
    helpers.setTouched(true);
    field.onBlur(event);
  };

  const handleValueChange = (value) => {
    helpers.setValue(value);
    setTimeout(() => {
      helpers.setTouched(true, true);
    });
    if (postFieldValueChange) {
      postFieldValueChange(name, value);
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
        <Select
          id={name}
          name={name}
          value={field.value}
          placeholder={placeholder}
          className={className}
          {...(multiSelect && { mode: "multiple" })}
          maxTagCount={matches ? 1 : 0}
          options={options}
          onBlur={handleBlur}
          onChange={handleValueChange}
          onSelect={onSelect}
          showSearch={canSearch || filterable}
          filterOption={!filterable ? false : filterOptions}
          {...rest}
        />
        <ValidationFeedback error={meta.error} touched={meta.touched} />
      </Form.Item>
    </>
  );
};

SelectInput.propTypes = {
  className: PropTypes.string,
  filterable: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
};

export default SelectInput;
