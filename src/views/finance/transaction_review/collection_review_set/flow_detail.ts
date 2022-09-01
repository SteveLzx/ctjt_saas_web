import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { deepClone, drivingSchool } from '@/assets/js/common';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  RECORD_STATUS, TRANSACTION_TYPE,
} from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

// 宝安深港才有标记状态，未来根据驾校来处理
const tableOptionList = [
  {
    id: 1,
    label: '标记为代收',
    type: 'primary',
    path: 'btn_bjwds'
  },
  {
    id: 2,
    label: '取消标记',
    type: 'warning',
    path: 'btn_qxbj'
  },
  {
    id: 10,
    label: '导出',
    path: 'btn_export'
  },
];
const posTableLabels = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'storeName',
    label: '门店',
  },
  {
    key: 'company',
    label: 'pos公司',
  },
  {
    key: 'bankAccount',
    label: '刷卡银行账号',
    minWidth: 100,
  },
  {
    key: 'bank',
    label: '发卡银行',

  },
  {
    key: 'refNum',
    label: '交易参考号',
    minWidth: 100,
  },
  {
    key: 'orderNo',
    label: '商户订单号',
    minWidth: 110,
  },
  {
    key: 'amount',
    label: '交易金额(元)',
  },

  {
    key: 'payTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  // 宝安深港才有标记状态，未来根据驾校来处理
  // {
  //   key: 'isCollection',
  //   label: '标记状态',
  //   render(h: any, params: any) {
  //     const { isCollection } = params.row;
  //     if (isCollection === undefined) return h('div', '');
  //     const list = RECORD_STATUS.filter(a => a.id === isCollection);
  //     return h('span', list ? list[0].label : '');
  //   },
  // },
  {
    key: 'status',
    label: '交易状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = TRANSACTION_TYPE.filter(a => a.id === status);
      return h('span', list ? list[0].label : '');
    },
  }
];

// 银行转账
const bankTableLabels = [
  {
    key: 'payNo',
    label: '付款账号',
  },
  {
    key: 'collectionBankName',
    label: '开户机构',
  },
  {
    key: 'payAmount',
    label: '交易金额(元)',
  },
  {
    key: 'payTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'remark',
    label: '备注',
    render(h: any, params: any) {
      const { remark } = params.row;
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: remark,
        },
        scopedSlots: {
          reference: () => h('p', remark),
        },
      });
    }
  },
  // 宝安深港才有标记状态，未来根据驾校来处理
  // {
  //   key: 'isCollection',
  //   label: '标记状态',
  //   render(h: any, params: any) {
  //     const { isCollection } = params.row;
  //     if (isCollection === undefined) return h('div', '');
  //     const list = RECORD_STATUS.filter(a => a.id === isCollection);
  //     return h('span', list ? list[0].label : '');
  //   },
  // },
  {
    key: 'status',
    label: '交易状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = TRANSACTION_TYPE.filter(a => a.id === status);
      return h('span', list ? list[0].label : '');
    },
  }
];

// 第三方
const thirdTableLabels = [
  {
    key: 'orderNo',
    label: '订单号/券码',
    render(h: any, params: any) {
      const { orderNo } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.openOrderDetail(orderNo);
          }
        }
      }, orderNo);
    }
  },
  {
    key: 'payAmount',
    label: '交易金额(元)',
  },
  {
    key: 'diffAmount',
    label: '差异金额(元)',
  },
  {
    key: 'payTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  // 宝安深港才有标记状态，未来根据驾校来处理
  // {
  //   key: 'isCollection',
  //   label: '标记状态',
  //   render(h: any, params: any) {
  //     const { isCollection } = params.row;
  //     if (isCollection === undefined) return h('div', '');
  //     const list = RECORD_STATUS.filter(a => a.id === isCollection);
  //     return h('span', list ? list[0].label : '');
  //   },
  // },
  {
    key: 'status',
    label: '交易状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = TRANSACTION_TYPE.filter(a => a.id === status);
      return h('span', list ? list[0].label : '');
    },
  },
  {
    key: 'isMatch',
    label: '匹配状态',
    render(h: any, params: any) {
      const { isMatch } = params.row;
      return h('div', isMatch === 0 ? '未匹配' : '已匹配');
    },
  },
];
// 第三方-广仁
const thirdTableLabelsGuangren = [
  {
    key: 'orderNo',
    label: '订单号/券码',
    render(h: any, params: any) {
      const { orderNo } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.openOrderDetail(orderNo);
          }
        }
      }, orderNo);
    }
  },
  {
    key: 'payAmount',
    label: '交易金额(元)',
  },
  {
    key: 'diffAmount',
    label: '差异金额(元)',
  },
  {
    key: 'payTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'receiptDate',
    label: '票据日期',
    render(h: any, params: any) {
      const { receiptDate } = params.row;
      if (!receiptDate) return h('div', '');
      return h('div', dayjs(receiptDate).format('YYYY-MM-DD'));
    }
  },
  // 宝安深港才有标记状态，未来根据驾校来处理
  // {
  //   key: 'isCollection',
  //   label: '标记状态',
  //   render(h: any, params: any) {
  //     const { isCollection } = params.row;
  //     if (isCollection === undefined) return h('div', '');
  //     const list = RECORD_STATUS.filter(a => a.id === isCollection);
  //     return h('span', list ? list[0].label : '');
  //   },
  // },
  {
    key: 'status',
    label: '交易状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = TRANSACTION_TYPE.filter(a => a.id === status);
      return h('span', list ? list[0].label : '');
    },
  },
  {
    key: 'isMatch',
    label: '匹配状态',
    render(h: any, params: any) {
      const { isMatch } = params.row;
      return h('div', isMatch === 0 ? '未匹配' : '已匹配');
    },
  },
];

// 上缴现金
const moneyTableLabels = [
  {
    key: 'userName',
    label: '学员姓名',
  },
  {
    key: 'idNo',
    label: '证件号码',
  },
  {
    key: 'orderSeq',
    label: '订单号',
  },
  {
    key: 'payAmount',
    label: '交易金额(元)',
  },
  {
    key: 'payTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  // 宝安深港才有标记状态，未来根据驾校来处理
  // {
  //   key: 'isCollection',
  //   label: '标记状态',
  //   render(h: any, params: any) {
  //     const { isCollection } = params.row;
  //     if (isCollection === undefined) return h('div', '');
  //     const list = RECORD_STATUS.filter(a => a.id === isCollection);
  //     return h('span', list ? list[0].label : '');
  //   },
  // },
  {
    key: 'status',
    label: '交易状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = TRANSACTION_TYPE.filter(a => a.id === status);
      return h('span', list ? list[0].label : '');
    }
  },
  {
    key: 'remark',
    label: '备注',
    render(h: any, params: any) {
      const { remark } = params.row;
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: remark,
        },
        scopedSlots: {
          reference: () => h('p', remark),
        },
      });
    },
  },
];

@Component
export default class FinanceCollectionReviewSetFlow extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('finance/queryPosFlowDetailList') private queryPosFlowDetailList!: (data: any) => ParamsType;

  @Action('finance/queryPosFlowDetailListExport') private queryPosFlowDetailListExport!: (data: any) => ParamsType;

  @Action('finance/queryBankFlowDetailList') private queryBankFlowDetailList!: (data: any) => ParamsType;

  @Action('finance/queryBankFlowDetailListExport') private queryBankFlowDetailListExport!: (data: any) => ParamsType;

  @Action('finance/queryThirdFlowDetailList') private queryThirdFlowDetailList!: (data: any) => ParamsType;

  @Action('finance/queryThirdFlowDetailListExport') private queryThirdFlowDetailListExport!: (data: any) => ParamsType;

  @Action('finance/queryCashFlowDetailList') private queryCashFlowDetailList!: (data: any) => ParamsType;

  @Action('finance/queryCashFlowDetailListExport') private queryCashFlowDetailListExport!: (data: any) => ParamsType;

  @Action('finance/flowDetailMark') private flowDetailMark!: (data: any) => ParamsType;

  @Action('finance/queryTransactionListByOrderNo') private queryTransactionListByOrderNo!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 列表搜索项配置
  private publicForm: ParamsType = {
    inputList: [
      {
        label: '交易金额',
        key: 'amount',
        type: 'number',
        value: undefined,
        controls: false,
        width: 200,
        placeholder: '',
        clearable: true,
        hasZero: true,
      },
    ],
    selectList: [
      {
        label: '交易状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: TRANSACTION_TYPE,
      },
      // 宝安深港才有标记状态，未来根据驾校来处理
      // {
      //   label: '标记状态',
      //   key: 'isCollection',
      //   value: '',
      //   placeholder: '请选择',
      //   multiple: false,
      //   clearable: true,
      //   width: 120,
      //   options: RECORD_STATUS,
      // },
    ],
    checkedList: [],
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
        type: '',
        plain: false,
        path: 'btn_search'
      }
    ]
  }

  private searchForm: ParamsType = deepClone(this.publicForm)

  // pos列表搜索项配置
  private posSearchForm: ParamsType = {
    inputList: [
      {
        label: '商户订单号',
        key: 'orderNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
      {
        label: '交易参考号',
        key: 'refNum',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
    ],
    selectList: [],
    checkedList: [],
    buttonList: [],
  }

  // 银行转账列表搜索项配置
  private bankSearchForm: ParamsType = {
    inputList: [
      {
        label: '付款账号',
        key: 'payNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
    ],
    selectList: [],
    checkedList: [],
    buttonList: [],
  }

  // 第三方列表搜索项配置
  private thirdSearchForm: ParamsType = {
    inputList: [
      {
        label: '订单号/券码',
        key: 'orderNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '匹配状态',
        key: 'isMatch',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: [{
          id: 0,
          label: '未匹配',
        },
        {
          id: 1,
          label: '已匹配',
        }],
      },
      // {
      //   label: '差异金额',
      //   key: 'isDiffAmount',
      //   value: '',
      //   placeholder: '请选择',
      //   multiple: false,
      //   clearable: true,
      //   width: 120,
      //   options: [{
      //     id: 0,
      //     label: '不为0',
      //   },
      //   {
      //     id: 1,
      //     label: '为0',
      //   }],
      // }
    ],
    checkedList: [],
    buttonList: [],
  }

  // 上缴现金列表搜索项配置
  private moneySearchForm: ParamsType = {
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '请输入学员姓名、证件号码、订单号',
        clearable: true,
      },
    ],
    selectList: [],
    checkedList: [],
    buttonList: [],
  }

  private contentLabel = '';

  private content = '';

  initTitleShow(payType: number) {
    if (payType !== undefined) {
      const { account } = this.detailParams;
      if (payType === 1) { // 第三方
        this.content = account;
        this.contentLabel = '收款渠道';
      } else if (payType === 2) { // pos
        this.content = account;
        this.contentLabel = 'pos终端号';
      } else if (payType === 3) { // 银行转账
        this.content = account;
        this.contentLabel = '收款账号';
      } else if (payType === 6) { // id === 6 上缴现金
        this.content = '上缴现金';
        this.contentLabel = '收款渠道';
      }
    }
  }

  /**
  * @description 表格初始化设置
  */
  private initSetTableLabel(payType: number) {
    if (payType !== undefined) {
      if (payType === 1) { // 第三方
        const { drivingSchoolId } = this.userInfo;
        this.tableData.labels = drivingSchool(drivingSchoolId) === 'guangren' ? thirdTableLabelsGuangren : thirdTableLabels;
      } else if (payType === 2) { // pos
        this.tableData.labels = posTableLabels;
      } else if (payType === 3) { // 银行转账
        this.tableData.labels = bankTableLabels;
      } else if (payType === 6) { // id === 6 上缴现金
        this.tableData.labels = moneyTableLabels;
      }
    }
  }

  /**
    * @description 初始化列表搜索项
    */
  private initSearch(payType: number) {
    // 合并混入的公共搜索项，和本地的搜索项
    this.searchForm = deepClone((this as any)._data.publicForm);
    const {
      searchForm,
      posSearchForm,
      bankSearchForm,
      thirdSearchForm,
      moneySearchForm
    } = this;
    let localSearchForm: ParamsType = {};
    if (payType !== undefined) {
      if (payType === 1) { // 第三方
        localSearchForm = thirdSearchForm;
      } else if (payType === 2) { // pos
        localSearchForm = posSearchForm;
      } else if (payType === 3) { // 银行转账
        localSearchForm = bankSearchForm;
      } else if (payType === 6) { // id === 6 上缴现金
        localSearchForm = moneySearchForm;
      }
    }
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
  }

  /**
  * @description 列表搜索 操作按钮回调
*/
  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.querFirstPageList();
    }
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: tableOptionList,
    labels: [],
    list: [],
    selectionList: [],
  };

  /**
 * @description 表格操作回调
 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const hasApproval = selectionList.filter((a: any) => a.status === TRANSACTION_TYPE[1].id).length > 0; // 存在已结转数据
    const hasRecord = selectionList.filter((a: any) => a.isCollection === RECORD_STATUS[1].id).length > 0; // 存在已标记数据
    const hasNoRecord = selectionList.filter((a: any) => a.isCollection === RECORD_STATUS[0].id).length > 0; // 存在未标记数据
    if (id === 1) {
      // 标记代收
      // 交易状态==已结转 or 标记状态==已标记 的数据时，提示“已结转或已标记的数据均不可标记，请重新选择”
      if (_len >= 1) {
        if (hasApproval || hasRecord) this.$message.warning('已结转或已标记的数据均不可标记，请重新选择!');
        else this._recordFun(selectionList, 1);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 2) {
      // 取消标记
      // 交易状态==已结转 or 标记状态==未标记 的数据时，均提示“已结转或未标记的数据均不可取消标记，请重新选择”
      if (_len >= 1) {
        if (hasApproval || hasNoRecord) this.$message.warning('已结转或未标记的数据均不可取消标记，请重新选择!');
        else this._recordFun(selectionList, 0);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 10) {
      // 导出
      this._exportData();
    }
  }

  /** 导出 */
  private async _exportData() {
    const {
      payType, account, beginDate, endDate,
    } = this.detailParams;
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData: any = {
      ..._data, account, beginDate, endDate, isExport: 1
    };

    let body: any = {};
    if (payType === 1) body = await this.queryThirdFlowDetailListExport(sendData);
    if (payType === 2) body = await this.queryPosFlowDetailListExport(sendData);
    if (payType === 3) body = await this.queryBankFlowDetailListExport(sendData);
    if (payType === 6) {
      delete sendData.account;
      body = await this.queryCashFlowDetailListExport(sendData);
    }
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `招生流水明细${this.$dayjs(new Date()).format('YYYYMMDD')}`);
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

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 标记/取消标记 */
  private _recordFun(selectionList: any, collectType: any) {
    const _msg = collectType === 1 ? '标记为代收' : '取消标记';
    const ids: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      ids.push(_item.id);
    });
    const { payType } = this.detailParams;
    const sendData = {
      ids,
      isCollection: collectType,
      type: payType
    };
    this.$confirm(`确定${_msg}？`, `${_msg}`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.flowDetailMark(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success(`${_msg}成功！`);
      });
    }).catch(() => {
      this.$message.info(`已取消${_msg}`);
    });
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const {
      payType, account, beginDate, endDate,
    } = this.detailParams;
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData: any = {
      ..._data, account, beginDate, endDate,
    };

    try {
      let body: any = {};
      if (payType === 1) body = await this.queryThirdFlowDetailList(sendData);
      if (payType === 2) body = await this.queryPosFlowDetailList(sendData);
      if (payType === 3) body = await this.queryBankFlowDetailList(sendData);
      if (payType === 6) {
        delete sendData.account;
        body = await this.queryCashFlowDetailList(sendData);
      }
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  drawer = false;

  /** 打开订单明细弹出框 */
  openOrderDetail(orderNo: string) {
    this.queryListDrawer(orderNo);
    this.drawer = true;
  }

  // 表格配置
  private drawerTableData: ParamsType = {
    loading: true,
    selection: false,
    index: true,
    list: [],
    selectionList: [],
    options: [],
    labels: [
      {
        key: 'regionName',
        label: '片区',
      },
      {
        key: 'storeName',
        label: '门店',
        sortable: 'custom',
      },
      {
        key: 'userName',
        label: '学员姓名',
      },
      {
        key: 'idNo',
        label: '证件号码',
      },
      {
        key: 'orderType',
        label: '订单类型',
        render(h: any, params: any) {
          const { orderType } = params.row;
          if (orderType === undefined) return h('div', '');
          const orderTypeOption = [{
            id: 1,
            label: '招生订单',
          },
          {
            id: 2,
            label: '散学订单',
          },
          {
            id: 3,
            label: '其他订单',
          }
          ];
          const list = orderTypeOption.filter(a => a.id === orderType);
          return h('span', list ? list[0].label : '');
        },
      },
      {
        key: 'productName',
        label: '班别/商品名称',
        minWidth: 100,
        showOverflowTooltip: true,
      },
      {
        key: 'feeName',
        label: '费用类型',
        showOverflowTooltip: true,
      },
      {
        key: 'receipt',
        label: '收据编号',
      },
      {
        key: 'orderSeq',
        label: '订单号',
      },
      {
        key: 'salePrice',
        label: '订单金额(元)',
        minWidth: 110,
      },
      {
        key: 'amount',
        label: '实收金额(元)',
        minWidth: 110,
      },
      {
        key: 'payTime',
        label: '交易时间',
        render(h: any, params: any) {
          const { payTime } = params.row;
          if (!payTime) return h('div', '');
          return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      // {
      //   key: 'flowPayTime',
      //   label: '流水交易时间',
      //   render(h: any, params: any) {
      //     const { flowPayTime } = params.row;
      //     if (!flowPayTime) return h('div', '');
      //     return h('div', dayjs(flowPayTime).format('YYYY-MM-DD'));
      //   }
      // },
      {
        key: 'tradingStatus',
        label: '交易状态',
        render(h: any, params: any) {
          const { tradingStatus } = params.row;
          if (tradingStatus === undefined) return h('div', '');
          const list = TRANSACTION_TYPE.filter(a => a.id === tradingStatus);
          return h('span', list ? list[0].label : '');
        },
      },
      {
        key: 'transactionId',
        label: '第三方订单号',
        minWidth: 110,
        sortable: 'custom',
      },
      {
        key: 'diffAmount',
        label: '第三方订单号差异金额',
        minWidth: 140,
      },
      {
        key: 'remark',
        label: '备注',
        render(h: any, params: any) {
          const { remark } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remark,
            },
            scopedSlots: {
              reference: () => h('p', remark),
            },
          });
        },
      },
      {
        key: 'isMatch',
        label: '匹配状态',
        render(h: any, params: any) {
          const { isMatch } = params.row;
          return h('div', isMatch === 0 ? '未匹配' : '已匹配');
        },
      },
      {
        key: 'status',
        label: '券码使用状态',
        minWidth: 110,
        render(h: any, params: any) {
          const { status } = params.row;
          const statusArry = [
            {
              id: 1,
              label: '待确认'
            },
            {
              id: 2,
              label: '已使用'
            },
            {
              id: 11,
              label: '已作废'
            },
            {
              id: 99,
              label: '已删除'
            },
          ];
          const _list = statusArry.filter((a:any) => a.id === status);
          return h('div', _list && _list[0] ? _list[0].label : '');
        },
      },
    ]
  }

  queryListDrawer(transactionId: string) {
    this.queryTransactionListByOrderNo({ transactionId }).then((res: any) => {
      this.drawerTableData.list = res;
    }).finally(() => {
      this.drawerTableData.loading = false;
    });
  }

  created() {
    this.tableData._this = this;
  }

  async activated() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      const { payType } = this.detailParams;
      this.queryList();
      this.initSearch(payType);
      this.initSetTableLabel(payType);
      this.initTitleShow(payType);
      const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
      this.tableData.options = permObj.tablePerm;
      this.searchForm.buttonList = permObj.searchPerm;
    }
  }
}
