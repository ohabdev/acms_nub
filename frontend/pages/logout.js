import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ScreenLoader from "@/components/screen-loader/ScreenLoader";
import { logout } from "@/store/slices/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectUrl = searchParams.get("redirectUrl")
    ? searchParams.get("redirectUrl")?.toString()
    : "";

  useEffect(() => {
    dispatch(logout());
    window.location.replace(
      redirectUrl ? `/login?redirectUrl=${redirectUrl}` : `/login`,
    );
  }, [dispatch, redirectUrl]);

  return <ScreenLoader />;
};

export default Logout;
