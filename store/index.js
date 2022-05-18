import { Tinode } from "../tinode-sdk/lib";

export const state = () => ({
  chatToken: null,
  isChatPage: false,
  loading: false,
  selection: 2,
  chatIsValid: true,
  selectedUser: -1,
  isWriting: false,
  loading: true,
  chat: [],
  msg: null,
  token: localStorage.getItem("chat-token")
    ? localStorage.getItem("chat-token")
    : sessionStorage.getItem("chat-token")
    ? sessionStorage.getItem("chat-token")
    : null,
  items: [
    {
      avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      name: "دکتر حسام حسینی",
      description: `متن کوتاهی درباره دکتر و توضیحاتی درباره چگونگی برگذاری جلسات.`,
      price: "500,000",
    },
    {
      avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      name: "دکتر هاشم اسلامی",
      description: `متن کوتاهی درباره دکتر و توضیحاتی درباره چگونگی برگذاری جلسات.`,
      price: "700,000",
    },
    {
      avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
      name: "دکتر مهسا رحمانی",
      description:
        "متن کوتاهی درباره دکتر و توضیحاتی درباره چگونگی برگذاری جلسات.",
      price: "550,000",
    },
    {
      avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
      name: "دکتر رویا رحمتی",
      description:
        "متن کوتاهی درباره دکتر و توضیحاتی درباره چگونگی برگذاری جلسات.",
      price: "680,000",
    },
    {
      avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
      name: "دکتر آمنه نواب",
      description:
        "متن کوتاهی درباره دکتر و توضیحاتی درباره چگونگی برگذاری جلسات.",
      price: "740,000",
    },
  ],
});
export const mutations = {
  joinAndLeaveChat(state, payload) {
    state.isChatPage = !state.isChatPage;
    state.selectedUser = payload.index;
  },
  chatValidation(state) {
    state.chatIsValid = !state.chatIsValid;
  },
  sendMessage(state) {
    if (state.msg) {
      state.chat.push({
        from: "user",
        msg: state.msg,
      });
      state.msg = "";
      this.commit("addReply");
      state.isWriting = false;
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    }
  },
  addReply(state) {
    state.chat.push({
      from: "sushant",
      msg: "Hmm",
    });
  },
  updateSelection(state, value) {
    state.selection = value;
  },
  startLoading(state) {
    state.loading = true;
  },
  stopLoading(state) {
    state.loading = false;
  },
  updateMessage(state, msg) {
    msg.length > 0 ? (state.isWriting = true) : (state.isWriting = false);
    state.msg = msg;
  },
  checkForToken(state) {
    localStorage.getItem("chat-token")
      ? (state.chatToken = localStorage.getItem("chat-token"))
      : sessionStorage.getItem("chat-token")
      ? (state.chatToken = sessionStorage.getItem("chat-token"))
      : null;
    console.log(state.chatToken);
  },
  connectToTinode(state) {
    const tinode = new Tinode("tinode", "web", {
      host: "127.0.0.1:6060",
      APIKey: "AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K",
      secure: false,
      transport: "ws",
      autoReconnect: true,
    });
    tinode
      .connect()
      .then((res) => {
        console.log("connected!");
      })
      .catch((err) => {
        console.log("cant connect to server!");
      });
    console.log(tinode.authToken);
  },
};
