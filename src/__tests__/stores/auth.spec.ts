import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { login } from '@/services/api'

// Mock the API calls
jest.mock('@/services/api', () => ({
  login: jest.fn(),
  signup: jest.fn(),
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with null user and token', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
  })

  it('updates user and token on successful login', async () => {
    const store = useAuthStore()
    const mockLoginData = {
      user_id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      jwt: 'mock-token',
    }

    ;(login as jest.Mock).mockResolvedValue(mockLoginData)

    await store.loginUser('test@example.com', 'password')

    expect(store.user).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    })
    expect(store.token).toBe('mock-token')
  })

  it('clears user and token on logout', async () => {
    const store = useAuthStore()
    // Set initial state
    store.$patch({
      user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' },
      token: 'mock-token',
    })

    store.logout()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
  })
})
