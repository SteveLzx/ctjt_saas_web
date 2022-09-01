<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <CtjtTable :tableData="tableData" @option-call="tableOptionCallback">
    </CtjtTable>
    <!-- <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination> -->
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCreateTable,
} from '@/components';
import Index from './goods_sale_list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCreateTable,
  },
})
export default class GoodsSale extends Index {}
</script>
<style lang="scss" scoped>
.page {
  padding: 25px 20px;
}
</style>
