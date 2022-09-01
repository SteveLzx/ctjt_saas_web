// 列表搜索配置
export const listSearchForm: any = {
  datePickerList: [
    {
      label: '学车日期',
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
  inputList: [
    {
      label: '关键词',
      key: 'keyword',
      type: 'text',
      value: '',
      width: 280,
      clearable: true,
      placeholder: '请输入学员姓名、证件号码、手机号',
    }
  ],
  selectList: [
    {
      label: '片区/门店',
      key: 'regionId',
      value: '',
      placeholder: '请选择片区',
      clearable: true,
      width: 140,
      options: []
    },
    {
      label: '',
      key: 'storeId',
      width: 140,
      value: '',
      placeholder: '请选择门店',
      clearable: true,
      options: []
    },
    {
      label: '教练',
      key: 'coachId',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      filterable: true,
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      }
    },
  ],
  buttonList: [
    {
      label: '查询',
      key: 'search',
      type: 'primary',
      path: 'btn_search'
    },
    {
      label: '重置',
      key: 'reset',
      path: 'btn_search'
    }
  ]
};

// 列表配置
export const listTableData: any = {
  _this: {},
  loading: false,
  index: true,
  selection: true,
  selectionList: [],
  list: [],
  options: [
    {
      id: 1,
      label: '新增带教记录',
      path: 'btn_add'
    },
    {
      id: 2,
      label: '删除',
      path: 'btn_delete',
      type: 'danger',
    },
  ],
  labels: [
    {
      key: 'studentName',
      label: '学员姓名',
      showOverflowTooltip: true
    },
    {
      key: 'idNo',
      label: '证件号码',
      showOverflowTooltip: true
    },
    {
      key: 'studentMobile',
      label: '联系方式',
      showOverflowTooltip: true
    },
    {
      key: 'seq',
      label: '订单号',
      showOverflowTooltip: true
    },
    {
      key: 'storeName',
      label: '门店',
      showOverflowTooltip: true
    },
    {
      key: 'carModel',
      label: '车型',
      showOverflowTooltip: true
    },
    {
      key: 'appointDate',
      label: '学车日期',
      showOverflowTooltip: true,
      sortable: 'custom'
    },
    {
      key: 'learnDrivingTime',
      label: '学车时间',
      showOverflowTooltip: true
    },
    {
      key: 'period',
      label: '已学学时(h)',
      showOverflowTooltip: true
    },
    {
      key: 'coachName',
      label: '教练姓名',
      showOverflowTooltip: true
    },
    {
      key: '',
      label: '回访评价',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { remark } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: remark,
          },
          scopedSlots: {
            reference: () => h('p', remark),
          },
        });
      }
    },
    {
      key: 'operatorBy',
      label: '操作人',
      showOverflowTooltip: true
    },
    {
      key: 'operatorDate',
      label: '操作日期',
      showOverflowTooltip: true
    },
  ]
};

// 约车表单
export const listFormData: any = {
  appointDate: '', // 约车日期
  carBrand: '', // 车辆品牌
  carModel: '', // 车型
  classesType: 1, // 练车班次 1:自由班 2:两小时班 3:三小时班
  coachId: '', // 教练Id
  coachName: '', // 教练姓名
  endTime: '', // 结束时间
  followPerson: '', // 跟踪人
  id: 0,
  idNo: '', // 证件号码
  orderId: 0, // 订单id
  regionId: 0, // 片区id
  regionName: '', // 片区
  remark: '', // 回访评价
  seq: '', // 订单号
  startTime: '', // 开始时间
  storeId: 0, // 门店id
  storeName: '', // 门店
  studentIdNo: '', // 学员证件号码
  studentMobile: '', // 学员手机号
  studentName: '' // 学员姓名
};

// 约车表单校验
export const listFormRules = {
  appointDate: [
    { required: true, message: '请选择约车日期', trigger: ['change', 'blur'] }
  ],
  startTime: [
    { required: true, message: '请选择约车开始时间', trigger: ['change', 'blur'] }
  ],
  endTime: [
    { required: true, message: '请选择约车结束时间', trigger: ['change', 'blur'] }
  ],
  coachName: [
    { required: true, message: '请选择教练姓名', trigger: ['change', 'blur'] }
  ],
};
