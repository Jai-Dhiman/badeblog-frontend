import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

// Simple interceptor that reads token directly from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const storyApi = {
  getAll: () => api.get("/stories"),
  get: (id: number) => api.get(`/stories/${id}`),
  create: (formData: FormData) => api.post("/stories", formData),
  update: (id: number, formData: FormData) => api.put(`/stories/${id}`, formData),
  getComments: (storyId: number) => api.get(`/stories/${storyId}/comments`),
  addComment: (storyId: number, data: { content: string }) => 
    api.post(`/stories/${storyId}/comments`, data),
};

export const categoryApi = {
  getAll: () => api.get("/categories"),
  getStories: (id: number) => api.get(`/categories/${id}/stories`),
};

export default api;