import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      realName:
        localStorage.getItem("user" || "[]") === "undefined"
          ? "未登录"
          : JSON.parse(localStorage.getItem("user" || "[]")).realName,

      profilePicture:
        localStorage.getItem("user" || "[]") === "undefined"
          ? ""
          : JSON.parse(localStorage.getItem("user" || "[]")).profilePicture
    },
    routes: []
  },
  mutations: {
    initResources(state, fmtRoutes) {
      state.routes = fmtRoutes;
    },
    login(state, user) {
      state.user = user;
      localStorage.setItem("user", user);
    },
    logout() {
      localStorage.removeItem("user");
    }
  },
  actions: {}
});
