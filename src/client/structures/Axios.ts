// External imports
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Internal imports
import { clientConfig } from '../../interfaces/env_config';

// Default Axios instance
export const AxiosPublic = axios.create({
  baseURL: clientConfig.BASE_URL,
});

// Private Axios instance
export const AxiosPrivate = axios.create({
  baseURL: clientConfig.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Interceptors
AxiosPrivate.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers?.Authorization) {
      config.headers!.Authorization = `Bearer ${clientConfig.API_KEY}`;
    }
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  },
);
AxiosPrivate.interceptors.response.use(
  (response: AxiosResponse) => response as AxiosResponse,
  async (error: any) => {
    return Promise.reject(error);
  },
);
