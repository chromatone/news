<script setup>
useHead({
  htmlAttrs: {
    lang: 'en',
    icon: '/logo.svg',
  }
})

const config = useRuntimeConfig()

if (process.env.NODE_ENV == 'production') {
  useHead({
    script: [
      {
        'data-website-id': config.public.umamiId,
        async: '',
        src: config.public.umamiUrl
      }
    ]
  })
}

useSeoMeta({
  title: 'Chromatone academy',
  ogTitle: 'Chromatone Academy',
  description: 'Visual Music Education Community Center',
  ogDescription: 'Visual Music Education Community Center',
  ogImage: 'https://academy.chromatone.center/front.png',
  twitterCard: 'summary_large_image',
})

</script>

<template lang="pug">
NuxtLoadingIndicator(color='purple')
Notivue(v-slot="item")
  Notification(:item="item")
NuxtLayout
  NuxtPage
</template>

<style lang="postcss">
@import '~/assets/layout.postcss'
</style>