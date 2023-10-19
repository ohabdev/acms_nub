import dynamic from "next/dynamic";
import AuthLayout from "@/components/layouts/AuthLayout";
import Spinner from "@/components/spinner/Spinner";

const RegistrationForm = dynamic(
  () => import("@/components/forms/Registration"),
  { loading: () => <Spinner size="medium" /> },
);

const ProviderRegistration = () => {
  return (
    <AuthLayout title="Lawyers2Go - Registration" withCover={true}>
      <RegistrationForm />
    </AuthLayout>
  );
};

export default ProviderRegistration;
