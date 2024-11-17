import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CategoryStoriesLayout from '@/components/CategoryStoriesLayout.vue'
import { getStoriesByCategory } from '@/services/api'

jest.mock('@/services/api', () => ({
  getStoriesByCategory: jest.fn(),
}))

describe('CategoryStoriesLayout', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
    // Spy on console.error and suppress it
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console.error after each test
    jest.restoreAllMocks()
  })

  it('displays loading state initially', () => {
    const wrapper = mount(CategoryStoriesLayout, {
      props: {
        categoryId: '1',
        title: 'Test Category',
      },
    })

    expect(wrapper.text()).toContain('Loading...')
  })

  it('renders stories when loaded', async () => {
    const mockStories = [
      {
        id: '1',
        attributes: {
          title: 'Test Story',
          content: 'Test content',
          'created-at': '2024-03-20T12:00:00Z',
        },
      },
    ]

    ;(getStoriesByCategory as jest.Mock).mockResolvedValue(mockStories)

    const wrapper = mount(CategoryStoriesLayout, {
      props: {
        categoryId: '1',
        title: 'Test Category',
      },
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Test Story')
  })

  it('displays error message when loading fails', async () => {
    const error = new Error('Failed to load')
    ;(getStoriesByCategory as jest.Mock).mockRejectedValue(error)

    const wrapper = mount(CategoryStoriesLayout, {
      props: {
        categoryId: '1',
        title: 'Test Category',
      },
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // Verify the error is shown in the UI
    expect(wrapper.text()).toContain('Failed to load')
    // Verify the error was logged (optional)
    expect(console.error).toHaveBeenCalledWith('Failed to load stories:', error)
  })
})
