import ApiService from "@/utils/interceptor/apiService";

export const practiceAreas = async () => {
  const res = await ApiService.get(`/practice-areas`, { noAuth: true });
  return res;
};

export const scopeOfServices = async (provider) => {
  const res = await ApiService.get(`/services`, {
    noAuth: true,
    params: {
      provider,
    },
  });
  return res;
};

export const getAllServiceTypes = async (queries) => {
  const res = await ApiService.get(`/serviceType`, {
    params: queries,
    noAuth: true,
  });
  return res;
};

export const getAllSubServiceTypes = async (queries) => {
  const res = await ApiService.get(`/serviceType/sub-serviceTypes`, {
    params: queries,
    noAuth: true,
  });
  return res;
};

export const getAllCountries = async (params) => {
  const res = await ApiService.get(`/country`, {
    params,
    noAuth: true,
  });
  return res;
};

export const getAllStates = async (params) => {
  const res = await ApiService.get(`/state`, {
    params,
    noAuth: true,
  });
  return res;
};

export const getAllCounties = async (params) => {
  const res = await ApiService.get(`/county`, {
    params,
    noAuth: true,
  });
  return res;
};

export const getAllCities = async (params) => {
  const res = await ApiService.get(`/city`, {
    params,
    noAuth: true,
  });
  return res;
};
