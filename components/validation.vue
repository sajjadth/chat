<template>
  <v-main>
    <v-card class="mx-auto my-2" max-width="360">
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img height="250" :src="item.avatar"></v-img>

      <v-card-title>{{ item.name }}</v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <div class="grey--text ms-4">4.5 (413)</div>
          <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>
        </v-row>

        <div class="my-4 text-subtitle-1">
          <v-icon>mdi-cash</v-icon>
          <span> ساعتی {{ item.price }} </span>
        </div>

        <div>
          {{ item.description }}
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>انتخاب زمان</v-card-title>

      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="blue darken-4 accent-4 white--text"
          column
        >
          <v-chip>5:30PM</v-chip>

          <v-chip>7:30PM</v-chip>

          <v-chip>8:00PM</v-chip>

          <v-chip>9:00PM</v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions>
        <v-btn color="blue darken-4" text>رزرو کردن</v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      item: this.$store.state.items[this.$store.state.selectedUser],
    };
  },
  computed: {
    selection: {
      get() {
        return this.$store.state.selection;
      },
      set(value) {
        this.$store.commit("updateSelection", value);
      },
    },
  },
};
</script>

<style></style>
