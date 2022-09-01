<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <!-- <template slot="header">
        <el-row class="form" type="flex" justify="end"> -->
      <template slot="reference">
        <el-button
          @click="dialogName = 'field'"
          style="float: right"
          v-if="perm['btn_field']"
          >字段设置</el-button
        >
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'statistics'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
        <!-- </el-row> -->
      </template>
    </CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>

    <!--新增服务跟踪抽屉-->
    <el-drawer
      :visible.sync="drawer"
      :wrapperClosable="false"
      size="1000px"
      :before-close="closeDrawer"
    >
      <template slot="title">
        <span class="draw_title">新增服务跟踪</span>
      </template>
      <el-form
        ref="drawerForm"
        :model="servicesFormData"
        :rules="servicesFormDataRules"
        label-position="left"
        label-width="130px"
        class="drawer_form"
      >
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item class="ctjt_form_item_class" label="证件号码">
              <CtjtSelect
                :value="servicesFormData.idNo"
                :list="idNoOption.options"
                :callback="formDataSelectCallback"
                :placeholder="'请输入证件号选择学员'"
                :filterable="true"
                :remote="true"
                :options="{
                  value: 'idNo',
                  label: 'idNo',
                  title: 'userName',
                }"
                :loading="idNoOption.loading"
                @remotemethod="queryIdNoSearch"
              ></CtjtSelect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" style="padding: 20px 0px 80px 0px">
          <CtjtTable
            :tableData="previewData"
            @option-call="servicesTableOptionCallback"
            @selection-change="servicesTableSelectionChange"
          >
          </CtjtTable>
          <CtjtPagination
            :prop-data="servicesPaginationData"
            @on-size-change="servicesTableSizeChange"
            @on-current-change="servicesTableCurrentChange"
          ></CtjtPagination>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="服务来源："
              class="ctjt_form_item_class"
              prop="source"
            >
              <el-select
                v-model="servicesFormData.source"
                placeholder="请选择服务来源"
                clearable
              >
                <el-option
                  v-for="item in servicesFromList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="服务方式："
              class="ctjt_form_item_class"
              prop="pattern"
            >
              <el-select
                v-model="servicesFormData.pattern"
                placeholder="请选择服务方式"
                clearable
              >
                <el-option
                  v-for="item in servicesWayList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="服务类型："
              class="ctjt_form_item_class"
              prop="firstType"
            >
              <el-select
                v-model="servicesFormData.firstType"
                placeholder="请选择一级分类"
                clearable
                @change="servicesTypeChange"
              >
                <el-option
                  v-for="item in servicesTypeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="二级分类："
              class="ctjt_form_item_class"
              prop="secondType"
            >
              <el-select
                v-model="servicesFormData.secondType"
                placeholder="请选择二级分类"
                clearable
              >
                <el-option
                  v-for="item in servicesChildTypeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item
              label="结果反馈："
              class="ctjt_form_item_class"
              prop="feedback"
            >
              <el-select
                v-model="servicesFormData.feedback"
                placeholder="请选择结果反馈"
                clearable
              >
                <el-option
                  v-for="item in resultFeedbackList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item label="服务内容：" class="" prop="content">
              <el-input
                v-model.trim="servicesFormData.content"
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="4"
                style="width: 100%"
                placeholder="请输入，限200字以内"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="padding: 60px 0px">
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="closeDrawer"
            >取消</el-button
          >
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="_addServicesTrack"
            :loading="submitLoading"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-drawer>
    <!--修改学习证有效期弹出框-->
    <CtjtDialog
      :title="dialogName"
      width="500px"
      :is-show="dialogName === '修改学习证有效期'"
      @button-call="closeStudyPeriodDialog"
    >
      <el-form
        label-width="120px"
        ref="studyPeriodForm"
        :model="studyPeriodForm"
        :rules="studyPeriodFormRules"
        :style="{ padding: '0px 40px' }"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名" class="ctjt_form_item_class">
              <span>{{ studyPeriodForm.userName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="证件号码" class="ctjt_form_item_class">
              <span>{{ studyPeriodForm.idNo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="科目一合格日期" class="ctjt_form_item_class">
              <span>{{ studyPeriodForm.examDate }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="原有效期" class="ctjt_form_item_class">
              <span>{{ expireDates }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="现有效期"
              class="ctjt_form_item_class"
              prop="expireDate"
            >
              <el-date-picker
                align="right"
                v-model="studyPeriodForm.expireDate"
                type="date"
                :clearable="false"
                style="width: 220px"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="padding-bottom: 30px">
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="_editStudyCardFunc"
            :loading="submitLoading"
            >保存</el-button
          >
          <el-button
            type="info"
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="closeStudyPeriodDialog"
            >取消</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog>
    <!--转入历史弹出框-->
    <CtjtDialog
      :title="dialogName"
      width="450px"
      :is-show="dialogName === '转入历史'"
      @button-call="closeTurnHistoryDialog"
    >
      <el-form
        label-width="80px"
        ref="turnHistoryForm"
        :model="turnHistoryForm"
        :rules="turnHistoryFormRules"
        :style="{ padding: '0px 40px' }"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="原因" class="" prop="reason">
              <el-select
                v-model="turnHistoryForm.reason"
                placeholder="请选择原因"
                clearable
                style="width: 220px"
              >
                <el-option
                  v-for="item in turnHistoryReasonList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model.trim="turnHistoryForm.remark"
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="4"
                style="width: 220px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="padding-bottom: 30px">
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="_turnHistoryFunc"
            :loading="submitLoading"
            >保存</el-button
          >
          <el-button
            type="info"
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="closeTurnHistoryDialog"
            >取消</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog>
    <!--修改学车进度-->
    <CtjtDialog
      :title="dialogName"
      width="450px"
      :is-show="dialogName === '修改学车进度'"
      @button-call="closeStudyStageDialog"
    >
      <el-form
        label-width="120px"
        ref="studyStageForm"
        :model="studyStageForm"
        :rules="studyStageFormRules"
        :style="{ padding: '0px 40px' }"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名" class="ctjt_form_item_class">
              <span>{{ studyStageForm.userName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="证件号码" class="ctjt_form_item_class">
              <span>{{ studyStageForm.idNo }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="原学车进度" class="ctjt_form_item_class">
              <span>{{
                studyStageForm.learnDrivingSchedule | learnDrivingScheduleFilter
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="现学车进度" prop="studyStage">
              <el-select
                v-model="studyStageForm.studyStage"
                placeholder="请选择"
                clearable
                style="width: 220px"
              >
                <el-option
                  v-for="item in studyStageList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="padding-bottom: 30px">
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="_studyStageFunc"
            :loading="submitLoading"
            >保存</el-button
          >
          <el-button
            type="info"
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="closeStudyStageDialog"
            >取消</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtSelect,
  CtjtSetField,
  CtjtDialog,
} from '@/components';
import Index from './list';
import { STUDY_STAGE } from '@/enums';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtSelect,
    CtjtDialog,
  },
  filters: {
    learnDrivingScheduleFilter(val: number): string {
      const _item = STUDY_STAGE.filter((item: any) => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
  },
})
export default class StatisticsStudentIntegrationFile extends Index {}
</script>
<style lang="scss" scoped>
// ::v-deep .el-message-box__wrapper .el-message-box .el-message-box__header {
//   border-bottom: 1px solid #c0c4cc;
// }
// .form {
//   border: 1px solid $--color-border-split;
//   border-bottom: 0;
//   padding: 5px 18px;
//   background: #f9fafb;
// }

::v-deep .el-drawer__header {
  border-bottom: 1px solid $--color-border-split;
  padding: 30px;
  .draw_title {
    font-size: 17px;
    font-weight: 500;
  }
}

::v-deep .el-drawer__body {
  overflow: auto;
  padding: 30px;
}
::v-deep .ctjt_form_item_class .el-input__inner {
  width: 100%;
}
::v-deep .ctjt_form_item_child_class .el-form-item__content {
  margin-left: 50px !important;
}

// ::v-deep .drawer_form .el-row {
//   padding: 10px 0px;
// }
::v-deep .drawer_table .el-table__header-wrapper .el-checkbox {
  display: none;
}
::v-deep .drawer_form .el-form-item__label,
::v-deep .drawer_detail_form .el-form-item__label {
  font-weight: bold;
}
</style>
