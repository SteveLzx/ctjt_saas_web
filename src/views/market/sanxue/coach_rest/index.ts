export const tableData = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  options: [
    {
      id: 1,
      label: '新增休假',
      path: 'btn_add',
      type: 'primary'
    },
    {
      id: 2,
      label: '取消休假',
      path: 'btn_cancel'
    },
    {
      id: 3,
      label: '修改休假',
      path: 'btn_edit',
      type: 'warning'
    },
    {
      id: 4,
      label: '导出',
      path: 'btn_export'
    }
  ],
  labels: [
    {
      key: 'name',
      label: '教练'
    },
    {
      key: 'restDate',
      label: '休息日期'
    },
    {
      key: 'timeFrameInfoList',
      label: '休息时段',
      render(h: any, params: any) {
        const { timeFrameInfoList } = params.row;
        const node: any[] = [];
        timeFrameInfoList.forEach((item: any) => {
          node.push(h('div', {}, item.name));
        });
        return h('div', {}, node);
      }
    },
    {
      key: 'cause',
      label: '请假事项',
      showOverflowTooltip: true
    },
    {
      key: 'operatorBy',
      label: '操作人'
    },
    {
      key: 'remark',
      label: '备注',
      showOverflowTooltip: true
    }
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

export const searchForm = {
  datePickerList: [
    {
      label: '休息日期',
      key: 'startDate',
      value: '',
      placeholder: '开始时间',
      type: 'date',
      width: 140,
    },
    {
      label: '-',
      key: 'endDate',
      value: '',
      placeholder: '结束时间',
      type: 'date',
      width: 140,
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
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      }
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

export const timeList = [
  {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }, {
    key: 1,
    label: '08:30-11:30'
  }
];

export const reasonList = [
  {
    key: 1,
    label: '正常休假'
  }, {
    key: 2,
    label: '请假'
  }, {
    key: 3,
    label: '接送学员'
  }, {
    key: 4,
    label: '公司工作安排'
  }, {
    key: 5,
    label: '法定节假日'
  }, {
    key: 6,
    label: '其他'
  }
];

export const coachRestData: any = {
  cause: '',
  coachId: '',
  name: '',
  remark: '',
  restDate: '',
  checkedList: []
};

export const rules = {
  coachId: [
    { required: true, message: '请选择教练' }
  ],
  restDate: [
    {
      required: true,
      message: '请选择休息日期',
      type: 'date'
    }
  ],
  checkedList: [
    {
      required: true,
      message: '请选择休息时段',
      type: 'array',
      min: 1
    }
  ],
  cause: [
    { required: true, message: '请选择休息原因' }
  ],
};
