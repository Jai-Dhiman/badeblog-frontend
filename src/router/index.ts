import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import("../views/auth/LoginView.vue")
      },
      {
        path: 'register',
        name: 'register',
        component: () => import("../views/auth/RegisterView.vue")
      }
    ]
  },
  {
    path: '/stories',
    children: [
      {
        path: '',
        name: 'stories',
        component: () => import("../views/stories/StoriesView.vue")
      },
      {
        path: 'new',
        name: 'new-story',
        component: () => import("../views/stories/NewStoryView.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        name: 'story-detail',
        component: () => import("../views/stories/StoryDetailView.vue")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem("token");

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
