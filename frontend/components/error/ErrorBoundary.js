import React from "react";
import dynamic from "next/dynamic";
import Button from "@/components/common/Button";
import { defaultFont } from "@/utils/misc/fonts";

const PreviousIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.PreviousIcon),
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CATCH ERROR OF APPLICATION: ", error, errorInfo);
  }

  render() {
    const refresh = () => (window.location.href = "/");

    if (this.state.hasError) {
      return (
        <div
          className={`${defaultFont.variable} mx-auto flex min-h-screen flex-col items-center justify-evenly p-6 font-sans`}
        >
          <div className="flex min-h-[400px] max-w-xl flex-col items-center justify-around rounded bg-white p-6 shadow-md ring-1 ring-gray-900/5">
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold uppercase">
                Oops! Something went wrong.
              </h1>
              <p className="mb-4 text-base font-bold uppercase">
                We are working on fixing this.
              </p>
            </div>

            <span className="relative flex h-[60px] w-[60px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error/90 opacity-75"></span>
              <span className="relative inline-flex h-[60px] w-[60px] rounded-full bg-error"></span>
            </span>
            <Button onClick={refresh} variant="primary" className="w-1/2">
              <span className="mr-2">
                <PreviousIcon width={18} height={18} />
              </span>
              Go To Home
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
