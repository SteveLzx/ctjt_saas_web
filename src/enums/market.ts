// 培训车型
const MARKET_MOTORCYCLE_TYPE = [
  {
    id: 1,
    label: 'C1',
    disabled: false,
  },
  {
    id: 2,
    label: 'C2',
    disabled: false,
  },
  {
    id: 3,
    label: 'C5',
    disabled: false,
  },
  {
    id: 4,
    label: 'D',
    disabled: false,
  },
  {
    id: 5,
    label: 'E',
    disabled: false,
  },
  {
    id: 6,
    label: 'A1',
    disabled: false,
  },
  {
    id: 7,
    label: 'B2',
    disabled: false,
  }
];

// 培训项目
const MARKET_TRAINING_PROGRAMS = [
  {
    id: '1',
    label: 'C1人工带教',
    list: [
      {
        label: '科目一',
        list: []
      },
      {
        label: '科目二',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目三',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目四',
        list: []
      },
    ]
  },
  {
    id: '2',
    label: 'C1智能带教',
    list: [
      {
        label: '科目一',
        list: []
      },
      {
        label: '科目二',
        list: [
          { label: '智能教练', check: true },
          { label: '人工教练', check: false },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目三',
        list: [
          { label: '智能教练', check: true },
          { label: '人工教练', check: false },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目四',
        list: []
      },
    ]
  },
  {
    id: '3',
    label: 'C2人工带教',
    list: [
      {
        label: '科目一',
        list: []
      },
      {
        label: '科目二',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目三',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目四',
        list: []
      },
    ]
  },
  {
    id: '4',
    label: 'C2智能带教',
    list: [
      {
        label: '科目一',
        list: []
      },
      {
        label: '科目二',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: false },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目三',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: false },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目四',
        list: []
      },
    ]
  },
  {
    id: '5',
    label: 'C5残疾人',
    list: [
      {
        label: '科目一',
        list: []
      },
      {
        label: '科目二',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: false },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目三',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: false },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目四',
        list: []
      },
    ]
  },
  {
    id: '6',
    label: 'D摩托车',
    list: [
      {
        label: '科目一',
        list: []
      },
      {
        label: '科目二',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目三',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目四',
        list: []
      },
    ]
  },
  {
    id: '6',
    label: 'E摩托车',
    list: [
      {
        label: '科目一',
        list: []
      },
      {
        label: '科目二',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目三',
        list: [
          { label: '智能教练', check: false },
          { label: '人工教练', check: true },
          { label: '模拟机练习2小时', check: false },
        ]
      },
      {
        label: '科目四',
        list: []
      },
    ]
  }
];

// 补考次数
const MARKET_MAKE_UP_EXAM = [
  {
    id: 1,
    label: '1次'
  },
  {
    id: 2,
    label: '2次'
  },
  {
    id: 3,
    label: '3次'
  },
  {
    id: 4,
    label: '4次'
  },
  {
    id: 5,
    label: '5次'
  },
  {
    id: 0,
    label: '不包含'
  },
  {
    id: -1,
    label: '不限次数'
  }
];

// 门店其他
const MARKET_STORE_OTHER_SERVICE = [
  {
    id: 1,
    label: '模拟机练习室'
  },
  {
    id: 2,
    label: '录指纹采集'
  },
  {
    id: 3,
    label: '自助体检'
  },
  {
    id: 4,
    label: '学车咨询'
  },
  {
    id: 5,
    label: '驾考拍照'
  }
];

// 是否高端班
const MARKET_BOOLEAN = [
  {
    id: 0,
    label: '否'
  },
  {
    id: 1,
    label: '是'
  },
];

// 商品状态
const MARKET_STATUS = [
  {
    id: 0,
    label: '下架'
  },
  {
    id: 1,
    label: '上架'
  },
  {
    id: 2,
    label: '待上架'
  },
];

// 供职状态
const MARKET_SERVICE_STATUS = [
  {
    id: 1,
    label: '待试用'
  },
  {
    id: 2,
    label: '试用'
  },
  {
    id: 3,
    label: '正式'
  },
  {
    id: 4,
    label: '离职'
  },
];

// 门店规模
const MARKET_STORE_SCALE = [
  {
    id: '1',
    label: '旗舰店'
  },
  {
    id: '2',
    label: '服务店'
  },
  {
    id: '3',
    label: '中型门店'
  },
];

// 门店营业状态
const MARKET_STORE_BUDINESS_STATUS = [
  {
    id: '1',
    label: '正常营业'
  },
  {
    id: '2',
    label: '待营业'
  },
  {
    id: '0',
    label: '停业'
  },
];

// 门店类型
const MARKET_STORE_PATTERN = [
  {
    id: '1',
    label: '直营'
  },
  {
    id: '2',
    label: '加盟'
  },
];

// 门店类型
const MARKET_STORE_TYPE = [
  {
    id: '1',
    label: '单人店'
  },
  {
    id: '2',
    label: '双人店'
  },
  {
    id: '0',
    label: '总台'
  },
];

// 客服岗位类型
const MARKET_POST_TYPE = [
  {
    label: '顶班客服',
    id: 1
  },
  {
    label: '客服专员',
    id: 2
  },
  {
    label: '代班客服',
    id: 3
  },
  {
    label: '储备客服',
    id: 4
  },
  {
    label: '主管客服',
    id: 5
  }
];

// 教练岗位类型
const MARKET_COACH_TYPE = [
  {
    label: '正式员工',
    id: 1
  },
  {
    label: '合作教练',
    id: 2
  },
];

// 带教班别
const MARKET_TEACHING_CLASS = [
  {
    label: 'C1全包',
    id: 1
  },
  {
    label: 'C2智能',
    id: 2
  },
  {
    label: 'C2VIP',
    id: 3
  },
];

// 带教科目
const MARKET_TEACHING_SUBJECTS = [
  {
    label: '专职科目二',
    id: 1
  },
  {
    label: '专职科目三',
    id: 2
  },
  {
    label: '技术全程',
    id: 3
  },
  {
    label: '普通全程',
    id: 4
  },
  {
    label: '安全员',
    id: 5
  },
  {
    label: '教学组长',
    id: 6
  },
];

// 启用停用
const MARKET_CLASS_FEE_STATUS = [
  {
    label: '停用',
    id: 0
  },
  {
    label: '启用',
    id: 1
  },
];

const MARKET_CHANNEL_STATUS = [
  {
    label: '停用',
    id: 99
  },
  {
    label: '启用',
    id: 1
  },
];
const MARKET_ACTIVITIES_SET_STATUS = [
  {
    label: '启用',
    id: 1
  },
  {
    label: '停用',
    id: 2
  },
];

// 核销方式
const MARKET_WRITE_OFF_TYPE = [
  {
    label: '手动核销',
    id: 1
  },
  {
    label: '自动核销',
    id: 2
  },
];

// 上下架状态
const MARKET_UP_DOWN_STATUS = [
  {
    id: 1,
    label: '上架'
  },
  {
    id: 0,
    label: '下架'
  },
];

const MARKET_ACTIVITIES_STATUS = [
  {
    id: 1,
    label: '未开始'
  },
  {
    id: 2,
    label: '进行中'
  },
  {
    id: 3,
    label: '已结束'
  },
  {
    id: 4,
    label: '已关闭'
  },
];

const MARKET_CLASSESS_TYPE = [
  {
    id: 1,
    label: '学车班别'
  },
  {
    id: 2,
    label: '散学班别'
  },
];

const MARKET_COMMISSION_TYPE = [
  {
    id: 1,
    label: '正常优惠'
  },
  {
    id: 2,
    label: '特批优惠'
  },
  {
    id: 3,
    label: '教练介绍'
  },
  {
    id: 4,
    label: '网络招生'
  },
  {
    id: 5,
    label: '转入'
  },
  {
    id: 6,
    label: '转校'
  },
  {
    id: 7,
    label: '退费重报名'
  },
  {
    id: 8,
    label: '无提成'
  },
];

const MARKET_RECOMMEND_TYPE = [
  {
    id: 1,
    label: '员工推荐'
  },
  {
    id: 2,
    label: '学员推荐'
  },
];

export {
  MARKET_MOTORCYCLE_TYPE,
  MARKET_TRAINING_PROGRAMS,
  MARKET_MAKE_UP_EXAM,
  MARKET_STORE_OTHER_SERVICE,
  MARKET_BOOLEAN,
  MARKET_STATUS,
  MARKET_SERVICE_STATUS,
  MARKET_STORE_SCALE,
  MARKET_POST_TYPE,
  MARKET_COACH_TYPE,
  MARKET_TEACHING_CLASS,
  MARKET_TEACHING_SUBJECTS,
  MARKET_STORE_BUDINESS_STATUS,
  MARKET_STORE_TYPE,
  MARKET_STORE_PATTERN,
  MARKET_CLASS_FEE_STATUS,
  MARKET_WRITE_OFF_TYPE,
  MARKET_UP_DOWN_STATUS,
  MARKET_ACTIVITIES_STATUS,
  MARKET_CLASSESS_TYPE,
  MARKET_CHANNEL_STATUS,
  MARKET_ACTIVITIES_SET_STATUS,
  MARKET_COMMISSION_TYPE,
  MARKET_RECOMMEND_TYPE
};
