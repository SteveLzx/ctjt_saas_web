// 教练休息管理
<template>
  <div class="page" ref="pageRef">
    <SearchTable :prop-data="searchForm" @select-change="searchSelectChange"></SearchTable>
    <section class="table_section" ref="table_section">
      <CtjtTable
        ref="ctjtTableReference"
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
      />
    </section>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtCreateTable
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import { drawSearchForm } from '@/assets/js/search_table';
import { tableData, searchForm as formData } from './index';
import { deepClone } from '@/assets/js/common';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtCreateTable
  }
})
export default class StudentHistoryList extends mixins(ctjtPaginationMixins) {
  static created() {
    console.log('component created');
  }

  searchForm = formData;

  tableData = { ...tableData };

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  searchSelectChange(val: ParamsType) {
    console.log(val);
  }

  queryList() {
    this.tableData.loading = false;
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 表格配置 */
  downTableData: ParamsType = {
    labels: [],
    list: [],
    name: '教练排班',
  };

  tableOptionCallback(val: TableOptionsValue) {
    const { selectionList, labels } = this.tableData;
    const idList: Array<number | string> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const { id } = val;
    // 导出
    if (id === 4) {
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
  }

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }
}

</script>

<style lang="scss" scoped>

</style>
