import { ParamsType } from '@/type';
import { ORDER_PAY_TYPE, IN_LIBRARY_STATUS } from '@/enums';

const statusOpt = [
  { id: 0, label: '正常' }, { id: 1, label: '已退费' }
];

// 表格
export const defaultTableData: ParamsType = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  height: 300,
  options: [
    {
      id: 3,
      label: '新增订单',
      path: 'btn_xzsgld'
    },
    {
      id: 1,
      label: '编辑',
      type: 'primary',
      icon: '&#xe60f;',
      path: 'btn_edit'
    },
    {
      id: 2,
      label: '导出',
      path: 'btn_export'
    },
    {
      id: 4,
      label: '删除',
      type: 'danger',
      path: 'btn_delete'
    },
  ],
  labels: [
    {
      key: 'seq',
      label: '订单号',
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
      key: 'userName',
      label: '学员姓名',
      showOverflowTooltip: true,
    },
    {
      key: 'mobile',
      label: '手机号',
      showOverflowTooltip: true,
    },
    {
      key: 'idNo',
      label: '证件号码',
      showOverflowTooltip: true,
    },
    {
      key: 'productName',
      label: '商品名称',
      showOverflowTooltip: true
    },
    {
      key: 'classesName',
      label: '班别',
      showOverflowTooltip: true
    },
    {
      key: 'createdTime',
      label: '报名时间',
      showOverflowTooltip: true,
    },
    {
      key: 'drivingSchoolName',
      label: '驾校',
      showOverflowTooltip: true
    },
    {
      key: 'storeName',
      label: '报名门店',
      showOverflowTooltip: true
    },
    {
      key: 'regionName',
      label: '片区',
      showOverflowTooltip: true
    },
    {
      key: 'amount',
      label: '订单金额(元)',
      width: 110,
      isPrice: true
    },
    {
      key: 'payType',
      label: '支付方式',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { payType } = params.row;
        const _payTypeList = ORDER_PAY_TYPE;
        if (payType && typeof payType === 'string') {
          const _list: string[] = [];
          _payTypeList.forEach(item => {
            if (payType.includes(String(item.id))) {
              _list.push(item.label);
            }
          });
          return h('div', `${_list.join(',')}`);
        }
        return h('div', '-');
      }
    },
    {
      key: 'status',
      label: '退费状态',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { status } = params.row;
        const _list = statusOpt.filter((item: any) => item.id === status);
        const item = _list[0] || {};
        return h('div', item.label || '');
      }
    },
    {
      key: 'studentStatus',
      label: '在库状态',
      render(h: any, params: any) {
        const { studentStatus } = params.row;
        if (studentStatus === undefined) return h('div', '');
        const list = IN_LIBRARY_STATUS.filter(item => item.id === studentStatus);
        return h('div', list[0] ? list[0].label : '');
      }
    },
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

// 广仁表格
export const guangrenTableData: ParamsType = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  height: 300,
  options: [
    {
      id: 3,
      label: '新增订单',
      path: 'btn_xzsgld'
    },
    {
      id: 1,
      label: '编辑',
      type: 'primary',
      icon: '&#xe60f;',
      path: 'btn_edit'
    },
    {
      id: 2,
      label: '导出',
      path: 'btn_export'
    },
    {
      id: 4,
      label: '删除',
      type: 'danger',
      path: 'btn_delete'
    },
  ],
  labels: [
    {
      key: 'seq',
      label: '订单号',
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
      key: 'userName',
      label: '学员姓名',
    },
    {
      key: 'mobile',
      label: '手机号',
    },
    {
      key: 'idNo',
      label: '证件号码',
    },
    {
      key: 'productName',
      label: '商品名称',
      showOverflowTooltip: true
    },
    {
      key: 'classesName',
      label: '班别',
      showOverflowTooltip: true
    },
    {
      key: 'createdTime',
      label: '报名时间',
    },
    {
      key: 'storeName',
      label: '报名门店',
      showOverflowTooltip: true
    },
    {
      key: 'amount',
      label: '订单金额(元)',
      width: 110,
      isPrice: true
    },
    {
      key: 'payType',
      label: '支付方式',
      render(h: any, params: any) {
        const { payType } = params.row;
        const _payTypeList = ORDER_PAY_TYPE;
        if (payType && typeof payType === 'string') {
          const _list: string[] = [];
          _payTypeList.forEach(item => {
            if (payType.includes(String(item.id))) {
              _list.push(item.label);
            }
          });
          return h('div', `${_list.join(',')}`);
        }
        return h('div', '-');
      }
    },
    {
      key: 'status',
      label: '退费状态',
      render(h: any, params: any) {
        const { status } = params.row;
        const _list = statusOpt.filter((item: any) => item.id === status);
        const item = _list[0] || {};
        return h('div', item.label || '');
      }
    },
    {
      key: 'studentStatus',
      label: '在库状态',
      render(h: any, params: any) {
        const { studentStatus } = params.row;
        if (studentStatus === undefined) return h('div', '');
        const list = IN_LIBRARY_STATUS.filter(item => item.id === studentStatus);
        return h('div', list[0] ? list[0].label : '');
      }
    },
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

// 搜索
export const defalutSearchForm: ParamsType = {
  inputList: [
    {
      label: '订单号',
      key: 'keyword',
      type: 'text',
      value: '',
      width: 300,
      clearable: true,
      placeholder: '请输入订单号/学员姓名/证件号码/手机号',
    }
  ],
  selectList: [
    {
      label: '驾校',
      key: 'drivingSchoolId',
      value: '',
      width: 160,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: []
    },
    {
      label: '片区',
      key: 'regionId',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      width: 160,
      options: []
    },
    {
      label: '门店',
      key: 'storeId',
      value: '',
      width: 160,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: []
    },
    {
      label: '退费状态',
      key: 'status',
      value: '',
      width: 120,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: statusOpt
    },
  ],
  datePickerList: [
    {
      label: '报名时间',
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
  cascaderList: [
    {
      label: '在库状态',
      key: 'studentStatus',
      value: [IN_LIBRARY_STATUS[0].id, IN_LIBRARY_STATUS[1].id],
      placeholder: '请选择',
      clearable: true,
      width: 170,
      options: IN_LIBRARY_STATUS,
      optionProps: {
        emitPath: false, // 只展示最后一级
        multiple: true, // 可多选
        collapseTags: true,
        value: 'id',
        label: 'label',
        children: 'children',
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
    }
  ]
};

// 广仁搜索
export const guangrenSearchForm: ParamsType = {
  inputList: [
    {
      label: '订单号',
      key: 'keyword',
      type: 'text',
      value: '',
      width: 300,
      clearable: true,
      placeholder: '请输入订单号/学员姓名/证件号码/手机号',
    }
  ],
  selectList: [
    {
      label: '门店',
      key: 'storeId',
      value: '',
      width: 160,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: []
    },
    {
      label: '退费状态',
      key: 'status',
      value: '',
      width: 120,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: statusOpt
    },
  ],
  datePickerList: [
    {
      label: '报名时间',
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
  cascaderList: [
    {
      label: '在库状态',
      key: 'studentStatus',
      value: [IN_LIBRARY_STATUS[0].id, IN_LIBRARY_STATUS[1].id],
      placeholder: '请选择',
      clearable: true,
      width: 170,
      options: IN_LIBRARY_STATUS,
      optionProps: {
        emitPath: false, // 只展示最后一级
        multiple: true, // 可多选
        collapseTags: true,
        value: 'id',
        label: 'label',
        children: 'children',
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
    }
  ]
};
