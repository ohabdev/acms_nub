import { useEffect, useState } from "react";
import { Button, Result } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthLayout from "@/components/layouts/AuthLayout";
import Spinner from "@/components/spinner/Spinner";
import { verifyEmail } from "@/services/auth";

const VerifyAccount = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = router.query.token;
    setLoading(true);
    if (token) {
      verifyEmail(token)
        .then((res) => {
          setSuccess(true);
          setError(false);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
          setSuccess(false);
          setLoading(false);
        });
    }
  }, [router]);

  return (
    <AuthLayout title="Lawyers2Go - Verification" withCover={false}>
      {loading ? (
        <div className="flex justify-center">
          <Spinner size="medium" />
        </div>
      ) : (
        <div className="w-full max-w-lg rounded bg-white p-4 shadow-md ring-1 ring-gray-900/5">
          {!loading && success && (
            <Result
              status="success"
              title={<h3>Your acccount has been verified!</h3>}
              extra={
                <Link href="/login">
                  <Button
                    type="primary"
                    key="console"
                    className="mx-auto w-1/2 rounded bg-blue-500"
                  >
                    Go To Login Page
                  </Button>
                </Link>
              }
            />
          )}
          {!loading && error && (
            <Result
              status="error"
              title={<h3>Something went wrong!</h3>}
              subTitle={
                <h4 className="text-base !text-gray-600">
                  Your email couldn&apos;t be verified. Try again later.
                </h4>
              }
            />
          )}
        </div>
      )}
    </AuthLayout>
  );
};
export default VerifyAccount;
