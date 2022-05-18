<template>
  <v-main class="mx-auto">
    <v-list
      width="100%"
      :key="item.name"
      v-for="(item, index) in this.$store.state.items"
      three-line
    >
      <v-list-item @click="() => joinChat({ index })">
        <v-list-item-avatar class="mr-0 my-4 ml-4">
          <v-img :src="item.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="item.name"></v-list-item-title>
          <v-list-item-subtitle
            v-html="item.description"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-main>
</template>

<script>
export default {
  props: ["items"],
  methods: {
    joinChat(index) {
      this.$store.commit("joinAndLeaveChat", index);
    },
  },
};
</script>
<style></style>
