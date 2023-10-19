import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Button, Form } from "antd";
import { Formik } from "formik";
import { object, string } from "yup";
import TextInput from "@/components/fields/TextInput";
import { loginUser, currentUser } from "@/store/slices/authSlice";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";

const Alert = dynamic(() => import("@/components/alert/Alert"));

const LoginForm = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(window.location.search);
  const redirectUrl = searchParams.get("redirectUrl")
    ? searchParams.get("redirectUrl")?.toString()
    : "";

  const handleLogin = async (values, setSubmitting) => {
    setError({});
    setSubmitting(true);
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      if (response?.data && response?.data?.token) {
        setLoginSuccess(true);
        await dispatch(currentUser()).unwrap();
        window.location.replace(redirectUrl ? redirectUrl : "/");
      }
    } catch (error) {
      setError(error);
      setLoginSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = object().shape({
    email: string()
      .email(getValidationMessage("email", "invalid"))
      .required(getValidationMessage("Email")),
    password: string().required(getValidationMessage("Password")),
  });

  return (
    <div className="w-full max-w-md rounded bg-white shadow-md ring-1 ring-gray-900/5">
      <div className="mb-2 flex flex-row items-center justify-center border-b border-secondary/25 px-5 py-3">
        <h4 className="text-center font-bold text-black">Login</h4>
      </div>
      <div className="px-5 pb-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleLogin(values, setSubmitting);
          }}
          enableReinitialize={true}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form layout={"vertical"} form={form} onFinish={handleSubmit}>
              <TextInput
                label="Email"
                name="email"
                placeholder="Enter Email Address"
              />

              <TextInput
                label="Password"
                name="password"
                placeholder="Enter Password"
                inputType="password"
              />

              <Form.Item className="mb-1.5 mt-3">
                <Button
                  type="primary"
                  className="mx-auto w-full bg-success hover:!bg-primary/90"
                  htmlType="submit"
                  loading={isSubmitting || loginSuccess}
                >
                  Login
                </Button>
              </Form.Item>

              {/* <Link href="/forgot-password" className="text-sm font-bold">
                Forgot Password?
              </Link> */}
            </Form>
          )}
        </Formik>

        {error?.message && (
          <Alert
            message={
              typeof error?.message === "string"
                ? error?.message
                : "Network Error"
            }
            type="error"
            className="mt-2"
          />
        )}

        <p className="mt-3 text-center font-semibold text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/registration" className="font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
