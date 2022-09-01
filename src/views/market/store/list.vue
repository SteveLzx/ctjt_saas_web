<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
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
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import { ParamsType, TableOptionsValue } from '@/type';
import { deepClone } from '@/assets/js/common';
import {
  MARKET_STORE_BUDINESS_STATUS, MARKET_STORE_SCALE, MARKET_STORE_TYPE, MARKET_STORE_PATTERN
} from '@/enums';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination
  }
})
export default class MarketStoreList extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('space/updateStoreBusinessStatusById') private updateStoreBusinessStatusById!: (data: any) => ParamsType;

  @Action('space/queryStorePageList') private queryStorePageList!: (data: any) => ParamsType;

  // 营业状态
  private businessStatusList = MARKET_STORE_BUDINESS_STATUS;

  // 门店规模
  private scaleList = MARKET_STORE_SCALE;

  // 门店类型
  private storeTypeList = MARKET_STORE_TYPE;

  // 门店性质
  private storePatternList = MARKET_STORE_PATTERN;

  /** 列表 开始 */
  private searchForm = {
    inputList: [
      {
        label: '门店',
        key: 'storeCodeAndStoreName',
        clearable: true,
        type: 'text',
        value: '',
        width: 280,
        placeholder: '请输入门店名称，门店代码',
      }
    ],
    selectList: [
      // {
      //   label: '驾校',
      //   key: 'drivingSchoolId',
      //   value: '',
      //   placeholder: '请选择',
      //   multiple: false,
      //   clearable: true,
      //   options: [{
      //     label: '',
      //     id: null
      //   }]
      // },
      {
        label: '片区',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '营业状态',
        key: 'businessStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: this.businessStatusList
      },
      {
        label: '门店规模',
        key: 'scale',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: this.scaleList
      },
      {
        label: '门店类型',
        key: 'storeType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: this.storeTypeList
      },
      {
        label: '门店性质',
        key: 'pattern',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: this.storePatternList
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
      // {
      //   label: '新增门店',
      //   key: 'add',
      //   type: '',
      //   plain: false,
      //   path: 'btn_addstore'
      // }
    ]
  }

  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'add') {
      this.$router.push({ path: '/market/store/detail' });
    }
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 3,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
      {
        id: 1,
        label: '停业',
        type: 'warning',
        path: 'btn_closing'
      },
      {
        id: 2,
        label: '恢复营业',
        type: 'warning',
        path: 'btn_opening'
      },
    ],
    labels: [
      {
        key: 'code',
        label: '门店代码',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { code, id } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(id, '1');
              }
            }
          },
          code);
        }
      },
      {
        key: 'name',
        label: '门店名称',
        showOverflowTooltip: true,
      },
      {
        key: 'regionName',
        label: '所属片区',
        showOverflowTooltip: true,
      },
      {
        key: 'customerNumber',
        label: '客服人数',
        showOverflowTooltip: true,
      },
      {
        key: 'pattern',
        label: '门店性质',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { pattern } = params.row;
          if (!pattern) return h('div', '-');
          const _obj = JSON.parse(pattern);
          return h('div', `${_obj.label || ''}`);
        }
      },
      {
        key: 'scale',
        label: '门店规模',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { scale } = params.row;
          if (!scale) return h('div', '-');
          const _obj = JSON.parse(scale);
          return h('div', `${_obj.label || ''}`);
        }
      },
      {
        key: 'storeType',
        label: '门店类型',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { storeType } = params.row;
          if (!storeType) return h('div', '-');
          const _obj = JSON.parse(storeType);
          return h('div', `${_obj.label || ''}`);
        }
      },
      {
        key: 'area',
        label: '门店面积',
        showOverflowTooltip: true,
      },
      {
        key: 'rentPrice',
        label: '门店租金单价',
        width: 110,
      },
      {
        key: 'coachNumber',
        label: '教练人数',
      },
      {
        key: 'openingTime',
        label: '开业时间',
        sortable: 'custom',
        width: 110,
        showOverflowTooltip: true,
      },
      {
        key: 'businessStatus',
        label: '营业状态',
        render(h: any, params: any) {
          const { businessStatus } = params.row;
          if (!businessStatus) return h('div', '-');
          const _obj = JSON.parse(businessStatus);
          return h('div', `${_obj.label || ''}`);
        }
      }
    ],
    list: [],
    selectionList: [], // 选中的子项数组
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
      if (id === 1 || id === 2) {
        // 停业，恢复营业
        this.upDataStatusFunc(selectionList[0], id);
      }
      if (id === 3) {
        // 编辑
        this.jumpDetail(spaceId);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 列表 结束 */

  /** 业务处理 开始 */
  /**
   * 跳转
  */
  private jumpDetail(val: string, isEdit?: string): void {
    this.$router.push({ path: '/market/store/detail', query: { id: val, edit: isEdit } });
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      // if (type === 'driverSchool') {
      //   this.searchForm.selectList[0].options = _data;
      // }
      if (type === 'region') {
        this.searchForm.selectList[0].options = _data;
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
  /** 请求处理 */

  // 排序参数对象
  sortSearchFormDeep: any = {
    orderByType: 0, // 类型排序
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
    this.sortSearchForm.orderByType = returnStatusFunc(order);
    this.queryList();
  }

  /**
   * 请求门店列表
   */
  async queryList() {
    const { searchForm, paginationData, sortSearchForm } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
      ...sortSearchForm
    };
    const body = await this.queryStorePageList(sendData);
    if (body) {
      const {
        data, current, total
      } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }
    this.tableData.loading = false;
  }

  /**
   * 门店营业状态修改
   */
  async upDataStatusFunc(val: any, type: number) {
    const { id, businessStatus, revision } = val;
    const _businessStatus = JSON.parse(businessStatus);
    const _id = _businessStatus.id;
    // 相同状态判断
    if ((_id === '1' && type === 2) || (_id !== '1' && type === 1)) {
      if (_id === '2') {
        this.$message.warning('当前门店状态为待营业，无法停业');
      } else {
        this.$message.warning(`${type === 2 ? '当前状态已经是营业' : '当前状态已经是停业'}`);
      }
      return;
    }
    this.$confirm(`${_id === '1' ? '状态修改为停业' : '状态修改为营业'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      if (_id === '1') {
      // 营业改为停业
        _businessStatus.id = '0';
        _businessStatus.label = '停业';
      } else {
      // 非营业改为营业
        _businessStatus.id = '1';
        _businessStatus.label = '正常营业';
      }
      const sendData = {
        id,
        status: JSON.stringify(_businessStatus),
        revision
      };
      await this.updateStoreBusinessStatusById(sendData);
      this.$message.success('修改成功！');
      await this.queryList();
    });
  }

  async mounted() {
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    this.selectFunc('region', drivingSchoolId);
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
