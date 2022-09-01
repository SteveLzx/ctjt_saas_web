import { ParamsType } from '@/type';
import { SUBJECT } from './base';

/** 补录表单配置 分配教练和监管学时没有补录 */
// 固定表单字段
const FIX_EDIT_FORM: ParamsType = {
  inputList: [
    {
      label: '姓名',
      key: 'userName',
      type: 'text',
      value: '',
      width: 600,
      labelWidth: 130,
      clearable: true,
      disabled: true,
      rules: [{ required: true, message: '找不到学员', trigger: 'blur' }],
    },
    {
      label: '证件号码',
      key: 'idNo',
      type: 'text',
      value: '',
      width: 600,
      labelWidth: 130,
      clearable: true,
      disabled: true,
      rules: [{ required: true, message: '找不到学员', trigger: 'blur' }],
    }
  ],
  selectList: [],
  datePickerList: [],
};

/** 混合公共表单元素和各节点所需元素 */
function mixForm(localForm: ParamsType) {
  // 合并公共项，和各节点项
  const _localForm = localForm;
  Object.keys(FIX_EDIT_FORM).forEach((key) => {
    const _list = _localForm[key];
    if (Array.isArray(_list)) {
      _localForm[key] = [...FIX_EDIT_FORM[key], ..._localForm[key]];
    }
  });
  return _localForm;
}

// 无纸化采集
const PAPERLESS_COLLECT_EDIT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '采集日期',
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      width: 600,
      labelWidth: 130,
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择采集日期', trigger: 'blur' },
      ],
    },
  ],
});
// 场点交表表单配置
const SITE_DELIVERY_TABLE_EDIT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '场点交表日期',
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      width: 600,
      labelWidth: 130,
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择场点交表日期', trigger: 'blur' },
      ],
    },
  ],
});
// 牌证收表表单配置
const LICENSE_RECEIPT_FORM_EDIT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '牌证收表日期',
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      width: 600,
      labelWidth: 130,
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择牌证收表日期', trigger: 'blur' },
      ],
    },
  ],
});
// 上课情况表单配置
const CLASS_SITUATION_EDIT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [{
    label: '备注',
    key: 'remark',
    type: 'text',
    value: '',
    width: 600,
    labelWidth: 130,
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
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      width: 600,
      labelWidth: 130,
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择上课日期', trigger: 'blur' },
      ],
    },
  ],
});

// 车管所送审
const VEHICLE_APPROVAL_EDIT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [],
  datePickerList: [
    {
      label: '送审日期',
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      width: 600,
      labelWidth: 130,
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择送审日期', trigger: 'blur' },
      ],
    },
  ],
});
// 考场受理-受理成功
const EXAM_ACCEPTANCE_EDIT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [
    {
      label: '备注',
      key: 'remark',
      type: 'text',
      value: '',
      width: 600,
      labelWidth: 130,
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
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      width: 600,
      labelWidth: 130,
      placeholder: '请选择',
      type: 'date',
      dateDisabled: true,
      rules: [
        { required: true, message: '请选择受理日期', trigger: 'blur' },
      ],
    },
  ],
});
// 考场受理-受理失败
const EXAM_ACCEPTANCE_ERROR_EDIT_FORM: ParamsType = mixForm({
  selectList: [],
  inputList: [
    {
      label: '失败原因',
      key: 'reason',
      type: 'text',
      value: '',
      width: 600,
      labelWidth: 130,
      clearable: false,
      disabled: false,
      rules: [
        { required: true, message: '请填写失败原因', trigger: 'blur' },
      ],
    },
    {
      label: '备注',
      key: 'remark',
      type: 'text',
      value: '',
      width: 600,
      labelWidth: 130,
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
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      width: 600,
      labelWidth: 130,
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
const SUBJECT_TRAINING_EDIT_FORM: ParamsType = mixForm({
  selectList: [
    {
      label: '培训科目',
      key: 'step',
      value: '',
      multiple: false,
      clearable: true,
      width: 600,
      labelWidth: 130,
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
      width: 600,
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
      key: 'applyDate',
      EDIT_FORMatType: 'YYYY-MM-DD',
      value: '',
      placeholder: '请选择',
      type: 'date',
      rules: [
        { required: true, message: '请选择培训日期', trigger: 'blur' },
      ],
    },
  ],
});

export {
  PAPERLESS_COLLECT_EDIT_FORM,
  SITE_DELIVERY_TABLE_EDIT_FORM,
  LICENSE_RECEIPT_FORM_EDIT_FORM,
  CLASS_SITUATION_EDIT_FORM,
  VEHICLE_APPROVAL_EDIT_FORM,
  EXAM_ACCEPTANCE_EDIT_FORM,
  EXAM_ACCEPTANCE_ERROR_EDIT_FORM,
  SUBJECT_TRAINING_EDIT_FORM,
};
