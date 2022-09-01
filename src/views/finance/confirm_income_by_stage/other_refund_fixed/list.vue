<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <div style="color: red;">统计周期为上月26号至本月25号，每个周期只允许进行一次【确认收入】操作</div>
    <CtjtTable :tableData="tableData" @option-call="tableOptionCallback"></CtjtTable>
    <el-drawer
      title="其他收入明细（固化）"
      size="80%"
      :visible.sync="drawer">
      <div class="page">
        <CtjtTable :tableData="drawerTableData" @selection-change="drawerTableSelectionChange" @option-call="drawerTableOptionCallback"></CtjtTable>
        <CtjtPagination :prop-data="paginationData" @on-size-change="drawerTableSizeChange" @on-current-change="drawertTbleCurrentChange"></CtjtPagination>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class FinanceConfirmIncomeByStageOtherRefundFixed extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
</style>
