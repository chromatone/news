<script setup>
const props = defineProps({
  name: { type: String, default: 'Academy Member' },
  news: { type: Array, default: () => [] },
  title: { type: String, default: 'Chromatone updates' },
  description: { type: String, default: 'Fresh community newsletter' },
  content: { type: String, default: 'This is example content' },
  newsletter: { type: Object, default: () => ({}) },
})
</script>

<template>
  <div style="font-size: 1.5rem">
    <h2>Hello, {{ name }}!</h2>
    <p class="description">{{ description }}</p>
    <p>{{ content }}</p>
    <div class="news-list">
      <div class="news" v-for="n in news" :key="n">
        <h3>{{ n.title }}</h3>
        <p>{{ n?.description }}</p>
        <a v-if="n?.link" :href="n?.link">{{ n?.link }}</a>
        <a :href="`https://news.chromatone.center/read/${n?.slug}`">Read more...</a>
      </div>
    </div>
    <hr />
    <div class="footer">
      <h4>{{ newsletter?.title }}</h4>
      <i>{{ newsletter?.description }}</i>
    </div>

  </div>
</template>

<style scroped>
h3 {
  font-size: 1.6em;
}

.news-list {
  margin: 2em 0;
  display: flex;
  flex: column;
  gap: 2em
}

.news {
  display: flex;
  flex: column;
  gap: 1em;
  background-color: #eee3;
  border-radius: 1em;
}

.description {
  opacity: 0.6;
  font-size: 1.2em;
  margin: 0.5em 0;
}

.footer {
  padding: 1em;
  display: flex;
  flex: column;
  opacity: 0.7;
  text-transform: uppercase;
  font-size: 0.5em
}
</style>