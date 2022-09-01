<template>
  <div class="page">
    <CtjtTable :tableData="tableData" @option-call="tableOptionCallback">
    </CtjtTable>
    <div style="color: red; margin-top: 30px">
      总计：订单总额 {{ formatPrice(staticData.orderTotal) }}元，实收总额
      {{ formatPrice(staticData.amountTotal) }}元
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
import { CtjtTable, CtjtPagination, CtjtStatistics } from '@/components';
import Detail from './all_order_detail';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    CtjtStatistics,
  },
})
export default class FinanceAllOrderDetail extends Detail {}
</script>
<style lang="scss" scoped>
.header_container {
  padding: 8px;
}
.ctjt_form_item_class {
  font-size: 16px;
  font-weight: 500;
}
</style>
