import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { approveStatusOpt } from '@/views/workbench/_enums';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class WorkbenchProcessOverQueue extends mixins(ctjtPaginationMixins) {
  @Action('workbench/queryCoachChangeList') private queryCoachChangeList!: (data: any) => ParamsType;

  @Action('workbench/queryCoachVerifyCoachChange') private queryCoachVerifyCoachChange!: (data: any) => ParamsType;

  // 列表搜索项配置
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '申请单号',
        key: 'applyNo',
        type: 'text',
        value: '',
        width: 160,
        placeholder: '请输入申请单号',
        clearable: true,
      },
    ],
    datePickerList: [
      {
        label: '创建时间',
        keyArr: ['beginDate', 'endDate'],
        formatType: 'YYYY-MM-DD',
        value: '',
        placeholder: '请选择',
        type: 'daterange',
        rangeSeparator: '-',
      },
    ],
    selectList: [
      {
        label: '流程名称',
        key: 'flowName',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [
          {
            id: '教练新增申请',
            label: '教练新增申请'
          },
          {
            id: '教练信息修改申请',
            label: '教练信息修改申请'
          }
        ]
      }
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
      },
      {
        label: '重置',
        key: 'reset',
      },
    ]
  }

  // 列表搜索 操作按钮回调
  private searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    labels: [
      {
        key: 'applyNo',
        label: '申请单号',
      },
      {
        key: 'flowName',
        label: '流程名称',
        render(h: any, params: any) {
          const { applyNo, flowName } = params.row;
          const that = params._self.tableData._this;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                const _list = flowName.split('-');
                const { 0: text } = _list;
                that.drawerTiltle = text;
                that.jumpDetail(applyNo, '1');
              }
            }
          },
          flowName);
        }
      },
      {
        key: 'createdName',
        label: '创建人'
      },
      {
        key: 'createdTime',
        label: '创建时间'
      },
      {
        key: 'nextNode',
        label: '下一个节点'
      },
      {
        key: 'approver',
        label: '审批人'
      },
      {
        key: 'status',
        label: '当前状态',
        render(h: any, params: any) {
          return h('div', '审批中');
        }
      }
    ],
    list: [],
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 跳转详情
  private jumpDetail(id?: string) {
    if (id) {
      this.queryDetail(id);
      this.drawerShow = true;
    }
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

  private async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = { ..._data };
    this.tableData.loading = true;
    try {
      const body = await this.queryCoachChangeList(sendData);
      const {
        data, current, total
      } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (err) {
      this.tableData.loading = false;
    }
  }

  // 抽屉
  private drawerShow = false;

  private drawerTiltle = '';

  private drawerTableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    labels: [
      {
        key: 'verifyNode',
        label: '审批环节'
      },
      {
        key: 'verifyUser',
        label: '审核人'
      },
      {
        key: 'verifyOperation',
        label: '审核操作'
      },
      {
        key: 'verifyOpinion',
        label: '审核意见'
      },
      {
        key: 'verifyDate',
        label: '审核时间'
      },
    ],
    list: [],
  }

  private async queryDetail(applyNo: string) {
    const body = await this.queryCoachVerifyCoachChange({ applyNo });
  }

  async mounted() {
    this.tableData._this = this;
    this.queryList();
  }
}
