import { Button, Form } from "antd";
import { Formik } from "formik";
import { object, string } from "yup";
import TextInput from "@/components/fields/TextInput";
import useFeedback from "@/utils/hooks/useFeedback";
import { forgotPassword } from "@/services/users";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";

const ForgotPasswordForm = () => {
  const [form] = Form.useForm();
  const { showNotification } = useFeedback();

  const initialValues = {
    email: "",
  };

  const validationSchema = object().shape({
    email: string()
      .email(getValidationMessage("email", "invalid"))
      .required(getValidationMessage("Email")),
  });

  const handleFormSubmit = async (values, setSubmitting) => {
    try {
      const response = await forgotPassword(values);
      showNotification({
        message: "Success",
        description: response?.data || response?.data?.message,
        type: "success",
      });
    } catch (error) {
      const message = error?.response?.data?.message;
      const description =
        typeof message === "string"
          ? message
          : Array.isArray(message) && typeof message[0] === "string"
          ? message[0]
          : "Network Error";

      showNotification({
        message: "Error",
        description,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded bg-white shadow-md ring-1 ring-gray-900/5">
      <div className="mb-2 flex flex-row items-center justify-center border-b border-secondary/25 px-5 py-3">
        <h4 className="text-center font-bold text-black">Forgot Password?</h4>
      </div>
      <div className="px-5 pb-4">
        <p className="my-3 text-center text-sm text-gray-500">
          Don&apos;t worry. Submit your email address so that we can send you a
          password reset link.
        </p>
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
                label="Email"
                name="email"
                placeholder="Enter Email Address"
              />

              <Form.Item className="mb-2 mt-3 text-center">
                <Button
                  type="primary"
                  className="mx-auto w-full rounded bg-black hover:!bg-black/90"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Send Reset Link
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
