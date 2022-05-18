<template>
  <v-app>
    <chat v-if="this.$store.state.chatIsValid" />
    <validation v-else />
  </v-app>
</template>

<script>
export default {};
</script>

<style></style>
