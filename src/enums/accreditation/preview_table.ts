/** 导入办证数据预览表格配置 */
// 无纸化采集
const PAPERLESS_COLLECT_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '采集日期',
      label: '采集日期',
      minWidth: 120
    },
  ],
};
// 场点交表
const SITE_DELIVERY_TABLE_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '场点交表日期',
      label: '场点交表日期',
    },
  ],
};
// 牌证收表
const LICENSE_RECEIPT_FORM_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '牌证收表日期',
      label: '牌证收表日期',
    },
  ],
};
// 上课情况
const CLASS_SITUATION_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '备注',
      label: '备注',
    },
    {
      key: '上课日期',
      label: '上课日期',
    },
  ],
};
// 片区交表
const AREA_DELIVERY_TABLE_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '片区交表日期',
      label: '片区交表日期',
    },
  ],
};
// 车管所送审
const VEHICLE_APPROVAL_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '送审日期',
      label: '送审日期',
    },
  ],
};
// 成绩单
const REPORT_CARD_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '考试科目',
      label: '考试科目',
      minWidth: 80,
    },
  ],
};
// 资金监管存入
const CAPITAL_SUPERVISION_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '车型',
      label: '车型',
      minWidth: 80,
    },
    {
      key: '资金科目',
      label: '资金科目',
      minWidth: 80,
    },
    {
      key: '监管日期',
      label: '监管日期',
    },
    // {
    //   key: '付款方式',
    //   label: '付款方式',
    // },
    {
      key: '转账码',
      label: '转账码',
      winth: 150
    },
  ],
};

// 考场受理
const EXAM_ACCEPTANCE_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '受理号',
      label: '受理号',
      minWidth: 200,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '车型',
      label: '车型',
    },
    {
      key: '受理日期',
      label: '受理日期',
    },
    {
      key: '失败原因',
      label: '失败原因',
    },
    {
      key: '备注',
      label: '备注',
    },
  ],
};
// 考场受理-惠州深港
const HUIZHOU_EXAM_ACCEPTANCE_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '车型',
      label: '车型',
    },
    {
      key: '受理日期',
      label: '受理日期',
    },
    {
      key: '失败原因',
      label: '失败原因',
    },
    {
      key: '备注',
      label: '备注',
    },
  ],
};
// 学科培训
const SUBJECT_TRAINING_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '培训科目',
      label: '培训科目',
    },
    {
      key: '备注',
      label: '备注',
    },
    {
      key: '培训日期',
      label: '培训日期',
    },
  ],
};
// 考试报考
const APPLY_EXAM_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '科目',
      label: '科目',
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '受理号',
      label: '受理号',
      minWidth: 200,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '考试地点',
      label: '考试地点',
    },
    {
      key: '考试日期',
      label: '考试日期',
      minWidth: 110,
    },
  ],
};
// 考试批复
const EXAM_APPROVAL_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '科目',
      label: '科目',
    },
    {
      key: '车型',
      label: '车型',
    },
    // {
    //   key: '受理号',
    //   label: '受理号',
    //   minWidth: 150,
    // },
    {
      key: '考试日期',
      label: '考试日期',
    },
    {
      key: '考试时间',
      label: '考试时间',
    },
    {
      key: '考试地点',
      label: '考试地点',
    },
    {
      key: '批复异常',
      label: '批复异常',
      minWidth: 200,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    }
  ],
};

// 考试批复-惠州深港
const HUIZHOU_EXAM_APPROVAL_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 100,
    },
    {
      key: '考试科目',
      label: '考试科目',
    },
    {
      key: '考试车型',
      label: '考试车型',
    },
    {
      key: '预约日期',
      label: '预约日期',
    },
    {
      key: '预考日期',
      label: '预考日期',
    },
    {
      key: '考试场地',
      label: '考试场地',
      minWidth: 120,
    },
    {
      key: '考试场次',
      label: '考试场次',
    },
  ],
};
// 考试批复-惠州深港-old
// const HUIZHOU_EXAM_APPROVAL_EXCEL = {
//   labels: [
//     {
//       key: '序号',
//       label: '序号',
//       minWidth: 80,
//     },
//     {
//       key: '考试科目',
//       label: '考试科目',
//     },
//     {
//       key: '考试车型',
//       label: '考试车型',
//     },
//     {
//       key: '约考日期',
//       label: '约考日期',
//     },
//     {
//       key: '考试场次',
//       label: '考试场次',
//     },
//     {
//       key: '考试场地',
//       label: '考试场地',
//     },
//     {
//       key: '学员姓名',
//       label: '学员姓名',
//       minWidth: 100,
//     },
//     {
//       key: '身份证明号码',
//       label: '身份证明号码',
//       minWidth: 200,
//     }
//   ],
// };
// 考试交费
const EXAM_FEE_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '门店',
      label: '门店',
    },
    {
      key: '姓名',
      label: '姓名',
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    // {
    //   key: '受理号',
    //   label: '受理号',
    //   minWidth: 150,
    // },
    {
      key: '缴费流水号',
      label: '缴费流水号',
      minWidth: 200,
    },
    {
      key: '金额',
      label: '金额',
    },
    {
      key: '科目',
      label: '科目',
    },
    {
      key: '交费方式',
      label: '交费方式',
    },
    {
      key: '费用科目',
      label: '费用科目',
    },
    {
      key: '交费日期',
      label: '交费日期',
    },
  ],
};
// 考试交费-惠州深港
const HUIZHOU_EXAM_FEE_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    // {
    //   key: '门店',
    //   label: '门店',
    // },
    {
      key: '姓名',
      label: '姓名',
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '缴费流水号',
      label: '缴费流水号',
      minWidth: 200,
    },
    {
      key: '金额',
      label: '金额',
    },
    {
      key: '科目',
      label: '科目',
    },
    {
      key: '交费方式',
      label: '交费方式',
    },
    {
      key: '费用科目',
      label: '费用科目',
    },
    {
      key: '交费日期',
      label: '交费日期',
    },
  ],
};
// 考试结果
const EXAM_RESULTS_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    // {
    //   key: '受理号',
    //   label: '受理号',
    //   minWidth: 120,
    // },
    {
      key: '科目',
      label: '科目',
    },
    {
      key: '考试结果',
      label: '考试结果',
    },
    {
      key: '考试日期',
      label: '考试日期',
    },
    {
      key: '取消原因',
      label: '取消原因',
    }
  ],
};
// 考试结果-惠州深港
const HUIZHOU_EXAM_RESULTS_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 100,
    },
    {
      key: '考试科目',
      label: '考试科目',
      minWidth: 200,
    },
    {
      key: '考试车型',
      label: '考试车型',
    },
    {
      key: '考试日期',
      label: '考试日期',
    },
    {
      key: '考试场地',
      label: '考试场地',
    },
    {
      key: '考试场次',
      label: '考试场次',
    },
    {
      key: '成绩',
      label: '成绩',
    },
    {
      key: '备注',
      label: '备注',
    }
  ],
};
// 考试结果-惠州深港-old
// const HUIZHOU_EXAM_RESULTS_EXCEL = {
//   labels: [
//     {
//       key: '序号',
//       label: '序号',
//       minWidth: 80,
//     },
//     {
//       key: '学员姓名',
//       label: '学员姓名',
//       minWidth: 100,
//     },
//     {
//       key: '身份证明号码',
//       label: '身份证明号码',
//       minWidth: 200,
//     },
//     {
//       key: '考试科目',
//       label: '考试科目',
//     },
//     {
//       key: '考试成绩',
//       label: '考试成绩',
//     },
//     {
//       key: '考试日期',
//       label: '考试日期',
//     },
//     {
//       key: '取消原因',
//       label: '取消原因',
//     }
//   ],
// };
// 监管学时科二科三
const SUPERVISION_HOURS_ACTIVE_EXCEL = {
  labels: [
    {
      key: '序号',
      label: '序号',
      minWidth: 80,
    },
    {
      key: '姓名',
      label: '姓名',
      minWidth: 80,
    },
    {
      key: '证件号码',
      label: '证件号码',
      minWidth: 200,
    },
    {
      key: '车型',
      label: '车型',
    },
    {
      key: '划拨科目',
      label: '划拨科目',
    },
    {
      key: '学时考核',
      label: '学时考核',
    },
    {
      key: '监管学时-模拟机',
      label: '监管学时-模拟机',
    },
    {
      key: '监管学时-真车',
      label: '监管学时-真车',
    },
  ],
};

export {
  PAPERLESS_COLLECT_EXCEL,
  SITE_DELIVERY_TABLE_EXCEL,
  LICENSE_RECEIPT_FORM_EXCEL,
  CLASS_SITUATION_EXCEL,
  AREA_DELIVERY_TABLE_EXCEL,
  VEHICLE_APPROVAL_EXCEL,
  CAPITAL_SUPERVISION_EXCEL,
  REPORT_CARD_EXCEL,
  EXAM_ACCEPTANCE_EXCEL,
  HUIZHOU_EXAM_ACCEPTANCE_EXCEL,
  SUBJECT_TRAINING_EXCEL,
  APPLY_EXAM_EXCEL,
  EXAM_APPROVAL_EXCEL,
  HUIZHOU_EXAM_APPROVAL_EXCEL,
  EXAM_FEE_EXCEL,
  HUIZHOU_EXAM_FEE_EXCEL,
  EXAM_RESULTS_EXCEL,
  HUIZHOU_EXAM_RESULTS_EXCEL,
  SUPERVISION_HOURS_ACTIVE_EXCEL,
};
