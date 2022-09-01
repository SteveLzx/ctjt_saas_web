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
    ></CtjtTable>
    <div style="margin-top: 30px">
      总人数：{{ staticData.countNum }}，总退费：{{
        staticData.countFinanceAuditAmount
      }}元，退培训费：{{ staticData.countFinanceTrainCost }}元， 退代缴注册费：{{
        staticData.countFinanceRegisteringCost
      }}元，退差价 {{ staticData.countFinanceDifferCost }}元
    </div>
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
  CtjtTable,
  CtjtPagination,
  CtjtSetField,
} from '@/components';
import Detail from './detail';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
  },
})
export default class FinanceStudentRefundMgDetail extends Detail {}
</script>
