<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination
} from '@/components';
import { ParamsType } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination
  }
})
export default class Index extends mixins(ctjtPaginationMixins) {
  // 搜索配置
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '修改时间',
        keyArr: ['beginDate', 'endDate'],
        formatType: 'YYYY-MM-DD',
        value: '',
        placeholder: '请选择',
        type: 'daterange',
        rangeSeparator: '-',
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false
      },
    ]
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    this.paginationData.current = 1;
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    options: [],
    labels: [
      {
        key: '',
        label: '修改人',
      },
      {
        key: '',
        label: '修改时间',
      },
      {
        key: '',
        label: '修改项',
      },
      {
        key: '',
        label: '修改前',
      },
      {
        key: '',
        label: '修改后',
      },
    ],
    list: [],
  }

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
  }
}
</script>
