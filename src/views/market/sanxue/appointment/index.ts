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
      key: 'studentName',
      label: '学员姓名'
    }, {
      key: 'idNo',
      label: '证件号码'
    }, {
      key: 'studentMobile',
      label: '联系方式'
    }, {
      key: 'seq',
      label: '订单号',
      showOverflowTooltip: true
    }, {
      key: 'carModel',
      label: '车型',
      showOverflowTooltip: true
    }, {
      key: 'carBrand',
      label: '车辆品牌',
      showOverflowTooltip: true
    }, {
      key: 'pickUpAddress',
      label: '接送地址',
      showOverflowTooltip: true
    }, {
      key: 'appointDate',
      label: '学车日期',
      sortable: 'custom'
    }, {
      key: 'learnDrivingTime',
      label: '学车时间'
    }, {
      key: 'period',
      label: '已学学时'
    }, {
      key: 'coachName',
      label: '教练姓名'
    }, {
      key: 'operatorBy',
      label: '操作人'
    }
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

export const searchForm = {
  datePickerList: [
    {
      label: '学车日期',
      key: 'startDate',
      value: '',
      placeholder: '开始时间',
      type: 'date',
      width: 140,
      clearable: true
    },
    {
      label: '-',
      key: 'endDate',
      value: '',
      placeholder: '结束时间',
      type: 'date',
      width: 140,
      clearable: true
    },
  ],
  selectList: [
    {
      label: '教练',
      key: 'coachId',
      value: '',
      placeholder: '请选择教练',
      multiple: false,
      clearable: true,
      width: 130,
      filterable: true,
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      }
    }
  ],
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
      path: 'btn_reset'
    }
  ]
};
