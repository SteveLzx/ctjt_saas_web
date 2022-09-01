<template>
  <div class="page">
    <el-table
      :data="tableData.list"
      row-key="id"
      border
      v-loading="tableData.loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :tree-props="{children: 'children'}">
      <el-table-column
        prop=""
        label=""
        :align="'center'"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="index"
        label="序号"
        :align="'center'"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="车辆用途"
        :align="'center'"
      >
      </el-table-column>
      <el-table-column
        prop="carNumber"
        :align="'center'"
        label="车辆数量">
        <template slot-scope="props">
          <el-link
            type="primary"
            :underline="false"
            @click="jumpDetail(props.row)"
          >{{ props.row.carNumber }}</el-link>
        </template>
      </el-table-column>
    </el-table>
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
import { deepClone } from '@/assets/js/common';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
  }
})
export default class VehicleBasicsetUsenatureMg extends mixins(ctjtPaginationMixins) {
  @Action('car/queryCarUsePropertiesList') private queryCarUsePropertiesList!: (data: any) => any;

  @Action('car/queryCarUsePropertiesDetail') private queryCarUsePropertiesDetail!: (data: any) => any;

  // 列表
  private tableData: ParamsType = {
    loading: true,
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
   * 请求列表
   */
  async queryList() {
    const { paginationData } = this;
    const sendData = { ...paginationData };
    try {
      const body = await this.queryCarUsePropertiesList(sendData);
      const {
        data, current, total
      } = body;
      const deepData = deepClone(data);
      deepData.forEach((item: any, index: number) => {
        const _item = item;
        _item.index = index + 1;
      });
      this.tableData.list = deepData;
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
        key: 'carPurpose',
        label: '车辆用途',
      },
      {
        key: 'useProperties',
        label: '使用性质',
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
    const { firstLevelId = 0, secondLevelId = null, carNumber } = row;
    if (!carNumber) return;
    this.drawerTableData.firstLevelId = firstLevelId;
    this.drawerTableData.secondLevelId = secondLevelId;
    this.queryDrawerList();
    this.drawer = true;
  }

  /**
   * 请求详情列表
   */
  async queryDrawerList() {
    const { drawerTableData } = this;
    const { firstLevelId, secondLevelId } = drawerTableData;
    const sendData = {
      firstLevelId,
      secondLevelId,
    };
    try {
      const body = await this.queryCarUsePropertiesDetail(sendData);
      this.drawerTableData.loading = false;
      this.drawerTableData.list = body;
    } catch (error) {
      this.drawerTableData.loading = false;
    }
  }

  // 生命周期函数
  async mounted() {
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
