import { auth } from '@/services/auth'
import api from '@/services/api'

// Mock API module
jest.mock('@/services/api')

describe('auth service', () => {
  beforeEach(() => {
    // Clear localStorage and reset token before each test
    localStorage.clear()
    auth.setToken(null)
  })

  it('sets token correctly', () => {
    const token = 'test-token'
    auth.setToken(token)
    expect(localStorage.getItem('token')).toBe(token)
    expect(auth.token).toBe(token)
  })

  it('login sets token and returns user data', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        user: { id: 1, email: 'test@test.com' }
      }
    }
    
    // Mock API response
    ;(api.post as jest.Mock).mockResolvedValue(mockResponse)
    
    const result = await auth.login('test@test.com', 'password')
    
    expect(auth.token).toBe('test-token')
    expect(result).toEqual(mockResponse.data.user)
  })
})