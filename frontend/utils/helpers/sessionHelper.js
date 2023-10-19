import { getCookie, setCookie, deleteCookie } from "cookies-next";
import jwt_decode from "jwt-decode";
import Router from "next/router";

export const seed = (accessToken) => {
  const options = { sameSite: "Lax", path: "/" };
  setCookie("user_access_token", accessToken, options);
};

export const deltCookie = () => {
  deleteCookie("user_access_token");
};

export const getAccessToken = async () => {
  const accessToken = getCookie("user_access_token");

  if (accessToken && isTokenValid(accessToken)) {
    return accessToken;
  }
  Router.push(
    `/logout?redirectUrl=${encodeURIComponent(Router.router.asPath)}`
  );
};

const isTokenValid = (token) => {
  const now = Date.now() / (1000 * 60);
  const data = decodeToken(token);

  if (data && data.exp) {
    const expiry = data.exp / 60;
    return expiry - 1 > now;
  }

  return false;
};

const decodeToken = (token) => {
  if (token) {
    return jwt_decode(token);
  }
};
