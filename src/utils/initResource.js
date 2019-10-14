/**
 * Created with WebStorm.
 * @author tsien
 * @version 1.0.0
 * @date 2019/9/24 0024 15:24
 */
import {getRequest} from './api';

export const initResource = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }

  getRequest("/config/userResources").then(response => {
    if (response && response.status === 200) {
      let userResources = formatRoutes(response.data);
      router.addRoutes(userResources);
      store.commit("initResources", userResources);
    }
  });
};

// 格式化路由
export const formatRoutes = routes => {
  let fmRoutes = [];
  routes.forEach(router => {
    // 结构JSON，字段名称与JSON里的一致
    let {
      resourcePath,
      component,
      name,
      iconCls,
      keepAlive,
      requireAuth,
      subordinateResources
    } = router;

    if (subordinateResources && subordinateResources instanceof Array) {
      subordinateResources = formatRoutes(subordinateResources);
    }

    let fmRouter = {
      path: resourcePath,
      component: () => {
        if (component.startsWith("Home")) {
          return import(`../views/${component}.vue`);
        } else if (component.startsWith("Employee")) {
          return import(`../views/employee/${component}.vue`);
        } else if (component.startsWith("Per")) {
          return import(`../views/personnel/${component}.vue`);
        } else if (component.startsWith("Sal")) {
          return import(`../views/salary/${component}.vue`);
        } else if (component.startsWith("Sta")) {
          return import(`../views/statistics/${component}.vue`);
        } else if (component.startsWith("Sys")) {
          return import(`../views/system/${component}.vue`);
        }
      },
      name: name,
      meta: {
        iconCls: iconCls,
        keepAlive: keepAlive,
        requireAuth: requireAuth
      },
      children: subordinateResources
    };
    fmRoutes.push(fmRouter);
  });
  return fmRoutes;
};
