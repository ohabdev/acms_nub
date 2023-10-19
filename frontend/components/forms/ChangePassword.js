import { Button, Form } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/fields/TextInput";
import useFeedback from "@/utils/hooks/useFeedback";
import { changePassword } from "@/services/users";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";
import regexOptions from "@/utils/options/regex";

const ChangePasswordForm = ({ closeModal }) => {
  const [form] = Form.useForm();
  const { showNotification } = useFeedback();

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(
      getValidationMessage("Current Password"),
    ),
    newPassword: Yup.string()
      .required(getValidationMessage("New Password"))
      .min(8, getValidationMessage("New Password", "min", { min: 8 }))
      .matches(
        regexOptions.patterns.password,
        getValidationMessage("New password", "passwordFormat"),
      ),
    confirmNewPassword: Yup.string()
      .oneOf(
        [Yup.ref("newPassword")],
        getValidationMessage("Password and confirm new password", "match"),
      )
      .required(getValidationMessage("Confirm new password")),
  });

  const handleFormSubmit = async (values, setSubmitting) => {
    const { oldPassword, newPassword } = values;
    try {
      const response = await changePassword({ oldPassword, newPassword });
      showNotification({
        message: "Success",
        description: response?.message,
        type: "success",
      });
      closeModal();
    } catch (error) {
      showNotification({
        message: "Error",
        description: error?.response?.data?.message || "Network Error",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleFormSubmit(values, setSubmitting);
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <Form layout={"vertical"} form={form} onFinish={handleSubmit}>
            <TextInput
              label="Current Password"
              name="oldPassword"
              placeholder="Enter Current Password"
              inputType="password"
            />

            <TextInput
              label="New Password"
              name="newPassword"
              placeholder="Enter New Password"
              inputType="password"
            />

            <TextInput
              label="New Confirm New Password"
              name="confirmNewPassword"
              placeholder="Enter Confirm New Password"
              inputType="password"
            />

            <Form.Item className="mb-2 mt-6 text-center">
              <Button
                type="primary"
                className="mx-auto w-full bg-black hover:!bg-black/90"
                htmlType="submit"
                loading={isSubmitting}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ChangePasswordForm;
