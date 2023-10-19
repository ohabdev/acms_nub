import dynamic from "next/dynamic";
import AuthLayout from "@/components/layouts/AuthLayout";
import Spinner from "@/components/spinner/Spinner";

const ResetPasswordForm = dynamic(
  () => import("@/components/forms/ResetPassword"),
  { loading: () => <Spinner size="medium" /> },
);

const ResetPassword = () => {
  return (
    <AuthLayout title="Lawyers2Go - Reset Password" withCover={true}>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
