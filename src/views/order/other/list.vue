<template>
  <div class="page" ref="pageRef">
    <SearchTable :prop-data="searchForm" @select-change="searchSelectChange"></SearchTable>
    <section class="table_section" ref="table_section">
      <CtjtTable
        ref="ctjtTableReference"
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
      > </CtjtTable>
    </section>
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
import FileSaver from 'file-saver';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ORDER_PAY_TYPE, IN_LIBRARY_STATUS } from '@/enums';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { spliceHoursAndMinutesAndSeconds, timestampSizeCompare } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';
import {
  defaultTableData, guangrenTableData, defalutSearchForm, guangrenSearchForm
} from './index';

interface ElementDOMS extends Element {
  offsetHeight: number;
}

const name = '其他订单';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
  }
})
export default class OrderOtherList extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('order/queryExtOrderList') private queryExtOrderList!: (data: any) => ParamsType;

  @Action('order/queryExportExtOrderList') private queryExportExtOrderList!: (data: any) => any;

  @Action('order/deleteOrderExt') private deleteOrderExt!: (data: any) => any;

  /* 订单列表相关 开始 */
  // 列表搜索配置
  searchForm: ParamsType = defalutSearchForm;

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 表格
  tableData: ParamsType = defaultTableData;

  /** 导出 */
  private async _exportData() {
    const { searchForm, paginationData } = this;
    const { cascaderList } = searchForm;
    const _data = drawSearchForm(searchForm, paginationData);
    const { startDate, endDate } = _data;
    // 处理数据
    const sendData = {
      ..._data,
      isExport: 1,
      studentStatus: Array.isArray(cascaderList[0].value) ? cascaderList[0].value : null,
      startDate: startDate ? spliceHoursAndMinutesAndSeconds(1, startDate) : '',
      endDate: endDate ? spliceHoursAndMinutesAndSeconds(2, endDate) : ''
    };
    const body = await this.queryExportExtOrderList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  // 删除
  deleteOrderExtFunc(id: string) {
    this.$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const _list: string[] = [id];
      await this.deleteOrderExt(_list);
      this.$message.success('删除成功！');
      this.queryList();
    });
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

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 3) {
      this.jumpDetail('');
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (id === 2) {
      // 导出
      this._exportData();
      return;
    }
    if (_len === 0) {
      this.$message.warning('请先勾选一项，再进行操作！');
      return;
    }

    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 1) {
      const spaceId: string = selectionList[0].id;
      if (id === 1) {
        // 编辑
        this.jumpDetail(spaceId);
      }
      if (id === 4) {
        // 删除
        this.deleteOrderExtFunc(spaceId);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }
  /* 订单列表相关 结束 */

  /** 业务处理 开始 */
  private jumpDetail(val: string, isEdit?: string): void {
    this.$router.push({ path: '/market/order/other/detail', query: { id: val, edit: isEdit } });
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'driverSchool') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'region') {
        this.searchForm.selectList[1].options = _data;
      }
      if (type === 'store') {
        const { drivingSchoolId } = this.userInfo;
        this.searchForm.selectList[drivingSchoolId === '370' ? 0 : 2].options = _data;
      }
    }
  }

  /** 搜索筛选框选择回调 */
  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      this.searchForm.selectList[2].options = [];
      this.searchForm.selectList[2].value = '';
      if (value) {
        this.selectFunc('region', value);
      }
    }
    if (key === 'regionId') {
      this.searchForm.selectList[2].options = [];
      this.searchForm.selectList[2].value = '';
      if (value) {
        this.selectFunc('store', value);
      }
    }
  }

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /** 业务处理 结束 */

  // 请求处理
  /**
   * 请求订单列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const { cascaderList } = searchForm;
    const _data = drawSearchForm(searchForm, paginationData);
    const { startDate, endDate } = _data;
    // 判断时间
    if (startDate && endDate && timestampSizeCompare(startDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data,
      studentStatus: Array.isArray(cascaderList[0].value) ? cascaderList[0].value : null,
      startDate: startDate ? spliceHoursAndMinutesAndSeconds(1, startDate) : '',
      endDate: endDate ? spliceHoursAndMinutesAndSeconds(2, endDate) : ''
    };
    try {
      const body = await this.queryExtOrderList(sendData);
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
    const { drivingSchoolId, regionId } = this.userInfo;
    if (drivingSchoolId === '370') {
      this.tableData = guangrenTableData;
      this.searchForm = guangrenSearchForm;
      this.selectFunc('store', regionId !== '0' ? regionId : '1470');
    } else {
      this.selectFunc('driverSchool', '0');
    }
    this.tableData._this = this;
    // 可见区域高度
    this.$nextTick(() => {
      const _dom = document.querySelector('#container_body');
      if (_dom) {
        const _mh = (_dom as ElementDOMS).offsetHeight;
        (this.$refs.pageRef as VueComponentParent).style.height = `${_mh}px`;
        const _tbsetionH = (this.$refs.table_section as VueComponentParent).offsetHeight;
        this.tableData.height = _tbsetionH - 50;
      }
    });
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }

  activated() {
    this.queryList();
  }
}
</script>
<style lang="scss" scoped>
.page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.table_section {
  flex: 1;
}
.table_operation {
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time_input_no_r {
  width: 170px;
  ::v-deep .el-input__inner{
    padding-right: 0;
  }
}
</style>
