<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
    ></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <div style="margin-top: 30px">
      总人数：{{ staticData.countNum }}，已学学时费：{{
        staticData.countLearnedPeriodFee
      }}元，应扣服务费：{{ staticData.countDeductTrainFee }}元，应扣金额合计：{{
        staticData.countDeductTotalFee
      }}元， 应退费用: {{ staticData.countRefundableFee }}元
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
export default class FinanceSanXueRefundMgDetail extends Detail {}
</script>
