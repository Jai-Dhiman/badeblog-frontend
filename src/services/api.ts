import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => api.post("/sessions", { email, password }),
  register: (userData: any) => api.post("/users", { user: userData }),
};

export const storiesAPI = {
  getAll: () => api.get("/stories"),
  get: (id: number) => api.get(`/stories/${id}`),
  create: (storyData: any) => api.post("/stories", { story: storyData }),
  update: (id: number, storyData: any) => api.put(`/stories/${id}`, { story: storyData }),
  delete: (id: number) => api.delete(`/stories/${id}`),
};

export default api;
