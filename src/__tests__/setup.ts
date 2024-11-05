import { config } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: {} },
    { path: '/stories', component: {} },
    { path: '/stories/:id', component: {} }
  ]
})

// Configure Vue Test Utils
config.global.mocks = {
  $router: router
}

config.global.stubs = {
  'router-link': true,
  'router-view': true
}

beforeAll(() => {
  // Any setup you need before all tests
})

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  // Any cleanup after each test
})

afterAll(() => {
  // Any cleanup after all tests
})