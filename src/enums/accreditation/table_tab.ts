// 资金监管存入tab
const CAPITAL_TAB = [
  {
    label: '待录入',
    id: 1
  },
  {
    label: '待存入',
    id: 2
  },
  {
    label: '已存入',
    id: 3
  },
];
// 考场受理tab
const ACCEPTANCE_TAB = [
  {
    id: 1,
    label: '受理成功',
  },
  {
    id: 2,
    label: '受理失败',
  },
];
// 分配教练tab
const COACH_TAB = [
  {
    id: 2,
    label: '科目二',
  },
  {
    id: 3,
    label: '科目三',
  },
];
// 学科培训tab
const TRAINING_TAB = [
  {
    id: 1,
    label: '科一',
    hours: {
      theory: 12,
      simulator: 0,
      realCar: 0,
    },
  },
  {
    id: 2,
    label: '科二',
    hours: [{
      theory: 0,
      simulator: 2,
      realCar: 10,
    },
    {
      theory: 0,
      simulator: 2,
      realCar: 8,
    },
    ]
  },
  {
    id: 3,
    label: '科三',
    hours: [{
      theory: 0,
      simulator: 2,
      realCar: 6,
    },
    {
      theory: 0,
      simulator: 2,
      realCar: 6,
    },
    ]
  },
  {
    id: 4,
    label: '文明',
    hours: {
      theory: 10,
      simulator: 0,
      realCar: 0,
    },
  }
];
// 考试批复tab
const APPROVAL_TAB = [
  {
    id: 1,
    label: '已批复',
  },
  {
    id: 2,
    label: '批复异常',
  },
];
// 考试交费tab
const FEE_TAB = [
  {
    id: 1,
    label: '代交',
  },
  {
    id: 2,
    label: '自交',
  },
];
// 监管学时tab
const SUPERVISION_TAB = [
  {
    label: '不可划拨',
    id: 1
  },
  {
    label: '待划拨',
    id: 2
  },
  {
    label: '已划拨',
    id: 3
  },
];

export {
  CAPITAL_TAB,
  ACCEPTANCE_TAB,
  COACH_TAB,
  TRAINING_TAB,
  APPROVAL_TAB,
  FEE_TAB,
  SUPERVISION_TAB,
};
