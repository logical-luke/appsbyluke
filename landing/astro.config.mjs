import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";

export default defineConfig({
    site: 'https://appsbyluke.com',
    output: 'static',
    integrations: [
        tailwind(),
        sitemap(),
        icon(),
    ],
    vite: {
        build: {
            cssCodeSplit: true,
            cssMinify: true,
            rollupOptions: {
                output: {
                    assetFileNames: 'assets/[hash][extname]',
                    chunkFileNames: 'assets/[hash].js',
                    entryFileNames: 'assets/[hash].js',
                }
            }
        }
    },
    server: {
        host: '0.0.0.0',
        port: 4321
    },
});
