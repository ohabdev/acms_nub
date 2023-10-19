import ApiService from "@/utils/interceptor/apiService";

export const login = (payload) => {
  return ApiService.post(`/auth/login`, payload, { noAuth: true }).then(
    (res) => {
      return res;
    },
  );
};

export const loginWithGoogle = (payload) => {
  return ApiService.post(`/auth/google`, payload, {
    noAuth: true,
  }).then((res) => {
    return res;
  });
};

export const loginWithFacebook = (payload) => {
  return ApiService.post(`/auth/facebook`, payload, {
    noAuth: true,
  }).then((res) => {
    return res;
  });
};

export const register = (payload) => {
  return ApiService.post(`/auth/register`, payload, {
    noAuth: true,
  }).then((res) => {
    return res;
  });
};

export const verifyEmail = (token) => {
  return ApiService.get(`auth/verify-email/${token}`, {
    noAuth: true,
  }).then((res) => {
    return res;
  });
};
