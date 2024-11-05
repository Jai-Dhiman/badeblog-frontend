import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { auth } from '@/services/auth'
import type { JestMockFunction } from '../types'

type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

const mockPost: JestMockFunction<AuthResponse> = jest.fn();

jest.mock('@/services/api', () => ({
  default: {
    post: mockPost
  }
}))

describe('auth service', () => {
  beforeEach(() => {
    localStorage.clear()
    auth.setToken(null)
    mockPost.mockReset()
  })

  it('login sets token and returns user data', async () => {
    const mockResponseData = {
      data: {
        token: 'test-token',
        user: { id: 1, email: 'test@test.com' }
      }
    }

    mockPost.mockResolvedValue(mockResponseData)
    
    const result = await auth.login('test@test.com', 'password')
    
    expect(auth.token).toBe(mockResponseData.data.token)
    expect(result).toEqual(mockResponseData.data.user)
  })
})