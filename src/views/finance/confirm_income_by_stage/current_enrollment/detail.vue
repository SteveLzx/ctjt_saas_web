<template>
  <div class="page">
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { CtjtTable, CtjtPagination, CtjtCreateTable } from '@/components';
import Detail from './detail';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    CtjtCreateTable,
  },
})
export default class FinanceCurrentEnrollmentDetail extends Detail {}
</script>
<style lang="scss" scoped>
.header_container {
  padding: 8px;
}
</style>
