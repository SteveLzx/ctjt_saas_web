<template>
  <div>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>
<script lang='ts'>
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  CtjtTable, CtjtPagination
} from '@/components';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';
import { certificateTableData } from '../index';

@Component({
  components: { CtjtTable, CtjtPagination }
})
export default class MarketMiniProgramsPoster extends mixins(ctjtPaginationMixins) {
  @Action('sale/queryPosterPage') private queryPosterPage!: (data: any) => ParamsType;

  tableData = certificateTableData;

  async tableOptionCallback(val: any) {
    const { id } = val;
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  public parentSearchCall() {
    this.tableCurrentChange(1);
  }

  async queryList() {
    const { paginationData } = this;
    const _data = drawSearchForm(paginationData);
    _data.posterType = 2;
    this.tableData.loading = true;
    this.queryPosterPage(_data).then((res: any) => {
      const { data, total, current } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).finally(() => {
      this.tableData.loading = false;
    });
  }

  mounted() {
    this.queryList();
  }
}
</script>
