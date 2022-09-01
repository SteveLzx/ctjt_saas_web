<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { REG_MAX_ZERO_ONE_FLOAT_NUMBER } from '@/assets/js/common';
import { MARKET_ACTIVITIES_SET_STATUS } from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
  },
})
export default class MarketCxPjHoursList extends mixins(ctjtPaginationMixins) {
  @Action('sale/queryClassHoursList') private queryClassHoursList!: (
    data: any
  ) => ParamsType;

  @Action('sale/createClassHours') private createClassHours!: (
    data: any
  ) => ParamsType;

  @Action('sale/updateClassHoursStatus') private updateClassHoursStatus!: (
    data: any
  ) => ParamsType;

  @Action('sale/deleteClassHoursData') private deleteClassHoursData!: (
    data: any
  ) => ParamsType;

  /** 表单搜索 开始 */
  private searchForm = {
    inputList: [],
    selectList: [
      {
        label: '状态',
        key: 'status',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_ACTIVITIES_SET_STATUS,
      },
    ],
    datePickerList: [],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search',
      },
    ],
  };

  // 点击搜索回调方法
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  /** 表单搜索 结束 */

  /** 列表配置 开始 */
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '新增',
        path: 'btn_add',
      },
      {
        id: 2,
        label: '停用',
        type: 'warning',
        path: 'btn_disable',
      },
      {
        id: 3,
        label: '启用',
        type: 'success',
        path: 'btn_enable',
      },
      {
        id: 4,
        label: '删除',
        type: 'danger',
        path: 'btn_delete',
      },
    ],
    labels: [
      {
        key: 'timeLength',
        label: '赠送学时(h)',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { timeLength } = params.row;
          if (!timeLength || timeLength === undefined) return h('div', '');
          // const hours
          return h('div', timeLength / 60);
        },
      },
      {
        key: 'status',
        label: '状态',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_ACTIVITIES_SET_STATUS;
          const _arr = _list.filter((item: any) => item.id === status);
          return h('div', _arr && _arr[0] ? _arr[0].label : '');
        },
      },
      {
        key: 'createdTime',
        label: '创建日期',
        render(h: any, params: any) {
          const { createdTime } = params.row;
          if (!createdTime || createdTime === undefined) return h('div', '');
          return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
        },
      },
      {
        key: 'createdName',
        label: '创建人',
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
  };

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    // 新增
    if (id === 1) {
      this._addHours();
    }
    if (id === 2) {
      // 停用
      if (_len >= 1) {
        this._changeStatusFunc(selectionList, 2);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 3) {
      // 启用
      if (_len >= 1) {
        this._changeStatusFunc(selectionList, 1);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 4) {
      // 删除
      if (_len > 1) this.$message.warning('只能单选一项进行操作！');
      if (_len === 0) this.$message.warning('请先勾选数据!');
      if (_len === 1) {
        this._deleteFunc(selectionList[0]);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }
  /** 列表配置 结束 */

  /** 列表分页 开始 */

  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  /** 列表分页 结束 */

  /** 新增学时 */
  private _addHours() {
    this.$prompt('*赠送学时（h）', '新增', {
      confirmButtonText: '添加',
      cancelButtonText: '取消',
      inputPattern: REG_MAX_ZERO_ONE_FLOAT_NUMBER,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(Number(val) >= 100);
      },
      inputErrorMessage: '请输入最多保留一位小数的大于0小于100的数值',
      inputPlaceholder: '请填写可赠送的学时数',
      inputType: 'text',
    })
      .then((val: any) => {
        const sendData = {
          timeLength: Number(val.value.trim()),
        };
        this.createClassHours(sendData).then((res: any) => {
          this.$message.success('保存成功');
          this.paginationData.current = 1;
          this.queryList();
        });
      })
      .catch((error: any) => {
        this.$message.info('已取消新增');
      });
  }

  /** @description 启用/停用 */
  _changeStatusFunc(selectionList: any, status: number) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        id: _item.id,
        status,
      };
      sendData.push(data);
    });
    this.updateClassHoursStatus(sendData)
      .then(() => {
        const _msg = status === 1 ? '启用' : '停用';
        this.$message.success(`学时已${_msg}！`);
      })
      .finally(() => {
        this.paginationData.current = 1;
        this.queryList();
      });
  }

  /** @description 删除 */
  _deleteFunc(item: any) {
    const sendData = { id: item.id };
    this.deleteClassHoursData(sendData)
      .then(() => {
        this.$message.success('学时已删除！');
      })
      .finally(() => {
        this.paginationData.current = 1;
        this.queryList();
      });
  }

  /** 请求处理 */
  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const body = await this.queryClassHoursList(sendData);
    const { data, current, total } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
</script>
