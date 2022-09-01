// 审批状态
export const approveStatusOpts = [
  {
    id: 0,
    label: '审核中'
  },
  {
    id: 1,
    label: '已完成'
  },
  {
    id: 2,
    label: '已驳回'
  },
  {
    id: 3,
    label: '已撤销'
  }
];

// 审批状态
export const auditStatusOpts = [
  {
    id: 0,
    label: '审核中'
  },
  {
    id: 1,
    label: '已完成'
  },
  {
    id: 2,
    label: '已驳回'
  },
  {
    id: 3,
    label: '已撤销'
  },
  {
    id: 4,
    label: '已付款'
  }
];

export const refundReasonOpts = [
  {
    id: 1,
    label: '离开学车地'
  },
  {
    id: 2,
    label: '不想学'
  },
  {
    id: 3,
    label: '体检不合格'
  },
  {
    id: 4,
    label: '有违法违章史'
  },
  {
    id: 5,
    label: '异地有证或流水号'
  },
  {
    id: 6,
    label: '有效期内无法学完'
  },
  {
    id: 7,
    label: '对客服服务不满意'
  },
  {
    id: 8,
    label: '对教练服务不满意'
  },
  {
    id: 9,
    label: '身体问题无法继续学'
  },
  {
    id: 10,
    label: '其他'
  }
];

export const haveOrNoOpts = [
  {
    id: 0,
    label: '无'
  },
  {
    id: 1,
    label: '有'
  }
];

// 其他商品-业务类型
export const businessTypeOpts = [
  {
    id: 1,
    label: '转车型'
  },
  {
    id: 2,
    label: '转班别'
  },
  {
    id: 3,
    label: '过考保障'
  },
  {
    id: 4,
    label: '延期学车'
  },
  {
    id: 5,
    label: '其它'
  },
  {
    id: 6,
    label: '平台补贴'
  }
];

// 其他商品-费用科目
export const feeNameOpts = [
  { label: '二次报考费' }, { label: '转入/换证' }, { label: '减免' }, { label: '补交' }, { label: '代桩' },
  { label: '代缴注册费' }, { label: '意外险' }, { label: '缺考费' }, { label: '培训费' }, { label: '退培训费' }, { label: '学科' },
  { label: '退费' }, { label: '补交考试费' }, { label: '提成' }, { label: '代检费' }, { label: '扣提成' },
  { label: '代暂费' }, { label: '代学科费' }, { label: '桩考费' }, { label: '延期学车费' }, { label: '转车型费' },
  { label: '转班别费' }, { label: '过考保障费' }, { label: '长途长训费' }, { label: '重受理费' }, { label: '补卡费' },
  { label: '代上课费' }, { label: '重受理注册费' }, { label: '增值服务包2' }, { label: '体检费' }, { label: '其他费用' }, { label: '佣金' },
  { label: '转场费' },
];

// 平台补贴-费用科目
export const platformSubsidyOpts = [
  { label: '京东补贴' }
];

// 延期类型
export const delayTypeOpts = [
  {
    id: 1,
    label: '正常延期'
  },
  {
    id: 2,
    label: '非正常延期'
  }
];
