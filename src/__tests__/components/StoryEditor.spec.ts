import { describe, it, expect, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import StoryEditor from '@/components/StoryEditor.vue'
import type { Category, StoryFormData } from '@/types'
import type { ApiMockFunction } from '../types'

jest.mock('@/services/api', () => ({
  categoryApi: {
    getAll: mockGetAll
  }
}));

const mockGetAll: ApiMockFunction<Category[]> = jest.fn();
const { storyApi } = jest.requireMock('@/services/api');
Object.assign(mockGetAll, storyApi.getAll);

describe('StoryEditor.vue', () => {
  it('emits save event with correct data', async () => {
    mockGetAll.mockResolvedValue({
      data: [
        { id: 1, name: 'Stories', description: '' },
        { id: 2, name: 'Memories', description: '' }
      ]
    })

    const wrapper = mount(StoryEditor)
    
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    await wrapper.find('[data-test="title-input"]').setValue('Test Title')
    await wrapper.find('[data-test="content-input"]').setValue('Test Content')
    await wrapper.find('[data-test="category-select"]').setValue('1')
    await wrapper.find('[data-test="publish-button"]').trigger('click')
    
    const emittedEvents = wrapper.emitted()
    const saveEvents = emittedEvents.save as Array<[StoryFormData]>
    expect(saveEvents).toBeTruthy()
    expect(saveEvents[0][0]).toMatchObject({
      title: 'Test Title',
      content: 'Test Content',
      categoryId: '1',
      status: 'published'
    })
  })
})