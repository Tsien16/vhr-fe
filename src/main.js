import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import "./plugins/element.js";
import "./utils/dateUtil";
import "font-awesome/css/font-awesome.min.css";
import "element-ui/lib/theme-chalk/index.css";

import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest
} from "./utils/api";

import { initResource } from "./utils/initResource";

Vue.config.productionTip = false;

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;

// 配置全局路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.name === "Login") {
    next();
    return;
  }

  let name = store.state.user.realName;
  if (name === "未登录") {
    if (to.meta.requireAuth || to.name == null) {
      next({ path: "/", query: { redirect: to.path } });
    } else {
      next();
    }
  } else {
    initResource(router, store);
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
