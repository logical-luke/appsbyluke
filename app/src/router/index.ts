import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: '/login', component: () => import('@/views/LoginPage.vue') },
  { path: '/register', component: () => import('@/views/RegisterPage.vue') },
  { path: '/forgot-password', component: () => import('@/views/ForgotPasswordPage.vue') },
  { path: "/:pathMatch(.*)*", component: () => import("@/views/NotFoundPage.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;