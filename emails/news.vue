<script setup>
const props = defineProps({
  name: { type: String, default: 'Academy Member' },
  memberId: { type: String, default: 'UUID' },
  news: { type: Array, default: () => [] },
  title: { type: String, default: 'Chromatone updates' },
  description: { type: String, default: 'Fresh community newsletter' },
  content: { type: String, default: 'This is example content' },
  newsletter: { type: Object, default: () => ({}) },
  discordInvite: { type: String, default: '' },
})
</script>

<template>
  <html lang="en" style="font-size: 1.5rem">
  <h2>Hello, {{ name }}!</h2>
  <h3>{{ title }}</h3>
  <h4>{{ description }}</h4>
  <p>{{ content }}</p>
  <hr />
  <table>
    <tr v-for="n in news" :key="n">
      <td>
        <h4>{{ n.title }}</h4>
        <p>{{ n?.description }}</p>
        <p><a v-if="n?.link" :href="n?.link">{{ n?.link }}</a></p>
        <p><a :href="`https://news.chromatone.center/read/${n?.slug}`">Read more...</a></p>
        <hr />
      </td>
    </tr>
  </table>

  <div>
    <h4>{{ newsletter?.title }}</h4>
    <i>{{ newsletter?.description }}</i>
  </div>
  <hr />
  <div>
    <a href="https://academy.chromatone.center/">Proceed to Academy web-site</a>
  </div>
  <div>
    <a :href="discordInvite">Discuss on Discord</a>
  </div>
  <div>
    <a :href="`https://news.chromatone.center/unsubscribe/?id=${memberId}`">Unsubscribe</a>
  </div>

  </html>
</template>