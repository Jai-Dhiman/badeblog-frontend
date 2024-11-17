import { config } from '@vue/test-utils'

config.global.components = {
  RouterLink: {
    template: '<a><slot></slot></a>',
  },
  RouterView: {
    template: '<div><slot></slot></div>',
  },
  QuillEditor: {
    template: '<div><slot></slot></div>',
  },
}

jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}))
