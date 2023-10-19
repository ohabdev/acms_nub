import dynamic from "next/dynamic";
import AuthLayout from "@/components/layouts/AuthLayout";
import Spinner from "@/components/spinner/Spinner";

const LoginForm = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(import("@/components/forms/Login")), 400);
    });
  },
  { loading: () => <Spinner size="medium" /> },
);

const Login = () => {
  return (
    <AuthLayout title="Lawyers2Go - Login" withCover={true}>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
