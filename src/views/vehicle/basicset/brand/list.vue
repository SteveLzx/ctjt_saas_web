<template>
  <div class="page">
    <CtjtTable :tableData="tableData"></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>

    <el-drawer
      title="车辆列表"
      :visible.sync="drawer"
      size="80%">
      <div class="page">
        <CtjtTable :tableData="drawerTableData"></CtjtTable>
      </div>
    </el-drawer>
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
export default class VehicleBasicsetBrand extends mixins(ctjtPaginationMixins) {
  @Action('car/queryCarBrandManageList') private queryCarBrandManageList!: (data: any) => any;

  @Action('car/queryCarBrandInfoList') private queryCarBrandInfoList!: (data: any) => any;

  // 列表
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    index: true,
    labels: [
      {
        key: 'name',
        label: '名称',
      },
      {
        key: 'carNum',
        label: '车辆数量',
        render(h: any, params: any) {
          const { carNum } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(params.row);
              }
            }
          },
          carNum);
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
      const body = await this.queryCarBrandManageList(sendData);
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

  private drawer = false;

  // 详情列表
  private drawerTableData: ParamsType = {
    index: true,
    loading: true,
    list: [],
    labels: [
      {
        key: 'carBrand',
        label: '品牌',
      },
      {
        key: 'regionName',
        label: '片区',
        minWidth: 180
      },
      {
        key: 'carNumber',
        label: '车牌号',
      },
      {
        key: 'engineCode',
        label: '发动机号',
      },
      {
        key: 'registerDate',
        label: '登记日期',
        minWidth: 160
      },
      {
        key: 'status',
        label: '状态',
        minWidth: 240
      },
      {
        key: 'carAge',
        label: '车龄',
      }
    ],
    firstLevelId: null,
    secondLevelId: null,
  }

  jumpDetail(row: any) {
    const { id = null, carNum } = row;
    if (!carNum) return;
    this.queryDrawerList(id);
    this.drawer = true;
  }

  /**
   * 请求详情列表
   */
  async queryDrawerList(id: string) {
    const sendData = { id };
    try {
      const body = await this.queryCarBrandInfoList(sendData);
      this.drawerTableData.loading = false;
      this.drawerTableData.list = body;
    } catch (error) {
      this.drawerTableData.loading = false;
    }
  }

  // 生命周期函数
  async mounted() {
    this.tableData._this = this;
    this.queryList();
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
</style>
