<script setup>
const { data: newsletters } = await useFetch('/api/list/newsletters')
</script>

<template lang='pug'>
.p-4.flex.flex-wrap.gap-4 
  .flex.flex-col.flex-1.max-w-55ch.gap-4
    .glass.p-4.flex.flex-col.gap-4
      .text-xl NEWS
      NuxtLink.underline(to="/news/rss" target="_blank") RSS Feed Link
  .flex.flex-col.flex-1.max-w-55ch.gap-4(v-for="newsletter in newsletters") 
    .glass.p-4.flex.flex-col.gap-2
      .flex.items-center
        .text-xl {{ newsletter?.title }}
        .right-4.absolute.text-sm.op-50 NEWSLETTER
      .text-md {{ newsletter?.description }}
    template(v-for="issue in newsletter?.issues") 
      .glass.p-2.flex.flex-col.gap-4
        .flex.items-center.px-2
          .text-xl {{ issue?.title }}
          .right-4.absolute.text-sm.op-50 ISSUE
        .text-sm.px-2 {{ issue?.description }}
        .rounded-lg.shadow.bg-light-900.bg-op-10.p-2.flex.flex-col.gap-2(v-for="news in issue?.news")
          .flex.items-center
            .text-md {{ news?.title }}
            .right-4.absolute.text-sm.op-50 NEWS
          .text-xs {{ news?.description }}
</template>