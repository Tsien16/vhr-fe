<template>
  <el-form
    :rules="rules"
    class="login-container"
    label-position="left"
    :model="loginForm"
    ref="loginForm"
    :loading="loading"
  >
    <h3 class="login_title">系统登录</h3>

    <el-form-item label="账号" prop="username">
      <el-input
        type="text"
        v-model="loginForm.username"
        autocomplete="off"
        placeholder="账号"
      ></el-input>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        v-model="loginForm.password"
        autocomplete="off"
        placeholder="密码"
        @keydown.enter.native="submitClick"
      ></el-input>
    </el-form-item>

    <el-checkbox class="login-remember" v-model="checked" label-position="left"
      >记住密码
    </el-checkbox>

    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%" @click="submitClick">
        登录
      </el-button></el-form-item
    >
  </el-form>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      rules: {
        username: {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        },
        password: {
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }
      },
      checked: true,
      loginForm: {
        username: "admin",
        password: "123"
      },
      loading: false
    };
  },
  methods: {
    submitClick() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postRequest("/login", {
            username: this.loginForm.username,
            password: this.loginForm.password
          }).then(response => {
            this.loading = false;
            if (response && response.status === 200) {
              let data = response.data.data;
              this.$store.commit("login", data);
              let path = this.$route.query.redirect;
              // 登录后页面跳转
              this.$router.replace({
                path: path === "/" || path === undefined ? "/home" : path
              });
            }
          });
        } else {
          this.$message.error("用户名/密码不能为空");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
.login-remember {
  margin: 0 0 35px 0;
  text-align: left;
}
</style>
