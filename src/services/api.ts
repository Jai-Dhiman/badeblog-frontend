import axios from "axios";
import { auth } from "./auth";
import type { Story, Comment } from "@/types";

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
  getAll: () => api.get<Story[]>("/stories"),
  get: (id: number) => api.get<Story>(`/stories/${id}`),
  create: (formData: FormData) => {
    if (formData.has('story[content]')) {
      const content = formData.get('story[content]');
      formData.set('story[content]', content as string);
    }
    return api.post<Story>("/stories", formData);
  },
  update: (id: number, formData: FormData) => {
    if (formData.has('story[content]')) {
      const content = formData.get('story[content]');
      formData.set('story[content]', content as string);
    }
    return api.put<Story>(`/stories/${id}`, formData);
  },
  getComments: (storyId: number) => api.get<Comment[]>(`/stories/${storyId}/comments`),
  addComment: (storyId: number, data: { content: string }) => api.post<Comment>(`/stories/${storyId}/comments`, data),
};

export const categoryApi = {
  getAll: () => api.get("/categories"),
  getStories: (id: number) => api.get(`/categories/${id}/stories`),
};

export default api;
