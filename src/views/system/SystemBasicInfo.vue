<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="departmentManagement">
      <department-management />
    </el-tab-pane>
    <el-tab-pane label="配置管理" name="positionManagement"
      >职位管理</el-tab-pane
    >
    <el-tab-pane label="职称管理" name="professionalTitleManagement"
      >职称管理</el-tab-pane
    >
    <el-tab-pane label="奖惩规则" name="rewardAndPunishmentManagement"
      >奖惩规则</el-tab-pane
    >
    <el-tab-pane label="权限组管理" name="roleGroupManagement"
      >权限组管理</el-tab-pane
    >
  </el-tabs>
</template>

<script>
import DepartmentManagement from "./component/DepartmentManagement";
export default {
  name: "SystemBasicInfo",
  components: { DepartmentManagement },
  data() {
    return {
      activeName: "departmentManagement"
    };
  },
  methods: {
    handleClick(tab, event) {
      window.console.log(tab, event);
    }
  }
};
</script>

<style scoped></style>
