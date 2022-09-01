// 学员状态
const STUDENT_STATUS = [
  {
    id: 1,
    label: '正常'
  },
  {
    id: 2,
    label: '退学',
  },
  {
    id: 3,
    label: '暂停',
  },
  {
    id: 4,
    label: '转出',
  },
  {
    id: 5,
    label: '作废',
  },
  {
    id: 99,
    label: '注销',
  },
  {
    id: 69,
    label: '毕业',
  },
];
// 在库状态
const IN_LIBRARY_STATUS = [
  {
    id: 1,
    label: '在学学员'
  },
  {
    id: 2,
    label: '超期学员',
  },
  {
    id: 3,
    label: '历史学员',
  },
];
// 服务来源
const SERVICES_FROM = [
  {
    id: 1,
    label: '呼叫中心'
  },
  {
    id: 2,
    label: '网上投诉',
  },
  {
    id: 3,
    label: '主管部门',
  },
  {
    id: 4,
    label: '市场活动'
  },
  {
    id: 5,
    label: '回访投诉',
  },
  {
    id: 6,
    label: '客户来电',
  },
  {
    id: 7,
    label: '客户上门'
  },
  {
    id: 8,
    label: '服务门店',
  },
  {
    id: 9,
    label: '其他',
  },
];
// 服务方式
const SERVICES_WAY = [
  {
    id: 1,
    label: '去电',
  },
  {
    id: 2,
    label: '上门服务',
  },
  {
    id: 3,
    label: '客户来电',
  },
  {
    id: 4,
    label: '客户上门',
  }
];
// 结果反馈
const RESULT_FEEDBACK = [
  {
    id: 1,
    label: '正常运转',
  },
  {
    id: 2,
    label: '学员弃学',
  },
  {
    id: 3,
    label: '申请退学',
  },
  {
    id: 4,
    label: '暂停学车',
  },
  {
    id: 5,
    label: '恢复学车',
  },
  {
    id: 6,
    label: '学习证过期',
  },
  {
    id: 7,
    label: '无法联系',
  },
  {
    id: 8,
    label: '其他',
  },
];
// 转入历史原因
const TURN_HISTORY_REASON = [
  {
    id: 1,
    label: '退学退费/转学/已注销'
  },
  {
    id: 2,
    label: '科目5次不合格'
  },
  {
    id: 3,
    label: '学习证过期'
  },
  {
    id: 4,
    label: '合同到期'
  },
  {
    id: 5,
    label: '定金作废'
  },
  {
    id: 6,
    label: '僵尸学员'
  },
  {
    id: 7,
    label: '已毕业'
  },
  {
    id: 8,
    label: '其他'
  }
];
export {
  STUDENT_STATUS,
  IN_LIBRARY_STATUS,
  SERVICES_FROM,
  SERVICES_WAY,
  RESULT_FEEDBACK,
  TURN_HISTORY_REASON,
};
