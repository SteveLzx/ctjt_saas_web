<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
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
          :localstorage-service="'finance'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtStatistics
      v-if="activeTab === 1"
      :statistics-data="statisticsData"
      remark=""
    ></CtjtStatistics>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTabBar,
  CtjtTable,
  CtjtPagination,
  CtjtAutoUpload,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import Index from './list';

@Component({
  components: {
    SearchTable,
    CtjtTabBar,
    CtjtTable,
    CtjtPagination,
    CtjtAutoUpload,
    CtjtSetField,
    CtjtStatistics,
  },
})
export default class FinancepayReviewSetExamMakeupFeeReview extends Index {}
</script>
