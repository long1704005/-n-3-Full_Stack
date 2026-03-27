import axiosClient from './axiosClient';

export const brandApi = {
  getAll: () => axiosClient.get('/api/Brands'),
  getById: (id) => axiosClient.get(`/api/Brands/${id}`),
  create: (body) => axiosClient.post('/api/Brands', body),
  update: (id, body) => axiosClient.put(`/api/Brands/${id}`, body),
  remove: (id) => axiosClient.delete(`/api/Brands/${id}`),
};
