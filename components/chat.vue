<template>
  <v-main id="chat">
    <v-container class="fill-height mb-1">
      <v-row class="fill-height pb-14" align="end">
        <v-col class="px-3 py-0">
          <div
            v-for="(item, index) in this.$store.state.chat"
            :key="index"
            :class="[
              'd-flex flex-row align-center my-2',
              item.from == 'user' ? 'justify-end' : null,
            ]"
          >
            <span v-if="item.from != 'user'" class="ml-3 message">{{
              item.msg
            }}</span>
            <span
              v-if="item.from == 'user'"
              class="mr-3 message-user message"
              >{{ item.msg }}</span
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-footer fixed class="justify-center">
      <v-container class="ma-0 pa-0 d-flex justify-center">
        <v-row no-gutters>
          <v-col >
            <div class="d-flex flex-row align-center">
              <v-text-field
                v-model="message"
                placeholder="Type Something"
                @keypress.enter="send"
                rounded
                dense
                filled
                hide-details="true"
                full-width
                height="auto"
              ></v-text-field>
              <v-btn v-if="this.$store.state.isWriting" icon class="ml-4" @click="send">
                <v-icon >mdi-send</v-icon>
              </v-btn>
              <v-btn v-else icon class="ml-4" @mousedown="drag" @mouseup="drag">
                <v-icon >mdi-microphone-outline</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      isWriting: this.$store.state.isWriting,
      item: this.$store.state.items[this.$store.state.selectedUser],
    };
  },
  methods: {
    send() {
      this.$store.commit("sendMessage");
    },
    drag(){
      console.log(`drag start`)
    }
  },
  computed: {
    message: {
      get() {
        return this.$store.state.msg;
      },
      set(msg) {
        this.$store.commit("updateMessage", msg);
      },
    },
  },
};
</script>

<style></style>
