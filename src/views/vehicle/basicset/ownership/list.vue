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
export default class VehicleBasicsetOwnership extends mixins(ctjtPaginationMixins) {
  @Action('car/queryOrganizationList') private queryOrganizationList!: (data: any) => any;

  // 列表
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    index: true,
    labels: [
      {
        key: 'organName',
        label: '名称',
        minWidth: 300,
      },
      {
        key: '',
        label: '描述',
        minWidth: 300,
        render(h: any, params: any) {
          const { organDesc } = params.row;
          if (!organDesc) return h('span', '-');
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: organDesc,
            },
            scopedSlots: {
              reference: () => h('p', organDesc),
            },
          });
        }
      },
      {
        key: 'address',
        label: '地址',
        minWidth: 300,
        render(h: any, params: any) {
          const { address } = params.row;
          if (!address) return h('span', '-');
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: address,
            },
            scopedSlots: {
              reference: () => h('p', address),
            },
          });
        }
      },
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
      const body = await this.queryOrganizationList(sendData);
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
