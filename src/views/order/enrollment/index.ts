import { ParamsType } from '@/type';
import {
  ORDER_PAYMENT_TYPE, IN_LIBRARY_STATUS
} from '@/enums';
import { formatPrice } from '@/assets/js/common';

// 表格
export const defaultTableData: ParamsType = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  height: 300,
  options: [
    {
      id: 5,
      label: '新增手工录单',
      path: 'btn_xzsgld'
    },
    {
      id: 1,
      label: '修改订单',
      type: 'primary',
      icon: '&#xe60f;',
      path: 'btn_edit'
    },
    {
      id: 2,
      label: '收尾款',
      path: 'btn_swk'
    },
    {
      id: 3,
      label: '订单作废',
      type: 'danger',
      path: 'btn_ddzf'
    },
    {
      id: 4,
      label: '导出',
      path: 'btn_export'
    },
    {
      id: 6,
      label: '转牌证',
      path: 'btn_zpz'
    }
  ],
  labels: [
    {
      key: 'storeName',
      label: '门店',
      showOverflowTooltip: true
    },
    {
      key: 'regionName',
      label: '片区',
      showOverflowTooltip: true
    },
    {
      key: 'drivingSchoolName',
      label: '驾校',
      showOverflowTooltip: true
    },
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
      showOverflowTooltip: true
    },
    {
      key: 'mobile',
      label: '手机号',
      showOverflowTooltip: true
    },
    {
      key: 'idNo',
      label: '证件号码',
      showOverflowTooltip: true
    },
    {
      key: 'className',
      label: '班别',
      showOverflowTooltip: true
    },
    {
      key: 'carModel',
      label: '车型',
      showOverflowTooltip: true
    },
    {
      key: 'learnType',
      label: '学车类型',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { learnType } = params.row;
        const _learnType = JSON.parse(learnType);
        if (!_learnType) return h('div', '-');
        return h('div', `${_learnType.label}`);
      }
    },
    {
      key: 'createTime',
      label: '报名时间',
      showOverflowTooltip: true
    },
    {
      key: 'activityName',
      label: '营销活动',
      showOverflowTooltip: true
    },
    {
      key: 'discountAmount',
      label: '优惠总金额',
      width: 100,
      isPrice: true
    },
    {
      key: 'marketingChannel',
      label: '营销渠道',
      showOverflowTooltip: true
    },
    {
      key: 'status',
      label: '是否退费',
      render(h: any, params: any) {
        const { status } = params.row;
        if (status === 1) return h('div', '已退费');
        if (status === 0) return h('div', '未退费');
        return h('div', '-');
      }
    },
    {
      key: 'syncFlag',
      label: '是否转牌证',
      width: 100,
      render(h: any, params: any) {
        const { syncFlag } = params.row;
        if (syncFlag === 1) return h('div', '是');
        return h('div', '否');
      }
    },
    {
      key: 'isInstallment',
      label: '缴费类型',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { isInstallment } = params.row;
        const _payTypeList = ORDER_PAYMENT_TYPE;
        const _list = _payTypeList.filter(item => item.id === isInstallment);
        if (_list.length === 0) return h('div', '-');
        return h('div', `${_list[0].label}`);
      }
    },
    {
      key: 'referrerName',
      label: '推荐人',
      showOverflowTooltip: true
    },
    {
      key: 'salePrice',
      label: '订单金额',
      width: 80,
      isPrice: true
    },
    {
      key: 'amount',
      label: '实收金额',
      isPrice: true,
      width: 80,
    },
    {
      key: 'balance',
      label: '待收金额',
      width: 80,
      render(h: any, params: any) {
        const { balance } = params.row;
        return h('div', balance ? formatPrice(balance) : 0);
      }
    },
    {
      key: 'balance',
      label: '是否欠费',
      render(h: any, params: any) {
        const { balance } = params.row;
        return h('div', balance > 0 ? '是' : '否');
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
      id: 5,
      label: '新增手工录单',
      path: 'btn_xzsgld'
    },
    {
      id: 1,
      label: '修改订单',
      type: 'primary',
      icon: '&#xe60f;',
      path: 'btn_edit'
    },
    {
      id: 2,
      label: '收尾款',
      path: 'btn_swk'
    },
    {
      id: 3,
      label: '订单作废',
      type: 'danger',
      path: 'btn_ddzf'
    },
    {
      id: 4,
      label: '导出',
      path: 'btn_export'
    },
    {
      id: 6,
      label: '转牌证',
      path: 'btn_zpz'
    },
    {
      id: 7,
      label: '欠减免审核',
      path: 'btn_qjmsh'
    }
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
      key: 'mobile',
      label: '手机号',
    },
    {
      key: 'idNo',
      label: '证件号码',
    },
    {
      key: 'className',
      label: '班别',
    },
    {
      key: 'carModel',
      label: '车型',
    },
    {
      key: 'learnType',
      label: '学车类型',
      render(h: any, params: any) {
        const { learnType } = params.row;
        const _learnType = JSON.parse(learnType);
        if (!_learnType) return h('div', '-');
        return h('div', `${_learnType.label}`);
      }
    },
    {
      key: 'createTime',
      label: '报名时间',
    },
    {
      key: 'marketingChannel',
      label: '营销渠道',
      showOverflowTooltip: true
    },
    {
      key: 'referrerName',
      label: '推荐人',
    },
    {
      key: 'salePrice',
      label: '订单金额',
      isPrice: true
    },
    {
      key: 'amount',
      label: '实收金额',
      isPrice: true,
    },
    {
      key: 'balance',
      label: '待收金额',
      render(h: any, params: any) {
        const { balance } = params.row;
        return h('div', balance ? formatPrice(balance) : 0);
      }
    },
    {
      key: 'balance',
      label: '是否欠费',
      render(h: any, params: any) {
        const { balance } = params.row;
        return h('div', balance > 0 ? '是' : '否');
      }
    },
    {
      key: 'status',
      label: '是否退费',
      render(h: any, params: any) {
        const { status } = params.row;
        if (status === 1) return h('div', '已退费');
        if (status === 0) return h('div', '未退费');
        return h('div', '-');
      }
    },
    {
      key: 'activityName',
      label: '营销活动',
      showOverflowTooltip: true
    },
    {
      key: 'activityAmount',
      label: '营销活动优惠',
      isPrice: true
    },
    {
      key: 'otherDiscounts',
      label: '其他优惠',
      isPrice: true
    },
    {
      key: 'discountAmount',
      label: '优惠总金额',
      isPrice: true
    },
    {
      key: 'creditAmount',
      label: '欠减免金额',
      isPrice: true
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
    {
      key: 'syncFlag',
      label: '是否转牌证',
      render(h: any, params: any) {
        const { syncFlag } = params.row;
        if (syncFlag === 1) return h('div', '是');
        return h('div', '否');
      }
    },
    {
      key: 'isInstallment',
      label: '缴费类型',
      render(h: any, params: any) {
        const { isInstallment } = params.row;
        const _payTypeList = ORDER_PAYMENT_TYPE;
        const _list = _payTypeList.filter(item => item.id === isInstallment);
        if (_list.length === 0) return h('div', '-');
        return h('div', `${_list[0].label}`);
      }
    },
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

// 搜索
export const defaultsearchForm: ParamsType = {
  inputList: [
    {
      label: '订单号',
      key: 'queryField',
      type: 'text',
      value: '',
      width: 370,
      clearable: true,
      placeholder: '请输入订单号/学员姓名/证件号码/手机号/推荐人姓名',
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
      width: 140,
      options: []
    },
    {
      label: '门店',
      key: 'storeId',
      value: '',
      width: 140,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: []
    },
    {
      label: '缴费类型',
      key: 'isInstallment',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      width: 120,
      options: ORDER_PAYMENT_TYPE
    },
    {
      label: '订单状态',
      key: 'orderStatus',
      value: '',
      width: 120,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: [{
        id: 1,
        label: '已退费'
      }, {
        id: 2,
        label: '已转牌证'
      }]
    },
    {
      label: '是否欠费',
      key: 'isArrears',
      value: '',
      width: 120,
      placeholder: '请选择',
      clearable: true,
      options: [{
        id: 0,
        label: '否'
      }, {
        id: 1,
        label: '是'
      }]
    },
  ],
  cascaderList: [
    {
      label: '营销渠道',
      key: 'marketingChannel',
      value: [],
      placeholder: '请先选择驾校',
      clearable: true,
      width: 170,
      options: [],
      optionProps: {
        showAllLevels: true,
        checkStrictly: false,
        emitPath: true,
        value: 'secondLevelName',
        label: 'secondLevelName',
        children: 'list',
      },
    },
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
  datePickerList: [
    {
      label: '报名时间',
      key: 'registrationBeginTime',
      value: '',
      placeholder: '开始时间',
      type: 'date',
      width: 140,
    },
    {
      label: '-',
      key: 'registrationEndTime',
      value: '',
      placeholder: '结束时间',
      type: 'date',
      width: 140,
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
      key: 'queryField',
      type: 'text',
      value: '',
      width: 370,
      clearable: true,
      placeholder: '请输入订单号/学员姓名/证件号码/手机号/推荐人姓名',
    }
  ],
  selectList: [
    {
      label: '门店',
      key: 'storeId',
      value: '',
      width: 140,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: []
    },
    {
      label: '缴费类型',
      key: 'isInstallment',
      value: '',
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      width: 120,
      options: ORDER_PAYMENT_TYPE
    },
    {
      label: '订单状态',
      key: 'orderStatus',
      value: '',
      width: 120,
      placeholder: '请选择',
      multiple: false,
      clearable: true,
      options: [{
        id: 1,
        label: '已退费'
      }, {
        id: 2,
        label: '已转牌证'
      }]
    },
    {
      label: '是否欠费',
      key: 'isArrears',
      value: '',
      width: 120,
      placeholder: '请选择',
      clearable: true,
      options: [{
        id: 0,
        label: '否'
      }, {
        id: 1,
        label: '是'
      }]
    },
    {
      label: '欠减免金额',
      key: 'creditAmount',
      value: '',
      width: 120,
      placeholder: '请选择',
      clearable: true,
      options: [{
        id: 0,
        label: '为0'
      }, {
        id: 1,
        label: '不为0'
      }]
    },
  ],
  cascaderList: [
    {
      label: '营销渠道',
      key: 'marketingChannel',
      value: [],
      placeholder: '请先选择驾校',
      clearable: true,
      width: 170,
      options: [],
      optionProps: {
        showAllLevels: true,
        checkStrictly: false,
        emitPath: true,
        value: 'secondLevelName',
        label: 'secondLevelName',
        children: 'list',
      },
    },
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
  datePickerList: [
    {
      label: '报名时间',
      key: 'registrationBeginTime',
      value: '',
      placeholder: '开始时间',
      type: 'date',
      width: 140,
    },
    {
      label: '-',
      key: 'registrationEndTime',
      value: '',
      placeholder: '结束时间',
      type: 'date',
      width: 140,
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
