import { mount } from '@vue/test-utils'
import StoriesView from '@/views/stories/StoriesView.vue'
import { storyApi } from '@/services/api'
import { createRouter, createWebHistory } from 'vue-router'
import type { Story } from '@/types'

// Create router with necessary routes
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: {} },
    { path: '/stories', component: {} },
    { path: '/stories/:id', component: {} }
  ]
})

jest.mock('@/services/api', () => ({
  storyApi: {
    getAll: jest.fn()
  }
}))

describe('StoriesView.vue', () => {
  beforeEach(() => {
    (storyApi.getAll as jest.Mock).mockReset()
  })

  it('displays stories correctly', async () => {
    const mockStories: Story[] = [
      {
        id: 1,
        title: 'Story 1',
        content: 'Content 1',
        status: 'published',
        categoryId: 1,
        userId: 1,
        createdAt: '2024-11-05T00:00:00.000Z',
        updatedAt: '2024-11-05T00:00:00.000Z'
      },
      {
        id: 2,
        title: 'Story 2',
        content: 'Content 2',
        status: 'published',
        categoryId: 1,
        userId: 1,
        createdAt: '2024-11-05T00:00:00.000Z',
        updatedAt: '2024-11-05T00:00:00.000Z'
      }
    ]
    
    ;(storyApi.getAll as jest.Mock).mockResolvedValue({ data: mockStories })
    
    const wrapper = mount(StoriesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true,
          StoryCard: true
        }
      }
    })
    
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    const storyCards = wrapper.findAllComponents({ name: 'StoryCard' })
    expect(storyCards).toHaveLength(2)
    expect(wrapper.text()).toContain('Story 1')
    expect(wrapper.text()).toContain('Story 2')
  })
})