<template>
  <div class="page">
    <section class="header_container">
      <div class="ctjt_form_item_class mr-30">
        交易日期：{{ detailParams.beginDate }} 至 {{ detailParams.endDate }}
      </div>
      <div class="ctjt_form_item_class mr-30">
        {{ contentLabel }}：{{ content }}
      </div>
    </section>
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
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
     <el-drawer
      title="订单明细"
      size="80%"
      :visible.sync="drawer">
      <div class="page">
        <CtjtTable :tableData="drawerTableData" ></CtjtTable>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import Detail from './flow_detail';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
  },
})
export default class FinanceCollectionReviewSetFlow extends Detail {}
</script>
<style lang="scss" scoped>
.header_container {
  padding: 8px;
}
.ctjt_form_item_class {
  font-size: 16px;
  font-weight: 500;
}
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
</style>
