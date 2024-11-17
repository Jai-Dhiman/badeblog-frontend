import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginForm from '@/components/LoginForm.vue'

// Mock the API service
jest.mock('@/services/api', () => ({
  login: jest.fn(),
  signup: jest.fn(),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(LoginForm)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Login')
  })

  it('updates v-model values when inputs change', async () => {
    const wrapper = mount(LoginForm)

    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    expect((emailInput.element as HTMLInputElement).value).toBe('test@example.com')
    expect((passwordInput.element as HTMLInputElement).value).toBe('password123')
  })
})
