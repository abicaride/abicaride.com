import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://abicaride.com',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
