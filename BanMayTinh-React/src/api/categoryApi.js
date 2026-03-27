import axiosClient from './axiosClient';

export const categoryApi = {
  getAll: () => axiosClient.get('/api/Categories'),
  getById: (id) => axiosClient.get(`/api/Categories/${id}`),
  create: (body) => axiosClient.post('/api/Categories', body),
  update: (id, body) => axiosClient.put(`/api/Categories/${id}`, body),
  remove: (id) => axiosClient.delete(`/api/Categories/${id}`),
};
