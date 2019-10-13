<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">微人事</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-badge style="margin-right: 30px">
            <i class="fa fa-bell-o" style="cursor: pointer"></i>
          </el-badge>
          <el-dropdown @command="commandHandler">
            <span
              class="el-dropdown-link home_userInfo"
              style="display: flex;align-items: center"
            >
              {{ user.realName }}
              <i
                ><img
                  v-if="user.profilePicture !== ''"
                  :src="user.profilePicture"
                  style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"
                  alt="头像"
              /></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside width="180px" class="home-aside">
          <div>
            <el-menu unique-opened router>
              <template v-for="(item, index) in this.routes">
                <el-submenu
                  v-if="!item.hidden"
                  :key="index"
                  :index="index + ''"
                >
                  <template slot="title">
                    <i
                      style="margin-right: 10px"
                      :class="item.meta.iconCls"
                    ></i>
                    <span slot="title">{{ item.name }}</span>
                  </template>
                  <el-menu-item
                    width="l80px"
                    v-for="subordinateResource in item.children"
                    :index="subordinateResource.path"
                    :key="subordinateResource.path"
                  >
                    {{ subordinateResource.name }}
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="this.$router.currentRoute.name !== 'Home'"
          >
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item
              v-text="this.$router.currentRoute.name"
            ></el-breadcrumb-item>
          </el-breadcrumb>
          <div
            class="homeWelcome"
            v-if="this.$router.currentRoute.name === 'Home'"
          >
            欢迎访问微人事!
          </div>
          <keep-alive>
            <router-view v-if="this.$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {},
  methods: {
    commandHandler(cmd) {
      if (cmd === "logout") {
        this.$confirm("此操作将注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.getRequest("/logout");
            this.$store.commit("logout");

            // 注销时候要清空vuex里的路由数据，否则如果用户切换账号，但是没刷新页面，拿到的还是上一个用户的菜单数据
            this.$store.commit("initResources", []);
            this.$router.replace("/");
            // this.$message({
            //   type: "success",
            //   message: "注销成功!"}
            //   );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    routes() {
      return this.$store.state.routes;
    }
  }
};
</script>

<style>
.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  padding-top: 50px;
}
.home-container {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.home-header {
  background-color: #20a0ff;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;
  padding: 0;
}

.home-aside {
  background-color: #ececec;
}

.home-main {
  background-color: #fff;
  color: #000;
  text-align: center;
  margin: 0;
  padding: 0;
}

.home_title {
  color: #fff;
  font-size: 22px;
  display: inline;
  margin-left: 8px;
}

.home_userInfo {
  color: #fff;
  cursor: pointer;
}

.home_userInfoContainer {
  display: inline;
  margin-right: 20px;
}

.el-submenu .el-menu-item {
  width: 180px;
  min-width: 175px;
}
</style>
