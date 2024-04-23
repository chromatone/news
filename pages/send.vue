<script setup>
definePageMeta({ middleware: ["auth"] })

async function sendMail() {
  const res = await $fetch('/api/newsletter/send', {
    method: 'POST',
    body: {
      from: 'hi@chromatone.center',
      to: 'davay@ooley.ru',
      subject: 'Newletter',
      unsubscribeUrl: 'https://academy.chromatone.center/',
    }
  })
  push.info('sent')
  console.log(res)
}
</script>

<template lang='pug'>
p NEWS
  button.button(@click="sendMail()") SEND
</template>