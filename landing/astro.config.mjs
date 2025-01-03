// @ts-check
import {defineConfig} from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

import icon from "astro-icon"

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
    site: 'https://appsbyluke.com',
    integrations: [
        tailwind(),
        sitemap(),
        icon(),
        partytown({
            config: {
                forward: ['dataLayer.push'],
            }
        })
    ],
    server: {
        host: '0.0.0.0',
        port: 4321
    },
});