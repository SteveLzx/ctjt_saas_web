<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    > <template slot="autocomplete">
        <el-form-item
          v-for="(item, index) in searchForm.autocompleteList"
          :key="`autocomplete-${index}`"
          :label="item.label"
          :label-width="`${item.labelWidth + 'px' || 'auto'}`"
        >
          <el-autocomplete
            popper-class="seach_table_autocomplete"
            v-model="item.value"
            value-key="idNo"
            :maxlength="item.maxlength"
            :clearable="item.clearable"
            :fetch-suggestions="autocompleteQuerySearch"
            :placeholder="item.placeholder || '请输入内容'"
            style="width: 400px" size="mini"
          >
            <template slot-scope="{ item }">
              <div class="idNo">{{ item.idNo }}</div>
              <span class="userName">{{ item.userName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
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
          :localstorage-service="'accreditation'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtStatistics
      :remark="`<div style='color: red; margin-top: 10px;'>注：学员科目二、科目三考试合格后，数据将在列表中展示</div>`"
    ></CtjtStatistics>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--singleForm 单选操作弹出框 学时更新-->
    <CtjtSingleInfoDialog
      ref="singleFormDialog"
      :info-data="userBaseInfoData"
      title="学时更新"
      :rules="singleFormRules"
      :is-show="dialogName === 'singleForm'"
      @button-call="singleInfoButtonCallback"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="划拨科目" class="ctjt_form_item_class">
            <span>{{ userBaseInfoData.transferSubjects | transferSubjectsFilter }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24"
          ><el-form-item
            label="监管学时"
            class="ctjt_form_item_class"
          ></el-form-item
        ></el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="`模拟机学时`"
            class="ctjt_form_item_class"
            prop="periodMachine"
          >
            <el-input
              v-model="userBaseInfoData.periodMachine"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="`真车学时`"
            class="ctjt_form_item_class"
            prop="periodCar"
          >
            <el-input
              v-model="userBaseInfoData.periodCar"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="学时考核"
            class="ctjt_form_item_class"
            prop="periodAssess"
          >
            <el-radio-group v-model="userBaseInfoData.periodAssess">
              <el-radio :label="'未完成'">未完成</el-radio>
              <el-radio :label="'已完成'">已完成</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </CtjtSingleInfoDialog>
    <!--导入办证数据弹出框-->
    <CtjtImportDrawer
      :import-visible="dialogName === 'import'"
      :import-props="importProps"
      @button-call="dialogName = ''"
      @on-upload="importResultCallback"
    ></CtjtImportDrawer>
    <!--导入办证数据返回结果弹出框-->
    <CtjtCertificateResultDialog
      :certificate-result-visible="
        certificateResult === 'import' || certificateResult === 'supplement'
      "
      :title="certificateResult === 'import' ? '导入' : '补录'"
      :import-data="importData"
      @button-call="certificateResult = ''"
    ></CtjtCertificateResultDialog>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCreateTable,
  CtjtOperationLog,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import {
  CtjtSingleInfoDialog,
  CtjtCertificateResultDialog,
  CtjtImportDrawer,
} from '@/views/accreditation/_components';
import Index from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtStatistics,
    CtjtSingleInfoDialog,
    CtjtImportDrawer,
    CtjtCertificateResultDialog,
    CtjtCreateTable,
    CtjtOperationLog,
  },
})
export default class AccreditationSupervisionHours extends Index {}
</script>
<style lang="scss" scoped>
.ctjt_form_item_class {
  width: 380px;
  .el-date-editor,
  .el-select {
    width: 100%;
  }
}
.el-form-item{
  margin-bottom: 8px;
}
</style>
