<script setup>
const route = useRoute()
</script>

<template lang='pug'>
p {{ route?.params?.slug }}
</template>