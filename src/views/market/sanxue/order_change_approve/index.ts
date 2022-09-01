import { approveStatusOpts } from '@/views/market/_enums';
import {
  ORDER_IDNO_TYPE, EDUCATIONAL_SEX, ORDER_INVOICE_TYPE, ORDER_OPEN_INVOICE_TYPE, ORDER_PAY_TYPE, ORDER_IS_INSTALLMENT,
  ORDER_DISCOUNT_TYPE
} from '@/enums';

const orderField = require('@/assets/json/order_field_sx.json');

// 列表搜索配置
export const listSearchForm: any = {
  datePickerList: [
    {
      label: '申请日期',
      key: 'applyDate',
      value: '',
      placeholder: '开始时间',
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
      label: '审核状态',
      key: 'auditStatus',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: approveStatusOpts
    }
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
  list: [],
  labels: [
    {
      key: 'seq',
      label: '订单号',
      showOverflowTooltip: true
    },
    {
      key: 'regionName',
      label: '片区',
      showOverflowTooltip: true
    },
    {
      key: 'storeName',
      label: '门店',
      showOverflowTooltip: true
    },
    {
      key: 'userName',
      label: '学员姓名',
      showOverflowTooltip: true
    },
    {
      key: 'idNo',
      label: '证件号',
      showOverflowTooltip: true
    },
    {
      key: 'mobile',
      label: '手机号',
      showOverflowTooltip: true
    },
    {
      key: 'applyDate',
      label: '报名日期',
      showOverflowTooltip: true
    },
    {
      key: 'auditStatus',
      label: '审核状态',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { auditStatus, id, orderId } = params.row;
        const list = approveStatusOpts.filter((item: any) => item.id === auditStatus);
        const text = list[0] ? list[0].label : '';
        return h('el-link', {
          props: {
            type: 'primary',
            underline: false
          },
          on: {
            click: () => {
              params._self.tableData._this.jumpDetail(id, orderId, auditStatus);
            }
          }
        },
        text);
      }
    },
    {
      key: 'verifyNode',
      label: '审批环节',
      showOverflowTooltip: true
    },
    {
      key: 'verifyUser',
      label: '审核人',
      showOverflowTooltip: true
    },
    {
      key: 'createdName',
      label: '申请人',
      showOverflowTooltip: true
    },
    {
      key: 'createdTime',
      label: '申请日期',
      showOverflowTooltip: true
    },
  ]
};

const renderFieldFunc = (updateField: string, field: string) => {
  let _textArr = [];
  switch (updateField) {
    case 'discountAmount':
    case 'originalPrice':
    case 'amount':
      if (field) {
        return field;
      }
      return '0';
    case 'papersType':
      _textArr = ORDER_IDNO_TYPE.filter((item: any) => item.id === Number(field));
      return _textArr[0] ? _textArr[0].label : '-';
    case 'sex':
      _textArr = EDUCATIONAL_SEX.filter((item: any) => item.id === Number(field));
      return _textArr[0] ? _textArr[0].label : '-';
    case 'invoiceType':
      _textArr = ORDER_INVOICE_TYPE.filter((item: any) => item.id === Number(field));
      return _textArr[0] ? _textArr[0].label : '-';
    case 'invoiceMode':
      _textArr = ORDER_OPEN_INVOICE_TYPE.filter((item: any) => item.id === Number(field));
      return _textArr[0] ? _textArr[0].label : '-';
    case 'discountType':
      _textArr = ORDER_DISCOUNT_TYPE.filter((item: any) => item.id === Number(field));
      return _textArr[0] ? _textArr[0].label : '-';
    case 'payType':
      _textArr = ORDER_PAY_TYPE.filter((item: any) => item.id === Number(field));
      return _textArr[0] ? _textArr[0].label : '-';
    default:
      return field || '-';
  }
};

// 详情变更内容列表配置
export const detailChangeInfoTableData: any = {
  _this: {},
  index: true,
  list: [],
  labels: [
    {
      key: 'updateField',
      label: '字段',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { updateField } = params.row;
        const _text = orderField[updateField];
        if (!_text) return updateField;
        return _text;
      }
    },
    {
      key: 'afterField',
      label: '变更前',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { updateField, afterField } = params.row;
        return h('span', renderFieldFunc(updateField, afterField));
      }
    },
    {
      key: 'beforeField',
      label: '变更后',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { updateField, beforeField } = params.row;
        return h('span', renderFieldFunc(updateField, beforeField));
      }
    },
  ]
};

// 审批流程列表配置
export const detailApproveTableData: any = {
  list: [],
  labels: [
    {
      key: 'verifyNode',
      label: '审批环节',
      showOverflowTooltip: true
    },
    {
      key: 'createdName',
      label: '审核人',
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      key: 'verifyOperation',
      label: '审核操作',
      showOverflowTooltip: true
    },
    {
      key: 'verifyOpinion',
      label: '审核意见',
      showOverflowTooltip: true
    },
    {
      key: 'verifyDate',
      label: '审核时间',
      minWidth: 160,
      showOverflowTooltip: true
    },
  ]
};
