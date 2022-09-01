<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    >
      <template slot="autocomplete">
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
            style="width: 400px"
            size="mini"
          >
            <template slot-scope="{ item }">
              <div class="idNo">{{ item.idNo }}</div>
              <span class="userName">{{ item.userName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template></SearchTable
    >
    <CtjtTabBar :tabs="tabList" :value.sync="activeTab"></CtjtTabBar>
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
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--快速录入办证数据-->
    <CtjtAccreditationQuickEntry
      :is-show="dialogName === 'quickEntry'"
      :supplement-props="importProps"
      @button-call="submitQuickEntryCallback"
    >
    </CtjtAccreditationQuickEntry>
    <!--补录办证数据-->
    <CtjtSupplementDrawer
      :is-show="dialogName === 'supplement'"
      :supplement-props="importProps"
      @button-call="submitSupplementCallback"
    >
    </CtjtSupplementDrawer>
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
        certificateResult === 'import' ||
        certificateResult === 'supplement' ||
        certificateResult === 'quickEntry'
      "
      :title="
        certificateResult === 'import'
          ? '导入'
          : certificateResult === 'supplement'
          ? '补录'
          : '快速录入'
      "
      :import-data="importData"
      @button-call="certificateResult = ''"
    ></CtjtCertificateResultDialog>
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
  CtjtTabBar,
  CtjtTable,
  CtjtPagination,
  CtjtOperationLog,
  CtjtSetField,
} from '@/components';
import { SUBJECT } from '@/enums';
import {
  CtjtCertificateResultDialog,
  CtjtImportDrawer,
  CtjtSupplementDrawer,
  CtjtAccreditationQuickEntry,
} from '@/views/accreditation/_components';
import Index from './index';

@Component({
  components: {
    SearchTable,
    CtjtTabBar,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtImportDrawer,
    CtjtCertificateResultDialog,
    CtjtSupplementDrawer,
    CtjtOperationLog,
    CtjtAccreditationQuickEntry,
  },
  filters: {
    subjectFilter: (val: any) => (val ? SUBJECT[val - 1].label : ''),
  },
})
export default class AccreditationExamApprovalList extends Index {}
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
