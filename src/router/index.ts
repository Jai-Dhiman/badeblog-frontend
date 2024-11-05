import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/services/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/RegisterView.vue"),
  },
  {
    path: "/stories",
    name: "stories",
    component: () => import("@/views/stories/StoriesView.vue"),
  },
  {
    path: "/stories/new",
    name: "story-create",
    component: () => import("@/views/stories/StoryCreateView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/stories/:id",
    name: "story-detail",
    component: () => import("@/views/stories/StoryDetailView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    next("/login");
  } else {
    next();
  }
});

export default router;
