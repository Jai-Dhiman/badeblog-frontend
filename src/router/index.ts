import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RouteLocationNormalized } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
    guestOnly?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: (to) => {
        if (to.query.unsubscribed === 'true') {
          alert('You have been successfully unsubscribed.')
        } else if (to.query.unsubscribe_error) {
          alert('There was an error processing your unsubscribe request.')
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
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
    {
      path: '/others',
      name: 'others',
      component: () => import('../views/OtherView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/acknowledge',
      name: 'acknowledge',
      component: () => import('../views/AcknowledgeView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
    {
      path: '/auth/callback',
      component: () => import('@/views/AuthCallback.vue'),
    },
  ],
})

const isAuthenticated = (authStore: ReturnType<typeof useAuthStore>) => {
  return !!authStore.token && !!authStore.user
}

const isAdmin = (authStore: ReturnType<typeof useAuthStore>) => {
  return authStore.user?.role === 'admin'
}

const handleNavigation = (
  to: RouteLocationNormalized,
  authStore: ReturnType<typeof useAuthStore>,
): string | true => {
  if (to.meta.guestOnly && isAuthenticated(authStore)) {
    return '/'
  }

  if (to.meta.requiresAuth && !isAuthenticated(authStore)) {
    const loginPath = '/login'
    const redirect = to.fullPath
    return `${loginPath}?redirect=${encodeURIComponent(redirect)}`
  }

  if (to.meta.requiresAdmin && !isAdmin(authStore)) {
    return '/'
  }

  return true
}

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  try {
    if (!authStore.user && authStore.token) {
      await authStore.initializeAuth()
    }

    const navigationResult = handleNavigation(to, authStore)
    if (navigationResult === true) {
      next()
    } else {
      next(navigationResult)
    }
  } catch (error) {
    console.error('Navigation guard error:', error)
    authStore.logout()
    next('/login')
  }
})

router.onError((error) => {
  console.error('Router error:', error)
  router.push('/')
})

export default router
