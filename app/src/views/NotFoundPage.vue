<template>
  <div class="relative p-8 bg-yellow-100 neo-brutalism">
    <h1 class="text-4xl font-bold mb-6">404: Lost in the Tech Odyssey</h1>

    <div class="bg-yellow-300 neo-brutalism p-4 md:p-6 transform -rotate-1 mb-8">
      <p class="text-lg md:text-xl font-bold mb-4">Fear not, explorer! Your journey isn't over.</p>
      <router-link
        to="/"
        class="inline-block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 neo-brutalism neo-brutalism-hover transition-all duration-300 text-xl transform hover:rotate-2"
      >
        Return to Dashboard
      </router-link>
    </div>

    <div class="space-y-4 mb-8">
      <p class="text-lg md:text-xl">You've stumbled into the internet's Bermuda Triangle. What happened?</p>

      <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
        <li>The page took an extended coffee break.</li>
        <li>A mischievous AI had your URL for breakfast.</li>
        <li>You've found a glitch in the Matrix.</li>
        <li>Our hamster servers are napping.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  document.title = 'Page Not Found | AppsByLuke Dashboard';
});
</script>