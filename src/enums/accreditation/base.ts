/** 1、资金监管存入、监管学时、分配教练不进入批次号管理
 *  2、学科培训只在批次号管理中展示数据，不进行导入和补录以及变更操作
 *  3、考场受理、学科培训、考试结果不进行变更
 */
// 资金科目
const CAPITAL_ACCOUNT = [
  {
    label: '存入一期',
    id: 1,
  },
  {
    label: '存入二期',
    id: 2,
  },
  {
    label: '存入三期',
    id: 3,
  },
  {
    label: '存入全款',
    id: 4
  }
];

// 划拨科目
const TRANSFER_ACCOUNT = [
  {
    label: '划拨科目二',
    id: 2,
  },
  {
    label: '划拨科目三',
    id: 3,
  },
];

// 科目
const SUBJECT = [
  {
    label: '科目一',
    id: 1,
  },
  {
    label: '科目二',
    id: 2,
  },
  {
    label: '科目三',
    id: 3,
  },
  {
    label: '文明',
    id: 4,
  },
];

// 牌证车型
const CARMODEL_LIST = [
  {
    id: 'C1',
    label: 'C1'
  },
  {
    id: 'C2',
    label: 'C2'
  },
  {
    id: 'A1',
    label: 'A1'
  },
  {
    id: 'B2',
    label: 'B2'
  }
];
// 费用科目
const FEE_SUBJECT = [
  {
    label: '考试费',
    id: 1,
  },
  {
    label: '补考费',
    id: 2,
  },
  {
    label: '工本费',
    id: 3,
    disabled: false,
  }
];

// 上次考试结果
const LAST_EXAM_RESULT = [
  {
    label: '不合格',
    id: 1,
  },
  {
    label: '缺考',
    id: 2,
  },
  {
    label: '取消考试',
    id: 3,
  },
  {
    label: '未联考（仅针对文明）',
    id: 4,
  },
];

// 考试结果
const EXAM_RESULT = [
  {
    label: '合格',
    id: '合格',
  },
  {
    label: '不合格',
    id: '不合格',
  },
  {
    label: '缺考',
    id: '缺考',
  },
  {
    label: '取消考试',
    id: '取消考试',
  },
  {
    label: '未联考（仅针对文明）',
    id: '未联考',
    disabled: true
  },
];
// 考试结果变更类型
const EXAM_RESULT_CHANGE_TYPE = [
  {
    label: '合格',
    id: '合格',
  },
  {
    label: '不合格',
    id: '不合格',
  },
  {
    label: '缺考',
    id: '缺考',
  },
  {
    label: '取消考试',
    id: '取消考试',
  },
  // {
  //   label: '尚未考试误录入',
  //   id: '尚未考试误录入',
  // },
  {
    label: '未联考（仅针对文明）',
    id: '未联考',
    disabled: true
  },
];

// 通用审核状态
const VERIFY_STRTUS = [
  {
    label: '审核中',
    id: 0,
  },
  {
    label: '已通过',
    id: 1,
  },
  {
    label: '已驳回',
    id: 2,
  },
  {
    label: '已撤回',
    id: 3,
  },
];

// 考核类型
const EXAM_TYPE = [
  {
    label: '主观出错',
    id: 0,
  },
  {
    label: '客观出错',
    id: 1,
  },
];
// 成绩单状态
const REPORT_CARD_STATUS = [
  {
    label: '未收',
    id: 0,
  },
  {
    label: '已收',
    id: 1,
  },
];
// 驾校id
const DRIVINGSCHOOL = [
  {
    label: 'huizhou',
    id: '3374',
  },
  {
    label: 'guangren',
    id: '370',
  },
];

// 资料移交方式
const DATATRANSFER_STATUS = [{
  id: 1,
  label: '快递'
}, {
  id: 2,
  label: '人工移交'
}];
const STUDENT_CATEGORY = [{
  id: 1,
  label: '正常转店'
}, {
  id: 2,
  label: '资料缺失'
}, {
  id: 3,
  label: '特殊学员'
}];

// 取消原因
const CANCEL_REASON = [{
  id: 1,
  label: '正常取消'
}, {
  id: 2,
  label: '批复录错取消'
}, {
  id: 3,
  label: '车管所调期取消'
}
];

export {
  CAPITAL_ACCOUNT,
  TRANSFER_ACCOUNT,
  SUBJECT,
  LAST_EXAM_RESULT,
  EXAM_RESULT,
  EXAM_RESULT_CHANGE_TYPE,
  VERIFY_STRTUS,
  EXAM_TYPE,
  FEE_SUBJECT,
  REPORT_CARD_STATUS,
  DRIVINGSCHOOL,
  DATATRANSFER_STATUS,
  STUDENT_CATEGORY,
  CARMODEL_LIST,
  CANCEL_REASON
};
