<script setup>
const duplicates = ref([])

async function sendCommand() {
  duplicates.value = await $fetch('/api/service/cleanup', {
    method: 'POST'
  })
}
</script>

<template lang='pug'>
.flex.flex-col.p-4.gap-4
  .text-2xl CLEANUP
  button.p-4.bg-dark-400.rounded-xl.text-light(@click="sendCommand()") Clean up emails
  pre {{ duplicates}}
</template>