import axiosClient from './axiosClient';

export const orderApi = {
  getAll: () => axiosClient.get('/api/Orders'),
  getById: (id) => axiosClient.get(`/api/Orders/${id}`),
  create: (body) => axiosClient.post('/api/Orders', body),
  updateStatus: (id, status) =>
    axiosClient.put(`/api/Orders/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' },
    }),
};
