import dynamic from "next/dynamic";
import getConfig from "next/config";
import { useField } from "formik";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import ValidationFeedback from "@/components/error/ValidationFeedback";
import { defaultFont } from "@/utils/misc/fonts";

const AddressAutofillField = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            import("@mapbox/search-js-react").then(
              (module) => module.AddressAutofill,
            ),
          ),
        500,
      );
    });
  },
  { ssr: false, loading: () => <Input placeholder="Loading..."></Input> },
);

const { publicRuntimeConfig } = getConfig();
const mapboxToken = publicRuntimeConfig.mapboxToken;

const addressAutofillInputProps = {
  accessToken: mapboxToken,
  popoverOptions: {
    placement: "top-start",
    flip: true,
    offset: 5,
  },
  options: {
    language: "en",
    country: "US",
  },
  theme: {
    variables: {
      fontFamily: `${defaultFont.style.fontFamily}`,
      lineHeight: 1.5,
      unit: "14px",
    },
  },
};

const AddressAutofillInput = ({
  className,
  disabled = false,
  label,
  name,
  placeholder,
  postFieldValueChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value) => {
    helpers.setValue(value);
    if (postFieldValueChange) {
      postFieldValueChange(name, value);
    }
  };

  const handleBlur = (event) => {
    helpers.setTouched(true);
    field.onBlur(event);
  };

  return (
    <>
      <Form.Item
        label={label}
        className="mb-2"
        validateStatus={meta.error && meta.touched ? "error" : ""}
        htmlFor={name}
      >
        <AddressAutofillField
          {...addressAutofillInputProps}
          onChange={handleChange}
          onRetrieve={(res) => {
            if (res) {
              const address = res?.features[0]?.properties?.full_address;
              handleChange(address);
            }
          }}
        >
          <Input
            id={name}
            name={name}
            placeholder={placeholder}
            value={field.value}
            className={className}
            disabled={disabled}
            onBlur={handleBlur}
            autoComplete="address-line1"
          />
        </AddressAutofillField>
        <ValidationFeedback error={meta.error} touched={meta.touched} />
      </Form.Item>
    </>
  );
};

AddressAutofillInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  postFieldValueChange: PropTypes.func,
};

export default AddressAutofillInput;
