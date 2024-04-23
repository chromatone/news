<script setup>
const props = defineProps({
  name: { type: String, default: 'Member' }
})
</script>

<template>
<div>
  <h2>Hello, {{ name }}!</h2>
</div>
</template>