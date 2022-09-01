<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import Index from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
  },
})
export default class FinanceHuiZhouCurrentRefund extends Index {}
</script>
<style lang="scss" scoped>
.add_form .ctjt_form_item_class {
  width: 420px;
}
</style>
