<template>
  <aside class="w-64 bg-white border-r-4 border-black">
    <nav class="mt-10">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="block py-2 px-4 text-lg font-bold hover:bg-gray-200 neo-brutalism neo-brutalism-hover m-2"
        :class="{ 'bg-blue-200': $route.path === item.path }"
      >
        {{ item.name }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Subscription', path: '/subscription' },
  { name: 'Invoices', path: '/invoices' },
  { name: 'Account', path: '/account' },
];
</script>
