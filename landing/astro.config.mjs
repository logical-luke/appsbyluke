// astro.config.mjs
import {defineConfig} from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import partytown from '@astrojs/partytown';
import prefetch from '@astrojs/prefetch';

export default defineConfig({
    site: 'https://appsbyluke.com',
    integrations: [
        tailwind({
            // Add this configuration to better handle CSS
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
    server: {
        host: '0.0.0.0',
        port: 4321
    },
    build: {
        inlineStylesheets: 'auto'
    }
});
