// pos状态
const POS_STATUS = [
  {
    id: 0,
    label: '启用',
  },
  {
    id: 1,
    label: '停用',
  },
];

// pos类型
const POS_TYPE = [
  {
    id: 1,
    label: '移动',
  },
  {
    id: 2,
    label: '固定',
  },
];

// 订单类型
const ORDER_TYPE = [
  {
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

// 发票状态
const INVOICE_TYPE = [
  {
    id: 1,
    label: '待开票',
  },
  {
    id: 2,
    label: '已开票',
  },
  {
    id: 3,
    label: '已作废',
  },
  {
    id: 4,
    label: '无票',
  }
];

// 交易状态
const TRANSACTION_TYPE = [
  {
    id: 1,
    label: '待结转',
  },
  {
    id: 2,
    label: '已结转',
  },
];
// 系统交易流水-交易状态
const SYS_FLOW_TRANSACTION_TYPE = [
  ...TRANSACTION_TYPE,
  {
    id: 3,
    label: '作废审批中',
  },
  {
    id: 4,
    label: '已作废',
  }
];
// 资金监管阶段
const CAPITAL_STEP = [
  {
    id: 1,
    label: '一阶段',
  },
  {
    id: 2,
    label: '二阶段',
  },
  {
    id: 3,
    label: '三阶段',
  },
  {
    id: 4,
    label: '一次性',
  },
  {
    id: 5,
    label: '初期',
  },
  {
    id: 6,
    label: '理论',
  },
  {
    id: 7,
    label: '科目二',
  },
  {
    id: 8,
    label: '科目三',
  },
  {
    id: 9,
    label: '退款',
  },
  {
    id: 10,
    label: '预存退款',
  },
];
// 作废状态
const CANCEL_STATUS = [
  {
    id: 1,
    label: '未作废',
  },
  {
    id: 2,
    label: '已作废',
  }];
// 流水类别
const FLOW_TYPE = [
  {
    id: 1,
    label: '存入',
  },
  {
    id: 2,
    label: '消费',
  },
  {
    id: 3,
    label: '退款',
  },
  {
    id: 4,
    label: '错误存入',
  },
];
// 复核状态
const REVIEW_STATUS = [
  {
    id: 0,
    label: '待复核',
  },
  {
    id: 1,
    label: '已复核',
  },
];
// 费用类型
const FEE_TYPE = [
  {
    id: 1,
    label: '代检费',
  },
  {
    id: 2,
    label: '业务费',
  },
  {
    id: 3,
    label: '代理佣金'
  },
  {
    id: 4,
    label: '代刷学时费'
  },
  {
    id: 5,
    label: '支出受理费(指标费)'
  },
  {
    id: 6,
    label: '外转班受理费'
  }
];
// 差异
const DIFF_LIST = [
  {
    id: 1,
    label: '有差异'
  },
  {
    id: 2,
    label: '无差异'
  }
];

// 标记状态
const RECORD_STATUS = [
  { id: 0, label: '未标记' },
  { id: 1, label: '已标记' },
];
// pos流水数据类型
const POS_DATA_TYPE = [
  {
    id: 0,
    label: 'pos标准流水导入'
  },
  {
    id: 1,
    label: '光大银行-微信支付宝手机支付'
  },
  {
    id: 2,
    label: '浙商银行-微信支付宝手机支付'
  },
  {
    id: 3,
    label: '东莞银行-微信支付宝手机支付'
  },
  {
    id: 4,
    label: '银联商务-微信支付宝手机支付'
  },
  {
    id: 5,
    label: '光大银行-POS批量'
  },
  {
    id: 6,
    label: '光大银行-POS单个'
  },
  {
    id: 7,
    label: '银联商务-pos'
  },
  {
    id: 8,
    label: '银盛支付-pos'
  },
];

// pos流水数据类型-广仁
const GUANGREN_POS_DATA_TYPE = [{
  id: 1,
  label: '云闪付'
},
{
  id: 2,
  label: '银联pos刷卡或二维码'
},
{
  id: 0,
  label: 'pos标准流水导入'
}
];
// 审核状态
const SHENHE_STATUS = [
  {
    id: 0,
    label: '未审核',
  },
  {
    id: 1,
    label: '已审核',
  },
];
// 阶段
const TRAINING_STAGE = [
  {
    id: 0,
    label: '已报名'
  },
  {
    id: 1,
    label: '已受理'
  },
  {
    id: 2,
    label: '已科目一'
  },
  {
    id: 3,
    label: '已科目二'
  },
  {
    id: 4,
    label: '已科目三'
  },
];

// 学车进度
const STUDY_STAGE = [
  {
    id: 0,
    label: '考场受理'
  },
  {
    id: 1,
    label: '科目一'
  },
  {
    id: 2,
    label: '科目二'
  },
  {
    id: 3,
    label: '科目三'
  },
  {
    id: 4,
    label: '文明'
  },
  {
    id: 5,
    label: '毕业'
  }
];
// 退款类型
const REFUND_TYPE = [
  {
    id: 1,
    label: '扣服务费'
  },
  {
    id: 2,
    label: '正常退费'
  },
  {
    id: 3,
    label: '非正常退费'
  },
  {
    id: 4,
    label: '全额退费'
  },
  {
    id: 5,
    label: '过期退费'
  },
  {
    id: 6,
    label: '退差价'
  },
  {
    id: 7,
    label: '换人学车'
  }
];
// 票据类型
const INVOICING_TYPE = [
  {
    id: 1,
    label: '无票'
  },
  {
    id: 2,
    label: '国税',
  },
  {
    id: 3,
    label: '地税',
  },
];
export {
  POS_STATUS,
  POS_TYPE,
  ORDER_TYPE,
  INVOICE_TYPE,
  TRANSACTION_TYPE,
  SYS_FLOW_TRANSACTION_TYPE,
  CAPITAL_STEP,
  FLOW_TYPE,
  CANCEL_STATUS,
  REVIEW_STATUS,
  FEE_TYPE,
  DIFF_LIST,
  RECORD_STATUS,
  POS_DATA_TYPE,
  GUANGREN_POS_DATA_TYPE,
  SHENHE_STATUS,
  TRAINING_STAGE,
  INVOICING_TYPE,
  REFUND_TYPE,
  STUDY_STAGE,
};
