import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import EnvironmentPlugin from "vite-plugin-environment";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  server: {
    port: 4173
  },
  plugins: [
    vue(),
    vueJsx(),
    EnvironmentPlugin({
      API_BASE_URL: "https://api.appsbyluke.com/v1",
      NODE_ENV: process.env.NODE_ENV || "development"
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {}
      }
    }
  }
});