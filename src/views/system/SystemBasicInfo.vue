<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="部门管理" name="departmentManagement">
      <department-management />
    </el-tab-pane>
    <el-tab-pane label="职位管理" name="positionManagement">
      <position-and-professional-title-management state="position" />
    </el-tab-pane>
    <el-tab-pane label="职称管理" name="professionalTitleManagement">
      <position-and-professional-title-management state="professionalTitle"
    /></el-tab-pane>
    <el-tab-pane label="奖惩规则" name="rewardAndPunishmentManagement"
      >奖惩规则</el-tab-pane
    >
    <el-tab-pane label="权限组管理" name="roleGroupManagement"
      ><resource-role-management
    /></el-tab-pane>
  </el-tabs>
</template>

<script>
  import DepartmentManagement from './component/DepartmentManagement';
  import PositionAndProfessionalTitleManagement from './component/PositionAndProfessionalTitleManagement';
  import ResourceRoleManagement from './component/ResourceRoleManagement';

  export default {
  name: "SystemBasicInfo",
  components: {
    ResourceRoleManagement,
    PositionAndProfessionalTitleManagement,
    DepartmentManagement
  },
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
