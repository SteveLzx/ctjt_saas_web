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
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, TableOptionsValue } from '@/type';
import { MARKET_ACTIVITIES_STATUS } from '@/enums';
import { drawSearchForm } from '@/assets/js/search_table';
import { spliceHoursAndMinutesAndSeconds, timestampSizeCompare } from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class MarketActivitiesList extends mixins(ctjtPaginationMixins) {
  @Action('sale/queryActivityPageList') private queryActivityPageList!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  /** 表单搜索 开始 */
  private searchForm = {
    inputList: [
      {
        label: '活动名称',
        key: 'name',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入活动名称',
      },
    ],
    selectList: [
      {
        label: '活动状态',
        key: 'status',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_ACTIVITIES_STATUS
      },
    ],
    datePickerList: [
      {
        label: '活动时间',
        key: 'beginDate',
        value: '',
        placeholder: '请选择',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        placeholder: '请选择',
        type: 'date',
        width: 140,
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      }
    ]
  }

  // 点击搜索回调方法
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  private jumpDetail(val?: string, type?: string) {
    this.$router.push({ path: '/market/market_manage/activities_set/detail', query: { id: val, isEdit: type } });
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
        id: 2,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 1,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
    ],
    labels: [
      {
        key: 'name',
        label: '活动名称',
        fixed: true,
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { name, id } = params.row;
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
          name);
        }
      },
      {
        key: 'code',
        label: '活动代码',
        showOverflowTooltip: true,
      },
      {
        key: 'activityClassesQueryListDto',
        label: '适用班别',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { activityClassesQueryListDto } = params.row;
          if (Array.isArray(activityClassesQueryListDto)) {
            const _list: string[] = [];
            activityClassesQueryListDto.forEach((item: any) => {
              _list.push(item.classesName);
            });
            const _text = _list.join('，');
            return h('el-popover', {
              props: {
                placement: 'top-start',
                width: '300',
                trigger: 'hover',
                content: _text,
              },
              scopedSlots: {
                reference: () => h('p', _text),
              },
            });
          }
          return h('-');
        }
      },
      {
        key: 'activityRegionQueryListDto',
        label: '适用门店',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { activityRegionQueryListDto } = params.row;
          if (Array.isArray(activityRegionQueryListDto)) {
            const _list: string[] = [];
            activityRegionQueryListDto.forEach((item: any) => {
              _list.push(item.storeName);
            });
            const _text = _list.join('，');
            return h('el-popover', {
              props: {
                placement: 'top-start',
                width: '300',
                trigger: 'hover',
                content: _text,
              },
              scopedSlots: {
                reference: () => h('p', _text),
              },
            });
          }
          return h('span', '-');
        }
      },
      {
        key: 'endDate',
        label: '活动起止时间',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { beginDate, endDate } = params.row;
          return h('span', `${beginDate || ''} / ${endDate || ''}`);
        }
      },
      {
        key: 'recruitNumber',
        label: '已招生人数',
        width: 100
      },
      {
        key: 'createdName',
        label: '添加人',
      },
      {
        key: 'createdTime',
        label: '添加时间',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { createdTime } = params.row;
          if (createdTime) {
            return h('span', params._self.tableData._this.$dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
          }
          return h('-');
        }
      },
      {
        key: 'status',
        label: '活动状态',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_ACTIVITIES_STATUS;
          const _arr = _list.filter((item: any) => item.id === status);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        }
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
  }

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 2) {
      this.jumpDetail();
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      const spaceId: string = selectionList[0].id;
      if (id === 1) {
        // 编辑
        this.jumpDetail(spaceId, '');
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

  /** 请求处理 */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const { drivingSchoolId } = this.userInfo;
    const sendData = {
      ..._data,
      drivingSchoolId
    };
    const body = await this.queryActivityPageList(sendData);
    const {
      data, current, total
    } = body;
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
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
</script>
