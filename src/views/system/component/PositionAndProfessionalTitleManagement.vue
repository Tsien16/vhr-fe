<template>
  <div>
    <div style="text-align: left">
      <el-input
        v-model="positionNameOrProfessionalTitleName"
        :placeholder="state === 'position' ? '添加职位...' : '添加职称...'"
        style="width: 300px"
        @keyup.enter.native="addPosition"
        prefix-icon="el-icon-plus"
      >
      </el-input>
      <el-select
        v-model="professionalTitleLevel"
        v-if="state === 'professionalTitle'"
        placeholder="职称等级"
        style="height: 40px"
      >
        <el-option
          v-for="item in professionalTitleLevels"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>

      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="addPosition"
        style="height: 36px"
        >添加</el-button
      >
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="loading"
        :data="positionOrProfessionalTitleData"
        size="mini"
        ref="multipleTable"
        stripe
        border
        @selection-change="handleSelectionChange"
        style="width: 80%"
      >
        <el-table-column type="selection" width="55" text-align="left">
        </el-table-column>
        <el-table-column
          v-if="state === 'position'"
          prop="positionId"
          label="编号"
          width="80"
          text-align="left"
        >
        </el-table-column>
        <el-table-column
          v-else
          prop="professionalTitleId"
          label="编号"
          width="80"
          text-align="left"
        >
        </el-table-column>
        <el-table-column
          v-if="state === 'position'"
          prop="positionName"
          label="职位名称"
          width="180"
          text-align="left"
        >
        </el-table-column>
        <el-table-column
          v-else
          prop="name"
          label="职称名称"
          width="180"
          text-align="left"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="职称级别"
          width="180"
          text-align="left"
          v-if="state === 'professionalTitle'"
        >
        </el-table-column>
        <el-table-column width="180" label="创建时间" text-align="left">
          <template slot-scope="scope">{{
            scope.row.createTime | formatDate
          }}</template>
        </el-table-column>
        <el-table-column label="操作" text-align="left">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: left;margin-top: 10px">
      <el-button
        type="danger"
        size="mini"
        v-if="positionOrProfessionalTitleData.length > 0"
        :disabled="multipleSelection.length === 0"
        @click="batchDelete"
        >批量删除
      </el-button>
    </div>
    <div style="text-align: left">
      <el-dialog
        :title="state === 'position' ? '编辑职位名称' : '编辑职称'"
        :visible.sync="dialogVisible"
        width="25%"
      >
        <el-input
          v-model="updateName"
          size="mini"
          :placeholder="
            this.state === 'position'
              ? '请输入职位名称...'
              : '请输入职称名称...'
          "
        ></el-input>
        <el-select
          v-model="updateProfessionalTitleLevel"
          v-if="state === 'professionalTitle'"
          style="margin-top: 10px"
          size="mini"
          placeholder="职称等级"
        >
          <el-option
            v-for="item in professionalTitleLevels"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" size="mini" @click="updatePosNameExec"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "PositionAndProfessionalManagement",
  props: {
    state: String
  },
  data() {
    return {
      positionNameOrProfessionalTitleName: "",
      updateName: "",
      updateId: "",
      professionalTitleLevel: "",
      updateProfessionalTitleLevel: "",
      professionalTitleLevels: ["正高级", "副高级", "中级", "初级", "员级"],
      positionList: [],
      multipleSelection: [],
      dialogVisible: false,
      loading: false,
      positionOrProfessionalTitleData: []
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    loadTableData() {
      this.loading = true;
      this.getRequest(
        this.state === "position"
          ? "/system/basicInfo/position"
          : "/system/basicInfo/professionalTitle"
      ).then(response => {
        this.loading = false;
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.positionOrProfessionalTitleData = response.data.data;
        }
      });
    },
    addPosition() {
      if (!this.isNotNullOrBlank(this.positionNameOrProfessionalTitleName)) {
        this.$message.warning(
          this.state === "position" ? "职位名称不能为空!" : "职称名称不能为空!"
        );
        return;
      }
      if (this.state === "professionalTitle") {
        if (!this.isNotNullOrBlank(this.professionalTitleLevel)) {
          this.$message.warning("请选择职称级别!");
          return;
        }
      }
      this.loading = true;
      this.postRequest(
        this.state === "position"
          ? "/system/basicInfo/position"
          : "/system/basicInfo/professionalTitle",
        {
          name: this.positionNameOrProfessionalTitleName,
          professionalTitleLevel: this.professionalTitleLevel
        }
      ).then(response => {
        this.loading = false;
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.loadTableData();
          this.positionNameOrProfessionalTitleName = "";
          this.professionalTitleLevel = "";
        }
      });
    },
    batchDelete() {
      this.$confirm(
        "删除" + this.multipleSelection.length + "条数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let ids = "";
          this.multipleSelection.forEach(row => {
            let id =
              this.state === "position"
                ? row.positionId
                : row.professionalTitleId;
            ids = ids + id + ",";
          });
          this.doDelete(ids);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEdit(index, row) {
      if (this.state === "position") {
        this.updateName = row.positionName;
        this.updateId = row.positionId;
      } else {
        this.updateId = row.professionalTitleId;
        this.updateName = row.name;
        this.updateProfessionalTitleLevel = row.level;
      }
      this.dialogVisible = true;
    },
    handleDelete(index, row) {
      let name = this.state === "position" ? row.positionName : row.name;
      this.$confirm("删除[" + name + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let id =
            this.state === "position"
              ? row.positionId
              : row.professionalTitleId;
          this.doDelete(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    doDelete(ids) {
      this.loading = true;
      let url =
        this.state === "position"
          ? "/system/basicInfo/position"
          : "/system/basicInfo/professionalTitle";
      this.deleteRequest(url + "?ids=" + ids).then(response => {
        this.loading = false;
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.$message.success({ message: "删除成功" });
          this.loadTableData();
        }
      });
    },
    updatePosNameExec() {
      if (!this.isNotNullOrBlank(this.updateName)) {
        this.$message.warning(
          this.state === "position" ? "职位名称不能为空!" : "职称名称不能为空!"
        );
        return;
      }
      this.loading = true;
      this.putRequest(
        this.state === "position"
          ? "/system/basicInfo/position"
          : "/system/basicInfo/professionalTitle",
        {
          updateName: this.updateName,
          updateId: this.updateId,
          professionalTitleLevel: this.updateProfessionalTitleLevel
        }
      ).then(response => {
        this.loading = false;
        if (
          response &&
          response.status === 200 &&
          response.data.status === 200
        ) {
          this.dialogVisible = false;
          this.loadTableData();
        }
      });
    }
  },
  mounted() {
    this.loadTableData();
  }
};
</script>

<style scoped></style>
