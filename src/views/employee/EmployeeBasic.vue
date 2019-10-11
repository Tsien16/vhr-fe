<template>
  <div>
    <el-container>
      <el-header
        style="padding: 0;display:flex;justify-content:space-between;align-items: center"
      >
        <div style="display: inline">
          <el-input
            placeholder="通过员工名搜索员工,记得回车哦..."
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0;padding: 0;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchEmp"
            prefix-icon="el-icon-search"
            v-model="keywords"
          >
          </el-input>
          <el-button
            type="primary"
            size="mini"
            style="margin-left: 5px"
            icon="el-icon-search"
            @click="searchEmp"
            >搜索
          </el-button>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            style="margin-left: 5px"
            @click="showAdvanceSearchView"
            ><i
              class="fa fa-lg"
              v-bind:class="[
                advanceSearchViewVisible ? faAngleDoubleUp : faAngleDoubleDown
              ]"
              style="margin-right: 5px"
            ></i
            >高级搜索
          </el-button>
        </div>
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-upload
            :show-file-list="false"
            accept="application/vnd.ms-excel"
            action="/employee/basic/importEmp"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :disabled="fileUploadBtnText === '正在导入'"
            :before-upload="beforeFileUpload"
            style="display: inline"
          >
            <el-button
              size="mini"
              type="success"
              :loading="fileUploadBtnText === '正在导入'"
              ><i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i
              >{{ fileUploadBtnText }}
            </el-button>
          </el-upload>
          <el-button type="success" size="mini" @click="exportEmps"
            ><i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i
            >导出数据
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="showAddEmployeeView"
          >
            添加员工
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0;padding-top: 0">
        <div>
          <transition name="slide-fade">
            <div
              style="margin-bottom: 10px;border-radius: 5px;padding: 5px 0 5px 0;box-sizing:border-box;border: 1px solid #20a0ff;"
              v-show="advanceSearchViewVisible"
            >
              <el-row>
                <el-col :span="5">
                  政治面貌:
                  <el-select
                    v-model="employee.politicalStatusId"
                    style="width: 130px"
                    size="mini"
                    placeholder="政治面貌"
                  >
                    <el-option
                      v-for="item in politicalStatusList"
                      :key="item.politicalStatusId"
                      :label="item.politicalStatusName"
                      :value="item.politicalStatusId"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  民族:
                  <el-select
                    v-model="employee.nationId"
                    style="width: 130px"
                    size="mini"
                    placeholder="请选择民族"
                  >
                    <el-option
                      v-for="item in nationList"
                      :key="item.nationId"
                      :label="item.nationName"
                      :value="item.nationId"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职位:
                  <el-select
                    v-model="employee.positionId"
                    style="width: 130px"
                    size="mini"
                    placeholder="请选择职位"
                  >
                    <el-option
                      v-for="item in positionList"
                      :key="item.positionId"
                      :label="item.positionName"
                      :value="item.positionId"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职称:
                  <el-select
                    v-model="employee.professional_title"
                    style="width: 130px"
                    size="mini"
                    placeholder="请选择职称"
                  >
                    <el-option
                      v-for="item in professionalTitleList"
                      :key="item.professionalTitleId"
                      :label="item.name"
                      :value="item.professionalTitleId"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  聘用形式:
                  <el-radio-group v-model="employee.employmentForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio style="margin-left: 15px" label="劳务合同"
                      >劳务合同</el-radio
                    >
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="5">
                  所属部门:
                  <el-popover
                    v-model="showOrHidePop2"
                    placement="right"
                    title="请选择部门"
                    trigger="manual"
                  >
                    <el-tree
                      :data="departmentList"
                      :default-expand-all="true"
                      :props="defaultProps"
                      :expand-on-click-node="false"
                      @node-click="handleNodeClick2"
                    ></el-tree>
                    <div
                      slot="reference"
                      style="width: 130px;height: 26px;display: inline-flex;font-size:13px;border-radius: 5px;padding-left: 13px;box-sizing:border-box;border: 1px solid #dcdfe6;cursor: pointer;align-items: center"
                      @click="showDepTree2"
                      v-bind:style="{ color: depTextColor }"
                    >
                      {{ employee.departmentName }}
                    </div>
                  </el-popover>
                </el-col>
                <el-col :span="10">
                  入职日期:
                  <el-date-picker
                    v-model="positionStartDateScope"
                    unlink-panels
                    size="mini"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="5" :offset="4">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    size="mini"
                    @click="searchEmp"
                    >搜索</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="employeeList"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%"
          >
            <el-table-column type="selection" align="left" width="30">
            </el-table-column>
            <el-table-column
              prop="employeeName"
              align="left"
              fixed
              label="姓名"
              width="90"
            >
            </el-table-column>
            <el-table-column
              prop="workNumber"
              width="85"
              align="left"
              label="工号"
            >
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="50">
            </el-table-column>
            <el-table-column width="85" align="left" label="出生日期">
              <template slot-scope="scope">{{
                scope.row.birthday | formatDate
              }}</template>
            </el-table-column>
            <el-table-column
              prop="idCard"
              width="150"
              align="left"
              label="身份证号码"
            >
            </el-table-column>
            <el-table-column prop="maritalStatus" width="70" label="婚姻状况">
            </el-table-column>
            <el-table-column width="50" prop="nation.nationName" label="民族">
            </el-table-column>
            <el-table-column prop="nativePlace" width="80" label="籍贯">
            </el-table-column>
            <el-table-column prop="politicsStatus.name" label="政治面貌">
            </el-table-column>
            <el-table-column
              prop="email"
              width="180"
              align="left"
              label="电子邮件"
            >
            </el-table-column>
            <el-table-column prop="phone" width="100" label="电话号码">
            </el-table-column>
            <el-table-column
              prop="address"
              width="220"
              align="left"
              label="联系地址"
            >
            </el-table-column>
            <el-table-column
              prop="department.name"
              align="left"
              width="100"
              label="所属部门"
            >
            </el-table-column>
            <el-table-column
              width="100"
              align="left"
              prop="position.name"
              label="职位"
            >
            </el-table-column>
            <el-table-column
              prop="jobLevel.name"
              width="100"
              align="left"
              label="职称"
            >
            </el-table-column>
            <el-table-column prop="engageForm" label="聘用形式">
            </el-table-column>
            <el-table-column width="85" align="left" label="入职日期">
              <template slot-scope="scope">{{
                scope.row.positionStartDate | formatDate
              }}</template>
            </el-table-column>
            <el-table-column width="85" align="left" label="转正日期">
              <template slot-scope="scope">{{
                scope.row.conversionDate | formatDate
              }}</template>
            </el-table-column>
            <el-table-column width="95" align="left" label="合同起始日期">
              <template slot-scope="scope">{{
                scope.row.contractBegin | formatDate
              }}</template>
            </el-table-column>
            <el-table-column width="95" align="left" label="合同截至日期">
              <template slot-scope="scope">{{
                scope.row.contractEnd | formatDate
              }}</template>
            </el-table-column>
            <el-table-column align="left" width="70" label="合同期限">
              <template slot-scope="scope"
                >{{ scope.row.contractTerm }}年</template
              >
            </el-table-column>
            <el-table-column align="left" prop="tiptopDegree" label="最高学历">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="195">
              <template slot-scope="scope">
                <el-button
                  @click="showEditEmpView(scope.row)"
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  size="mini"
                  >编辑
                </el-button>
                <el-button
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  type="primary"
                  size="mini"
                  >查看高级资料
                </el-button>
                <el-button
                  type="danger"
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  size="mini"
                  @click="deleteEmp(scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button
              type="danger"
              size="mini"
              v-if="employeeList.length > 0"
              :disabled="multipleSelection.length == 0"
              @click="deleteManyEmps"
              >批量删除
            </el-button>
            <el-pagination
              background
              :page-size="10"
              :pageNum="pageNum"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-form
      :model="employee"
      :rules="rules"
      ref="addEmployeeForm"
      style="margin: 0;padding: 0;"
    >
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="77%"
        >
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="employee.employeeName"
                    size="mini"
                    style="width: 150px"
                    placeholder="请输入员工姓名"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="employee.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio style="margin-left: 15px" label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="出生日期:" prop="birthday">
                  <el-date-picker
                    v-model="employee.birthday"
                    size="mini"
                    style="width: 150px"
                    type="date"
                    placeholder="出生日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="政治面貌:" prop="politicId">
                  <el-select
                    v-model="employee.politicalStatusId"
                    style="width: 200px"
                    size="mini"
                    placeholder="政治面貌"
                  >
                    <el-option
                      v-for="item in politicalStatusList"
                      :key="item.politicalStatusId"
                      :label="item.politicalStatusName"
                      :value="item.politicalStatusId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="民族:" prop="nationId">
                  <el-select
                    v-model="employee.nationId"
                    style="width: 150px"
                    size="mini"
                    placeholder="请选择民族"
                  >
                    <el-option
                      v-for="item in nationList"
                      :key="item.nationId"
                      :label="item.nationName"
                      :value="item.nationId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="籍贯:" prop="nativePlace">
                  <el-input
                    v-model="employee.nativePlace"
                    size="mini"
                    style="width: 120px"
                    placeholder="员工籍贯"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="电子邮箱:" prop="email">
                  <el-input
                    prefix-icon="el-icon-message"
                    v-model="employee.email"
                    size="mini"
                    style="width: 150px"
                    placeholder="电子邮箱地址..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="联系地址:" prop="address">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="employee.address"
                    size="mini"
                    style="width: 200px"
                    placeholder="联系地址..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="职位:" prop="posId">
                  <el-select
                    v-model="employee.positionId"
                    style="width: 150px"
                    size="mini"
                    placeholder="请选择职位"
                  >
                    <el-option
                      v-for="item in positionList"
                      :key="item.positionId"
                      :label="item.positionName"
                      :value="item.positionId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="职称:" prop="jobLevelId">
                  <el-select
                    v-model="employee.professionalTitleId"
                    style="width: 120px"
                    size="mini"
                    placeholder="请选择职称"
                  >
                    <el-option
                      v-for="item in professionalTitleList"
                      :key="item.professionalTitleId"
                      :label="item.name"
                      :value="item.professionalTitleId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="所属部门:" prop="departmentId">
                  <el-popover
                    v-model="showOrHidePop"
                    placement="right"
                    title="请选择部门"
                    trigger="manual"
                  >
                    <el-tree
                      :data="departmentList"
                      :default-expand-all="true"
                      :props="defaultProps"
                      :expand-on-click-node="false"
                      @node-click="handleNodeClick"
                    ></el-tree>
                    <div
                      slot="reference"
                      style="width: 150px;height: 26px;display: inline-flex;font-size:13px;border-radius: 5px;padding-left: 13px;box-sizing:border-box;border: 1px solid #dcdfe6;cursor: pointer;align-items: center"
                      @click.left="showDepTree"
                      v-bind:style="{ color: depTextColor }"
                    >
                      {{ employee.departmentName }}
                    </div>
                  </el-popover>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="电话号码:" prop="phone">
                  <el-input
                    prefix-icon="el-icon-phone"
                    v-model="employee.phone"
                    size="mini"
                    style="width: 200px"
                    placeholder="电话号码..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="工号:" prop="workID">
                  <el-input
                    v-model="employee.workNumber"
                    disabled
                    size="mini"
                    style="width: 150px"
                    placeholder="员工工号..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select
                    v-model="employee.highestDegree"
                    style="width: 120px"
                    size="mini"
                    placeholder="最高学历"
                  >
                    <el-option
                      v-for="item in degrees"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="毕业院校:" prop="school">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="employee.school"
                    size="mini"
                    style="width: 150px"
                    placeholder="毕业院校名称"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <el-form-item label="专业名称:" prop="specialty">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="employee.specialty"
                    size="mini"
                    style="width: 200px"
                    placeholder="专业名称"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="入职日期:" prop="positionStartDate">
                  <el-date-picker
                    v-model="employee.positionStartDate"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    placeholder="入职日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="转正日期:" prop="conversionDate">
                  <el-date-picker
                    v-model="employee.conversionDate"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    placeholder="转正日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="合同起始日期:" prop="contractBegin">
                  <el-date-picker
                    v-model="employee.contractBegin"
                    size="mini"
                    style="width: 135px"
                    type="date"
                    placeholder="合同起始日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="合同终止日期:" prop="contractEnd">
                  <el-date-picker
                    v-model="employee.contractEnd"
                    size="mini"
                    style="width: 135px"
                    type="date"
                    placeholder="合同终止日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div>
                <el-form-item label="身份证号码:" prop="idCard">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="employee.idCard"
                    size="mini"
                    style="width: 180px"
                    placeholder="请输入员工身份证号码..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="聘用形式:" prop="engageForm">
                  <el-radio-group v-model="employee.employmentForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio style="margin-left: 15px" label="劳务合同"
                      >劳务合同</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="婚姻状况:" prop="wedlock">
                  <el-radio-group v-model="employee.maritalStatus">
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio style="margin-left: 15px" label="未婚"
                      >未婚</el-radio
                    >
                    <el-radio style="margin-left: 15px" label="离异"
                      >离异</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="addEmployee('addEmployeeForm')"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "EmployeeBasic",
  data() {
    return {
      employeeList: [],
      keywords: "",
      fileUploadBtnText: "导入数据",
      positionStartDateScope: "",
      faAngleDoubleUp: "fa-angle-double-up",
      faAngleDoubleDown: "fa-angle-double-down",
      dialogTitle: "",
      multipleSelection: [],
      depTextColor: "#c0c4cc",
      nationList: [],
      politicalStatusList: [],
      positionList: [],
      professionalTitleList: [],
      total: -1,
      pageNum: 1,
      degrees: [
        { id: 4, name: "大专" },
        { id: 5, name: "本科" },
        { id: 6, name: "硕士" },
        { id: 7, name: "博士" },
        {
          id: 3,
          name: "高中"
        },
        { id: 2, name: "初中" },
        { id: 1, name: "小学" },
        { id: 8, name: "其他" }
      ],
      departmentList: [],
      defaultProps: {
        label: "name",
        isLeaf: "leaf",
        children: "children"
      },
      dialogVisible: false,
      tableLoading: false,
      advanceSearchViewVisible: false,
      showOrHidePop: false,
      showOrHidePop2: false,
      employee: {
        employeeName: "",
        gender: "",
        birthday: "",
        idCard: "",
        maritalStatus: "",
        nationId: "",
        nationName: "",
        nativePlace: "",
        politicalStatusId: "",
        politicalStatusName: "",
        email: "",
        phone: "",
        address: "",
        departmentId: "",
        departmentName: "所属部门...",
        professionalTitleId: "",
        professionalTitleName: "",
        positionId: "",
        positionName: "",
        employmentForm: "",
        highestDegree: "",
        specialty: "",
        school: "",
        positionStartDate: "",
        workingStatus: "",
        workNumber: "",
        contractPeriod: "",
        conversionDate: "",
        dimissionDate: "",
        contractBegin: "",
        contractEnd: "",
        workAge: "",
        salary: []
      },
      rules: {
        employeeName: [
          { required: true, message: "必填:姓名", trigger: "blur" }
        ],
        gender: [{ required: true, message: "必填:性别", trigger: "blur" }],
        birthday: [
          { required: true, message: "必填:出生日期", trigger: "blur" }
        ],
        idCard: [
          {
            required: true,
            message: "必填:身份证号码",
            trigger: "blur"
          },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: "身份证号码格式不正确",
            trigger: "blur"
          }
        ],
        maritalStatus: [
          { required: true, message: "必填:婚姻状况", trigger: "blur" }
        ],
        nationId: [{ required: true, message: "必填:民族", trigger: "change" }],
        nativePlace: [
          { required: true, message: "必填:籍贯", trigger: "blur" }
        ],
        politicalStatusId: [
          { required: true, message: "必填:政治面貌", trigger: "blur" }
        ],
        email: [
          { required: true, message: "必填:电子邮箱", trigger: "blur" },
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        phone: [{ required: true, message: "必填:电话号码", trigger: "blur" }],
        address: [
          { required: true, message: "必填:联系地址", trigger: "blur" }
        ],
        departmentId: [
          { required: true, message: "必填:部门", trigger: "change" }
        ],
        professionalTitleId: [
          { required: true, message: "必填:职称", trigger: "change" }
        ],
        positionId: [
          { required: true, message: "必填:职位", trigger: "change" }
        ],
        employmentForm: [
          { required: true, message: "必填:聘用形式", trigger: "blur" }
        ],
        highestDegree: [
          { required: true, message: "必填:最高学历", trigger: "change" }
        ],
        specialty: [{ required: true, message: "必填:专业", trigger: "blur" }],
        workNumber: [{ required: true, message: "必填:工号", trigger: "blur" }],
        school: [{ required: true, message: "必填:毕业院校", trigger: "blur" }],
        positionStartDate: [
          { required: true, message: "必填:入职日期", trigger: "blur" }
        ],
        conversionDate: [
          { required: true, message: "必填:转正日期", trigger: "blur" }
        ],
        contractBegin: [
          { required: true, message: "必填:合同起始日期", trigger: "blur" }
        ],
        contractEnd: [
          { required: true, message: "必填:合同终止日期", trigger: "blur" }
        ],
        workAge: [{ required: true, message: "必填:工龄", trigger: "blur" }]
      }
    };
  },
  mounted: function() {
    this.initData();
    this.loadEmployees();
  },
  methods: {
    fileUploadSuccess(response, file, fileList) {
      if (response) {
        this.$message({ type: response.status, message: response.msg });
      }
      this.loadEmployees();
      this.fileUploadBtnText = "导入数据";
    },
    fileUploadError(err, file, fileList) {
      this.$message({ type: "error", message: "导入失败!" });
      this.fileUploadBtnText = "导入数据";
    },
    beforeFileUpload(file) {
      this.fileUploadBtnText = "正在导入";
    },
    exportEmps() {
      window.open("/employee/basic/exportEmp", "_parent");
    },
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyEmployeeData();
      this.positionStartDateScope = "";
      this.loadEmployees();
    },
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.keywords = "";
      if (!this.advanceSearchViewVisible) {
        this.emptyEmployeeData();
        this.positionStartDateScope = "";
        this.loadEmployees();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteManyEmps() {
      this.$confirm(
        "此操作将删除[" + this.multipleSelection.length + "]条数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var ids = "";
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
          }
          this.doDelete(ids);
        })
        .catch(() => {});
    },
    deleteEmp(row) {
      this.$confirm("此操作将永久删除[" + row.name + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },
    doDelete(ids) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/employee/basic/emp/" + ids).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.loadEmployees();
        }
      });
    },
    keywordsChange(val) {
      if (val == "") {
        this.loadEmployees();
      }
    },
    searchEmp() {
      this.loadEmployees();
    },
    currentChange(pageNum) {
      this.pageNum = pageNum;
      this.loadEmployees();
    },
    loadEmployees() {
      this.tableLoading = true;
      this.getRequest(
        "/employee/basic/emp?pageNum=" +
          this.pageNum +
          "&size=10&keywords=" +
          this.keywords +
          "&politicalStatusId=" +
          this.employee.politicalStatusId +
          "&nationId=" +
          this.employee.nationId +
          "&positionId=" +
          this.employee.positionId +
          "&professionalTitleId=" +
          this.employee.professionalTitleId +
          "&employmentForm=" +
          this.employee.employmentForm +
          "&departmentId=" +
          this.employee.departmentId +
          "&positionStartDateScope=" +
          this.positionStartDateScope
      ).then(response => {
        this.tableLoading = false;
        if (response && response.status === 200) {
          let data = response.data.data;
          this.employeeList = data.list;
          this.total = data.total;
        }
      });
    },
    addEmployee(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.employee.employeeId) {
            //更新
            this.tableLoading = true;
            this.putRequest("/employee/basic/emp", this.employee).then(
              response => {
                _this.tableLoading = false;
                if (response && response.status === 200) {
                  _this.dialogVisible = false;
                  _this.emptyEmployeeData();
                  _this.loadEmployees();
                }
              }
            );
          } else {
            //添加
            this.tableLoading = true;
            this.postRequest("/employee/basic/emp", this.employee).then(
              response => {
                _this.tableLoading = false;
                if (response && response.status === 200) {
                  _this.dialogVisible = false;
                  _this.emptyEmployeeData();
                  _this.loadEmployees();
                }
              }
            );
          }
        } else {
          return false;
        }
      });
    },
    cancelEidt() {
      this.dialogVisible = false;
      this.emptyEmployeeData();
    },
    showDepTree() {
      this.showOrHidePop = !this.showOrHidePop;
    },
    showDepTree2() {
      this.showOrHidePop2 = !this.showOrHidePop2;
    },
    handleNodeClick(data) {
      this.employee.departmentName = data.name;
      this.employee.departmentId = data.id;
      this.showOrHidePop = false;
      this.depTextColor = "#606266";
    },
    handleNodeClick2(data) {
      this.emp.departmentName = data.name;
      this.emp.departmentId = data.id;
      this.showOrHidePop2 = false;
      this.depTextColor = "#606266";
    },
    initData() {
      this.getRequest("/employee/basic/employee_dict").then(response => {
        if (response && response.status === 200) {
          let data = response.data.data;
          this.nationList = data.nationList;
          this.politicalStatusList = data.politicalStatusList;
          this.departmentList = data.departmentList;
          this.positionList = data.positionList;
          this.professionalTitleList = data.professionalTitleList;
          this.employee.workNumber = data.workNumber;
        }
      });
    },
    showEditEmpView(row) {
      window.console.log(row);
      this.dialogTitle = "编辑员工";
      this.employee = row;
      this.formatDate();
      this.employee.birthday = this.formatDate(row.birthday);
      this.employee.conversionDate = this.formatDate(row.conversionDate);
      this.employee.contractBegin = this.formatDate(row.contractBegin);
      this.employee.contractEnd = this.formatDate(row.contractEnd);
      this.employee.contractBegin = this.formatDate(row.positionStartDate);
      this.employee.nationId = row.nationId;
      this.employee.politicalStatusId = row.politicsStatusId;
      this.employee.departmentId = row.departmentId;
      this.employee.departmentName = row.departmentName;
      this.employee.professionalTitleId = row.professionalTitleId;
      this.employee.positionId = row.positionId;
      delete this.employee.salary;
      delete this.employee.workAge;
      delete this.employee.workingStatus;
      this.dialogVisible = true;
      window.console.log(this.employee);
    },
    showAddEmployeeView() {
      this.dialogTitle = "添加员工";
      this.dialogVisible = true;
      var _this = this;
      this.getRequest("/employee/basic/maxWorkID").then(resp => {
        if (resp && resp.status == 200) {
          _this.emp.workID = resp.data;
        }
      });
    },
    emptyEmployeeData() {
      this.employee = {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: "",
        nativePlace: "",
        politicId: "",
        email: "",
        phone: "",
        address: "",
        departmentId: "",
        departmentName: "所属部门...",
        jobLevelId: "",
        posId: "",
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        positionStartDate: "",
        workState: "",
        workID: "",
        contractTerm: "",
        conversionDate: "",
        notWorkDate: "",
        contractBegin: "",
        contractEnd: "",
        workAge: ""
      };
    }
  }
};
</script>

<style>
.el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
