import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import StoriesView from '@/views/stories/StoriesView.vue'
import type { Story } from '@/types'
import type { JestMockFunction } from '../types'
import { createRouter, createWebHistory } from 'vue-router'

const mockGetAll: JestMockFunction<Story[]> = jest.fn();

jest.mock('@/services/api', () => ({
  storyApi: {
    getAll: mockGetAll
  }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: {} },
    { path: '/stories', component: {} },
    { path: '/stories/:id', component: {} }
  ]
})

describe('StoriesView.vue', () => {
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

  beforeEach(() => {
    mockGetAll.mockReset()
    mockGetAll.mockResolvedValue({ data: mockStories })
  })

  it('displays stories correctly', async () => {
    const wrapper = mount(StoriesView, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true,
          StoryCard: {
            template: '<div class="story-card">{{ props.story.title }}</div>',
            props: ['story']
          }
        }
      }
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const storyCards = wrapper.findAll('.story-card')
    expect(storyCards).toHaveLength(2)
    expect(wrapper.text()).toContain('Story 1')
    expect(wrapper.text()).toContain('Story 2')
  })
})