import axiosClient from './axiosClient';

export const userApi = {
  getAll: () => axiosClient.get('/api/Users'),
  getById: (id) => axiosClient.get(`/api/Users/${id}`),
  setActive: (id, isActive) =>
    axiosClient.put(`/api/Users/${id}/active`, isActive, {
      headers: { 'Content-Type': 'application/json' },
    }),
  setRole: (id, role) =>
    axiosClient.put(`/api/Users/${id}/role`, JSON.stringify(role), {
      headers: { 'Content-Type': 'application/json' },
    }),
};
