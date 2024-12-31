// @ts-check
import {defineConfig} from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://appsbyluke.com',
    integrations: [tailwind(), sitemap()],
    server: {
        host: '0.0.0.0',
        port: 4321
    },
});