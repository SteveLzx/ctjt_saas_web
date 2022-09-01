// 考试科目
export const examSubjectsOpt = [
  {
    value: 1,
    label: '科目一'
  },
  {
    value: 2,
    label: '科目二'
  },
  {
    value: 3,
    label: '科目三'
  },
  {
    value: 4,
    label: '科目三文明'
  },
];

// 车型
export const examCarTypeOpt = [
  'A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'C5', 'D', 'E', 'F', 'M', 'N', 'P', 'C3D', 'C3E', 'C4D', 'C4E'
];

// 考场类型
export const examPlaceTypeOpt = [
  {
    value: 0,
    label: '社会化考场'
  },
  {
    value: 1,
    label: '市考场'
  }
];

// 考试方式
export const examModeOpt = [
  {
    value: 0,
    label: '电子考试'
  },
  {
    value: 1,
    label: '人工考试'
  }
];

// 时间
export const examDayOpt = [
  {
    value: 1,
    label: '周一'
  },
  {
    value: 2,
    label: '周二'
  },
  {
    value: 3,
    label: '周三'
  },
  {
    value: 4,
    label: '周四'
  },
  {
    value: 5,
    label: '周五'
  },
  {
    value: 6,
    label: '周六'
  },
  {
    value: 7,
    label: '周天'
  }
];

// 是否常用考场
export const isOftenExamPlaceOpt = [
  {
    value: true,
    label: '是'
  },
  {
    value: false,
    label: '否'
  }
];

// 状态
export const statusOpt = [
  {
    value: true,
    label: '启用'
  },
  {
    value: false,
    label: '停用'
  }
];

// 可带教科目
export const canTeachSubjectOpts = [
  {
    value: 1,
    label: '科目一'
  },
  {
    value: 2,
    label: '科目二'
  },
  {
    value: 3,
    label: '科目三'
  },
  {
    value: 4,
    label: '科目三文明'
  }
];

// 带教模式
export const canTeachTypeOpts = [
  {
    value: 0,
    label: '计时模式'
  },
  {
    value: 1,
    label: '全包模式'
  }
];

// 季度
export const quarterOpts = [
  {
    value: 1,
    label: '一季度'
  },
  {
    value: 2,
    label: '二季度'
  },
  {
    value: 3,
    label: '三季度'
  },
  {
    value: 4,
    label: '四季度'
  }
];

// 带教状态
export const teachingStatusOpts = [
  {
    label: '正常分配',
    value: 1,
  },
  {
    label: '暂停分配',
    value: 2,
  },
  {
    label: '等待上岗',
    value: 5,
  },
  {
    label: '申请调岗',
    value: 3,
  },
  {
    label: '申请离职',
    value: 4,
  },
];

// 分配方式
export const distributionModeOpts = [
  {
    label: '系统分配',
    value: 1,
  },
  {
    label: '自选教练',
    value: 2,
  },
  {
    label: '人工分配',
    value: 3,
  }
];

// 教练岗位
export const coachPostTypeOpts = [
  {
    label: '教练员',
    value: 1,
  },
  {
    label: '贵宾教练员',
    value: 2,
  },
  {
    label: '助理教练员',
    value: 3,
  },
  {
    label: '储备教练员',
    value: 4,
  },
  {
    label: '教练员助理',
    value: 5,
  },
  {
    label: '其他',
    value: 99,
  }
];

// 可分配教练范围
export const allowScopeOpts = [
  {
    label: '同门店教练',
    value: 1,
  },
  {
    label: '同主要门店教练',
    value: 2,
  },
  {
    label: '同训练场教练',
    value: 3,
  },
  {
    label: '同片区教练',
    value: 4,
  },
  {
    label: '同驾校教练',
    value: 5,
  },
];

// 参考负荷规则
export const loadRuleOpts = [
  {
    label: '参考标准负荷值，优先负荷占比小的',
    value: 1,
  },
  {
    label: '启用学员年龄规则',
    value: 2,
  },
  {
    label: '超过标准负荷值不能再分配，无优先占比规则小',
    value: 3,
  },
];

// 审批状态
export const approveStatusOpts = [
  {
    id: 0,
    label: '审批中'
  },
  {
    id: 1,
    label: '已完成'
  },
  {
    id: 2,
    label: '驳回'
  },
  {
    id: 3,
    label: '撤回'
  }
];

// 出库/入库条件
export const subjectOutAndOnAccessOpts = [
  {
    id: 1,
    label: '考场受理',
    children: [
      {
        id: 1,
        label: '完成'
      },
    ]
  },
  {
    id: 2,
    label: '科目一成绩',
    children: [
      {
        id: 1,
        label: '合格'
      },
    ]
  },
  {
    id: 3,
    label: '科目二成绩',
    children: [
      {
        id: 1,
        label: '合格'
      },
    ]
  },
  {
    id: 4,
    label: '科目三成绩',
    children: [
      {
        id: 1,
        label: '合格'
      },
    ]
  }
];

// 变更原因
export const changeCauseOpts = [
  {
    id: 1,
    label: '教练调岗'
  },
  {
    id: 2,
    label: '教练带教类型调整'
  },
  {
    id: 3,
    label: '教练服务质量问题'
  },
  {
    id: 4,
    label: '系统问题'
  },
  {
    id: 5,
    label: '关系户'
  },
  {
    id: 6,
    label: '教练带教设置有误'
  },
  {
    id: 7,
    label: '调整负荷'
  },
  {
    id: 8,
    label: '公示日期后变更教练'
  }
];
