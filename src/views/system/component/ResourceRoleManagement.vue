<template>
  <div>
    <div style="text-align: left;height: 40px" :loading="loading">
      <el-input
        placeholder="请输入角色英文名称..."
        style="height: 40px; width: 250px"
        v-model="newRoleName"
        ><template slot="prepend"
          >ROLE_</template
        >
      </el-input>
      <el-input
        placeholder="请输入角色中文名称..."
        style="height: 40px;width: 250px"
        v-model="newChineseName"
      >
      </el-input>
      <el-button
        type="primary"
        style="margin-left: 5px;height: 36px"
        @click="addNewRole"
        >添加角色</el-button
      >
    </div>

    <div style="margin-top: 10px;text-align: left">
      <el-collapse
        v-model="activeColItem"
        accordion
        style="width: 500px;"
        @change="collapseChange"
      >
        <el-collapse-item
          v-for="(item, index) in roles"
          :title="item.chineseName"
          :name="item.roleId"
          :key="item.roleName"
        >
          <el-card class="box-card">
            <div slot="header">
              <span>可访问的资源</span>
              <el-button
                type="text"
                style="color: #f6061b;margin: 0;float: right; padding: 3px 0;width: 15px;height:15px"
                icon="el-icon-delete"
                @click="deleteRole(item.roleId, item.chineseName)"
              ></el-button>
            </div>
            <div>
              <el-tree
                :props="props"
                :key="item.roleId"
                :data="resourceTree"
                :default-checked-keys="checkedKeys"
                node-key="resourceId"
                ref="tree"
                show-checkbox
                highlight-current
                @check-change="handleCheckChange"
              >
              </el-tree>
            </div>
            <div
              style="display: flex;justify-content: flex-end;margin-right: 10px"
            >
              <el-button size="mini" @click="cancelUpdateRoleResource"
                >取消修改</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="updateResourceRole(index)"
                >确认修改</el-button
              >
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResourceRoleManagement",
  data() {
    return {
      props: { label: "name", children: "children" },
      loading: false,
      newRoleName: "",
      newChineseName: "",
      activeColItem: -1,
      roles: [],
      resourceTree: [],
      checkedKeys: []
    };
  },
  methods: {
    initRoles() {
      this.getRequest("/system/basicInfo/role").then(response => {
        this.loading = false;
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.roles = response.data.data;
          this.activeColItem = -1;
        }
      });
    },
    collapseChange(activeName) {
      if (activeName === "") {
        return;
      }
      this.getRequest(
        "/system/basicInfo/resourceTree?roleId=" + activeName
      ).then(response => {
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.resourceTree = response.data.data.resourcesTree;
          this.checkedKeys = response.data.data.resourceIdList;
        }
      });
    },
    addNewRole() {
      if (this.isNotNullOrBlank(this.newRoleName, this.newChineseName)) {
        this.loading = true;
        this.postRequest("/system/basicInfo/role", {
          roleName: this.newRoleName,
          chineseName: this.newChineseName
        }).then(response => {
          if (
            response &&
            response.status === 200 &&
            response.data.status === 200
          ) {
            this.initRoles();
            this.newRoleName = "";
            this.newChineseName = "";
          } else {
            this.loading = false;
          }
        });
      }
    },
    deleteRole(roleId, chineseName) {
      this.$confirm("删除角色[" + chineseName + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.deleteRequest("/system/basicInfo/role?roleId=" + roleId).then(
            response => {
              if (
                response &&
                response.status === 200 &&
                response.data.status === 200
              ) {
                this.initRoles();
              } else {
                this.loading = false;
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //有五个树，但是五个树用的同一个数据源
    updateResourceRole(index) {
      let checkedKeys = this.$refs.tree[index].getCheckedKeys(true);
      this.putRequest("/system/basicInfo/resourceRole", {
        roleId: this.activeColItem,
        resourceIdList: checkedKeys
      }).then(response => {
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.$message.success({ message: response.data.msg });
          this.activeColItem = -1;
        }
      });
    },
    cancelUpdateRoleResource() {
      this.activeColItem = -1;
    },
    handleCheckChange(data, checked, indeterminate) {
      window.console.log(data, checked, indeterminate);
    }
  },
  mounted: function() {
    this.loading = true;
    this.initRoles();
  }
};
</script>

<style scoped></style>
