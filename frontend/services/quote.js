import ApiService from "@/utils/interceptor/apiService";

export const createQuote = async (payload) => {
  const res = await ApiService.post(`/quote/create`, payload);
  return res;
};