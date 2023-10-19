import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import Button from "@/components/common/Button";
import { CheckCircleIcon } from "@/components/icons/Icons";

const RegistrationSuccess = () => {
  return (
    <AuthLayout withCover={true}>
      <div className="w-full max-w-sm rounded bg-white px-6 py-8 shadow-md ring-1 ring-gray-900/5">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-success">
            <CheckCircleIcon width={72} height={72} />
          </div>
          <h5 className="text-center font-semibold">
            Congratulation! Your account has been created successfully.
          </h5>
          <Link href="/login" className="w-full">
            <Button
              variant="primary"
              className="w-full max-w-full overflow-hidden before:bg-black hover:before:bg-black/90"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
export default RegistrationSuccess;
