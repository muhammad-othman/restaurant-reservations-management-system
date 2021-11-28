import libAxios from 'axios';

export const authAxios = libAxios.create({
  baseURL: process.env.REACT_APP_API_URL
});

libAxios.defaults.headers.post['Content-Type'] = 'application/json';

authAxios.interceptors.response.use((response) => {
  return response;
});

export const setAuthToken = (token: string) => authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const clearAuthToken = () => delete authAxios.defaults.headers.common['Authorization'];



export const axios = libAxios.create({
  baseURL: process.env.REACT_APP_API_URL
});

libAxios.defaults.headers.post['Content-Type'] = 'application/json';