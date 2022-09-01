<template>
  <div class="page">
    <SearchTable :prop-data="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
      @sort-change="tableSortChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>

<script lang="ts">
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { deepClone } from '@/assets/js/common';
import {
  SearchTable, CtjtTable, CtjtPagination
} from '@/components';
import { ParamsType, TableOptionsValue } from '@/type';
import { MARKET_SERVICE_STATUS, MARKET_STORE_SCALE, MARKET_POST_TYPE } from '@/enums';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination
  }
})
export default class MarketCustomerServiveList extends mixins(ctjtPaginationMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('user/queryCustomerList') private queryCustomerList!: (data: any) => ParamsType;

  /** 表单搜索开始 */
  private searchForm = {
    inputList: [
      {
        label: '搜索',
        key: 'userNameOrMobile',
        type: 'text',
        value: '',
        width: 220,
        clearable: true,
        placeholder: '请输入客服姓名，手机号',
      }
    ],
    selectList: [
      {
        label: '驾校',
        key: 'drivingSchoolId',
        value: '',
        placeholder: '请选择驾校',
        width: 200,
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '片区',
        key: 'regionId',
        value: '',
        placeholder: '请选择片区',
        width: 200,
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '门店规模',
        key: 'storeScale',
        value: '',
        placeholder: '请选择门店规模',
        multiple: false,
        clearable: true,
        width: 160,
        options: MARKET_STORE_SCALE
      },
      {
        label: '门店名称',
        key: 'storeId',
        value: '',
        placeholder: '请选择门店名称',
        width: 160,
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '供职',
        key: 'status',
        value: '',
        placeholder: '请选择供职',
        multiple: false,
        clearable: true,
        width: 160,
        options: MARKET_SERVICE_STATUS
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      },
    ],
  }

  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }
  /** 表单搜索结束 */

  /** 列表配置开始 */
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: false,
    index: true,
    labels: [
      {
        key: 'userName',
        label: '客服姓名',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { userName, id } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(id);
              }
            }
          },
          userName);
        }
      },
      {
        key: 'mobile',
        label: '手机号',
        showOverflowTooltip: true,
      },
      {
        key: 'drivingSchoolName',
        label: '所属驾校',
        showOverflowTooltip: true,
      },
      {
        key: 'regionName',
        label: '所属片区',
        showOverflowTooltip: true,
      },
      {
        key: 'storeName',
        label: '门店名称',
        showOverflowTooltip: true,
      },
      {
        key: 'storeScale',
        label: '门店规模',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { storeScale } = params.row;
          if (storeScale === 0) {
            return h('div', '-');
          }
          const _list = MARKET_STORE_SCALE;
          const _item = _list.filter(item => item.id === storeScale);
          return h('div', `${_item[0].label}`);
        }
      },
      {
        key: 'postType',
        label: '岗位类型',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { postType } = params.row;
          if (postType === 0) {
            return h('div', '-');
          }
          const _list = MARKET_POST_TYPE;
          const _item = _list.filter(item => item.id === postType);
          return h('div', `${_item[0].label}`);
        }
      },
      {
        key: 'entryTime',
        label: '入职时间',
        sortable: 'custom',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { entryTime } = params.row;
          if (!entryTime) {
            return h('div', '-');
          }
          return h('div', entryTime);
        }
      },
      {
        key: 'status',
        label: '供职状态',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { status } = params.row;
          if (status === 0) {
            return h('div', '-');
          }
          const _list = MARKET_SERVICE_STATUS;
          const _item = _list.filter(item => item.id === status);
          return h('div', `${_item[0].label}`);
        }
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
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
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      const { id } = val;
      const spaceId: string = selectionList[0].id;
      if (id === 1) {
        // 编辑
        this.jumpDetail(spaceId);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }
  /** 列表配置结束 */

  /** 业务处理 开始 */
  private jumpDetail(val: string): void {
    this.$router.push({ path: '/market/customerService/detail', query: { id: val } });
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
        this.searchForm.selectList[3].options = _data;
      }
    }
  }

  /** 搜索筛选框选择回调 */
  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      this.searchForm.selectList[3].options = [];
      this.searchForm.selectList[3].value = '';
      if (value) {
        this.selectFunc('region', value);
      }
    }
    if (key === 'regionId') {
      this.searchForm.selectList[3].options = [];
      this.searchForm.selectList[3].value = '';
      if (value) {
        this.selectFunc('store', value);
      }
    }
  }
  /** 业务处理 结束 */

  /** 请求处理 */

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  // 排序参数对象
  sortSearchFormDeep: any = {
    typeSort: 0, // 类型排序
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
    this.queryList();
  }

  /**
   * 请求场地列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData: ParamsType = {
      ..._data
    };
    const body = await this.queryCustomerList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  async mounted() {
    this.tableData._this = this;
    // 先默认请求驾校
    this.selectFunc('driverSchool', '0');
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}

</script>

<style lang="scss" scoped>

</style>
