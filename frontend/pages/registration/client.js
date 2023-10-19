import dynamic from "next/dynamic";
import AuthLayout from "@/components/layouts/AuthLayout";
import Spinner from "@/components/spinner/Spinner";

const RegistrationForm = dynamic(
  () => import("@/components/forms/Registration"),
  { loading: () => <Spinner /> },
);

const ClientRegistration = () => {
  return (
    <AuthLayout title="Lawyers2Go - Registration" withCover={true}>
      <RegistrationForm />
    </AuthLayout>
  );
};

export default ClientRegistration;
