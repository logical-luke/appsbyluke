// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import partytown from '@astrojs/partytown';
import prefetch from '@astrojs/prefetch';

export default defineConfig({
    site: 'https://appsbyluke.com',
    output: 'static', // Explicitly set static output
    integrations: [
        tailwind({
            applyBaseStyles: false,
        }),
        sitemap(),
        icon(),
        partytown({
            config: {
                forward: ['dataLayer.push'],
            }
        }),
        prefetch()
    ],
    build: {
        inlineStylesheets: 'always',
    },
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
