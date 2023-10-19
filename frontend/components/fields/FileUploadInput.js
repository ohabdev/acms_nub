import dynamic from "next/dynamic";
import { useField } from "formik";
import PropTypes from "prop-types";
import { Form, Button, Upload } from "antd";
import ValidationFeedback from "@/components/error/ValidationFeedback";
import { UploadIcon } from "@/components/icons/Icons";

const FileUploadInput = ({
  accept,
  action,
  buttonType = "default",
  label,
  name,
  onFileUploadSuccess = () => {},
  placeholder,
  postFieldValueChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value) => {
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
        <Upload
          id={name}
          name="file"
          className="w-full shadow-none"
          accept={accept}
          action={action}
          maxCount={1}
          showUploadList={{ showRemoveIcon: false }}
          onChange={(info) => {
            if (info.file.status === "done") {
              handleChange(info.file.response.data?.uploadPath);
              onFileUploadSuccess();
            }
          }}
        >
          <Button
            type={buttonType}
            className={`flex items-center justify-center !border-primary leading-normal !text-primary hover:!border-primary/90 ${
              meta.error && meta.touched
                ? "!border-error hover:!border-error"
                : ""
            }`}
          >
            <span className="mr-2">
              <UploadIcon height={22} width={22} />
            </span>
            <span> {placeholder}</span>
          </Button>
        </Upload>
        <ValidationFeedback error={meta.error} touched={meta.touched} />
      </Form.Item>
    </>
  );
};

FileUploadInput.propTypes = {
  accept: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  buttonType: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onFileUploadSuccess: PropTypes.func,
  placeholder: PropTypes.string,
  postFieldValueChange: PropTypes.func,
};

export default FileUploadInput;
