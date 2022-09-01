import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { setTableLabels, marginTableLabels } from '@/views/market/_common/common';
import { approveStatusOpts } from '@/views/market/_enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtSetField, CtjtCard
} from '@/components';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtSetField, CtjtCard
  }
})
export default class MarketOrderApprovalChange extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('order/queryApprovesList') private queryApprovesList!: (data: any) => ParamsType;

  // 弹窗名称
  private dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /**
   * @description 表格初始化设置
   */
  private initSetTableLabel() {
    const { tableLabelType } = this;
    const _originalLabelList = marginTableLabels(tableLabelType);
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(_originalLabelList, tableLabelType);
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  // 列表搜索项配置
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '关键词',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 280,
        placeholder: '请输入学员姓名、证件号码、手机号',
        clearable: true,
      },
    ],
    datePickerList: [
      {
        label: '申请时间',
        key: 'applyDate',
        value: '',
        type: 'date',
        placeholder: '请选择',
        width: 140,
      },
    ],
    selectList: [
      {
        label: '片区',
        key: 'regionId',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '门店',
        key: 'storeId',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '审核状态',
        key: 'auditStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 160,
        options: approveStatusOpts.filter((item: any) => item.id !== 2)
      },
    ],
    checkedList: [
      {
        key: 'isMe',
        value: true,
        label: '只看我审批',
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
      {
        label: '重置',
        key: 'reset',
        plain: false
      },
    ]
  }

  // 列表搜索 操作按钮回调
  private searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      if (key === 'reset') {
        this.searchForm.datePickerList[0].value = '';
        this.searchForm.selectList[1].options = [];
      }
      this.queryList();
    }
  }

  /** 搜索筛选框选择回调 */
  private async searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        const data = await this.queryGroupMechanismData({ pid: value });
        this.searchForm.selectList[1].options = data;
      }
    }
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    labels: [],
    list: [],
    selectionList: []
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 跳转详情
  private jumpDetail(id: string, orderId: string, auditStatus: number) {
    this.$router.push({ path: '/market/order_approval/change/detail', query: { id, orderId, auditStatus: String(auditStatus) } });
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
    const sendData = {
      ..._data,
      type: 3
    };
    const body = await this.queryApprovesList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
  }

  private async initSearch() {
    const { drivingSchoolId } = this.userInfo;
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.searchForm.selectList[0].options = data;
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'MARKET_ORDER_APPROVAL_CHANGE_LIST_LABEL';
    // this.queryList();
    this.initSetTableLabel();
    this.initSearch();
  }

  async activated() {
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
