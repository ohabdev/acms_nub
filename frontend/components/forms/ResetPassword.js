import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Button, Form } from "antd";
import { Formik } from "formik";
import { object, string, ref } from "yup";
import TextInput from "@/components/fields/TextInput";
import useFeedback from "@/utils/hooks/useFeedback";
import { resetPassword } from "@/services/users";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";
import regexOptions from "@/utils/options/regex";

const Link = dynamic(() => import("next/link"));
const PreviousIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.PreviousIcon),
);

const ResetPasswordForm = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { showNotification } = useFeedback();

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = object().shape({
    password: string()
      .required(getValidationMessage("Password"))
      .min(8, getValidationMessage("Password", "min", { min: 8 }))
      .matches(
        regexOptions.patterns.password,
        getValidationMessage("Password", "passwordFormat"),
      ),

    confirmPassword: string()
      .oneOf(
        [ref("password")],
        getValidationMessage("Password and confirm password", "match"),
      )
      .required(getValidationMessage("Confirm password ")),
  });

  const handleFormSubmit = async (values, setSubmitting) => {
    const { password } = values;
    const token = router.query.token;

    const payload = {
      newPassword: password,
      token,
    };

    try {
      const response = await resetPassword(payload);
      setSuccess(response?.success);
      showNotification({
        message: "Success",
        description:
          typeof response?.message === "string"
            ? response?.message
            : "Password has been reset successfully.",
        type: "success",
      });
    } catch (error) {
      const description =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
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
        <h4 className="text-center font-bold text-black">Reset Password</h4>
      </div>

      <div className="px-5 pb-4">
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
                label="New Password"
                name="password"
                placeholder="Enter New Password"
                inputType="password"
              />

              <TextInput
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Enter Confirm New Password"
                inputType="password"
              />

              <Form.Item className="mb-2 mt-3 text-center">
                <Button
                  type="primary"
                  className="mx-auto w-full rounded bg-black hover:!bg-black/90"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>

        {success && (
          <div className="mt-3 flex flex-row items-center justify-center gap-1 text-center">
            <Link
              href="/login"
              className="flex flex-row items-center gap-x-2 text-sm font-bold"
            >
              <span className="text-primary">
                <PreviousIcon width={18} height={18} />
              </span>
              <span>Go to Login Page</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
