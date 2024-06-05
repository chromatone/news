import { createDirectus, rest, staticToken, readSingleton, updateSingleton } from "@directus/sdk"
import pack from './package.json'

export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  devServer: {
    port: 3032
  },
  site: {
    url: 'https://news.chromatone.center'
  },
  css: [
    '@unocss/reset/tailwind.css',
    'notivue/notifications.css',
    'notivue/animations.css'
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },
  notivue: {
    position: 'top-right'
  },
  directus: {
    autoRefresh: true,
    devtools: true,
    url: process.env?.NUXT_PUBLIC_DB_URL,
    token: process.env?.NUXT_PUBLIC_ACADEMY_KEY
  },
  runtimeConfig: {
    apiToken: '',
    usersDbToken: '',
    usersDbDomain: '',
    emailFrom: '',
    emailSmtpHost: '',
    emailSmtpPort: '',
    emailSmtpSecure: '',
    emailSmtpUser: '',
    emailSmtpPassword: '',
    public: {
      appDomain: '',
      dbUrl: '',
      dbToken: '',
      umamiId: '',
      umamiUrl: '',
    }
  },
  modules: [
    'nuxt-auth-utils',
    "@unocss/nuxt",
    "@nuxtjs/sitemap",
    '@nuxtjs/mdc',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    'notivue/nuxt',
    '@vue-email/nuxt',
    'floating-vue/nuxt',
    'nuxt-cron'
  ],
  routeRules: {
    '/': { prerender: true },
  },
  colorMode: {
    classSuffix: ''
  },
  image: {
    provider: 'directus',
    format: ['webp'],
    domains: [process.env?.NUXT_PUBLIC_DB_DOMAIN],
    directus: {
      baseURL: `${process.env?.NUXT_PUBLIC_DB_URL}/assets/`,
      modifiers: {
        withoutEnlargement: 'true'
      }
    }
  },
  experimental: {
    sharedPrerenderData: true
  },
  vueEmail: {
    baseUrl: 'https://news.chromatone.center/',
    autoImport: true,
  },

})