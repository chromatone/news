<script setup>
const props = defineProps({
  name: { type: String, default: "Chromatone Enjoyer" },
  date: { type: String, default: "2024-01-31T17:00:00.000Z" },
});

import { useTimeAgo } from "@vueuse/core";

const ago = useTimeAgo(() => props.date);
</script>

<template>
  <html lang="en" style="font-size: 1.2rem;line-height: 1.4em;font-family: Commissioner, -apple-system,
    BlinkMacSystemFont, Segoe UI , Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans , Droid Sans , Helvetica Neue ,
    sans-serif;">

  <body>
    <h2>Hello, {{ name }}!</h2>
    <p style="font-size:0.8em; opacity:0.6">
      You've reading this because about {{ ago }} you've shared your email address with us to notify you about our news
      and updates here at <a href="https://synth.playtronica.com">
        synth.playtronica.com </a> and <a href="https://chromatone.center">chromatone.center</a>
    </p>
    <h3>Chromatone Academy is opening for the first time!</h3>
    <p>
      Our Visual Music Language research at Chromatone got deep enough to become a solid foundation for new visual
      music researchers, students and performers. We're starting a closer community platform to grow together as
      interconnected people all over the world, who understand music with colors and vice versa.
    </p>
    <a href="https://academy.chromatone.center">academy.chromatone.center</a>
    <h4>May Soft Launch</h4>
    <p> Become one of the first students! Join us during May 2024 and get the early-bird price.
    </p>
    <p>Witness the Academy's open-source development and educational content production firsthand as we grow alongside
      our first students (including you!). We've got plenty of projects realized and experience acquired and verified
      and now we start transforming it into granular units and modules inside comprehensive courses. You will be part of
      it via Discord community discussions, live streaming group calls and actions on the growing interactive Academy
      web-site.</p>
    <a href="https://academy.chromatone.center/membership/subscribe/"></a>
    <hr />
    <p style="height: 800px;">
      Denis Starov,<br />
      founder and developer<br />
      <a href="https://academy.chromatone.center">academy.chromatone.center</a>
    </p>
  </body>

  </html>
</template>
