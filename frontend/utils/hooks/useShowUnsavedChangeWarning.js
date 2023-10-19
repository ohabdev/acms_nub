import { useEffect } from "react";
import { useRouter } from "next/router";

const abortMessage = "Route change aborted.";

const useShowUnsavedChangeWarning = (isFormDirty) => {
  const router = useRouter();

  const confirmText =
    "You have unsaved changes, are you sure want to leave this page?";

  useEffect(() => {
    const handlePageReload = (event) => {
      isFormDirty.current
        ? (event.returnValue = confirmText)
        : event.preventDefault();
    };

    const handleRouteChange = (url, { shallow }) => {
      if (isFormDirty.current) {
        if (!shallow) {
          if (!confirm(confirmText)) {
            router.events.emit("routeChangeError", abortMessage, url, {
              shallow: false,
            });
            throw "Abort";
          }
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handlePageReload);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handlePageReload);
    };
  }, [isFormDirty, router]);
};

export default useShowUnsavedChangeWarning;
