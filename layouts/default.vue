<template>
  <v-app>
    <Header />
    <Nuxt />
  </v-app>
</template>

<script>
import "../tinode-sdk/browser/tinode.js";
import "../assets/global.sass";
import Header from "../components/header.vue";
export default { components: { Header } };
</script>
