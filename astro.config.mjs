// @ts-check
import {defineConfig} from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://appsbyluke.com',
    integrations: [tailwind(), sitemap()],
    vite: {
        ssr: {
            external: ['@sendgrid/mail'],
        },
    },
});