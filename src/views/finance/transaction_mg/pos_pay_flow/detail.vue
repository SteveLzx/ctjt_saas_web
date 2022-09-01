<template>
  <div class="page">
    <section class="header_container">
      <div class="ctjt_form_item_class mr-30">
        日期：{{ detailParams.beginDate }} 至 {{ detailParams.endDate }}
      </div>
      <div class="ctjt_form_item_class mr-30">
        pos公司：{{ detailParams.posCompany }}
      </div>
      <div class="ctjt_form_item_class mr-30">
        pos终端号：{{ detailParams.posTerminalNo }}
      </div>
      <div class="ctjt_form_item_class">门店：{{ detailParams.storeName }}</div>
    </section>
    <CtjtTable :tableData="tableData"></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { CtjtTable, CtjtPagination } from '@/components';
import Detail from './detail';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
  },
})
export default class FinancePosPayFlowDetail extends Detail {}
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
