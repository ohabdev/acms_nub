import axios from "axios";
import getConfig from "next/config";
import { getAccessToken } from "@/utils/helpers/sessionHelper";

const { publicRuntimeConfig } = getConfig();

const ApiService = axios.create({
  baseURL: publicRuntimeConfig.baseApiUrl,
});

ApiService.interceptors.request.use(
  async (config) => {
    config.headers["Content-Type"] = "application/json";

    if (!config?.noAuth && !config.headers.Authorization) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

ApiService.interceptors.response.use(
  (response) => {
    return response?.data || {};
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default ApiService;
