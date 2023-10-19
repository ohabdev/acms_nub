import Button from "@/components/common/Button";
import { BackIcon } from "@/components/icons/Icons";

const NotFound = () => {
  const refresh = () => (window.location.href = "/");

  return (
    <>
      <section className="bg-white">
        <div className="container mx-auto flex min-h-screen items-center justify-center px-6 py-12">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <h2 className="mb-3 font-bold text-primary">404 Error</h2>
            <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
              Page Not Found
            </h1>
            <p className="mt-4 text-base font-semibold text-gray-700">
              We searched high and low, but couldn’t find what you’re looking
              for.
              <br /> Let’s find a better place for you to go.
            </p>

            <div className="mt-5 flex w-full shrink-0 items-center justify-center gap-x-3">
              <Button onClick={refresh} variant="primary" className="w-1/2">
                <span className="mr-2">
                  <BackIcon width={24} height={24} />
                </span>
                Go To Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
