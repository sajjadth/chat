<template>
  <v-app-bar class="grey darken-1" app v-if="this.$store.state.isChatPage">
    <v-app-bar-nav-icon color="white" @click="leaveChat">
      <v-icon>mdi-arrow-left</v-icon>
    </v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-toolbar-title class="white--text">{{
      this.$store.state.items[this.$store.state.selectedUser].name
    }}</v-toolbar-title>
    <v-avatar color="blue darken-4" size="40" class="ml-2">
      <span class="white--text text-h5">Dr</span>
    </v-avatar>
  </v-app-bar>

  <v-app-bar class="grey darken-1" app v-else>
    <v-app-bar-nav-icon>
      <v-icon color="white">mdi-menu</v-icon>
    </v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-toolbar-title class="white--text">روانشناسی</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    leaveChat() {
      this.$store.commit("joinAndLeaveChat", -1);
    },
  },
};
</script>

<style></style>
