import axiosClient from './axiosClient';

export const authApi = {
  login: (userNameOrEmail, password) =>
    axiosClient.post('/api/Auth/login', { userNameOrEmail, password }),

  register: (body) => axiosClient.post('/api/Auth/register', body),
};
