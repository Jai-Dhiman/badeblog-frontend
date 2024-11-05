import axios from 'axios'
import type { Story, User } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (email: string, password: string) => 
    api.post<{token: string, user: User}>('/sessions', { email, password }),
  register: (userData: Partial<User>) => 
    api.post<{token: string, user: User}>('/users', { user: userData })
}

export const storiesAPI = {
  getAll: () => api.get<Story[]>('/stories'),
  get: (id: number) => api.get<Story>(`/stories/${id}`),
  create: (story: Partial<Story>) => api.post<Story>('/stories', { story }),
  update: (id: number, story: Partial<Story>) => 
    api.put<Story>(`/stories/${id}`, { story }),
  delete: (id: number) => api.delete(`/stories/${id}`)
}