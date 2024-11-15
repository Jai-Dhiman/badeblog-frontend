import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/stories/:id',
      name: 'story-view',
      component: () => import('../views/StoryView.vue'),
    },
    {
      path: '/stories/new',
      name: 'create-story',
      component: () => import('../views/CreateStoryView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/stories/:id/edit',
      name: 'edit-story',
      component: () => import('../views/EditStoryView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/essays',
      name: 'essays',
      component: () => import('../views/EssaysView.vue'),
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/ArticleView.vue'),
    },
    {
      path: '/short-stories',
      name: 'short-stories',
      component: () => import('../views/ShortStoryView.vue'),
    },
    {
      path: '/poems',
      name: 'poems',
      component: () => import('../views/PoemView.vue'),
    },
    {
      path: '/plays',
      name: 'plays',
      component: () => import('../views/PlayView.vue'),
    },
    {
      path: '/drafts',
      name: 'drafts',
      component: () => import('../views/DraftsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/')
  } else {
    next()
  }
})

export default router
