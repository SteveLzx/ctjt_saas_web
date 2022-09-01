// 散学约车记录
<template>
  <div class="page" ref="pageRef">
    <SearchTable :prop-data.sync="searchFormData" @select-change="searchSelectChange"></SearchTable>
    <section class="table_section" ref="table_section">
      <CtjtTable
        ref="ctjtTableReference"
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
        @sort-change="tableSortChange"
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
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import Component, { mixins } from 'vue-class-component';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import ctjtPaginationMixins from '@/mixins/pagination';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtCreateTable
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { deepClone } from '@/assets/js/common';
import { tableData, searchForm as formData } from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtCreateTable
  }
})
export default class MarketSanXueAppointmentList extends mixins(
  ctjtPaginationMixins,
  ctjtAreaStoreSeachTableMixins
) {
  @Action('assignment/queryAppointLogList') private queryAppointLogList!: (data: ParamsType) => ParamsType;

  @Action('assignment/queryScatteredCoach') private queryScatteredCoach!: () => ParamsType;

  @Action('assignment/exportAppointLogList') private exportAppointLogList!: (data: ParamsType) => any;

  searchFormData: any = { ...formData };

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }

  mounted() {
    this.searchFormData = { ...formData };
    const { drivingSchoolId } = this.userInfo;
    const { selectList } = this.searchForm;
    this.searchFormData.selectList = selectList.concat(this.searchFormData.selectList);
    this.queryRegionList(drivingSchoolId);
    this.queryScatteredCoach().then((res: any) => {
      this.searchFormData.selectList[2].options = res;
    });
    this.init();
    this.queryList();
  }

  init() {
    const today = this.$dayjs(new Date()).format('YYYY-MM-DD');
    this.searchFormData.datePickerList[0].value = today;
    this.searchFormData.datePickerList[1].value = today;
  }

  tableData = { ...tableData };

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.init();
      this.searchSelectChange({ key: 'regionId', value: null });
      this.queryList();
    }
  }

  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        // 请求该片区下的门店列表
        this.queryStoreList(value);
      }
    }
  }

  async queryList() {
    this.tableData.loading = false;
    this.filterDate(this.searchFormData);
    const { searchFormData, paginationData } = this;
    const _data = drawSearchForm(searchFormData, paginationData);
    const { startDate, endDate } = _data;
    if (new Date(endDate).getTime() - new Date(startDate).getTime() > 30 * 24 * 60 * 60 * 1000) {
      this.$message.warning('最长支持搜索30天');
      return;
    }
    const sendData = {
      ..._data,
      ...this.sortSearchForm
    };
    const body = await this.queryAppointLogList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data || [];
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  filterDate(data: any) {
    const _data = data;
    const startDate = _data.datePickerList[0].value;
    const endDate = _data.datePickerList[1].value;
    if (new Date(endDate) < new Date(startDate)) {
      [_data.datePickerList[0].value, _data.datePickerList[1].value] = [_data.datePickerList[1].value, _data.datePickerList[0].value];
    }
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  sortSearchFormDeep = {
    sortByAppointDate: 0
  }

  sortSearchForm = deepClone(this.sortSearchFormDeep);

  // 列表排序回调
  tableSortChange(data: any) {
    const { prop, order } = data;
    const returnStatusFunc = (res: any) => {
      if (res === 'ascending') return 1;
      if (res === 'descending') return 2;
      return 0;
    };
    this.sortSearchForm = deepClone(this.sortSearchFormDeep);
    switch (prop) {
      case 'appointDate':
        this.sortSearchForm.sortByAppointDate = returnStatusFunc(order);
        break;
      default:
        break;
    }
    this.queryList();
  }

  /** 表格配置 */
  downTableData: ParamsType = {
    labels: [],
    list: [],
    name: '散学约车记录',
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
      if (_len >= 1) { // 勾选了则直接导出
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
      } else {
        this.exportList();
        // this.$message.warning('请先勾学员！');
      }
    }
  }

  async exportList() {
    const { searchFormData } = this;
    const _data = drawSearchForm(searchFormData);
    // 处理数据
    const body = await this.exportAppointLogList(_data);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `散学约车记录${this.$dayjs(new Date()).format('YYYYMMDD')}`);
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
