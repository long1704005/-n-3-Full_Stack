import axiosClient from './axiosClient';

export const productApi = {
  getAll: (params) => axiosClient.get('/api/Products', { params }),

  getById: (id) => axiosClient.get(`/api/Products/${id}`),

  create: (body) => axiosClient.post('/api/Products', body),

  update: (id, body) => axiosClient.put(`/api/Products/${id}`, body),

  remove: (id) => axiosClient.delete(`/api/Products/${id}`),
};
