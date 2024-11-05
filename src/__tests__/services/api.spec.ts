import { storyApi } from '@/services/api'
import api from '@/services/api'

jest.mock('@/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}))

describe('storyApi', () => {
  it('creates story with correct form data', async () => {
    const mockStory = {
      title: 'Test Story',
      content: 'Test content',
      category_id: '1', // Change to string
      status: 'published'
    }
    
    const formData = new FormData()
    Object.entries(mockStory).forEach(([key, value]) => {
      formData.append(`story[${key}]`, value.toString())  // Convert all values to string
    })
    
    await storyApi.create(formData)
    
    expect(api.post).toHaveBeenCalledWith('/stories', formData)
  })
})