<template>
  <div>
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
  CtjtTable, CtjtPagination
} from '@/components';
import { ParamsType } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    CtjtTable, CtjtPagination
  }
})
export default class StudentRegistrationDetail extends mixins(ctjtPaginationMixins) {
  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    // selection: true,
    index: true,
    options: [],
    labels: [
      {
        key: '',
        label: '学员姓名',
      },
      {
        key: '',
        label: '考试科目',
      },
      {
        key: '',
        label: '考试时间',
      },
      {
        key: '',
        label: '录入时间',
      },
      {
        key: '',
        label: '流水号',
      },
      {
        key: '',
        label: '单号',
      },
      {
        key: '',
        label: '录入人',
      },
    ],
    list: [],
    selectionList: []
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
