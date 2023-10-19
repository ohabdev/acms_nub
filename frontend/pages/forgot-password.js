import dynamic from "next/dynamic";
import AuthLayout from "@/components/layouts/AuthLayout";
import Spinner from "@/components/spinner/Spinner";

const ForgotPasswordForm = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(import("@/components/forms/ForgotPassword")),
        400,
      );
    });
  },
  { loading: () => <Spinner size="medium" /> },
);

const ForgotPassword = () => {
  return (
    <AuthLayout title="Lawyers2Go - Forgot Password" withCover={true}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
