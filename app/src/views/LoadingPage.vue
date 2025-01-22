<template>
  <div class="flex items-center justify-center min-h-screen bg-blue-100">
    <div class="w-full items-center text-center max-w-md">
      <h2 class="text-3xl font-bold mb-6 transform rotate-2 bg-yellow-300 inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Loading</h2>

      <div class="flex justify-center items-center h-32">
        <div class="relative w-16 h-16">
          <div class="absolute top-0 left-0 w-16 h-16 bg-purple-400 border-4 border-black rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
