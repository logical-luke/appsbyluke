<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import AppSidebar from "@/components/AppSidebar.vue";

const route = useRoute();

const isAuthRoute = computed(() => {
  return ['/login', '/register', '/forgot-password'].includes(route.path);
});

onMounted(() => {
  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = `https://dashboard.appsbyluke.com${route.path}`;
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AppsByLuke Dashboard",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  });
  document.head.appendChild(script);
});
</script>

<template>
  <div class="h-screen" :class="{ 'flex bg-gray-100': !isAuthRoute }">
    <template v-if="!isAuthRoute">
      <AppSidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div class="container mx-auto px-6 py-8">
            <RouterView />
          </div>
        </main>
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<style>
body {
  font-family: 'Rubik', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Bebas Neue', sans-serif;
}

.neo-brutalism {
  @apply border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)];
}

.neo-brutalism-hover {
  @apply transition-all duration-300 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)];
}
</style>
