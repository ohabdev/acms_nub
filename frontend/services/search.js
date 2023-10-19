import ApiService from "@/utils/interceptor/apiService";

export const searchServices = async (page, limit, queries, config) => {
  const params = { page, limit, ...queries };
  const res = await ApiService.get(`/service/search`, { params, ...config });
  return res;
};
