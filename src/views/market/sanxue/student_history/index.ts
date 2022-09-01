export const tableData = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  options: [
    {
      id: 4,
      label: '导出',
      path: 'btn_export'
    }
  ],
  labels: [
    {
      key: 'storeName',
      label: '学员姓名'
    }, {
      key: 'storeName',
      label: '报名日期'
    }, {
      key: 'storeName',
      label: '证件号码'
    }, {
      key: 'storeName',
      label: '联系电话'
    }, {
      key: 'storeName',
      label: '教练'
    }, {
      key: 'storeName',
      label: '片区'
    }, {
      key: 'storeName',
      label: '门店'
    }, {
      key: 'storeName',
      label: '散学车型'
    }, {
      key: 'storeName',
      label: '车品牌'
    }, {
      key: 'storeName',
      label: '散学学时'
    }, {
      key: 'storeName',
      label: '赠送学时'
    }, {
      key: 'storeName',
      label: '减免金额'
    }, {
      key: 'storeName',
      label: '总金额'
    }, {
      key: 'storeName',
      label: '票据号码'
    }, {
      key: 'storeName',
      label: '转入日期'
    }, {
      key: 'storeName',
      label: '操作人'
    }
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

export const searchForm = {
  selectTimeList: [
    {
      label: '',
      clearable: true,
      select: {
        key: 'dateType',
        placeholder: '',
        value: 1,
        width: 110,
        options: [
          {
            id: 1,
            label: '转入日期',
          },
          {
            id: 2,
            label: '报名日期',
          }
        ],
      }
    },
  ],
  datePickerList: [
    {
      label: '',
      key: 'beginDate',
      value: '',
      type: 'date',
      placeholder: '开始时间',
      width: 140,
    },
    {
      label: '-',
      key: 'endDate',
      value: '',
      type: 'date',
      placeholder: '结束时间',
      width: 140,
    }
  ],
  selectList: [],
  inputList: [
    {
      label: '关键字',
      key: 'keyword',
      type: 'text',
      value: '',
      width: 310,
      placeholder: '请输入学员姓名、手机号、证件号码',
      clearable: true,
    }
  ],
  buttonList: [
    {
      label: '查询',
      key: 'search',
      type: 'primary',
      plain: false,
      path: 'btn_search'
    },
    {
      label: '重置',
      key: 'reset',
      type: '',
      plain: false,
      path: 'btn_search'
    }
  ]
};
