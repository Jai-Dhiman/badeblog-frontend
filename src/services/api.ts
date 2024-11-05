import axios from "axios";
import { auth } from "./auth";

const api = axios.create({
  baseURL: "/api/v1",
});

api.interceptors.request.use((config) => {
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export const storyApi = {
  getAll: () => api.get("/stories"),
  get: (id: number) => api.get(`/stories/${id}`),
  create: (formData: FormData) => api.post("/stories", formData),
  update: (id: number, formData: FormData) => api.put(`/stories/${id}`, formData),
  delete: (id: number) => api.delete(`/stories/${id}`),
};

export const categoryApi = {
  getAll: () => api.get("/categories"),
  getStories: (id: number) => api.get(`/categories/${id}/stories`),
};

export default api;
