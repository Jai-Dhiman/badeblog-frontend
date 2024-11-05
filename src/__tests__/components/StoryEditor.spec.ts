import { mount } from '@vue/test-utils'
import StoryEditor from '@/components/StoryEditor.vue'
import type { StoryFormData } from '@/types'
import { describe, it, expect } from '@jest/globals'

describe('StoryEditor.vue', () => {
  it('emits save event with correct data', async () => {
    const wrapper = mount(StoryEditor)
    
    // Set form values
    await wrapper.find('input[type="text"]').setValue('Test Title')
    await wrapper.find('textarea').setValue('Test Content')
    await wrapper.find('select').setValue('1')  // Select first category
    
    // Trigger save
    await wrapper.find('button:last-child').trigger('click')
    
    const emittedSave = wrapper.emitted('save')
    expect(emittedSave).toBeTruthy()
    if (emittedSave) {
      const saveData = emittedSave[0][0] as StoryFormData
      expect(saveData).toMatchObject({
        title: 'Test Title',
        content: 'Test Content',
        categoryId: 1,
        status: 'published'
      })
    }
  })
})