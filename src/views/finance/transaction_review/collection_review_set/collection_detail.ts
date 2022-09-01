import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { Watch } from 'vue-property-decorator';
import { ParamsType, TableOptionsValue } from '@/type';
import { ORDER_PAY_TYPE, TRANSACTION_TYPE } from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import { deepClone, formatPrice } from '@/assets/js/common';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import { drawSearchForm } from '@/assets/js/search_table';

const tableLabels = [
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
    key: 'payType',
    label: '终端类型',
    render(h: any, params: any) {
      const { payType } = params.row;
      if (payType === undefined) return h('div', '');
      const list = ORDER_PAY_TYPE.filter(a => a.id === payType);
      return h('span', list[0] ? list[0].label : '');
    },
  },
  {
    key: 'payContent',
    label: '终端号',
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
    minWidth: 110,
  },
  {
    key: 'feeName',
    label: '费用类型',
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
  },
  {
    key: 'amount',
    label: '实收金额(元)',
  },
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
    key: 'payTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
];
const name = '招生收款明细';
@Component
export default class FinanceCollectionReviewSetCollection extends mixins(ctjtPaginationMixins, clearCacheMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('finance/queryColectionDetailList') private queryColectionDetailList!: (data: any) => ParamsType;

  @Action('finance/queryColectionDetailCount') private queryColectionDetailCount!: (data: any) => ParamsType;

  @Action('finance/queryColectionDetailExport') private queryColectionDetailExport!: (data: any) => any;

  @Action('finance/queryThirdFlowDetailList') private queryThirdFlowDetailList!: (data: any) => any;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  private localSearchForm: ParamsType = {
    inputList: [],
    selectList: [
      {
        label: '交易状态',
        key: 'tradingStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: TRANSACTION_TYPE,
      },
    ],
    checkedList: [],
    buttonList: []
  };

  /**
   * @description 初始化列表搜索项
   */
  private initSearch() {
    // 合并混入的公共搜索项，和本地的搜索项
    const { searchForm, localSearchForm } = this;
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
    const { drivingSchoolId } = this.userInfo;
    const { options } = this.searchForm.selectList[0];
    const defaultRegionId = options && options[0] ? options[0].id : '';
    this.searchForm.selectList[0].value = drivingSchoolId === '370' ? defaultRegionId : '';
    this.searchSelectChange({ value: defaultRegionId, key: 'regionId' });
  }

  formatPrice(val: number | string) {
    return formatPrice(val);
  }

  /**
   * @param { ParamsType } val 搜索项 下拉选中返回当前对象
   * @description 搜索组件 下拉项选中回调函数
   */
  private searchSelectChange(val: ParamsType) {
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

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [{
      id: 1,
      label: '导出',
      path: 'btn_export'
    }],
    labels: tableLabels,
    list: [],
    selectionList: [],
  };

  // 排序参数对象
  sortSearchFormDeep: any = {
    storeSort: 0, // 门店排序
    transactionSort: 0, // 第三方订单号排序
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
      case 'storeName':
        this.sortSearchForm.storeSort = returnStatusFunc(order);
        break;
      case 'transactionId':
        this.sortSearchForm.transactionSort = returnStatusFunc(order);
        break;
      default:
        break;
    }
    this.queryList();
  }

  /**
* @description 表格操作回调
*/
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 1) {
      // 导出
      this._exportData();
    }
  }

  /** 导出 */
  private async _exportData() {
    const {
      payType,
      account,
      beginDate,
      endDate,
      type,
    } = this.detailParams;
    const { searchForm, sortSearchForm } = this;
    const _data = drawSearchForm(searchForm);
    const fileName = type === 1 ? '招生收款金额明细汇总' : name;
    const sendData = {
      payType,
      account,
      beginDate,
      endDate,
      isExport: 1,
      ..._data,
      ...sortSearchForm
    };
    const body = await this.queryColectionDetailExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${fileName}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
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

  private contentLabel = '';

  private content = '';

  initTitleShow() {
    const { account, payType } = this.detailParams;
    if (payType !== undefined) {
      if (payType === 1) { // 第三方
        this.content = account;
        this.contentLabel = '收款渠道';
      } else if (payType === 2) { // pos
        this.content = account;
        this.contentLabel = 'pos终端号';
      } else if (payType === 3) { // 银行转账
        this.content = account;
        this.contentLabel = '收款账号';
      } else if (payType === 6) {
        this.content = '上缴现金';
        this.contentLabel = '收款渠道';
      }
    }
  }

  async queryList() {
    const {
      payType,
      account,
      beginDate,
      endDate,
    } = this.detailParams;
    const { searchForm, paginationData, sortSearchForm } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      payType,
      account,
      beginDate,
      endDate,
      current: paginationData.current,
      pageSize: paginationData.pageSize,
      ..._data,
      ...sortSearchForm
    };
    try {
      const body = await this.queryColectionDetailList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.getStaticData(sendData);
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 表格底部统计数据
  private staticData: any = { amountTotal: 0, orderTotal: 0 };

  /** 获取表格底部统计数据 */
  async getStaticData(sendData: any) {
    try {
      const body = await this.queryColectionDetailCount(sendData);
      this.staticData = body;
    } catch (error) {
      //
    }
  }

  async created() {
    this.tableData._this = this;
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      const { payType } = this.detailParams;
      const { drivingSchoolId } = this.userInfo;
      await this.queryRegionList(drivingSchoolId); // 如果是广仁需要默认绑定片区
      this.initSearch();
      this.queryList();
      const copySelect: any = deepClone(this.searchForm.selectList);
      const copyInput: any = deepClone(this.searchForm.inputList);
      if (payType === 1) { // 第三方付款
        const copy = deepClone(tableLabels);
        const newLables = [...copy,
          {
            key: 'recordPayTime',
            label: '流水交易时间',
            render(h: any, params: any) {
              const { recordPayTime } = params.row;
              if (!recordPayTime) return h('div', '');
              return h('div', dayjs(recordPayTime).format('YYYY-MM-DD'));
            }
          },
          {
            key: 'transactionId',
            label: '第三方订单号',
            minWidth: 100,
            sortable: 'custom',
            render(h: any, params: any) {
              const {
                transactionId,
                account,
              } = params.row;
              return h('el-link', {
                props: {
                  type: 'primary',
                  underline: false
                },
                on: {
                  click: () => {
                    params._self.tableData._this.openFlowDetail(transactionId);
                  }
                }
              }, transactionId);
            }
          },
          {
            key: 'diffAmount',
            label: '第三方订单号差异金额',
            minWidth: 110,
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
        ];
        this.tableData.labels = newLables;
        const newSlect = [...copySelect, {
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
        {
          label: '交易日期差异',
          key: 'isDiffTime',
          value: '',
          placeholder: '请选择',
          multiple: false,
          clearable: true,
          width: 120,
          options: [{
            id: 2,
            label: '无差异',
          },
          {
            id: 1,
            label: '有差异',
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
        ];
        const newInput = [...copyInput, {
          label: '第三方订单号',
          key: 'transactionId',
          type: 'text',
          value: '',
          width: 150,
          clearable: true,
        }];
        this.searchForm.selectList = newSlect;
        this.searchForm.inputList = newInput;
      } else {
        this.tableData.labels = tableLabels;
        this.searchForm.selectList = copySelect;
        this.searchForm.inputList = copyInput;
      }
    }
  }

  drawer = false;

  openFlowDetail(transactionId: string) {
    this.drawer = true;
    this.queryListDrawer(transactionId);
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
    ]
  }

  queryListDrawer(orderNo: string) {
    const sendData = { orderNo };
    this.queryThirdFlowDetailList(sendData).then((res: any) => {
      const { data } = res;
      this.drawerTableData.list = data;
    }).finally(() => {
      this.drawerTableData.loading = false;
    });
  }

  async activated() {
    this.initTitleShow();
    const permObj = await this.$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
  }
}
