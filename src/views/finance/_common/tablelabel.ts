import dayjs from 'dayjs';
import { formatPrice, jsAddFunc } from '@/assets/js/common';
import {
  ORDER_TYPE, INVOICE_TYPE,
  SYS_FLOW_TRANSACTION_TYPE,
  TRANSACTION_TYPE, POS_STATUS, POS_TYPE,
  SUBJECT, VERIFY_STRTUS,
  REVIEW_STATUS,
  FEE_TYPE,
  ORDER_PAY_TYPE,
  SHENHE_STATUS,
  INVOICING_TYPE,
  IN_LIBRARY_STATUS,
  ORDER_PAYMENT_TYPE,
  CANCEL_STATUS
} from '@/enums';

// 系统交易流水管理列表
const SYSTEM_FLOW_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
    fixed: 'left'
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
    fixed: 'left'
  },
  // {
  //   key: 'storePattern',
  //   label: '门店性质',
  //   showOverflowTooltip: true,
  //   fixed: 'left'
  // },
  {
    key: 'userName',
    label: '姓名',
    fixed: 'left'
  },
  {
    key: 'registrationTime',
    label: '报名日期',
    fixed: 'left',
    render(h: any, params: any) {
      const { registrationTime } = params.row;
      if (!registrationTime) return h('div', '');
      return h('div', dayjs(registrationTime).format('YYYY-MM-DD HH:mm:ss'));
    }
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
    key: 'orderType',
    label: '订单类型',
    render(h: any, params: any) {
      const { orderType } = params.row;
      if (orderType === undefined) return h('div', '');
      const list = ORDER_TYPE.filter(item => item.id === orderType);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'isInstallment',
    label: '缴费类型',
    render(h: any, params: any) {
      const { isInstallment } = params.row;
      const _payTypeList = ORDER_PAYMENT_TYPE;
      const _list = _payTypeList.filter(item => item.id === isInstallment);
      if (_list.length === 0) return h('div', '-');
      return h('div', `${_list[0].label}`);
    }
  },
  {
    key: 'receipt',
    label: '收据编号',
    render(h: any, params: any) {
      const {
        orderId, payId, orderType, receipt
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({ orderId, payId, orderType }, true);
          }
        }
      }, receipt);
    }
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
    key: 'classesName',
    label: '班别/商品名称',
    minWidth: 150,
    showOverflowTooltip: true
  },
  {
    key: 'totalPeriod',
    label: '散学总学时',
    minWidth: 110,
  },
  {
    key: 'salePrice',
    label: '订单金额',
    isPrice: true
  },
  {
    key: 'amount',
    label: '实收金额',
    isPrice: true
  },
  {
    key: 'invoiceAmount',
    label: '发票金额',
    isPrice: true
  },
  {
    key: 'feeName',
    label: '费用科目',
    showOverflowTooltip: true
  },
  {
    key: 'registerFee',
    label: '已扣代缴注册费',
    minWidth: 120,
    isPrice: true
  },
  {
    key: 'invoiceUsedAmount',
    label: '已开发票金额',
    minWidth: 110,
    isPrice: true
  },
  {
    key: 'invoiceName',
    label: '发票名称',
  },
  {
    key: 'invoiceMedium',
    label: '发票介质',
    render(h: any, params: any) {
      const { invoiceMedium } = params.row;
      const invoiceMediumList = [{
        id: 1,
        label: '',
      },
      {
        id: 2,
        label: '电子票',
      },
      {
        id: 3,
        label: '无',
      }];
      if (invoiceMedium === undefined) return h('div', '');
      const list = invoiceMediumList.filter(item => item.id === invoiceMedium);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'invoiceStatus',
    label: '发票状态',
    render(h: any, params: any) {
      const { invoiceStatus } = params.row;
      if (invoiceStatus === undefined) return h('div', '');
      const list = INVOICE_TYPE.filter(item => item.id === invoiceStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'invoiceNo',
    label: '发票号',
  },
  {
    key: 'batchNo',
    label: '批次号',
  },
  {
    key: 'tradingStatus',
    label: '交易状态',
    render(h: any, params: any) {
      const { tradingStatus } = params.row;
      if (tradingStatus === undefined) return h('div', '');
      const list = SYS_FLOW_TRANSACTION_TYPE.filter(item => item.id === tradingStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'studentStatus',
    label: '在库状态',
    render(h: any, params: any) {
      const { studentStatus } = params.row;
      if (studentStatus === undefined) return h('div', '');
      const list = IN_LIBRARY_STATUS.filter(item => item.id === studentStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'carryoverTime',
    label: '结转时间',
    render(h: any, params: any) {
      const { carryoverTime } = params.row;
      if (!carryoverTime) return h('div', '');
      return h('div', dayjs(carryoverTime).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'reviewStatus',
    label: '现金复核状态',
    minWidth: 110,
    render(h: any, params: any) {
      const { reviewStatus } = params.row;
      if (reviewStatus === undefined) return h('div', '');
      const list = REVIEW_STATUS.filter(item => item.id === reviewStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'reviewTime',
    label: '现金复核时间',
    minWidth: 110,
    render(h: any, params: any) {
      const { reviewTime } = params.row;
      if (!reviewTime) return h('div', '');
      return h('div', dayjs(reviewTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
];
// 代收交易流水
const COLLECTION_FLOW_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'storePattern',
    label: '门店性质',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
  },
  {
    key: 'registrationTime',
    label: '报名日期',
    render(h: any, params: any) {
      const { registrationTime } = params.row;
      if (!registrationTime) return h('div', '');
      return h('div', dayjs(registrationTime).format('YYYY-MM-DD HH:mm:ss'));
    }
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
    key: 'orderType',
    label: '订单类型',
    render(h: any, params: any) {
      const { orderType } = params.row;
      if (orderType === undefined) return h('div', '');
      const list = ORDER_TYPE.filter(item => item.id === orderType);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'receipt',
    label: '收据编号',
    render(h: any, params: any) {
      const { orderId, payId, receipt } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({ orderId, payId });
          }
        }
      }, receipt);
    }
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
    key: 'amount',
    label: '实收金额',
    isPrice: true
  },
  {
    key: 'tradingStatus',
    label: '交易状态',
    render(h: any, params: any) {
      const { tradingStatus } = params.row;
      if (tradingStatus === undefined) return h('div', '');
      const list = TRANSACTION_TYPE.filter(item => item.id === tradingStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'carryoverTime',
    label: '结转时间',
    render(h: any, params: any) {
      const { carryoverTime } = params.row;
      if (!carryoverTime) return h('div', '');
      return h('div', dayjs(carryoverTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
];
// pos刷卡交易流水
const POS_PAY_FLOW_LIST_LABEL = [
  {
    key: 'posCompany',
    label: 'pos公司',
    minWidth: 80,
  },
  {
    key: 'posTerminalNo',
    label: 'pos机终端号',
    minWidth: 110,
    render(h: any, params: any) {
      const {
        posId,
        posCompany,
        posTerminalNo,
        storeName
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              posId,
              posCompany,
              posTerminalNo,
              storeName
            });
          }
        }
      }, posTerminalNo);
    }
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'incomeAmount',
    label: '实际进账金额(元)',
    minWidth: 150,
    isPrice: true
  },
  {
    key: 'settlementAmount',
    label: '结算金额(元)',
    minWidth: 110,
    isPrice: true
  },
  {
    key: 'processFee',
    label: '手续费(元)',
    minWidth: 100,
    isPrice: true
  },
  {
    key: 'referenceNo',
    label: '参考号',
  },
  {
    key: 'merchantOrderNo',
    label: '商户订单号',
    minWidth: 100,
  },
  {
    key: 'bankName',
    label: '发卡银行',
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
      const list = TRANSACTION_TYPE.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
];
// 银行转账交易流水
const BANK_TRANSFER_FLOW_LIST_LABEL = [
  {
    key: 'collectionNo',
    label: '收款账号',
  },
  {
    key: 'payNo',
    label: '付款账号',
  },
  {
    key: 'collectionBankName',
    label: '付款账号开户机构',
    minWidth: 150,
  },
  {
    key: 'payAmount',
    label: '交易金额(元)',
    minWidth: 110,
    isPrice: true
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
  {
    key: 'status',
    label: '交易状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = SYS_FLOW_TRANSACTION_TYPE.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
];
// 第三方交易流水-惠州、其他驾校
const THIRD_PARTY_FLOW_LIST_LABEL = [
  {
    key: 'channelName',
    label: '收款渠道',
  },
  {
    key: 'orderNo',
    label: '订单号/券码',
    minWidth: 190,
  },
  {
    key: 'payAmount',
    label: '交易金额(元)',
    minWidth: 110,
    isPrice: true
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
      const list = SYS_FLOW_TRANSACTION_TYPE.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
];
const THIRD_PARTY_FLOW_LIST_LABEL_GUANGREN = [
  {
    key: 'channelName',
    label: '收款渠道',
  },
  {
    key: 'orderNo',
    label: '订单号/券码',
    minWidth: 190,
  },
  {
    key: 'payAmount',
    label: '交易金额(元)',
    minWidth: 110,
    isPrice: true
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
  {
    key: 'status',
    label: '交易状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = SYS_FLOW_TRANSACTION_TYPE.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
];
// 收款复核-收款复核基础公共字段
const FIX_COLLECTION_REVIEW_SET_LIST_LABEL = [
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
    key: 'collectionAmount',
    label: '散学收款金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        payType,
        collectionAmount,
        account
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 3);
          }
        }
      }, formatPrice(collectionAmount));
    }
  },
  {
    key: 'recruitAmount',
    label: '招生收款金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        payType,
        recruitAmount,
        account
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 1);
          }
        }
      }, formatPrice(recruitAmount));
    }
  },
  {
    key: 'recruitRecordAmount',
    label: '招生流水金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        recruitRecordAmount,
        account,
        payType
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 2);
          }
        }
      }, formatPrice(recruitRecordAmount));
    }
  },
  {
    key: 'recruitDiffAmount',
    label: '招生差异金额(元)',
    minWidth: 130,
    isPrice: true
  },
  {
    key: 'recruitSettleAmount',
    label: '招生结转金额(元)',
    minWidth: 130,
    isPrice: true
  },
  {
    key: 'recruitUnSettleAmount',
    label: '未结转金额(元)',
    minWidth: 130,
    isPrice: true
  },
];
// 收款复核-收款复核-广仁
const COLLECTION_REVIEW_SET_LIST_LABEL = [
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
    key: 'collectionAmount',
    label: '散学收款金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        payType,
        collectionAmount,
        account
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 3);
          }
        }
      }, formatPrice(collectionAmount));
    }
  },
  {
    key: 'recruitAmount',
    label: '招生收款金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        payType,
        recruitAmount,
        account
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 1);
          }
        }
      }, formatPrice(recruitAmount));
    }
  },
  {
    key: 'orderAmount',
    label: '实际应收金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        payType,
        account,
        orderAmount
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 4);
          }
        }
      }, formatPrice(orderAmount));
    }
  },
  {
    key: 'recruitRecordAmount',
    label: '招生流水金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        recruitRecordAmount,
        account,
        payType
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 2);
          }
        }
      }, formatPrice(recruitRecordAmount));
    }
  },
  {
    key: 'recruitDiffAmount',
    label: '招生差异金额(元)',
    minWidth: 130,
    isPrice: true
  },
  {
    key: 'recruitSettleAmount',
    label: '招生结转金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        payType,
        recruitSettleAmount,
        account
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 5);
          }
        }
      }, formatPrice(recruitSettleAmount));
    }
  },
  {
    key: 'recruitUnSettleAmount',
    label: '未结转金额(元)',
    minWidth: 130,
    render(h: any, params: any) {
      const {
        id,
        payType,
        recruitUnSettleAmount,
        account
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              id,
              payType,
              account
            }, 6);
          }
        }
      }, formatPrice(recruitUnSettleAmount));
    }
  },
];
// 收款复核-收款复核-惠州
const HUIZHOU_COLLECTION_REVIEW_SET_LIST_LABEL = FIX_COLLECTION_REVIEW_SET_LIST_LABEL;
// 收款复核-收款复核-深港驾校
const SHENZHEN_SHENGAN_COLLECTION_REVIEW_SET_LIST_LABEL = [
  ...FIX_COLLECTION_REVIEW_SET_LIST_LABEL,
  ...[
    {
      key: 'collectionAmount',
      label: '代收收据金额(元)',
      isPrice: true
    },
    {
      key: 'collectionRecordAmount',
      label: '代收流水金额(元)',
      isPrice: true
    },
    {
      key: 'collectionDiffAmount',
      label: '代收差异金额(元)',
      isPrice: true
    },
    {
      key: 'collectionSettleAmount',
      label: '代收结转金额(元)',
      isPrice: true
    },
  ]
];

// 收款复核-门店收入统计
const STORE_COLLECTION_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    key: 'payContent',
    label: '收款终端号',
  },
  {
    key: 'amount',
    label: '系统金额',
    isPrice: true
  },
];
// 收款复核-支付渠道收入统计
const PAY_CHANEL_LIST_LABEL = [
  {
    key: 'payType',
    label: '收款机构',
    // render(h: any, params: any) {
    //   const { payType } = params;
    //   if (payType === undefined) return h('div', '');
    //   const list = ORDER_PAY_TYPE.filter(a => a.id === payType);
    //   return h('span', list[0] ? list[0].label : '');
    // }
  },
  {
    key: 'payContent',
    label: '收款终端号',
  },
  {
    key: 'systemAmount',
    label: '系统金额',
    isPrice: true
  },
  {
    key: 'incomingAmount',
    label: '进账金额',
    isPrice: true
  },
  {
    key: 'differenceAmount',
    label: '差异金额',
    isPrice: true
  },
  {
    key: 'carryoverAmount',
    label: '结转金额',
    isPrice: true
  },
];
// 收款复核-商品销售统计
const GOODS_SALE_LIST_LABEL = [
  {
    key: 'classesName',
    label: '商品名称',
  },
  {
    key: 'carModel',
    label: '培训车型',
  },
  {
    key: 'regionName',
    label: '片区',
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    key: 'total',
    label: '数量',
  },
  {
    key: 'amountTotal',
    label: '商品总价',
    isPrice: true
  },
];
// 支出复核-固定字段
const FEE_REVIEW_FIXED = [
  {
    key: 'batchNo',
    label: '交费批次号',
    minWidth: 100,
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
  },
  {
    key: 'idNo',
    label: '证件号码',
  },
  {
    key: 'classesName',
    label: '班别',
  },
  {
    key: 'carModel',
    label: '车型',
  },
  {
    key: 'step',
    label: '科目',
    render(h: any, params: any) {
      const { step } = params.row;
      const _list = SUBJECT.filter(a => a.id === step);
      const _text = _list[0] ? _list[0].label : '';
      return h('span', _text);
    },
  },
  {
    key: 'feeType',
    label: '费用科目',
  },
  {
    key: 'fee',
    label: '金额',
    isPrice: true
  },
  {
    key: 'payType',
    label: '交费类型',
    render(h: any, params: any) {
      const { payType } = params.row;
      if (payType === undefined) return h('div', '');
      return h('span', payType === 1 ? '代交' : '自交');
    },
  },
  {
    key: 'payNumber',
    label: '缴费流水号',
    minWidth: 100,
    showOverflowTooltip: true
  },
  {
    key: 'costDate',
    label: '交费日期',
    render(h: any, params: any) {
      const { costDate } = params.row;
      if (!costDate) return h('div', '');
      return h('div', dayjs(costDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'payName',
    label: '交费人',
  },
  {
    key: 'studentStatus',
    label: '在库状态',
    render(h: any, params: any) {
      const { studentStatus } = params.row;
      if (studentStatus === undefined) return h('div', '');
      const list = IN_LIBRARY_STATUS.filter(item => item.id === studentStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'reviewStatus',
    label: '复核状态',
    render(h: any, params: any) {
      const { reviewStatus } = params.row;
      if (reviewStatus === undefined) return h('div', '');
      const list = REVIEW_STATUS.filter(a => a.id === reviewStatus);
      return h('span', list[0] ? list[0].label : ''); // 0:待复核 1：已复核
    },
  },
  {
    key: 'reviewTime',
    label: '复核日期',
    render(h: any, params: any) {
      const { reviewTime } = params.row;
      if (!reviewTime) return h('div', '');
      return h('div', dayjs(reviewTime).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'reviewName',
    label: '复核人',
    render(h: any, params: any) {
      const { payType, reviewName } = params.row;
      const _text = payType === 1 ? reviewName : '系统自动';
      return h('span', _text);
    },
  },
];
// 支出复核-考试费复核列表-代交
const EXAM_FEE_REVIEW_OTHER_LIST_LABEL = FEE_REVIEW_FIXED;
// 支出复核-考试费复核列表-自交
const EXAM_FEE_REVIEW_SELF_LIST_LABEL = FEE_REVIEW_FIXED;
// 支出复核-补考费复核列表-代交
const EXAM_MAKEUP_FEE_REVIEW_OTHER_LIST_LABEL = FEE_REVIEW_FIXED;
// 支出复核-补考费复核列表-自交
const EXAM_MAKEUP_FEE_REVIEW_SELF_LIST_LABEL = FEE_REVIEW_FIXED;
// 支出复核-工本费复核列表-代交
const COST_PRODUCTION_FEE_REVIEW_OTHER_LIST_LABEL = FEE_REVIEW_FIXED;
// 支出复核-工本费复核列表-自交
const COST_PRODUCTION_FEE_REVIEW_SELF_LIST_LABEL = FEE_REVIEW_FIXED;
// 资金监管复核列表
const CAPITAL_SUPERVISION_REVIEW_SET_LIST_LABEL = [
  {
    key: 'serialId',
    label: '流水ID',
  },
  {
    key: 'account',
    label: '账号',
  },
  {
    key: 'userName',
    label: '学员姓名',
  },
  {
    key: 'idNo',
    label: '学员身份证号',
    minWidth: 110,
  },
  {
    key: 'drivingSchoolName',
    label: '所属驾校名称',
    minWidth: 110,
    showOverflowTooltip: true,
  },
  {
    key: 'channel',
    label: '流水来源',
  },
  {
    key: 'type',
    label: '流水类型',
  },
  {
    key: 'stage',
    label: '阶段',
  },
  {
    key: 'tradingAmount',
    label: '交易金额(元)',
    minWidth: 110,
    isPrice: true
  },
  {
    key: 'fee',
    label: '手续费(元)',
    minWidth: 100,
    isPrice: true
  },
  {
    key: 'amount',
    label: '实际到账金额(元)',
    minWidth: 130,
    isPrice: true
  },
  {
    key: 'balance',
    label: '虚拟账号余额(元)',
    minWidth: 130,
    isPrice: true
  },
  {
    key: 'bank',
    label: '资金监管银行',
    minWidth: 110,
  },
  {
    key: 'payTime',
    label: '到账时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'tradingTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { tradingTime } = params.row;
      if (!tradingTime) return h('div', '');
      return h('div', dayjs(tradingTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'studentStatus',
    label: '在库状态',
    render(h: any, params: any) {
      const { studentStatus } = params.row;
      if (studentStatus === undefined) return h('div', '');
      const list = IN_LIBRARY_STATUS.filter(item => item.id === studentStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'status',
    label: '作废状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = CANCEL_STATUS.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'remark',
    label: '备注',
    minWidth: 100,
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
];
// 其他费用列表
const OTHER_FEE_MG_LIST_LABEL = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 120,
    render(h: any, params: any) {
      const { batchNo } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({ batchNo });
          }
        }
      }, batchNo);
    }
  },
  {
    key: 'feeType',
    label: '费用类型',
    render(h: any, params: any) {
      const { feeType } = params.row;
      if (feeType === undefined) return h('div', '');
      const list = FEE_TYPE.filter(item => item.id === feeType);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'total',
    label: '数量',
  },
  {
    key: 'amount',
    label: '总金额',
    isPrice: true
  },
  {
    key: 'status',
    label: '状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = SHENHE_STATUS.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'createdName',
    label: '创建人',
  },
  {
    key: 'createdTime',
    label: '创建日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { createdTime } = params.row;
      if (!createdTime) return h('div', '');
      return h('div', dayjs(createdTime).format('YYYY-MM-DD'));
    }
  },
];
// 其他费用明细
const OTHER_FEE_MG_DETAIL_LABEL = [
  {
    key: 'storeName',
    label: '门店',
    minWidth: 110,
  },
  {
    key: 'userName',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'classesName',
    label: '班别',
  },
  {
    key: 'carModel',
    label: '车型',
  },
  {
    key: 'feeType',
    label: '费用类型',
    render(h: any, params: any) {
      const { feeType } = params.row;
      if (feeType === undefined) return h('div', '');
      const list = FEE_TYPE.filter(item => item.id === feeType);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'amount',
    label: '金额',
    isPrice: true
  },
  {
    key: 'status',
    label: '状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = SHENHE_STATUS.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'updatedName',
    label: '审核人',
    minWidth: 100,
    render(h: any, params: any) {
      const { updatedName, status } = params.row;
      if (!updatedName || status === SHENHE_STATUS[0].id) return h('div', '');
      return h('div', updatedName);
    }
  },
  {
    key: 'updatedTime',
    label: '审核时间',
    minWidth: 120,
    render(h: any, params: any) {
      const { updatedTime, status } = params.row;
      if (!updatedTime || status === SHENHE_STATUS[0].id) return h('div', '');
      return h('div', dayjs(updatedTime).format('YYYY-MM-DD'));
    }
  },
];
// 收据变更列表
const RECEIPT_CHANGE_MG_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'storePattern',
    label: '门店性质',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
  },
  {
    key: 'idNo',
    label: '证件号码',
  },
  {
    key: 'mobile',
    label: '联系电话',
  },
  {
    key: 'receipt',
    label: '收据编号',
    render(h: any, params: any) {
      const {
        receipt,
        approvalNo,
        orderType,
        orderId,
        payId,
        taskId
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({
              orderType,
              orderId,
              payId,
              taskId,
              approvalNo,
            });
          }
        }
      }, receipt);
    }
  },
  {
    key: 'orderType',
    label: '订单类型',
    render(h: any, params: any) {
      const { orderType } = params.row;
      if (orderType === undefined) return h('div', '');
      const list = ORDER_TYPE.filter(a => a.id === orderType);
      return h('span', list[0] ? list[0].label : '');
    },
  },
  {
    key: 'amount',
    label: '收款金额',
    isPrice: true
  },
  {
    key: 'status',
    label: '审核状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = VERIFY_STRTUS.filter(a => a.id === status);
      return h('span', list[0] ? list[0].label : '');
    },
  },
  {
    key: 'approvalName',
    label: '审核人',
  },
  {
    key: 'updatedTime',
    label: '审核时间',
    render(h: any, params: any) {
      const { updatedTime } = params.row;
      if (!updatedTime) return h('div', '');
      return h('div', dayjs(updatedTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'createdBy',
    label: '申请人',
  },
  {
    key: 'createdTime',
    label: '申请时间',
    render(h: any, params: any) {
      const { createdTime } = params.row;
      if (!createdTime) return h('div', '');
      return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
];

// 学员退费管理
const STUDENT_REFUND_MG_LIST_LABEL = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 120,
  },
  {
    key: 'invoiceType',
    label: '类型',
    minWidth: 80,
    render(h: any, params: any) {
      const { invoiceType } = params.row;
      if (invoiceType === undefined) return h('div', '');
      const list = INVOICING_TYPE.filter(item => item.id === invoiceType);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'count',
    label: '数量',
    minWidth: 100,
    render(h: any, params: any) {
      const {
        count, batchNo
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({ batchNo });
          }
        }
      }, count);
    }
  },
  {
    key: 'payer',
    label: '操作人',
    minWidth: 120,
  },
  {
    key: 'paymentDate',
    label: '操作时间',
    minWidth: 120,
    render(h: any, params: any) {
      const { paymentDate } = params.row;
      if (!paymentDate) return h('div', '');
      return h('div', dayjs(paymentDate).format('YYYY-MM-DD'));
    }
  },
];
// 收款账号管理列表
const COLLECTION_ACCOUNT_MG_LIST_LABEL = [
  {
    key: 'cardNo',
    label: '收款账号',
    minWidth: 100,
  },
  {
    key: 'name',
    label: '银行',
    minWidth: 150,
  },
  {
    key: 'holder',
    label: '持有人',
    minWidth: 130,
  },
  {
    key: 'remark',
    label: '备注',
    minWidth: 100,
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
  {
    key: 'createdTime',
    label: '创建时间',
    minWidth: 170,
    render(h: any, params: any) {
      const { createdTime } = params.row;
      if (!createdTime) return h('div', '');
      return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'createdName',
    label: '创建人',
  },
  {
    key: 'status',
    label: '状态',
    width: 200,
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = POS_STATUS.filter(a => a.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
];
// pos账号管理列表
const POS_ACCOUNT_MG_LIST_LABEL = [
  {
    key: 'account',
    label: 'pos账号',
    minWidth: 100,
  },
  {
    key: 'bank',
    label: '银行',
    minWidth: 150,
  },
  {
    key: 'company',
    label: 'pos公司',
    minWidth: 80,
  },
  {
    key: 'remark',
    label: '备注',
    minWidth: 100,
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
  {
    key: 'createdTime',
    label: '创建时间',
    minWidth: 170,
    render(h: any, params: any) {
      const { createdTime } = params.row;
      if (!createdTime) return h('div', '');
      return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'createdName',
    label: '创建人',
  },
  {
    key: 'status',
    label: '状态',
    width: 200,
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = POS_STATUS.filter(a => a.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
];
// pos机终端号管理列表
const POS_TERMINAL_NUMBER_MG_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'posTerminalNo',
    label: 'pos机终端号',
    width: 110
  },
  {
    key: 'posType',
    label: 'pos类型',
    render(h: any, params: any) {
      const { posType } = params.row;
      if (posType === undefined) return h('div', '');
      const list = POS_TYPE.filter(a => a.id === posType);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'posAccount',
    label: 'pos账号',
  },
  {
    key: 'posBank',
    label: '银行',
  },
  {
    key: 'posCompany',
    label: 'pos公司',
  },
  {
    key: 'installDate',
    label: 'pos公司装机日期',
    minWidth: 130,
    render(h: any, params: any) {
      const { installDate } = params.row;
      if (!installDate) return h('div', '');
      return h('div', dayjs(installDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'revokeDate',
    label: '服务店撤机日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { revokeDate } = params.row;
      if (!revokeDate) return h('div', '');
      return h('div', dayjs(revokeDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'recoveryDate',
    label: 'pos公司收机日期',
    minWidth: 130,
    render(h: any, params: any) {
      const { recoveryDate } = params.row;
      if (!recoveryDate) return h('div', '');
      return h('div', dayjs(recoveryDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'status',
    label: '状态',
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = POS_STATUS.filter(a => a.id === status);
      return h('div', list[0] ? list[0].label : '');
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
  {
    key: 'handoverName',
    label: '交接人',
  },
  {
    key: 'createdTime',
    label: '创建时间',
    render(h: any, params: any) {
      const { createdTime } = params.row;
      if (!createdTime) return h('div', '');
      return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'createdName',
    label: '创建人',
  },
];
// 代收散学复核
const SANXUE_REVIEW_SET_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
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
  },
  {
    key: 'source',
    label: '业务来源',
  },
  {
    key: 'receipt',
    label: '收据编号',
  },
  {
    key: 'orderSeq',
    label: '订单号',
    render(h: any, params: any) {
      const { orderSeq, orderId } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            console.log(3333, params.row);
            params._self.tableData._this.jumpOrderDetail(orderId);
          }
        }
      },
      orderSeq);
    }
  },
  {
    key: 'salePrice',
    label: '订单金额(元)',
    width: 110,
    isPrice: true
  },
  {
    key: 'amount',
    label: '实收金额(元)',
    width: 110,
    isPrice: true
  },
  {
    key: 'payTime',
    label: '交易时间',
  },
  {
    key: 'tradingStatus',
    label: '交易状态',
    render(h: any, params: any) {
      const { tradingStatus } = params.row;
      if (tradingStatus === undefined) return h('div', '');
      const list = SYS_FLOW_TRANSACTION_TYPE.filter(item => item.id === tradingStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'carryoverDate',
    label: '结转时间',
  }
];
// 散学退费管理
const SANXUE_REFUND_MG_LIST_LABEL = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 120,
  },
  {
    key: 'invoiceType',
    label: '类型',
    minWidth: 80,
    render(h: any, params: any) {
      const { invoiceType } = params.row;
      if (invoiceType === undefined) return h('div', '');
      const list = INVOICING_TYPE.filter(item => item.id === invoiceType);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'count',
    label: '数量',
    minWidth: 100,
    render(h: any, params: any) {
      const {
        count, batchNo, invoiceType
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({ batchNo, invoiceType });
          }
        }
      }, count);
    }
  },
  {
    key: 'payer',
    label: '操作人',
    minWidth: 120,
  },
  {
    key: 'paymentDate',
    label: '操作时间',
    minWidth: 120,
    render(h: any, params: any) {
      const { paymentDate } = params.row;
      if (!paymentDate) return h('div', '');
      return h('div', dayjs(paymentDate).format('YYYY-MM-DD'));
    }
  },
];
export {
  SYSTEM_FLOW_LIST_LABEL,
  COLLECTION_FLOW_LIST_LABEL,
  POS_PAY_FLOW_LIST_LABEL,
  BANK_TRANSFER_FLOW_LIST_LABEL,
  THIRD_PARTY_FLOW_LIST_LABEL,
  THIRD_PARTY_FLOW_LIST_LABEL_GUANGREN,
  COLLECTION_REVIEW_SET_LIST_LABEL,
  HUIZHOU_COLLECTION_REVIEW_SET_LIST_LABEL,
  SHENZHEN_SHENGAN_COLLECTION_REVIEW_SET_LIST_LABEL,
  STORE_COLLECTION_LIST_LABEL,
  PAY_CHANEL_LIST_LABEL,
  GOODS_SALE_LIST_LABEL,
  EXAM_FEE_REVIEW_OTHER_LIST_LABEL,
  EXAM_FEE_REVIEW_SELF_LIST_LABEL,
  EXAM_MAKEUP_FEE_REVIEW_OTHER_LIST_LABEL,
  EXAM_MAKEUP_FEE_REVIEW_SELF_LIST_LABEL,
  COST_PRODUCTION_FEE_REVIEW_OTHER_LIST_LABEL,
  COST_PRODUCTION_FEE_REVIEW_SELF_LIST_LABEL,
  CAPITAL_SUPERVISION_REVIEW_SET_LIST_LABEL,
  OTHER_FEE_MG_LIST_LABEL,
  OTHER_FEE_MG_DETAIL_LABEL,
  RECEIPT_CHANGE_MG_LIST_LABEL,
  STUDENT_REFUND_MG_LIST_LABEL,
  COLLECTION_ACCOUNT_MG_LIST_LABEL,
  POS_ACCOUNT_MG_LIST_LABEL,
  POS_TERMINAL_NUMBER_MG_LIST_LABEL,
  SANXUE_REVIEW_SET_LIST_LABEL,
  SANXUE_REFUND_MG_LIST_LABEL
};
