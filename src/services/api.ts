import axios from 'axios'
import type { Story, CreateStoryData } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (!config.headers.Authorization) {
    delete config.headers.Authorization
  }
  return config
})

export const login = async (email: string, password: string) => {
  const response = await api.post('/sessions', { email, password })
  return response.data
}

export const signup = async (userData: {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: string
}) => {
  const response = await api.post('/users', userData)
  return response.data
}

export const getStories = async () => {
  try {
    const response = await api.get('/stories')
    return response.data.data || []
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const createStory = async (storyData: CreateStoryData) => {
  const response = await api.post('/stories', storyData)
  return response.data
}

export const getCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data.data || []
  } catch (error) {
    throw error
  }
}

export const getCategory = async (id: string) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const getStory = async (id: string): Promise<Story> => {
  const response = await api.get(`/stories/${id}`, {
    headers: {
      Authorization: localStorage.getItem('token')
        ? `Bearer ${localStorage.getItem('token')}`
        : undefined,
    },
  })
  return response.data.data
}

export const getDrafts = async () => {
  try {
    const response = await api.get('/stories/drafts')
    return response.data.data || []
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getStoriesByCategory = async (categoryId: string | number) => {
  try {
    const url = `/categories/${categoryId}/stories`
    const response = await api.get(url, {
      params: { status: 'published' },
    })
    return response.data.data || []
  } catch (error) {
    console.error('Full error details:', {
      url: `/categories/${categoryId}/stories`,
      baseURL: api.defaults.baseURL,
      error,
    })
    throw error
  }
}

export const getStoryComments = async (storyId: string) => {
  const response = await api.get(`/stories/${storyId}/comments`, {
    headers: {
      Authorization: localStorage.getItem('token')
        ? `Bearer ${localStorage.getItem('token')}`
        : undefined,
    },
  })
  return response.data
}

export const updateStory = async (id: string, storyData: CreateStoryData) => {
  const response = await api.put(`/stories/${id}`, storyData)
  return response.data
}

export const deleteStory = async (id: string) => {
  const response = await api.delete(`/stories/${id}`)
  return response.data
}

export const createComment = async (storyId: string, data: { content: string }) => {
  const response = await api.post(`/stories/${storyId}/comments`, data)
  return response.data.data
}

export const deleteComment = async (storyId: string, commentId: string) => {
  const response = await api.delete(`/stories/${storyId}/comments/${commentId}`)
  return response.data
}
