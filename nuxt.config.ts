import cars from './data/cars.json'
const unverifiedCars = cars.filter((c: any) => !c.verified).map((c: any) => `/car/${c.slug}`)
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-simple-sitemap'],

  site: {
    url: 'https://battery.sgcarpass.com',
    name: 'SGCarPass Battery',
    trailingSlash: true,   // Cloudflare Pages 会把不带斜杠的网址 308 到带斜杠版，站点地图和 canonical 必须一致
  },

  sitemap: {
    exclude: [...unverifiedCars, '/eprice'],
    strictNuxtContentPaths: false,
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.sgcarpass.com',
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'SGCarPass Battery',
      meta: [
        { name: 'description', content: 'Genuine Amaron battery for your car in Singapore. Competitive prices, same-day workshop installation.' },
      ],
    },
  },
})
