import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { ORDER_PAY_TYPE, TRANSACTION_TYPE } from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import { deepClone, drivingSchool, formatPrice } from '@/assets/js/common';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';

const tableLabels = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'storeName',
    label: '门店',
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
    key: 'account',
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
    key: 'classesName',
    label: '班别/商品名称',
    minWidth: 100,
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
    key: 'seq',
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
  {
    key: 'receiptTimev',
    label: '流水交易时间',
    minWidth: 90,
    render(h: any, params: any) {
      const { receiptTime } = params.row;
      if (!receiptTime) return h('div', '');
      return h('div', dayjs(receiptTime).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'transactionId',
    label: '第三方订单号',
    minWidth: 110,
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
      const { isMatch, payType } = params.row;
      if (payType !== 1) return h('div', '');
      return h('div', isMatch === 0 ? '未匹配' : '已匹配');
    },
  },
];
const name = '收款明细';
@Component
export default class FinanceAllOrderDetail extends mixins(ctjtPaginationMixins, clearCacheMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('finance/queryAllOrderDetailList') private queryAllOrderDetailList!: (data: any) => ParamsType;

  @Action('finance/queryAllOrderTotal') private queryAllOrderTotal!: (data: any) => any;

  @Action('finance/queryAllOrderDetailListExport') private queryAllOrderDetailListExport!: (data: any) => any;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  formatPrice(val: number | string) {
    return formatPrice(val);
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

  /** 导出 */
  private async _exportData() {
    const {
      payType,
      account,
      tradingStatus,
      beginDate,
      endDate,
      type
    } = this.detailParams;
    const _type = type === 1 ? '汇总' : '';
    let _fileName = `实际应收金额${_type}明细`;
    if (tradingStatus === 2) _fileName = `招生结转金额${_type}明细`;
    if (tradingStatus === 1) _fileName = `未结转金额${_type}明细`;
    const sendData: any = {
      payType, account, tradingStatus, beginDate, endDate, isExport: 1
    };
    const body = await this.queryAllOrderDetailListExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${_fileName}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  async queryList() {
    const {
      payType,
      account,
      tradingStatus,
      beginDate,
      endDate,
    } = this.detailParams;
    const { current, pageSize } = this.paginationData;
    const sendData: any = {
      payType, account, tradingStatus, beginDate, endDate, current, pageSize
    };
    try {
      const body = await this.queryAllOrderDetailList(sendData);
      const { data, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.getStaticData();
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 表格底部统计数据
  private staticData: any = {};

  /** 获取表格底部统计数据 */
  async getStaticData() {
    const {
      payType, account, tradingStatus, beginDate, endDate,
    } = this.detailParams;
    const sendData: any = {
      account, tradingStatus, beginDate, endDate
    };
    try {
      const body = await this.queryAllOrderTotal(sendData);
      this.staticData = body;
    } catch (error) {
      //
      this.staticData = { amountTotal: 0, orderTotal: 0 };
    }
  }

  async activated() {
    this.tableData._this = this;
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
      const permObj = await this.$getPerm(this, this.tableData.options);
      this.tableData.options = permObj.tablePerm;
    }
  }
}
