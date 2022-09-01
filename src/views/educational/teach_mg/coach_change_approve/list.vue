<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable :tableData="tableData" @option-call="tableOptionCallback">
      <template slot="reference">
        <el-button v-if="perm['btn_field']" @click="dialogName = 'field'" style="float: right;">字段设置</el-button>
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'educational'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <!--导入办证类型选择-->
    <CtjtSelectDialog
      :select-list="selectDialogData"
      :select-dialog-visible="dialogName === 'chooseSubject'"
      title="选择科目"
      accre-label="请选择变更科目"
      @button-call="selectDialogCallback"
    ></CtjtSelectDialog>
    <!-- 变更教练申请 -->
    <el-drawer
      :visible.sync="drawerDetail"
      :title="'变更教练申请'"
      :direction="'rtl'"
      :size="'80%'">
      <CtjtCard :prop-data="{ title: `${isEdit ? '当前审核状态-' : '新增变更申请'}` }">
        <template #header v-if="isEdit">
          <el-link type="primary" class="mr-20">{{formData.verifyStatus | applyStatusFilter}}</el-link>
          <template v-if="formData.verifyStatus !== null && formData.verifyStatus === 0">
            <el-button v-if="perm['btn_pass']" type="success" :loading="btnLoading" @click="applySubmit(1)">审核通过</el-button>
            <el-button v-if="perm['btn_reject']" type="danger" :loading="btnLoading" @click="applySubmit(2)">驳回</el-button>
            <el-button v-if="perm['btn_revoke']" type="warning" :loading="btnLoading" @click="applySubmit(3)">撤销</el-button>
          </template>
        </template>
        <template slot='content'>
          <el-form ref="detailFormRef" :model="formData" :rules="formRules" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="`证件号码${isEdit ? ':' : ''}`" prop="idNo">
                  <template v-if="isEdit">
                    {{formData.idNo}}
                  </template>
                  <template v-else>
                    <CtjtSelect
                      :value="formData.idNo"
                      :list="handleIdNoSelect"
                      :callback="formDataSelectCallback"
                      :placeholder="'请输入证件号码'"
                      :filterable="true"
                      :remote="true"
                      :options="{ value: 'idNo', label: 'idNo', title: 'userName' }"
                      :loading="handleIdNoSelectLoading"
                      @remotemethod="queryIdNoSearch"
                    ></CtjtSelect>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`学员姓名${isEdit ? ':' : ''}`" prop="userName">
                  {{formData.userName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话:" prop="mobile">
                  {{formData.mobile}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车型:" prop="carModel">
                  {{formData.carModel}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="班别:" prop="classesName">
                  {{formData.classesName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="原教练:" prop="originalCoachName">
                  {{formData.originalCoachName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="学车进度:" prop="subjects">
                  {{formData.subjects | subjectsFilter}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="考试时间:" prop="examDateTime">
                  {{formData.examDate}} {{formData.examTime}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="考试科目:" prop="examSubjects">
                  {{formData.examSubjects | subjectsFilter}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="red_el-form-item" label="是否欠费:" prop="isArrears" style="color: red;">
                  {{formData.isArrears === 1 ? '是' : '否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="片区:" prop="regionName">
                  {{formData.regionName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`教练姓名${isEdit ? ':' : ''}`" prop="newCoachName">
                  <template v-if="isEdit">
                    {{formData.newCoachName}}
                  </template>
                  <template v-else>
                    <el-select
                      v-model="formData.newCoachName"
                      @change="newCoachNameChange"
                      placeholder="请选择">
                      <el-option
                        v-for="item in coachesListOpts"
                        :key="item.id"
                        :label="item.userName"
                        :value="item.userName">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="教练电话:" prop="coachMobile">
                  {{formData.coachMobile}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`变更原因${isEdit ? ':' : ''}`" prop="changeCause">
                  <template v-if="isEdit">
                    {{formData.changeCause}}
                  </template>
                  <template v-else>
                    <el-select v-model="formData.changeCause" placeholder="请选择">
                      <el-option
                        v-for="item in changeCauseOpts"
                        :key="item.id"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item :label="`备注${isEdit ? ':' : ''}`" prop="remarks">
                  <template v-if="isEdit">
                    {{formData.remarks}}
                  </template>
                  <template v-else>
                    <el-input class="w_400" type="textarea" v-model.trim="formData.remarks" placeholder="请输入内容" maxlength="60" show-word-limit></el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" v-if="!isEdit">
              <el-button @click="close()">取消</el-button>
              <el-button v-if="perm['btn_submit']" type="primary" :loading="btnLoading" @click="btnSubmit()">保存</el-button>
            </el-row>
          </el-form>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '流程审核记录' }" v-if="isEdit">
        <template slot='content'>
          <CtjtTable :tableData="detailTableData"></CtjtTable>
        </template>
      </CtjtCard>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class EducationalTeachMgCoachChangeApprove extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
::v-deep .red_el-form-item {
  .el-form-item__label {
    color: red;
  }
}
</style>
