import ApiService from "@/utils/interceptor/apiService";

export const me = async () => {
  const res = await ApiService.get(`/users/me`);
  return res;
};

export const updateProfile = async (payload) => {
  const res = await ApiService.put(`/users`, payload);
  return res;
};

export const updateClientProfile = async (payload, accessToken) => {
  const res = await ApiService.put(`/users/client`, payload, {
    ...(accessToken && {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });
  return res;
};

export const updateProviderProfile = async (payload, accessToken) => {
  const res = await ApiService.put(`/users/provider`, payload, {
    ...(accessToken && {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });
  return res;
};

export const changePassword = async (payload) => {
  const res = await ApiService.post(`/users/change-password`, payload);
  return res;
};

export const forgotPassword = async (payload) => {
  const res = await ApiService.post(`/users/forgot-password`, payload, {
    noAuth: true,
  });
  return res;
};

export const resetPassword = async (payload) => {
  const res = await ApiService.post(`/users/reset-password`, payload, {
    noAuth: true,
  });
  return res;
};

export const updateUserType = async (payload, accessToken) => {
  const res = await ApiService.post(`/users/user-type`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
};

export const updateProviderType = async (payload, accessToken) => {
  const res = await ApiService.post(`/users/provider-type`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
};

export const createService = async (payload) => {
  const res = await ApiService.post(`/service/create`, payload);
  return res;
};

export const getMyServices = async (page, limit) => {
  const params = { page, limit };
  const res = await ApiService.get(`/service/my-services`, { params });
  return res;
};

export const updateService = async (serviceId, payload) => {
  const res = await ApiService.put(`/service/${serviceId}`, payload);
  return res;
};

export const deleteService = async (serviceId) => {
  const res = await ApiService.delete(`/service/${serviceId}`);
  return res;
};
