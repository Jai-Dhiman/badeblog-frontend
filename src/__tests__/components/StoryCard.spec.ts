import { mount } from '@vue/test-utils'
import StoryCard from '@/components/StoryCard.vue'
import { formatDate, truncateText } from '@/utils/helpers'
import type { Story } from '@/types'

describe('StoryCard.vue', () => {
  const mockStory: Story = {
    id: 1,
    title: 'Test Story',
    content: 'Test content',
    status: 'published',
    categoryId: 1,
    userId: 1,
    createdAt: '2024-11-05T00:00:00.000Z',
    updatedAt: '2024-11-05T00:00:00.000Z',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      role: 'user'
    },
    category: {
      id: 1,
      name: 'Memories',
      description: ''
    }
  }

  it('renders story title correctly', () => {
    const wrapper = mount(StoryCard, {
      props: {
        story: mockStory
      },
      global: {
        stubs: {
          'router-link': true
        }
      }
    })
    expect(wrapper.find('h2').text()).toBe('Test Story')
  })

  it('formats date correctly', () => {
    const wrapper = mount(StoryCard, {
      props: {
        story: mockStory
      }
    })
    const formattedDate = formatDate(mockStory.createdAt)
    expect(wrapper.text()).toContain(formattedDate)
  })

  it('truncates content correctly', () => {
    const longContent = 'a'.repeat(200)
    const wrapper = mount(StoryCard, {
      props: {
        story: {
          ...mockStory,
          content: longContent
        }
      }
    })
    expect(wrapper.text()).toContain(truncateText(longContent))
  })
})
