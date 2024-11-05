import { mount } from '@vue/test-utils'
import CategoryList from '@/components/CategoryList.vue'
// import type { Category } from '@/types'

jest.mock('@/services/api', () => ({
  categoryApi: {
    getAll: jest.fn().mockResolvedValue({
      data: [
        { id: 1, name: 'Stories', description: '' },
        { id: 2, name: 'Memories', description: '' }
      ]
    })
  }
}))

describe('CategoryList.vue', () => {
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