import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/forgot-password',
    component: () => import('@/views/ForgotPasswordPage.vue'),
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/',
    component: () => import('@/views/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    component: () => import('@/views/TasksPage.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/account',
    component: () => import('@/views/AccountPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/store',
    component: () => import('@/views/StorePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    component: () => import('@/views/ProjectsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFoundPage.vue"),
    meta: { requiresAuth: false }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let authInitialized = false;

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authInitialized) {
    await authStore.initializeAuth();
    authInitialized = true;
  }

  if (to.meta.redirectIfAuth && authStore.isAuthenticated) {
    next('/');
    return;
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }

  next();
});

export default router;
