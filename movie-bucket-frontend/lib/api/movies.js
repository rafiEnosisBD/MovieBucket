import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '');

const http = axios.create({
  baseURL: API_URL,
});

function normalizeAxiosError(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const message =
    data?.message ||
    data?.Message ||
    err?.message ||
    'Something went wrong. Please try again.';

  return { status, data, message, raw: err };
}

export const movieApi = {
  async getAll(params = {}) {
    try {
      const response = await http.get(`/movies`, { params });
      return response.data;
    } catch (err) {
      throw normalizeAxiosError(err);
    }
  },

  async getById(id) {
    try {
      const response = await http.get(`/movies/${id}`);
      return response.data;
    } catch (err) {
      throw normalizeAxiosError(err);
    }
  },

  async create(formData) {
    try {
      const response = await http.post(`/movies`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      throw normalizeAxiosError(err);
    }
  },

  async update(id, formData) {
    try {
      const response = await http.put(`/movies/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      throw normalizeAxiosError(err);
    }
  },

  async delete(id) {
    try {
      await http.delete(`/movies/${id}`);
    } catch (err) {
      throw normalizeAxiosError(err);
    }
  },
};
