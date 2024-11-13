import axios from 'axios'
import type { Story, Comment } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (email: string, password: string) => {
  const response = await api.post('/sessions', { email, password })
  return response.data
}

export const getStories = async () => {
  const response = await api.get('/stories')
  return response.data
}

export const createStory = async (storyData: Partial<Story>) => {
  const response = await api.post('/stories', storyData)
  return response.data
}

export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

export const getStory = async (id: number): Promise<Story> => {
  const response = await api.get(`/stories/${id}`)
  return response.data
}

export const getStoryComments = async (storyId: number): Promise<Comment[]> => {
  const response = await api.get(`/stories/${storyId}/comments`)
  return response.data
}
