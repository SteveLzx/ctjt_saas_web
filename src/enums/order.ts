// 审核状态
const ORDER_AUDIT_STATUS = [
  {
    id: 0,
    label: '未审核'
  },
  {
    id: 1,
    label: '已审核'
  }
];

// 是否分期付款
const ORDER_IS_INSTALLMENT = [
  {
    id: 0,
    label: '否'
  },
  {
    id: 1,
    label: '是'
  },
];

// 支付状态
const ORDER_PAY_STATUS = [
  {
    id: 1,
    label: '待支付'
  },
  {
    id: 2,
    label: '支付成功'
  },
  {
    id: 3,
    label: '支付失败'
  },
  {
    id: 99,
    label: '已删除'
  },
];

// 支付类型| 终端类型
const ORDER_PAY_TYPE = [
  {
    id: 2,
    label: 'pos刷卡'
  },
  {
    id: 4,
    label: '收款二维码'
  },
  {
    id: 1,
    label: '第三方付款'
  },
  {
    id: 3,
    label: '转账'
  },
  {
    id: 6,
    label: '上缴现金'
  },
];

// 补考次数
const ORDER_RESIT_COUNT = [
  {
    id: -1,
    label: '不限补考次数'
  },
  {
    id: 0,
    label: '不包补考次数'
  },
];

// 学车类型
const ORDER_LEARN_TYPE = [
  {
    id: '1',
    label: '初学'
  },
  {
    id: '2',
    label: '增驾'
  },
  {
    id: '3',
    label: '本地转入'
  },
  {
    id: '4',
    label: '异地转入'
  },
];

// 带教方式
const ORDER_TEACHING_TYPE = [
  {
    id: '1',
    label: '人工教练'
  },
  {
    id: '2',
    label: '智能教练'
  },
];

// 缴费方式
const ORDER_PAYMENT_TYPE = [
  {
    id: 0,
    label: '全款'
  },
  {
    id: 1,
    label: '分期'
  },
];

// 证件类型
const ORDER_IDNO_TYPE = [
  {
    id: 1,
    label: '身份证'
  },
  {
    id: 2,
    label: '护照'
  },
  {
    id: 3,
    label: '军官证'
  },
  {
    id: 4,
    label: '居住证号'
  }
];

// 培训阶段
const ORDER_TRAINING_PHASE = [
  {
    id: '1',
    label: '已科目一未科目二'
  },
  {
    id: '2',
    label: '已科目二未科目三'
  },
  {
    id: '3',
    label: '已科目三未科目二'
  },
  {
    id: '4',
    label: '已科目三未文明'
  },
];

// 是否开发票
const ORDER_OPEN_INVOICE = [
  {
    id: 1,
    label: '已开发票'
  },
  {
    id: 0,
    label: '未开发票'
  },
];

// 发票类型
const ORDER_INVOICE_TYPE = [
  {
    id: 1,
    label: '普票'
  },
  {
    id: 2,
    label: '专票'
  },
];

// 开票方式
const ORDER_OPEN_INVOICE_TYPE = [
  {
    id: 1,
    label: '个人'
  },
  {
    id: 2,
    label: '企业'
  },
];

// 籍贯
const NATIVE_PLACE = [
  {
    name: '港/澳/台'
  },
  {
    name: '本地'
  },
  {
    name: '外地'
  },
  {
    name: '外籍'
  }
];

const OLD_DRIVER_LICENSE = [
  {
    id: 13,
    label: 'C1'
  }, {
    id: 1,
    label: 'C2'
  }, {
    id: 2,
    label: 'C3'
  }, {
    id: 3,
    label: 'C4'
  }, {
    id: 4,
    label: 'C5'
  }, {
    id: 5,
    label: 'D'
  }, {
    id: 6,
    label: 'E'
  }, {
    id: 7,
    label: 'F'
  }, {
    id: 8,
    label: 'M'
  }, {
    id: 9,
    label: 'N'
  }, {
    id: 10,
    label: 'P'
  }, {
    id: 11,
    label: 'A1'
  }, {
    id: 12,
    label: 'A2'
  }
];

// 优惠方式
const ORDER_DISCOUNT_TYPE = [
  {
    id: 1,
    label: '现金'
  },
  {
    id: 2,
    label: '赠送学时'
  },
  {
    id: 3,
    label: '优惠券'
  }
];

// 第三方渠道
const THIRD_CHANNELS_OPTS = [
  {
    id: 1,
    label: '百度糯米'
  },
  {
    id: 2,
    label: '浙商手机支付'
  },
  {
    id: 3,
    label: '车生活'
  },
  // {
  //   id: 4,
  //   label: '上缴现金'
  // },
  {
    id: 5,
    label: '美团转款'
  },
  {
    id: 6,
    label: '支付宝转款'
  },
  {
    id: 7,
    label: '学车饭团转款'
  },
  {
    id: 8,
    label: '小程序'
  },
  {
    id: 9,
    label: '斑斑学车'
  },
  {
    id: 10,
    label: '京东支付'
  },
];

// 第三方交易流水模板导入类型
const THIRD_CHANNELS_IMPORT_TYPE = [
  {
    id: 0,
    label: '标准导入'
  },
  {
    id: 1,
    label: '京东支付'
  },
  {
    id: 2,
    label: '美团转款'
  },
  {
    id: 3,
    label: '小程序'
  },
  {
    id: 4,
    label: '支付宝转款'
  },
  {
    id: 5,
    label: '斑斑学车-优惠券订单'
  },
  {
    id: 6,
    label: '斑斑学车-陪驾订单'
  },
  {
    id: 7,
    label: '斑斑学车-学车订单'
  }
];

const SCATTERED_TYPE = [
  {
    id: 1,
    label: '散学退费'
  },
];

export {
  ORDER_AUDIT_STATUS,
  ORDER_IS_INSTALLMENT,
  ORDER_PAY_STATUS,
  ORDER_PAY_TYPE,
  ORDER_RESIT_COUNT,
  ORDER_LEARN_TYPE,
  ORDER_TEACHING_TYPE,
  ORDER_PAYMENT_TYPE,
  ORDER_IDNO_TYPE,
  ORDER_TRAINING_PHASE,
  ORDER_OPEN_INVOICE,
  ORDER_INVOICE_TYPE,
  ORDER_OPEN_INVOICE_TYPE,
  NATIVE_PLACE,
  OLD_DRIVER_LICENSE,
  ORDER_DISCOUNT_TYPE,
  THIRD_CHANNELS_OPTS,
  THIRD_CHANNELS_IMPORT_TYPE,
  SCATTERED_TYPE
};
