import { describe, it, expect, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import CategoryList from '@/components/CategoryList.vue'
import type { Category } from '@/types'
import type { JestMockFunction } from '../types'

const mockGetAll: JestMockFunction<Category[]> = jest.fn();
jest.mock('@/services/api', () => ({
  categoryApi: {
    getAll: mockGetAll
  }
}))

describe('CategoryList.vue', () => {
  const mockCategories: Category[] = [
    { id: 1, name: 'Stories', description: '' },
    { id: 2, name: 'Memories', description: '' }
  ]

  beforeEach(() => {
    mockGetAll.mockReset()
    mockGetAll.mockResolvedValue({ data: mockCategories })
  })

  it('emits select event when category is clicked', async () => {
    const wrapper = mount(CategoryList, {
      props: {
        selectedId: undefined
      }
    })
    
    await wrapper.vm.$nextTick()

    const categoryButton = wrapper.find('button:last-child')
    await categoryButton.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('select')
    expect(wrapper.emitted().select[0]).toEqual([2])
  })
})