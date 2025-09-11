// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
  ],
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      include: undefined,
      exclude: [
        '/',
        '/auth/register',
        '/about',
        '/contact',
        '/help',
        '/privacy',
      ],
      saveRedirectToCookie: false,
    }
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      prefix: 'Ui',
      pathPrefix: false,
    }
  ],
  runtimeConfig: {
    // Private keys (only available on server-side)
    openaiApiKey: process.env.OPENAI_API_KEY,
    // Public keys (exposed to client-side)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  }
})