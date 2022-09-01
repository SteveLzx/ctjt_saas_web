import dayjs from 'dayjs';
import { ORDER_PAY_TYPE } from '@/enums';
import {
  REG_PRICE_OR_ZONE, REG_PHONE, REG_ZERO_INTEGER, REG_USERCARD, REG_INTEGER, NUMBER_AND_EN_REG, OSS_BASEURL
} from '@/assets/js/common';
// 散学车型
export const carModelOpts = [
  { id: 'C1', label: 'C1' },
  { id: 'C2', label: 'C2' },
];

// 是否退费
const refundTypeOpts = [
  { id: 0, label: '未退费' },
  { id: 1, label: '已退费' },
];

// 学员状态
const studentTypeOpts = [
  { id: 1, label: '在学' },
  { id: 2, label: '毕业' },
  { id: 3, label: '历史' },
];

// 财务结转
const tradingTypeOpts = [
  { id: 1, label: '待结转' },
  { id: 2, label: '已结转' },
];

// 学车状态
const learnDrivingStatusOpts = [
  { id: 0, label: '已冻结' },
  { id: 1, label: '正常' },
];

// 收款状态
const payTypeOpts = [
  { id: 1, label: '未收款' },
  { id: 2, label: '已收款' },
];

// 列表搜索配置(公共)
const publicSearchForm: any = {
  datePickerList: [
    {
      label: '',
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
      width: 330,
      clearable: true,
      placeholder: '请输入学员姓名、证件号码、订单号、手机号',
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
      label: '学车教练',
      key: 'coachId',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      },
      filterable: true
    },
    {
      label: '散学车型',
      key: 'carModel',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: carModelOpts
    },
    {
      label: '班别',
      key: 'classesId',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      }
    },
    {
      label: '业务来源',
      key: 'channel',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: [],
      customOptions: {
        value: 'name',
        label: 'name'
      }
    },
    {
      label: '是否退费',
      key: 'refundType',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: refundTypeOpts
    },
    {
      label: '学员状态',
      key: 'studentType',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: studentTypeOpts
    },
    {
      label: '财务结转',
      key: 'tradingType',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: tradingTypeOpts
    }
  ],
  selectInputList: [
    {
      label: '剩余学时',
      select: {
        key: 'periodType',
        placeholder: '',
        value: 1,
        width: 80,
        options: [
          {
            id: 1,
            label: '大于',
          },
          {
            id: 2,
            label: '等于',
          },
          {
            id: 3,
            label: '小于',
          },
        ],
      },
      input: {
        key: 'period',
        value: null,
        type: 'number',
        placeholder: '请输入数字',
        width: 140,
        clearable: true,
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

const {
  datePickerList, inputList, selectList, selectInputList, buttonList
} = publicSearchForm;

// 列表搜索配置(广仁)
export const listSearchForm: any = {
  selectTimeList: [
    {
      label: '',
      select: {
        key: 'dateType',
        placeholder: '',
        value: 1,
        width: 110,
        options: [
          {
            id: 1,
            label: '报名日期',
          },
          {
            id: 2,
            label: '转历史日期',
          },
        ],
      },
    },
  ],
  datePickerList,
  inputList,
  selectList: [
    ...selectList,
    ...[
      {
        label: '学车状态',
        key: 'learnDrivingStatus',
        width: 100,
        value: '',
        placeholder: '请选择',
        clearable: true,
        options: learnDrivingStatusOpts
      },
      {
        label: '收款状态',
        key: 'payType',
        width: 100,
        value: '',
        placeholder: '请选择',
        clearable: true,
        options: payTypeOpts
      },
    ]
  ],
  selectInputList,
  buttonList
};

// 列表搜索配置(惠州)
export const listSearchFormHuizhou: any = {
  selectTimeList: [
    {
      label: '',
      select: {
        key: 'dateType',
        placeholder: '',
        value: 1,
        width: 110,
        options: [
          {
            id: 1,
            label: '报名日期',
          },
        ],
      },
    },
  ],
  datePickerList,
  inputList,
  selectList,
  selectInputList,
  buttonList
};

// 列表配置(广仁)
export const listTableData: any = {
  _this: {},
  loading: false,
  index: true,
  height: 300,
  selection: true,
  selectionList: [],
  list: [],
  options: [
    {
      id: 1,
      label: '新增订单',
      path: 'btn_add'
    },
    {
      id: 2,
      label: '学员加钟',
      path: 'btn_addclock'
    },
    {
      id: 3,
      label: '编辑',
      type: 'primary',
      icon: '&#xe60f;',
      path: 'btn_edit'
    },
    {
      id: 4,
      label: '收款审核',
      type: 'primary',
      path: 'btn_skfh'
    },
    {
      id: 5,
      label: '转车型',
      type: 'primary',
      path: 'btn_zcx'
    },
    {
      id: 6,
      label: '学车记录',
      type: 'primary',
      path: 'btn_xclog'
    },
    {
      id: 7,
      label: '分配教练',
      type: 'primary',
      path: 'btn_fpcoach'
    },
    {
      id: 8,
      label: '进历史',
      type: 'warning',
      path: 'btn_inhistory'
    },
    {
      id: 9,
      label: '学时解冻',
      type: 'warning',
      path: 'btn_xsjd'
    },
    {
      id: 10,
      label: '转出历史',
      type: 'warning',
      path: 'btn_outhistory'
    },
    {
      id: 11,
      label: '删除',
      type: 'danger',
      path: 'btn_delete',
    },
    {
      id: 12,
      label: '导出',
      type: 'primary',
      path: 'btn_export'
    },
    {
      id: 13,
      label: '打印收据',
      type: 'primary',
      path: 'btn_dysj'
    }
  ],
  labels: [
    {
      key: 'seq',
      label: '订单号',
      width: 80,
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { seq, id } = params.row;
        return h('el-link', {
          props: {
            type: 'primary',
            underline: false
          },
          on: {
            click: () => {
              params._self.tableData._this.jumpDetail(id, '1');
            }
          }
        },
        seq);
      }
    },
    {
      key: 'storeName',
      label: '门店',
      showOverflowTooltip: true
    },
    {
      key: 'name',
      label: '学员姓名',
      minWidth: 80,
      showOverflowTooltip: true
    },
    {
      key: 'applyDate',
      label: '报名日期',
      showOverflowTooltip: true
    },
    {
      key: 'mobile',
      label: '联系电话',
      showOverflowTooltip: true
    },
    {
      key: 'idNo',
      label: '证件号码',
      showOverflowTooltip: true
    },
    {
      key: 'channel',
      label: '业务来源',
      showOverflowTooltip: true
    },
    {
      key: 'channel2',
      label: '跟踪人',
      showOverflowTooltip: true
    },
    {
      key: 'coachName',
      label: '学车教练',
      showOverflowTooltip: true
    },
    {
      key: 'period',
      label: '散学学时(h)',
    },
    {
      key: 'presentPeriod',
      label: '赠送学时(h)',
    },
    {
      key: 'sumPeriod',
      label: '总学时(h)',
    },
    {
      key: 'surplusPeriod',
      label: '剩余学时(h)',
    },
    {
      key: 'originalPrice',
      label: '原价(元)',
      isPrice: true
    },
    {
      key: 'discountAmount',
      label: '优惠金额(元)',
      isPrice: true
    },
    {
      key: 'amount',
      label: '订单金额(元)',
      isPrice: true
    },
    {
      key: 'realityAmount',
      label: '实收金额(元)',
      isPrice: true
    },
    {
      key: 'remarks',
      label: '备注',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { remarks } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: remarks,
          },
          scopedSlots: {
            reference: () => h('p', remarks),
          },
        });
      }
    },
    {
      key: 'payStatus',
      label: '收款状态',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { payStatus } = params.row;
        const list = payTypeOpts.filter((item: any) => item.id === payStatus);
        return h('span', list[0] ? list[0].label : '');
      }
    },
    {
      key: 'carModel',
      label: '散学车型',
      showOverflowTooltip: true
    },
    {
      key: 'classesName',
      label: '班别',
      showOverflowTooltip: true
    },
    {
      key: 'carBrand',
      label: '车辆品牌',
      showOverflowTooltip: true
    },
    {
      key: 'tradingType',
      label: '财务结转',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { tradingType } = params.row;
        const list = tradingTypeOpts.filter((item: any) => item.id === tradingType);
        return h('span', list[0] ? list[0].label : '');
      }
    },
    {
      key: 'refundType',
      label: '是否退费',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { refundType } = params.row;
        const list = refundTypeOpts.filter((item: any) => item.id === refundType);
        return h('span', list[0] ? list[0].label : '');
      }
    },
    {
      key: 'studentStatus',
      label: '学员状态',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { studentStatus } = params.row;
        const list = studentTypeOpts.filter((item: any) => item.id === studentStatus);
        return h('span', list[0] ? list[0].label : '');
      }
    },
    {
      key: 'learnDrivingStatus',
      label: '学车状态',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { learnDrivingStatus } = params.row;
        const list = learnDrivingStatusOpts.filter((item: any) => item.id === learnDrivingStatus);
        return h('span', list[0] ? list[0].label : '');
      }
    },
    {
      key: 'createdName',
      label: '录单人',
    },
    {
      key: 'rollHistoryTime',
      label: '转历史日期',
      showOverflowTooltip: true
    },
    {
      key: 'unfreezeRemark',
      label: '解冻备注',
      showOverflowTooltip: false,
      render(h: any, params: any) {
        const { unfreezeRemark } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: unfreezeRemark,
          },
          scopedSlots: {
            reference: () => h('p', unfreezeRemark),
          },
        });
      }
    },
    {
      key: '',
      label: '解冻附件',
      minWidth: 165,
      render(h: any, params: any) {
        const { unfreezeAccessory } = params.row;
        const newList = unfreezeAccessory.map((item: any) => `${OSS_BASEURL}${item}`);
        return h('div', newList.map((item: any) => h('el-image', {
          props: {
            src: item,
            lazy: true,
            previewSrcList: newList
          },
          style: {
            width: '30px',
            height: '30px',
            marginRight: '2px'
          }
        })));
      }
    },
  ]
};

// 学车记录配置
export const studyCarLogsTableData: any = {
  list: [],
  labels: [
    {
      key: 'studentName',
      label: '姓名',
      minWidth: 100,
    },
    {
      key: 'carModel',
      label: '车型',
      minWidth: 80,
    },
    {
      key: 'appointDate',
      label: '学车日期',
      minWidth: 120,
      sortable: 'custom'
    },
    {
      key: 'learnDrivingTime',
      label: '学车时间',
      minWidth: 120,
    },
    {
      key: 'period',
      label: '已学学时',
      minWidth: 100,
    },
    {
      key: 'coachName',
      label: '教练姓名',
      minWidth: 100,
    },
    {
      key: 'operatorBy',
      label: '操作人',
      minWidth: 100,
    },
  ]
};

// 散学列表 转车型表单
export const listChangeCarModelFormData: any = {
  name: '', // 学员姓名
  idNo: '', // 证件号
  sumPeriod: '', // 总学时
  surplusPeriod: '', // 剩余学时
  oldCarModel: '', // 原车型
  oldCarBrand: '', // 原车品牌
  amount: '', // 补费金额
  carBrand: '', // 车辆品牌
  carModel: '', // 车型
  remarks: '', // 备注
  period: null, // 学时
  id: '',
  payInfoList: [
    {
      amount: null,
      id: null,
      outTradeNo: '',
      payContent: '',
      payTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      payType: 1,
      remark: '',
      transactionId: ''
    }
  ],
};

export const listChangeCarModelFormRules: any = {
  carModel: [{ required: true, message: '请选择现车型', trigger: ['change', 'blur'] }],
  carBrand: [{ required: true, message: '请选择现车品牌', trigger: ['change', 'blur'] }],
  period: [
    { required: true, message: '请输入学时', trigger: ['change', 'blur'] },
  ],
  amount: [
    { required: true, message: '请输入补费金额', trigger: ['change', 'blur'] },
    { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999.99, 可保留两位小数', trigger: ['change', 'blur'] }
  ],
  // 支付校验
  orderPayVosPayType: [
    { required: true, message: '必选项', trigger: 'blur' }
  ],
  orderPayVosPayContent: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  orderPayVosOutTradeNo: [
    { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
  ],
  orderPayVosTransactionId: [
    { required: true, message: '必填项', trigger: 'blur' },
    { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
  ],
  orderPayVosAmount: [
    { required: true, message: '请输入收款金额', trigger: 'blur' },
    { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999.99, 可保留两位小数', trigger: ['change'] }
  ],
  orderPayVosPayTime: [
    { required: true, message: '请选择收款日期', trigger: 'change' }
  ],
};

// 散学详情表单配置
export const detailFormData: any = {
  seq: '', // 订单编号
  createdName: '', // 录单人
  amount: null, // 订单金额
  carBrand: '', // 车辆品牌
  carModel: '', // 车型
  channel: '', // 渠道
  channel2: '', // 渠道二
  coachId: null, // 教练id
  coachName: '', // 教练姓名
  couponNumber: '', // 优惠卷号码
  discountAmount: null, // 优惠金额
  discountType: null, // 优惠方式，1现金，2赠送学时，3优惠券
  drivingSchoolId: null, // 驾校ID
  drivingSchoolName: '', // 驾校名称
  examType: 0, // 报考类别
  examClasses: '', // 报考班别
  examClassesId: '', // 报考班别Id
  examDateTime: '', // 报考日期 yyyy-MM-dd HH:mm:ss
  id: null, // 数据库ID(新增禁传,修改必传)
  idNo: '', // 证件号码
  identifyNumber: '', // 纳税人识别号
  invoiceId: null, // 发票ID(新增时不传,修改时必传)
  invoiceMode: 1, // 开票方式
  invoiceName: '', // 发票名称
  invoiceType: 1, // 发票类型
  learnChannel: '', // 获知途径
  mobile: '', // 手机号码
  name: '', // 姓名
  originalPrice: null, // 原价
  papersType: null, // 证件类型 1:身份证
  period: null, // 散学学时
  pickUpArea: '', // 接送地址(区)
  pickUpAreaId: '', // 接送地址(区)Id
  pickUpCity: '', // 接送地址(市)
  pickUpCityId: '', // 接送地址(市)Id
  pickUpDetail: '', // 接送地址(详细地址)
  pickUpProvince: '', // 接送地址(省)
  pickUpProvinceId: '', // 接送地址(省)Id
  presentPeriod: null, // 赠送学时
  regionId: null, // 片区id
  regionName: '', // 片区名称
  remarks: '', // 备注
  sex: null, // 性别 1:男 2:女
  thirdRegionId: null, // 深港转入的片区id
  thirdRegionName: '', // 深港转入的片区名称
  thirdStoreId: null, // 深港转入的门店id
  thirdStoreName: '', // 深港转入的门店名称
  storeId: null, // 门店id
  storeName: '', // 门店名称
  sumPeriod: null, // 总学时
  usedPeriod: null, // 已学学时
  updateType: 1, // 1新增/加钟；2编辑；3收款复核(完成复核)
  // payId: null, // 支付主键ID
  // outTradeNo: '', // 交易参考号/核销码/付款帐号
  // payContent: '', // pos终端号/第三方渠道名称/收款帐号
  // payTime: '', // 收款日期
  // payType: 2, // 支付类型 1:第三方付款 2:pos刷卡 3:转账 4:收款二维码 5:哩哩小程序 99:其他线上支付(预设)
  // practicalAmount: null, // 收款金额
  // transactionId: '', // 微信支付订单号 / 第三方订单号 / 收款二维码编号
  payInfoList: [
    {
      amount: null,
      id: null,
      outTradeNo: '',
      payContent: '',
      payTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      payType: 2,
      remark: '',
      transactionId: ''
    },
  ],
  agent: '', // 代理人
  referrer: '', // 推荐人
};

export const detailFormData1: any = {
  amount: null, // 订单金额
  carBrand: '标致', // 车辆品牌
  carModel: 'C1', // 车型
  channel: '客服自招', // 渠道
  channel2: '肖兰芳', // 渠道二
  coachId: '104512', // 教练id
  coachName: '黄吴生', // 教练姓名
  couponNumber: '', // 优惠卷号码
  discountAmount: 20, // 优惠金额
  discountType: 1, // 优惠方式，1现金，2赠送学时，3优惠券
  drivingSchoolId: null, // 驾校ID
  drivingSchoolName: '', // 驾校名称
  examType: 0, // 报考类别
  examClasses: '', // 报考班别
  examClassesId: '', // 报考班别Id
  examDateTime: '2022-03-31 14:25:55', // 报考日期 yyyy-MM-dd HH:mm:ss
  id: null, // 数据库ID(新增禁传,修改必传)
  idNo: '420102200003078819', // 证件号码
  identifyNumber: '', // 纳税人识别号
  invoiceId: null, // 发票ID(新增时不传,修改时必传)
  invoiceMode: 1, // 开票方式
  invoiceName: '张学友', // 发票名称
  invoiceType: 1, // 发票类型
  learnChannel: '微信分享', // 获知途径
  mobile: '18822825395', // 手机号码
  name: '张学友', // 姓名
  originalPrice: null, // 原价
  papersType: 1, // 证件类型 1:身份证
  period: null, // 散学学时
  pickUpArea: '越秀区', // 接送地址(区)
  pickUpAreaId: '440104', // 接送地址(区)Id
  pickUpCity: '广州市', // 接送地址(市)
  pickUpCityId: '440100', // 接送地址(市)Id
  pickUpDetail: '人民公园', // 接送地址(详细地址)
  pickUpProvince: '广东省', // 接送地址(省)
  pickUpProvinceId: '440000', // 接送地址(省)Id
  presentPeriod: null, // 赠送学时
  regionId: '1470', // 片区id
  regionName: '广仁陪驾片区', // 片区名称
  remarks: '备注我还学车', // 备注
  sex: 1, // 性别 1:男 2:女
  thirdRegionId: null, // 深港转入的片区id
  thirdRegionName: '', // 深港转入的片区名称
  thirdStoreId: null, // 深港转入的门店id
  thirdStoreName: '', // 深港转入的门店名称
  storeId: '4052', // 门店id
  storeName: '民治天虹', // 门店名称
  sumPeriod: 0, // 总学时
  usedPeriod: 0, // 已学学时
  updateType: 1, // 1新增；2编辑；3收款复核(完成复核)
  // payId: null, // 支付主键ID
  // outTradeNo: '31231231', // 交易参考号/核销码/付款帐号
  // payContent: '车生活', // pos终端号/第三方渠道名称/收款帐号
  // payTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 收款日期
  // payType: 1, // 支付类型 1:第三方付款 2:pos刷卡 3:转账 4:收款二维码 5:哩哩小程序 99:其他线上支付(预设)
  // practicalAmount: null, // 收款金额
  // transactionId: '31231', // 微信支付订单号 / 第三方订单号 / 收款二维码编号
  payInfoList: [
    {
      amount: 0,
      id: 0,
      outTradeNo: '',
      payContent: '',
      payTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      payType: 2,
      remark: '',
      transactionId: ''
    }
  ],
  agent: '', // 代理人
  referrer: '', // 推荐人
};
// 散学详情表单校验

// 校验规则

const validateIdNo = (rule: any, value: string, callback: any) => {
  const { certificateType } = detailFormData;
  if (value === '') {
    callback(new Error('请输入证件号码'));
  } else if (certificateType === 1 && !REG_USERCARD.test(value)) {
    callback(new Error('身份证号码有误'));
  } else {
    callback();
  }
};

export const detailFormRules: any = {
  name: [{ required: true, message: '请输入姓名', trigger: ['change', 'blur'] }],
  mobile: [
    { required: true, message: '请输入手机号码', trigger: ['change', 'blur'] },
    { pattern: REG_PHONE, message: '请输入正确的格式', trigger: 'change' }
  ],
  papersType: [{ required: true, message: '请选择证件类型', trigger: ['change', 'blur'] }],
  idNo: [
    { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] },
    { validator: validateIdNo, trigger: ['change', 'blur'] }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: ['change', 'blur'] }],
  pickUpProvinceId: [{ required: true, message: '请选择省份', trigger: ['change', 'blur'] }],
  pickUpCityId: [{ required: true, message: '请选择城市', trigger: ['change', 'blur'] }],
  pickUpAreaId: [{ required: true, message: '请选择区域', trigger: ['change', 'blur'] }],
  pickUpDetail: [{ required: true, message: '请输入详细地址', trigger: ['change', 'blur'] }],
  invoiceType: [{ required: true, message: '请选择发票类型', trigger: ['change', 'blur'] }],
  invoiceMode: [{ required: true, message: '请选择开票方式', trigger: ['change', 'blur'] }],
  invoiceName: [{ required: true, message: '请输入发票名称', trigger: ['change', 'blur'] }],
  identifyNumber: [{
    required: true, message: '请输入纳税人识别号', trigger: ['change', 'blur']
  }],
  channel: [{ required: true, message: '请选择业务来源', trigger: ['change', 'blur'] }],
  channel2: [{ required: true, message: '请选择跟踪人', trigger: ['change', 'blur'] }],
  thirdRegionName: [{ required: true, message: '请选择片区', trigger: ['change', 'blur'] }],
  thirdStoreName: [{ required: true, message: '请选择门店', trigger: ['change', 'blur'] }],
  regionName: [{ required: true, message: '请选择片区', trigger: ['change', 'blur'] }],
  storeName: [{ required: true, message: '请选择门店', trigger: ['change', 'blur'] }],
  examClasses: [{ required: true, message: '请选择散学班别', trigger: ['change', 'blur'] }],
  carModel: [{ required: true, message: '请选择散学车型', trigger: ['change', 'blur'] }],
  carBrand: [{ required: true, message: '请选择车辆品牌', trigger: ['change', 'blur'] }],
  examDateTime: [{ required: true, message: '请选择报名日期', trigger: ['change', 'blur'] }],
  period: [
    { required: true, message: '请输入散学学时', trigger: ['change', 'blur'] },
    { pattern: REG_ZERO_INTEGER, message: '请输入>=0的整数', trigger: ['change', 'blur'] }
  ],
  couponNumber: [{ required: false, message: '请输入优惠券号码', trigger: ['blur'] }],
  discountAmount: [
    { required: true, message: '请输入优惠金额', trigger: ['blur'] },
    { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999.99, 可保留两位小数', trigger: ['change'] }
  ],
  presentPeriod: [
    { required: true, message: '请输入赠送学时', trigger: ['blur'] },
    { pattern: REG_INTEGER, message: '请输入>0的整数', trigger: ['change'] }
  ],
  learnChannel: [{ required: true, message: '请选择业务途径', trigger: ['change', 'blur'] }],
  // 循环支付列表校验
  orderPayVosPayType: [
    { required: true, message: '必选项', trigger: 'blur' }
  ],
  orderPayVosPayContent: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  orderPayVosOutTradeNo: [
    { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
  ],
  orderPayVosTransactionId: [
    { required: true, message: '必填项', trigger: 'blur' },
    { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
  ],
  orderPayVosAmount: [
    { required: true, message: '请输入收款金额', trigger: 'blur' },
    { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999.99, 可保留两位小数', trigger: ['change'] }
  ],
  orderPayVosPayTime: [
    { required: true, message: '请选择收款日期', trigger: 'change' }
  ],
};

// 散学详情支付列表
export const detailOrderPaytableData: any = {
  _this: {},
  index: true,
  list: [],
  labels: [
    {
      key: 'payType',
      label: '收款方式',
      minWidth: 120,
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { payType } = params.row;
        if (!payType) return h('div', '-');
        const _list = ORDER_PAY_TYPE.filter(item => item.id === payType);
        return h('div', _list[0] ? _list[0].label : '');
      }
    },
    {
      key: 'receipt',
      label: '收据编号',
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      key: 'amount',
      label: '收款金额(元)',
    },
    {
      key: '',
      label: '收据信息',
      minWidth: 200,
      render(h: any, params: any) {
        const {
          payType, payContent, outTradeNo, transactionId
        } = params.row;
        const _cssStyle = 'white-space: pre-line;';
        if (payType === 5) {
          return h('div', '');
        }
        if (payType === 2) {
          return h('div', { style: _cssStyle }, `POS机号：${payContent || ''}\n交易参考号：${outTradeNo || ''}`);
        }
        if (payType === 4) {
          return h('div', { style: _cssStyle }, `收款二维码编号：${payContent || ''}\n交易参考号：${outTradeNo || ''}`);
        }
        if (payType === 3) {
          return h('div', { style: _cssStyle }, `付款账号：${transactionId || ''}\n收款账号：${payContent || ''}`);
        }
        if (payType === 1) {
          return h('div', { style: _cssStyle }, `第三方渠道名称：${payContent || ''}\n第三方订单号：${transactionId || ''}\n核销码：${outTradeNo || ''}`);
        }
        return h('div', '');
      }
    },
    {
      key: 'payTime',
      label: '收款时间',
      minWidth: 160
    },
    {
      key: 'remark',
      label: '备注',
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
      key: '',
      label: '修改',
      render(h: any, params: any) {
        const that = params._self.tableData._this;
        return h('el-link', {
          props: {
            type: 'primary',
            underline: false,
            disabled: that.type === 1
          },
          on: {
            click: () => {
              that.editOrderPayVos(params.$index);
            }
          }
        },
        '修改');
      }
    },
  ],
};
