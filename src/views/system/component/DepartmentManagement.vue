<template>
  <div>
    <div style="text-align: left">
      <el-input
        v-model="keyword"
        placeholder="输入部门名称进行搜索..."
        style="width: 500px"
        prefix-icon="el-icon-search"
      ></el-input>
    </div>
    <div>
      <el-tree
        :data="departmentTree"
        :props="defaultProps"
        ref="departmentTree"
        :filter-node-method="filterNode"
        v-loading="treeLoading"
        style="width: 500px;margin-top: 10px"
        :render-content="renderContent"
      >
        ></el-tree
      >

      <div style="text-align: left">
        <el-dialog title="添加部门" :visible.sync="dialogVisible" width="25%">
          <div>
            <span>上级部门</span>
            <el-select
              v-model="parentId"
              style="width: 200px"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in allDepartments"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
              >
              </el-option>
            </el-select>
          </div>
          <div style="margin-top: 10px">
            <span>部门名称</span>
            <el-input
              size="mini"
              style="width: 200px;"
              v-model="departmentName"
              placeholder="请输入部门名称..."
              @keyup.enter.native="addDepartment"
            ></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false"
              >取消</el-button
            >
            <el-button size="small" type="primary" @click="addDepartment"
              >添加</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepartmentManagement",
  data() {
    return {
      keyword: "",
      treeLoading: false,
      dialogVisible: false,
      parentId: "",
      departmentName: "",
      departmentTree: [],
      allDepartments: [],
      defaultProps: {
        children: "children",
        isLeaf: "leaf",
        label: "departmentName"
      }
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.departmentName.indexOf(value) !== -1;
    },
    loadDepartmentTree() {
      this.getRequest("/system/basicInfo/departmentTree").then(response => {
        this.treeLoading = false;
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.departmentTree = response.data.data;
        }
      });
    },

    addDepartment() {
      this.dialogVisible = false;
      this.treeLoading = true;
      this.postRequest("/system/basicInfo/department", {
        departmentName: this.departmentName,
        parentId: this.parentId
      }).then(response => {
        this.treeLoading = false;
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          let department = response.data.data;

          // 由于后端设置了，字段的值为空，就将不显示该键，所以要手动加一个属性
          department["children"] = [];
          this.departmentName = "";
          this.setDataToDepartmentTree(
            this.departmentTree,
            this.parentId,
            department
          );
        }
      });
    },
    setDataToDepartmentTree(departmentTree, parentId, department) {
      for (let i = 0; i < departmentTree.length; i++) {
        let theDepartment = departmentTree[i];
        if (theDepartment.departmentId === parentId) {
          departmentTree[i].children.push(department);
          return;
        } else {
          this.setDataToDepartmentTree(
            theDepartment.children,
            parentId,
            department
          );
        }
      }
    },
    deleteDepartment(data, event) {
      if (data.children.length > 0) {
        this.$message({
          message: "该部门下尚有其他部门，不能被删除!",
          type: "warning"
        });
      } else {
        this.$confirm(
          "删除[" + data.departmentName + "]部门, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.treeLoading = true;
            this.deleteRequest(
              "/system/basicInfo/department?departmentId=" + data.departmentId
            ).then(response => {
              this.treeLoading = false;
              if (
                response &&
                response.status === 200 &&
                response.data.status === 200
              ) {
                let department = response.data.data;
                this.deleteLocalDepartment(this.departmentTree, department);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
      event.stopPropagation();
    },
    deleteLocalDepartment(departmentTree, department) {
      for (let i = 0; i < departmentTree.length; i++) {
        let theDepartment = departmentTree[i];
        if (theDepartment.departmentId === department.departmentId) {
          departmentTree.splice(i, 1);
          return;
        } else {
          this.deleteLocalDepartment(theDepartment.children, department);
        }
      }
    },
    loadAllDepartments() {
      this.getRequest("/system/basicInfo/department").then(response => {
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.allDepartments = response.data.data;
        }
      });
    },
    showAddDepartmentView(data, event) {
      this.loadAllDepartments();
      this.dialogVisible = true;
      this.parentId = data.departmentId;
      event.stopPropagation();
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button
              style="font-size: 12px;"
              type="primary"
              size="mini"
              style="padding:3px"
              on-click={() => this.showAddDepartmentView(data, event)}
            >
              添加部门
            </el-button>
            <el-button
              style="font-size: 12px;"
              type="danger"
              size="mini"
              style="padding:3px"
              on-click={() => this.deleteDepartment(data, event)}
            >
              删除部门
            </el-button>
          </span>
        </span>
      );
    }
  },
  mounted() {
    this.treeLoading = true;
    this.loadDepartmentTree();
  }
};
</script>

<style scoped></style>
