// External imports
const axios = require('axios');


// Default Axios instance
const axiosPublic = axios.create({
  baseURL: process.env.BASE_URL,
});

// Private Axios instance
const axiosPrivate = axios.create({
  baseURL: process.env.BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Interceptors
axiosPrivate.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${process.env.API_KEY}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);

module.exports = {
  axiosPublic,
  axiosPrivate,
};