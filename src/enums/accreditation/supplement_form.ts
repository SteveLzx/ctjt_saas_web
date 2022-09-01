import { ParamsType } from '@/type';
import { REG_PRICE, REG_TWO_FLOAT_NUMBER } from '@/assets/js/common';
import {
  SUBJECT,
  CAPITAL_ACCOUNT,
  EXAM_RESULT,
  FEE_SUBJECT,
  CANCEL_REASON,
} from './base';

/** 补录表单配置 分配教练和监管学时没有补录 */
// 固定表单字段
const FIX_FORM: ParamsType = {
  selectList: [
    {
      label: '证件号码',
      key: 'idNo',
      value: '',
      placeholder: '请输入姓名/证件号码',
      multiple: false,
      clearable: true,
      width: 120,
      filterable: true,
      loading: true,
      options: [],
      customOptions: {
        value: 'idNo',
        label: 'idNo',
        title: 'userName'
      },
      rules: [
        { required: true, message: '请输入姓名/证件号码', trigger: 'blur' }
      ],
    },
  ],
  inputList: [
    {
      label: '姓名',
      key: 'userName',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [{ required: true, message: '找不到学员', trigger: 'blur' }],
    },
    {
      label: '批次号',
      key: 'batchNo',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '请输入批次号',
      clearable: true,
      disabled: false,
      rules: [
        { required: true, message: '请输入批次号', trigger: 'blur' },
        {
          max: 50,
          message: '长度在50个字以内',
          trigger: 'change'
        },
      ],
    },
  ],
  datePickerList: [],
  cascaderList: [],
};

/** 混合公共表单元素和各节点所需元素 */
function mixForm(localForm: ParamsType) {
  // 合并公共项，和各节点项
  const _localForm = localForm;
  Object.keys(FIX_FORM).forEach((key) => {
    const _list = _localForm[key];
    if (Array.isArray(_list)) {
      _localForm[key] = [...FIX_FORM[key], ..._localForm[key]];
    }
  });
  return _localForm;
}

// 无纸化采集
const PAPERLESS_COLLECT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '采集日期',
      key: 'collectDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择采集日期', trigger: 'blur' },
      ],
    },
  ],
});
// 场点交表补录表单配置
const SITE_DELIVERY_TABLE_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '场点交表日期',
      key: 'deliverDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择场点交表日期', trigger: 'blur' },
      ],
    },
  ],
});
// 牌证收表补录表单配置
const LICENSE_RECEIPT_FORM_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '牌证收表日期',
      key: 'recoveryDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择牌证收表日期', trigger: 'blur' },
      ],
    },
  ],
});
// 上课情况补录表单配置
const CLASS_SITUATION_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [{
    label: '备注',
    key: 'remark',
    type: 'text',
    value: '',
    width: 200,
    clearable: true,
    rules: [{
      max: 200,
      message: '长度在200个字以内',
      trigger: 'blur'
    }
    ],
  }],
  datePickerList: [
    {
      label: '上课日期',
      key: 'attendClassDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择上课日期', trigger: 'blur' },
      ],
    },
  ],
});
// 片区交表补录表单配置
const AREA_DELIVERY_TABLE_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '片区交表日期',
      key: 'areaDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择片区交表日期', trigger: 'blur' },
      ],
    },
  ],
});
// 车管所送审
const VEHICLE_APPROVAL_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '送审日期',
      key: 'inspectionDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择送审日期', trigger: 'blur' },
      ],
    },
  ],
});
// 资金监管存入
const CAPITAL_SUPERVISION_FORM: ParamsType = mixForm({
  inputList: [
    {
      label: '车型',
      key: 'carModel',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到车型', trigger: 'blur' },
      ],
    },
    // {
    //   label: '付款方式',
    //   key: 'payType',
    //   type: 'text',
    //   value: '全款',
    //   width: 200,
    //   clearable: true,
    //   disabled: true,
    //   rules: [
    //     { required: true, message: '找不到付款方式', trigger: 'blur' },
    //   ],
    // },
    {
      label: '转账码',
      key: 'transferCode',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '请输入转账码',
      clearable: true,
      rules: [
        { required: true, message: '请输入转账码', trigger: 'blur' },
      ],
    },
  ],
  selectList: [
    {
      label: '资金科目',
      key: 'step',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      width: 120,
      options: CAPITAL_ACCOUNT,
      rules: [{ required: true, message: '请选择资金科目', trigger: 'change' }],
    },
  ],
  datePickerList: [
    {
      label: '监管日期',
      key: 'superviseDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择监管日期', trigger: 'blur' },
      ],
    },
  ],
});
// 考场受理
const EXAM_ACCEPTANCE_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [
    {
      label: '车型',
      key: 'carModel',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到车型', trigger: 'blur' },
      ],
    },
    {
      label: '受理号',
      key: 'acceptNumber',
      customKey: 'examAcceptNum',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '请输入受理号',
      clearable: false,
      disabled: false,
      rules: []
    },
    {
      label: '失败原因',
      key: 'acceptFailReason',
      type: 'text',
      value: '',
      width: 300,
      clearable: false,
      disabled: false,
      rules: [],
    },
    {
      label: '备注',
      key: 'acceptRemark',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      rules: [{
        max: 200,
        message: '长度在200个字以内',
        trigger: 'blur'
      }
      ],
    },
  ],
  datePickerList: [
    {
      label: '受理日期',
      key: 'acceptDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择受理日期', trigger: 'blur' },
      ],
    },
  ],
});
// 考场受理-惠州深港
const HUIZHOU_EXAM_ACCEPTANCE_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [
    {
      label: '车型',
      key: 'carModel',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到车型', trigger: 'blur' },
      ],
    },
    {
      label: '失败原因',
      key: 'acceptFailReason',
      type: 'text',
      value: '',
      width: 300,
      clearable: false,
      disabled: false,
      rules: [],
    },
    {
      label: '备注',
      key: 'acceptRemark',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      rules: [{
        max: 200,
        message: '长度在200个字以内',
        trigger: 'blur'
      }
      ],
    },
  ],
  datePickerList: [
    {
      label: '受理日期',
      key: 'acceptDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择受理日期', trigger: 'blur' },
      ],
    },
  ],
});
// 学科培训
const SUBJECT_TRAINING_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '培训科目',
      key: 'step',
      value: '',
      multiple: false,
      clearable: true,
      width: 120,
      options: SUBJECT,
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [{ required: true, message: '请选择培训科目', trigger: 'blur' }],
    },
  ],
  inputList: [
    {
      label: '备注',
      key: 'remark',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      rules: [{
        max: 200,
        message: '长度在200个字以内',
        trigger: 'blur'
      }
      ],
    }
  ],
  datePickerList: [
    {
      label: '培训日期',
      key: 'subjectTrainDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择培训日期', trigger: 'blur' },
      ],
    },
  ],
});
// 考试报考
const APPLY_EXAM_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '科目',
      key: 'subject',
      value: '',
      placeholder: '请选择科目',
      multiple: false,
      clearable: true,
      width: 120,
      options: SUBJECT,
      rules: [{ required: true, message: '请选择科目', trigger: 'change' }],
    },
    {
      label: '考试地点',
      key: 'examAddress',
      value: '',
      placeholder: '请选择考试地点',
      multiple: false,
      clearable: true,
      width: 120,
      options: [],
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [{ required: true, message: '请选择考试地点', trigger: 'change' }],
    },
  ],
  inputList: [
    {
      label: '受理号',
      key: 'acceptNumber',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '请输入受理号',
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到受理号', trigger: 'blur' },
      ],
    },
  ],
  datePickerList: [
    {
      label: '考试日期',
      key: 'examDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择考试日期', trigger: 'blur' },
      ],
    },
  ],
});
// 考试批复
const EXAM_APPROVAL_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '科目',
      key: 'step',
      customKey: 'approvalStep',
      value: '',
      placeholder: '请选择科目',
      multiple: false,
      clearable: true,
      width: 200,
      options: SUBJECT,
      rules: [{ required: true, message: '请选择科目', trigger: 'change' }],
    },
    {
      label: '考试地点',
      key: 'examAddress',
      value: '',
      placeholder: '请选择考试地点',
      multiple: false,
      clearable: true,
      width: 200,
      options: [],
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [{ required: true, message: '请选择考试地点', trigger: 'change' }],
    },
  ],
  inputList: [
    // {
    //   label: '受理号',
    //   key: 'acceptNumber',
    //   customKey: 'approvalAcceptNumber',
    //   type: 'text',
    //   value: '',
    //   width: 200,
    //   placeholder: '请输入受理号',
    //   clearable: true,
    //   disabled: true,
    //   rules: [
    //     { required: true, message: '找不到受理号', trigger: 'blur' },
    //   ],
    // },
    {
      label: '车型',
      key: 'carModel',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到车型', trigger: 'blur' },
      ],
    },
    {
      label: '批复异常',
      key: 'replyAbnormal',
      type: 'text',
      value: '',
      width: 300,
      clearable: false,
      rules: [{
        max: 200,
        message: '长度在200个字以内',
        trigger: 'blur'
      }
      ],
    },
    // {
    //   label: '考试地点',
    //   key: 'examAddress',
    //   type: 'text',
    //   value: '',
    //   width: 200,
    //   placeholder: '请输入考试地点',
    //   clearable: true,
    //   rules: [
    //     { required: true, message: '请输入考试地点', trigger: 'blur' },
    //   ],
    // },
  ],
  datePickerList: [
    {
      label: '考试日期',
      key: 'examDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择考试日期', trigger: 'blur' },
      ],
    },
    {
      label: '考试时间',
      key: 'examTime',
      formatType: 'HH:mm',
      value: '',
      placeholder: '--:--',
      width: 200,
      type: 'time',
      rules: [
        { required: true, message: '请选择考试时间', trigger: 'blur' },
      ],
    },
  ],
});
// 考试批复-惠州深港
const HUIZHOU_EXAM_APPROVAL_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '科目',
      key: 'step',
      customKey: 'approvalStep',
      value: '',
      placeholder: '请选择科目',
      multiple: false,
      clearable: true,
      width: 200,
      options: SUBJECT,
      rules: [{ required: true, message: '请选择科目', trigger: 'change' }],
    },
    {
      label: '考试地点',
      key: 'examAddress',
      value: '',
      placeholder: '请选择考试地点',
      multiple: false,
      clearable: true,
      width: 200,
      options: [],
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [{ required: true, message: '请选择考试地点', trigger: 'change' }],
    },
  ],
  inputList: [
    // {
    //   label: '考试地点',
    //   key: 'examAddress',
    //   type: 'text',
    //   value: '',
    //   width: 200,
    //   placeholder: '请输入考试地点',
    //   clearable: true,
    //   rules: [
    //     { required: true, message: '请输入考试地点', trigger: 'blur' },
    //   ],
    // },
    {
      label: '车型',
      key: 'carModel',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到车型', trigger: 'blur' },
      ],
    },
  ],
  datePickerList: [
    {
      label: '考试日期',
      key: 'examDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择考试日期', trigger: 'blur' },
      ],
    },
    {
      label: '考试时间',
      key: 'examTime',
      formatType: 'HH:mm',
      value: '',
      placeholder: '--:--',
      width: 200,
      type: 'time',
      rules: [
        { required: true, message: '请选择考试时间', trigger: 'blur' },
      ],
    },
  ],
});
// 考试交费
const EXAM_FEE_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '交费方式',
      key: 'payType',
      value: '',
      placeholder: '请选择交费方式',
      multiple: false,
      clearable: false,
      width: 200,
      options: [{
        id: '代交',
        label: '代交'
      }, {
        id: '自交',
        label: '自交'
      }],
      rules: [{ required: true, message: '请选择交费方式', trigger: 'change' }],
    },
    {
      label: '科目',
      customKey: 'feeStep',
      key: 'step',
      value: '',
      placeholder: '请选择科目',
      multiple: false,
      clearable: false,
      width: 200,
      options: SUBJECT,
      rules: [{ required: true, message: '请选择科目', trigger: 'change' }],
    },
    {
      label: '费用科目',
      key: 'feeSubject',
      value: '',
      placeholder: '请选择费用科目',
      multiple: false,
      clearable: false,
      width: 200,
      options: FEE_SUBJECT,
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [{ required: true, message: '请选择费用科目', trigger: 'change' }],
    }
  ],
  inputList: [
    {
      label: '金额',
      key: 'fee',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '',
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到金额', trigger: 'blur' },
        // {
        //   validator: (rule: any, value: any, callback: any) => {
        //     const reg = REG_PRICE;
        //     if (!reg.test(value)) {
        //       callback(new Error('范围1-999999,最多保留两位小数'));
        //     }
        //     callback();
        //   },
        // },
      ],
    },
    // {
    //   label: '受理号',
    //   key: 'acceptNumber',
    //   customKey: 'feeAcceptNumber',
    //   type: 'text',
    //   value: '',
    //   width: 200,
    //   clearable: true,
    //   disabled: true,
    //   rules: [
    //     { required: true, message: '找不到受理号', trigger: 'blur' },
    //   ],
    // },
    {
      label: '门店',
      key: 'storeName',
      type: 'text',
      value: '',
      width: 200,
      clearable: false,
      disabled: true,
      rules: [
        { required: true, message: '找不到门店', trigger: 'blur' },
      ],
    },
    {
      label: '缴费流水号',
      key: 'payNumber',
      type: 'text',
      value: '',
      width: 200,
      clearable: false,
      disabled: false,
      rules: [{
        max: 50,
        message: '长度在50个字以内',
        trigger: 'blur'
      }
      ],
    },
  ],
  datePickerList: [
    {
      label: '交费日期',
      key: 'costDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择交费日期', trigger: 'blur' },
      ],
    },
  ]
});
// 考试交费-惠州深港
const HUIZHOU_EXAM_FEE_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '交费方式',
      key: 'payType',
      value: '',
      placeholder: '请选择交费方式',
      multiple: false,
      clearable: false,
      width: 200,
      options: [{
        id: '代交',
        label: '代交'
      }, {
        id: '自交',
        label: '自交'
      }],
      rules: [{ required: true, message: '请选择交费方式', trigger: 'change' }],
    },
    {
      label: '科目',
      customKey: 'feeStep',
      key: 'step',
      value: '',
      placeholder: '请选择科目',
      multiple: false,
      clearable: false,
      width: 200,
      options: SUBJECT,
      rules: [{ required: true, message: '请选择科目', trigger: 'change' }],
    },
    {
      label: '费用科目',
      key: 'feeSubject',
      value: '',
      placeholder: '请选择费用科目',
      multiple: false,
      clearable: false,
      width: 200,
      options: FEE_SUBJECT,
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [{ required: true, message: '请选择费用科目', trigger: 'change' }],
    }
  ],
  inputList: [
    {
      label: '金额',
      key: 'fee',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '',
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到金额', trigger: 'blur' },
        // {
        //   validator: (rule: any, value: any, callback: any) => {
        //     const reg = REG_PRICE;
        //     if (!reg.test(value)) {
        //       callback(new Error('范围1-999999,最多保留两位小数'));
        //     }
        //     callback();
        //   },
        // },
      ],
    },
    {
      label: '门店',
      key: 'storeName',
      type: 'text',
      value: '',
      width: 200,
      clearable: false,
      disabled: true,
      rules: [
        { required: true, message: '找不到门店', trigger: 'blur' },
      ],
    },
    {
      label: '缴费流水号',
      key: 'payNumber',
      type: 'text',
      value: '',
      width: 200,
      clearable: false,
      disabled: false,
      rules: [{
        max: 50,
        message: '长度在50个字以内',
        trigger: 'blur'
      }
      ],
    },
  ],
  datePickerList: [
    {
      label: '交费日期',
      key: 'costDate',
      formatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择交费日期', trigger: 'blur' },
      ],
    },
  ]
});

// 考试结果
const EXAM_RESULTS_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '科目',
      key: 'step',
      customKey: 'resultStep',
      value: SUBJECT[0].id,
      placeholder: '请选择',
      multiple: false,
      clearable: false,
      width: 120,
      options: SUBJECT,
      rules: [{ required: true, message: '请选择科目', trigger: 'change' }],
    },
    {
      label: '考试结果',
      key: 'examResult',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      disabled: false,
      width: 120,
      options: EXAM_RESULT,
      rules: [{ required: false, message: '请选择考试结果', trigger: 'change' }],
    },
    {
      label: '取消原因',
      key: 'remark',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      disabled: true,
      width: 150,
      options: CANCEL_REASON,
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [
        {
          required: false,
          message: '请选择取消原因',
          trigger: 'change',
        },
      ]
    }
  ],
  inputList: [
    {
      label: '考试成绩',
      key: 'examGrade',
      type: 'text',
      value: null,
      width: 200,
      clearable: true,
      disabled: false,
      rules: [
        { required: false, message: '请输入考试成绩' },
        {
          pattern: REG_TWO_FLOAT_NUMBER,
          message: '请输入最多保留两位小数的数值',
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (Number(value) > 100) {
              callback(new Error('成绩不能超过100'));
            }
            callback();
          },
        },
      ],
    },
    // {
    //   label: '受理号',
    //   key: 'acceptNumber',
    //   customKey: 'resultAcceptNumber',
    //   type: 'text',
    //   value: '',
    //   width: 200,
    //   clearable: true,
    //   disabled: true,
    //   rules: [
    //     { required: true, message: '找不到受理号', trigger: 'blur' },
    //   ],
    // },
    {
      label: '考试日期',
      key: 'examDate',
      customKey: 'resultExamDate',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到考试日期', trigger: 'blur' },
      ],
    },
  ],
  datePickerList: []
});
// 考试结果-惠州深港
const HUIZHOU_EXAM_RESULTS_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '科目',
      key: 'step',
      customKey: 'resultStep',
      value: SUBJECT[0].id,
      placeholder: '请选择',
      multiple: false,
      clearable: false,
      width: 120,
      options: SUBJECT,
      rules: [{ required: true, message: '请选择科目', trigger: 'change' }],
    },
    {
      label: '考试结果',
      key: 'examResult',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      disabled: false,
      width: 120,
      options: EXAM_RESULT,
      rules: [{ required: false, message: '请选择考试结果', trigger: 'change' }],
    },
    {
      label: '取消原因',
      key: 'remark',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      disabled: true,
      width: 150,
      options: CANCEL_REASON,
      customOptions: {
        value: 'label',
        label: 'label',
      },
      rules: [
        {
          required: false,
          message: '请选择取消原因',
          trigger: 'change',
        },
      ]
    }
  ],
  inputList: [
    {
      label: '考试成绩',
      key: 'examGrade',
      type: 'text',
      placeholder: '请输入考试成绩',
      value: null,
      width: 200,
      clearable: true,
      disabled: false,
      rules: [
        { required: false, message: '请输入考试成绩' },
        {
          pattern: REG_TWO_FLOAT_NUMBER,
          message: '请输入最多保留两位小数的数值',
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (Number(value) > 100) {
              callback(new Error('成绩不能超过100'));
            }
            callback();
          },
        },
      ],
    },
    {
      label: '考试日期',
      key: 'examDate',
      customKey: 'resultExamDate',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [
        { required: true, message: '找不到考试日期', trigger: 'blur' },
      ],
    },
  ],
  datePickerList: []
});

// 学员转出
const TRANSFER_OUT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
});

export {
  PAPERLESS_COLLECT_FORM,
  SITE_DELIVERY_TABLE_FORM,
  LICENSE_RECEIPT_FORM_FORM,
  CLASS_SITUATION_FORM,
  AREA_DELIVERY_TABLE_FORM,
  VEHICLE_APPROVAL_FORM,
  CAPITAL_SUPERVISION_FORM,
  EXAM_ACCEPTANCE_FORM,
  HUIZHOU_EXAM_ACCEPTANCE_FORM,
  SUBJECT_TRAINING_FORM,
  APPLY_EXAM_FORM,
  EXAM_APPROVAL_FORM,
  HUIZHOU_EXAM_APPROVAL_FORM,
  EXAM_FEE_FORM,
  HUIZHOU_EXAM_FEE_FORM,
  EXAM_RESULTS_FORM,
  HUIZHOU_EXAM_RESULTS_FORM,
  TRANSFER_OUT_FORM
};
