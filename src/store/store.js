import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      realName:
        localStorage.getItem("realName" || "[]") === null
          ? "未登录"
          : localStorage.getItem("realName"),

      profilePicture:
        localStorage.getItem("profilePicture" || "[]") === null
          ? ""
          : localStorage.getItem("profilePicture")
    },
    routes: []
  },
  mutations: {
    initResources(state, fmtRoutes) {
      state.routes = fmtRoutes;
    },
    login(state, user) {
      state.user = user;
      localStorage.setItem("realName", user.realName);
      localStorage.setItem("profilePicture", user.profilePicture);
    },
    logout() {
      localStorage.removeItem("realName");
      localStorage.removeItem("profilePicture");
    }
  },
  actions: {}
});
