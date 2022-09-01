function render(time: string) {
  return (h: any, params: any) => {
    const { row } = params;
    const data = row[time];
    if (!data) return h('div', '');
    const list = data.split('LF');
    let node: any = '';
    list.forEach((item: string) => {
      // node.push(h('div', {}, item));
      node += `<div>${item}</div>`;
    });
    return h('div', {
      style: {
        cursor: 'pointer'
      },
      domProps: {
        innerHTML: node
      }
    });
  };
}

export const tableData = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  options: [
    {
      id: 1,
      label: '约车',
      path: 'btn_driving',
      type: 'primary'
    },
    {
      id: 2,
      label: '约车补录',
      path: 'btn_driving_bl',
      type: 'primary'
    },
    {
      id: 4,
      label: '导出',
      path: 'btn_export'
    }
  ],
  labels: [],
  labels1: [
    {
      key: 'dateAndWeek',
      label: '日期',
      width: 100,
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { dateAndWeek, date } = params.row;
        if (dateAndWeek && dateAndWeek.includes('星期')) {
          return h('div', [
            h('p', date),
            h('p', dateAndWeek.slice(-3)),
          ]);
        }
        return h('div', dateAndWeek);
      }
    },
    {
      key: 'name',
      label: '教练姓名',
      width: 100,
    },
    {
      key: 'teachCar',
      label: '车型',
      width: 100,
    },
    {
      key: 'carBrand',
      label: '车品牌',
      showOverflowTooltip: true
    },
    {
      key: 'teachArea',
      label: '带教区域',
      showOverflowTooltip: true
    }
  ],
  labels2: [
    {
      key: '07:30-09:30',
      label: '07:30-09:30',
      showOverflowTooltip: true,
      render: render('07:30-09:30')
    },
    {
      key: '10:00-12:00',
      label: '10:00-12:00',
      showOverflowTooltip: true,
      render: render('10:00-12:00')
    },
    {
      key: '13:30-15:30',
      label: '13:30-15:30',
      showOverflowTooltip: true,
      render: render('13:30-15:30')
    },
    {
      key: '16:00-18:00',
      label: '16:00-18:00',
      showOverflowTooltip: true,
      render: render('16:00-18:00')
    },
    {
      key: '18:30-20:30',
      label: '18:30-20:30',
      showOverflowTooltip: true,
      render: render('18:30-20:30')
    },
    {
      key: 'countPeriod',
      label: '合计(小时)',
      width: 100,
    }
  ],
  labels3: [
    {
      key: '08:30-11:30',
      label: '08:30-11:30',
      showOverflowTooltip: true,
      render: render('08:30-11:30')
    },
    {
      key: '14:00-17:00',
      label: '14:00-17:00',
      showOverflowTooltip: true,
      render: render('14:00-17:00')
    },
    {
      key: '18:00-21:00',
      label: '18:00-21:00',
      showOverflowTooltip: true,
      render: render('18:00-21:00')
    },
    {
      key: 'countPeriod',
      label: '合计(小时)',
      width: 100,
    }
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

export const searchForm = {
  datePickerList: [
    {
      label: '排班日期',
      key: 'startDate',
      value: '',
      placeholder: '开始时间',
      type: 'date',
      width: 140,
      clearable: false,
      editable: false
    },
    {
      label: '-',
      key: 'endDate',
      value: '',
      placeholder: '结束时间',
      type: 'date',
      width: 140,
      clearable: false,
      editable: false
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
      },
      filterable: true
    },
    {
      label: '班别明细',
      key: 'classes',
      value: 2,
      placeholder: '',
      multiple: false,
      width: 130,
      options: [{
        label: '2小时班',
        id: 2
      }, {
        label: '3小时班',
        id: 3
      }],
    },
    {
      label: '4s店查询',
      key: 'partners',
      value: '',
      placeholder: '',
      multiple: false,
      clearable: true,
      width: 130,
      options: [],
      customOptions: {
        value: 'name',
        label: 'name'
      },
    },
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

export const classList = [
  {
    label: '2小时班',
    value: 2
  },
  {
    label: '3小时班',
    value: 3
  },
  {
    label: '自由班',
    value: 1
  },
];

export const timeList: any = {
  2: [
    {
      label: '07:30-09:30',
      value: 1
    },
    {
      label: '10:00-12:00',
      value: 2
    },
    {
      label: '13:30-15:30',
      value: 3
    },
    {
      label: '16:00-18:00',
      value: 4
    },
    {
      label: '18:30-20:30',
      value: 5
    }
  ],
  3: [
    {
      label: '08:30-11:30',
      value: 1
    },
    {
      label: '14:00-17:00',
      value: 2
    },
    {
      label: '18:00-21:00',
      value: 3
    }
  ]
};

export const detailDataRules = {
  appointDate: [
    { required: true, message: '请选择约车日期', trigger: ['change', 'blur'] }
  ],
  classesType: [
    { required: true, message: '请选择练车班次', trigger: ['change', 'blur'] }
  ],
  coachId: [
    { required: true, message: '请选择教练', trigger: ['change', 'blur'] }
  ],
  timeFrameName: [
    { required: true, message: '请选择班次时间', trigger: ['change', 'blur'] }
  ],
  endTime: [
    { required: true, message: '请选择班次时间', trigger: ['change', 'blur'] }
  ],
  areaId: [
    { required: true, message: '请选择接送地址', trigger: ['change', 'blur'] }
  ],
  pickUpDetail: [
    { required: true, message: '请填写详细地址', trigger: ['change', 'blur'] }
  ],
  studentName: [
    { required: true, message: '请先选择学员', trigger: ['change', 'blur'] }
  ]
};

export const cancelReason = {
  coach: [
    {
      label: '身体原因',
      value: 1
    },
    {
      label: '家里有事',
      value: 2
    },
    {
      label: '天气原因',
      value: 3
    },
    {
      label: '车辆原因',
      value: 4
    },
    {
      label: '交通原因',
      value: 5
    },
    {
      label: '上下班次间隔太短',
      value: 6
    },
    {
      label: '排班地点不在范围内',
      value: 7
    },
    {
      label: '导师微信帮学员取消',
      value: 8
    },
  ],
  student: [
    {
      label: '学员主动取消',
      value: 8
    }
  ]
};

export const detail = {
  appointDate: '',
  carModel: '',
  classesType: '',
  coachId: '',
  coachName: '',
  endTime: '',
  followPerson: '',
  pickUpArea: '',
  pickUpAreaId: '',
  pickUpCity: '',
  pickUpCityId: '',
  pickUpDetail: '',
  pickUpProvince: '',
  pickUpProvinceId: '',
  pickUpStreet: '',
  regionId: '',
  id: '',
  regionName: '',
  remark: '',
  storeId: '',
  storeName: '',
  studentIdNo: '',
  studentMobile: '',
  studentName: '',
  timeFrameName: '',
  sumPeriod: '',
  usedPeriod: '',
  period: '',
  pickUpAddress: '',
  operatorDate: '',
  operatorBy: '',
  disableCoach: false,
  provinceId: '',
  provinceName: '',
  cityId: '',
  cityName: '',
  areaId: '',
  areaName: '',
  orderId: '',
  seq: '',
  carBrand: '',
  idNo: ''
};
