import dynamic from "next/dynamic";
import AuthLayout from "@/components/layouts/AuthLayout";
import Spinner from "@/components/spinner/Spinner";

const UserRegistrationForm = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(import("@/components/forms/UserRegistration")),
        400,
      );
    });
  },
  { loading: () => <Spinner size="medium" /> },
);

const Registration = () => {
  return (
    <AuthLayout title="Lawyers2Go - Registration" withCover={true}>
      <UserRegistrationForm />
    </AuthLayout>
  );
};

export default Registration;
