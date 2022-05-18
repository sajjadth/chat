<template>
  <!-- <chat @leaveChat="joinAndLeaveChat" v-if="isInChat" /> -->
  <ValidatePage v-if="this.$store.state.isChatPage" />
  <uesrs-list v-else />
</template>

<script>
import { Tinode } from "../tinode-sdk/lib";
import ValidatePage from "../components/validatePage.vue";

const tinode = new Tinode("tinode", "web", {
  host: "127.0.0.1:6060",
  APIKey: "AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K",
  secure: false,
  transport: "ws",
  autoReconnect: true,
});

tinode.connect();

export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {
    tinode.enableLogging(true);
    tinode.onConnect = function (e) {
      console.log("connected:", e);
    };
    tinode.onDisconnect = function (err) {
      console.log("disconnected:", err);
    };
    tinode.setAuthToken(this.token);
  },
  components: { ValidatePage },
};
</script>

<style></style>
