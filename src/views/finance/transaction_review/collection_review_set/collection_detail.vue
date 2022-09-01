<template>
  <div class="page">
    <section class="header_container">
      <div class="ctjt_form_item_class mr-30">
        交易日期：{{ detailParams.beginDate }} 至 {{ detailParams.endDate }}
      </div>
      <div class="ctjt_form_item_class mr-30" v-if="content">
        {{ contentLabel }}：{{ content }}
      </div>
    </section>
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @sort-change="tableSortChange"
    >
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
        <el-drawer title="流水明细" size="80%" :visible.sync="drawer">
      <div class="page">
        <CtjtTable :tableData="drawerTableData"></CtjtTable>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtStatistics,
} from '@/components';
import Detail from './collection_detail';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtStatistics,
  },
})
export default class FinanceCollectionReviewSetCollection extends Detail {}
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
