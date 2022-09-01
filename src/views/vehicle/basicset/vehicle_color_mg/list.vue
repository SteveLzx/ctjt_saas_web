<template>
  <div class="page">
    <CtjtTable :tableData="tableData"></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>
<script lang='ts'>
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  CtjtTable, CtjtPagination
} from '@/components';
import { ParamsType } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
  }
})
export default class VehicleBasicsetVehicleColorMg extends mixins(ctjtPaginationMixins) {
  @Action('car/queryCarColorList') private queryCarColorList!: (data: any) => any;

  // 列表
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    index: true,
    options: [],
    labels: [
      {
        key: 'carColor',
        label: '颜色',
      },
      {
        key: '',
        label: '状态',
        render(h: any, params: any) {
          return h('span', '启用');
        }
      }
    ],
    list: []
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

  /**
   * 请求订单列表
   */
  async queryList() {
    const { paginationData } = this;
    const sendData = { ...paginationData };
    try {
      const body = await this.queryCarColorList(sendData);
      const {
        data, current, total
      } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 生命周期函数
  async mounted() {
    this.queryList();
  }
}
</script>
