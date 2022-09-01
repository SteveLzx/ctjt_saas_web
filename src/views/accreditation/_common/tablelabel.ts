import dayjs from 'dayjs';
import {
  SUBJECT,
  CAPITAL_ACCOUNT,
  ACCEPTANCE_TAB,
  VERIFY_STRTUS,
  EXAM_TYPE,
  REPORT_CARD_STATUS,
  STUDENT_STATUS,
  STUDY_STAGE,
  TRANSFER_ACCOUNT
} from '@/enums';
import {
  CtjtAutocomplete
} from '@/components';

// 表格固定字段
const FIXED_LABELS = [
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  // {
  //   key: 'storePattern',
  //   label: '门店性质',
  //   minWidth: 80,
  //   showOverflowTooltip: true,
  // },
  {
    key: 'seq',
    label: '订单号',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'balance',
    label: '欠费金额',
    isPrice: true
  },
  {
    key: 'learnType',
    label: '学车类型',
    showOverflowTooltip: true,
  },
  {
    key: 'classesName',
    label: '班别',
    showOverflowTooltip: true,
  },
  {
    key: 'carModel',
    label: '车型',
    showOverflowTooltip: true,
  }
];
// 表格固定字段-惠州
const HUIZHOU_FIXED_LABELS = [
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'seq',
    label: '订单号',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'balance',
    label: '欠费金额',
    showOverflowTooltip: true,
    isPrice: true
  },
  {
    key: 'learnType',
    label: '学车类型',
    showOverflowTooltip: true,
  },
  {
    key: 'classesName',
    label: '班别',
    showOverflowTooltip: true,
  },
  {
    key: 'carModel',
    label: '车型',
    showOverflowTooltip: true,
  },
];
// 看删除数据时需要另外展示的字段
const DELETED_FIXED_LABELS = [
  {
    key: 'deletedName',
    label: '删除人',
    showOverflowTooltip: true,
  },
  {
    key: 'deletedReason',
    label: '删除原因',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { deletedReason } = params.row;
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '200',
          trigger: 'hover',
          content: deletedReason,
        },
        scopedSlots: {
          reference: () => h('p', deletedReason),
        },
      });
    }
  },
  {
    key: 'deletedTime',
    label: '删除日期',
    showOverflowTooltip: true,
  },
];
// 无纸化采集
const PAPERLESS_COLLECT_LIST_LABEL = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'registerTime',
      label: '报名日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { registerTime } = params.row;
        if (registerTime === undefined) return h('div', '');
        return h('div', dayjs(registerTime).format('YYYY-MM-DD HH:mm:ss'));
      }
    },
    {
      key: 'collectDate',
      label: '采集日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { collectDate } = params.row;
        if (collectDate === undefined) return h('div', '');
        return h('div', dayjs(collectDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'status',
      label: '状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('div', '已采集');
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 场点交表
const SITE_DELIVERY_TABLE_LIST_LABEL = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'registerTime',
      label: '报名日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { registerTime } = params.row;
        if (registerTime === undefined) return h('div', '');
        return h('div', dayjs(registerTime).format('YYYY-MM-DD HH:mm:ss'));
      }
    },
    {
      key: 'deliverDate',
      label: '场点交表日期',
      width: 110,
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { deliverDate } = params.row;
        if (deliverDate === undefined) return h('div', '');
        return h('div', dayjs(deliverDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'status',
      label: '状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('div', '已交表');
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 牌证收表
const LICENSE_RECEIPT_FORM_LIST_LABEL = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'recoveryDate',
      label: '牌证收表日期',
      minWidth: 110,
      render(h: any, params: any) {
        const { recoveryDate } = params.row;
        if (recoveryDate === undefined) return h('div', '');
        return h('div', dayjs(recoveryDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'status',
      label: '状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('div', '已收表');
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 片区交表
const AREA_DELIVERY_TABLE_LIST_LABEL = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'status',
      label: '状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('div', '已交表');
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 车管所送审
const VEHICLE_APPROVAL_LIST_LABEL = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'inspectionDate',
      label: '送审日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { inspectionDate } = params.row;
        if (inspectionDate === undefined) return h('div', '');
        return h('div', dayjs(inspectionDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'status',
      label: '状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('div', '已送审');
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 上课情况
const CLASS_SITUATION_LIST_LABEL = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'remark',
      label: '备注',
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
      key: 'attendClassDate',
      label: '上课日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { attendClassDate, } = params.row;
        if (attendClassDate === undefined) return h('div', '');
        return h('div', dayjs(attendClassDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'attendStatus',
      label: '上课状态',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        return h('div', '已上课');
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 成绩单
const REPORT_CARD_LIST_LABEL = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 120,
    showOverflowTooltip: true,
  },
  // {
  //   key: 'regionName',
  //   label: '片区',
  //   width: 100,
  //   showOverflowTooltip: true,
  // },
  {
    key: 'storeName',
    label: '门店',
    width: 100,
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    width: 170,
  },
  {
    key: 'registerTime',
    label: '报名日期',
    width: 160,
    render(h: any, params: any) {
      const { registerTime } = params.row;
      if (registerTime === undefined) return h('div', '');
      return h('div', dayjs(registerTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'classesName',
    label: '班别',
    minWidth: 100,
  },
  {
    key: 'step',
    label: '考试科目',
    minWidth: 100,
  },
  {
    key: 'examDate',
    label: '考试日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { examDate } = params.row;
      if (examDate === undefined || !examDate) return h('div', '');
      return h('div', dayjs(examDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'status',
    label: '成绩单状态',
    minWidth: 100,
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const state = Number(status);
      const list = REPORT_CARD_STATUS.filter(a => a.id === state);
      return h('span', list[0] ? list[0].label : '');
    },
  },
  {
    key: 'operationDate',
    label: '接收日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { operationDate } = params.row;
      if (operationDate === undefined || !operationDate) return h('div', '');
      return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'operationName',
    label: '操作人',
    minWidth: 100,
  },
];

// 监管学时
const SUPERVISION_HOURS_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'seq',
    label: '订单号',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'balance',
    label: '欠费金额',
    isPrice: true
  },
  {
    key: 'learnType',
    label: '学车类型',
    showOverflowTooltip: true,
  },
  {
    key: 'classesName',
    label: '班别',
    showOverflowTooltip: true,
  },
  {
    key: 'carModel',
    label: '车型',
    showOverflowTooltip: true,
  },
  {
    key: 'acceptNumber',
    label: '受理号',
    showOverflowTooltip: true,
  },
  {
    key: 'coachName',
    label: '教练',
    showOverflowTooltip: true,
  },
  {
    key: 'transferSubjects',
    label: '划拨科目',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { transferSubjects } = params.row;
      if (transferSubjects === undefined) return h('div', '');
      const list = TRANSFER_ACCOUNT.filter(a => a.id === transferSubjects);
      return h('span', list[0] ? list[0].label : '');
    },
  },
  {
    key: 'examDate',
    label: '考试日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { examDate } = params.row;
      if (examDate === undefined) return h('div', '');
      return h('div', dayjs(examDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'transferAmount',
    label: '划拨金额',
    minWidth: 100,
    isPrice: true
  },
  {
    key: 'periodAssess',
    label: '学时考核',
    showOverflowTooltip: true,
  },
  {
    key: 'supervisePeriodRobot',
    label: '监管学时-模拟机',
    minWidth: 130,
    showOverflowTooltip: true,
  },
  {
    key: 'supervisePeriodCar',
    label: '监管学时-真车',
    minWidth: 125,
    showOverflowTooltip: true,
  },
  {
    key: 'transferCreatedTime',
    label: '学时更新日期',
    minWidth: 125,
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { transferCreatedTime } = params.row;
      if (transferCreatedTime === undefined) return h('div', '');
      return h('div', dayjs(transferCreatedTime).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'transferName',
    label: '更新操作人',
    minWidth: 100,
    showOverflowTooltip: true,
  },
];

// 资金监管存入
const CAPITAL_SUPERVERION_LIST_LABEL = [
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'seq',
    label: '订单号',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { seq, orderId } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpOrderDetail(orderId);
          }
        }
      }, seq);
    }
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'classesName',
    label: '班别',
    showOverflowTooltip: true,
  },
  {
    key: 'carModel',
    label: '车型',
    showOverflowTooltip: true,
  },
  {
    key: 'registerTime',
    label: '报名日期',
    showOverflowTooltip: true,
  },
  {
    key: 'superviseStatus',
    label: '录入状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { superviseStatus } = params.row;
      const superviseArry = ['待录入', '已录入  '];
      return h('span', superviseArry[superviseStatus - 1]);
    },
  },
  {
    key: 'depositStatus',
    label: '存入状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { depositStatus } = params.row;
      const depositStatusArry = ['待存入', '已存入  '];
      return h('span', depositStatusArry[depositStatus - 1]);
    },
  },
  {
    key: 'step',
    label: '资金科目',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { step } = params.row;
      if (step === undefined) return h('div', '');
      const list = CAPITAL_ACCOUNT.filter(a => a.id === step);
      return h('span', list[0] ? list[0].label : '');
    },
  },
  {
    key: 'superviseAmount',
    label: '监管金额',
    isPrice: true
  },
  {
    key: 'superviseDate',
    label: '监管日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { superviseDate } = params.row;
      if (superviseDate === undefined) return h('div', '');
      return h('div', dayjs(superviseDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'transferCode',
    label: '转账码',
    showOverflowTooltip: true,
  },
  {
    key: 'payType',
    label: '付款方式',
    showOverflowTooltip: true,
  },
  {
    key: 'operationDate',
    label: '录入日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { operationDate } = params.row;
      if (operationDate === undefined) return h('div', '');
      return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'operationName',
    label: '录入人',
    showOverflowTooltip: true,
  },
];

// 考场受理-受理成功
const EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'acceptStatus',
      label: '受理状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('span', '受理成功');
      },
    },
    {
      key: 'acceptNumber',
      label: '受理号',
      showOverflowTooltip: true,
    },
    {
      key: 'acceptDate',
      label: '受理日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptDate } = params.row;
        if (acceptDate === undefined) return h('div', '');
        return h('div', dayjs(acceptDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'acceptRemark',
      label: '备注',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptRemark } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: acceptRemark,
          },
          scopedSlots: {
            reference: () => h('p', acceptRemark),
          },
        });
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 考场受理-受理失败
const EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'acceptStatus',
      label: '受理状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('span', '受理失败');
      },
    },
    {
      key: 'acceptFailReason',
      label: '失败原因',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptFailReason } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: acceptFailReason,
          },
          scopedSlots: {
            reference: () => h('p', acceptFailReason),
          },
        });
      },
    },
    {
      key: 'acceptDate',
      label: '受理日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptDate } = params.row;
        if (acceptDate === undefined) return h('div', '');
        return h('div', dayjs(acceptDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'acceptRemark',
      label: '备注',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptRemark } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: acceptRemark,
          },
          scopedSlots: {
            reference: () => h('p', acceptRemark),
          },
        });
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 考场受理-受理成功-惠州深港
const HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'acceptStatus',
      label: '受理状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('span', '受理成功');
      },
    },
    {
      key: 'acceptNumber',
      label: '受理档案号',
      minWidth: 120,
    },
    {
      key: 'acceptDate',
      label: '受理日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptDate } = params.row;
        if (acceptDate === undefined) return h('div', '');
        return h('div', dayjs(acceptDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'acceptRemark',
      label: '备注',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptRemark } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: acceptRemark,
          },
          scopedSlots: {
            reference: () => h('p', acceptRemark),
          },
        });
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 考场受理-受理失败-惠州深港
const HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'acceptStatus',
      label: '受理状态',
      showOverflowTooltip: true,
      render(h: any) {
        return h('span', '受理失败');
      },
    },
    {
      key: 'acceptFailReason',
      label: '失败原因',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptFailReason } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: acceptFailReason,
          },
          scopedSlots: {
            reference: () => h('p', acceptFailReason),
          },
        });
      },
    },
    {
      key: 'acceptDate',
      label: '受理日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptDate } = params.row;
        if (acceptDate === undefined) return h('div', '');
        return h('div', dayjs(acceptDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'acceptRemark',
      label: '备注',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { acceptRemark } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: acceptRemark,
          },
          scopedSlots: {
            reference: () => h('p', acceptRemark),
          },
        });
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];
// 学科培训
const SUBJECT_TRAINING_LIST_LABEL = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '培训科目',
      showOverflowTooltip: true,
    },
    {
      key: 'remark',
      label: '备注',
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
      key: 'subjectTrainDate',
      label: '培训日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { subjectTrainDate, } = params.row;
        if (subjectTrainDate === undefined) return h('div', '');
        return h('div', dayjs(subjectTrainDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'status',
      label: '培训状态',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        return h('div', '已培训');
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 分配教练-科二
const ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTWO = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { step } = params.row;
        const _list = SUBJECT.filter(a => a.id === step);
        const _text = _list[0] ? _list[0].label : '';
        return h('span', _text);
      },
    },
    {
      key: 'examResultUpdatedTime',
      label: '考试合格日期',
      minWidth: 110,
      render(h: any, params: any) {
        const { examResultUpdatedTime } = params.row;
        return h('div', dayjs(examResultUpdatedTime).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operatorDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operatorDate } = params.row;
        return h('div', dayjs(operatorDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operatorName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];
// 分配教练-科三
const ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTHREE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { step } = params.row;
        const _list = SUBJECT.filter(a => a.id === step);
        const _text = _list[0] ? _list[0].label : '';
        return h('span', _text);
      },
    },
    {
      key: 'examResultUpdatedTime',
      label: '考试合格日期',
      minWidth: 110,
      render(h: any, params: any) {
        const { examResultUpdatedTime } = params.row;
        return h('div', dayjs(examResultUpdatedTime).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operatorDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operatorDate } = params.row;
        return h('div', dayjs(operatorDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operatorName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];
// 考试报考
const APPLY_EXAM_LIST_LABEL = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'subject',
      label: '科目',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { subject } = params.row;
        const _list = SUBJECT.filter(a => a.id === subject);
        const _text = _list[0] ? _list[0].label : '';
        return h('span', _text);
      },
    },
    {
      key: 'trainCreatedTime',
      label: '培训日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { trainCreatedTime } = params.row;
        return h('div', dayjs(trainCreatedTime).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'examStatus',
      label: '报考状态',
      showOverflowTooltip: true,
    },
    {
      key: 'examNumber',
      label: '考试次数',
      showOverflowTooltip: true,
    },
    {
      key: 'cancelNumber',
      label: '取消次数',
      showOverflowTooltip: true,
    },
    {
      key: 'lastExamResult',
      label: '上次考试结果',
      showOverflowTooltip: true,
    },
    {
      key: 'isPay',
      label: '是否已交费',
      minWidth: 100,
      render(h: any, params: any) {
        const { isPay } = params.row;
        if (isPay === undefined) return h('div', '');
        const _text = isPay === 0 ? '否' : '是';
        return h('span', _text);
      },
    },
    {
      key: 'examResultCreatedTime',
      label: '结果录入日期',
      minWidth: 110,
      render(h: any, params: any) {
        const { examResultCreatedTime } = params.row;
        return h('div', dayjs(examResultCreatedTime).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'trainUpdatedTime',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { trainUpdatedTime } = params.row;
        return h('div', dayjs(trainUpdatedTime).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];
// 考试交费-代交
const EXAM_FEE_LIST_OTHER = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'acceptNumber',
      label: '受理号',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { step } = params.row;
        if (step === undefined) return h('div', '');
        const _list = SUBJECT.filter(a => a.id === step);
        const _text = _list[0] ? _list[0].label : '';
        return h('span', _text);
      },
    },
    {
      key: 'feeType',
      label: '费用科目',
      showOverflowTooltip: true,
    },
    {
      key: 'fee',
      label: '金额',
      showOverflowTooltip: true,
      isPrice: true
    },
    {
      key: 'payType',
      label: '交费方式',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { payType } = params.row;
        if (payType === undefined) return h('div', '');
        const _text = payType === 1 ? '代交' : '自交';
        return h('span', _text);
      },
    },
    {
      key: 'payNumber',
      label: '缴费流水号',
      width: 100,
      showOverflowTooltip: true,
    },
    {
      key: 'costDate',
      label: '交费日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { costDate } = params.row;
        return h('div', dayjs(costDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 考试交费-自交
const EXAM_FEE_LIST_SELF = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'acceptNumber',
      label: '受理号',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { step } = params.row;
        if (step === undefined) return h('div', '');
        const _list = SUBJECT.filter(a => a.id === step);
        const _text = _list[0] ? _list[0].label : '';
        return h('span', _text);
      },
    },
    {
      key: 'feeType',
      label: '费用科目',
      showOverflowTooltip: true,
    },
    {
      key: 'fee',
      label: '金额',
      showOverflowTooltip: true,
      isPrice: true
    },
    {
      key: 'payType',
      label: '交费方式',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { payType } = params.row;
        if (payType === undefined) return h('div', '');
        const _text = payType === 1 ? '代交' : '自交';
        return h('span', _text);
      },
    },
    {
      key: 'payNumber',
      label: '缴费流水号',
      showOverflowTooltip: true,
    },
    {
      key: 'costDate',
      label: '交费日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { costDate } = params.row;
        return h('div', dayjs(costDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];
// 考试交费-代交-惠州深港
const HUIZHOU_EXAM_FEE_LIST_OTHER = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { step } = params.row;
        if (step === undefined) return h('div', '');
        const _list = SUBJECT.filter(a => a.id === step);
        const _text = _list[0] ? _list[0].label : '';
        return h('span', _text);
      },
    },
    {
      key: 'feeType',
      label: '费用科目',
      showOverflowTooltip: true,
    },
    {
      key: 'fee',
      label: '金额',
      showOverflowTooltip: true,
      isPrice: true
    },
    {
      key: 'payType',
      label: '交费方式',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { payType } = params.row;
        if (payType === undefined) return h('div', '');
        const _text = payType === 1 ? '代交' : '自交';
        return h('span', _text);
      },
    },
    {
      key: 'payNumber',
      label: '缴费流水号',
      showOverflowTooltip: true,
    },
    {
      key: 'costDate',
      label: '交费日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { costDate } = params.row;
        if (costDate === undefined) return h('div', '');
        return h('div', dayjs(costDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];
// 考试交费-自交-惠州深港
const HUIZHOU_EXAM_FEE_LIST_SELF = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { step } = params.row;
        if (step === undefined) return h('div', '');
        const _list = SUBJECT.filter(a => a.id === step);
        const _text = _list[0] ? _list[0].label : '';
        return h('span', _text);
      },
    },
    {
      key: 'feeType',
      label: '费用科目',
      showOverflowTooltip: true,
    },
    {
      key: 'fee',
      label: '金额',
      showOverflowTooltip: true,
      isPrice: true
    },
    {
      key: 'payType',
      label: '交费方式',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { payType } = params.row;
        if (payType === undefined) return h('div', '');
        const _text = payType === 1 ? '代交' : '自交';
        return h('span', _text);
      },
    },
    {
      key: 'payNumber',
      label: '缴费流水号',
      showOverflowTooltip: true,
    },
    {
      key: 'costDate',
      label: '交费日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { costDate } = params.row;
        if (costDate === undefined) return h('div', '');
        return h('div', dayjs(costDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 考试批复-已批复
const EXAM_APPROVAL_LIST_HAS_REPLY = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'acceptNumber',
      label: '受理号',
      showOverflowTooltip: true,
    },
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
    },
    {
      key: 'examRegionName',
      label: '考试片区',
      showOverflowTooltip: true,
    },
    {
      key: 'examStoreName',
      label: '考试门店',
      showOverflowTooltip: true,
    },
    {
      key: 'examAddress',
      label: '考试地点',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { examAddress } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: examAddress,
          },
          scopedSlots: {
            reference: () => h('p', examAddress),
          },
        });
      },
    },
    {
      key: 'examDate',
      label: '考试日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { examDate } = params.row;
        if (examDate === undefined) return h('div', '');
        return h('span', dayjs(examDate).format('YYYY-MM-DD'));
      },
    },
    {
      key: 'examTime',
      label: '考试时间',
      showOverflowTooltip: true,
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 考试批复-批复异常
const EXAM_APPROVAL_LIST_REPLY_ERROR = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'acceptNumber',
      label: '受理号',
      showOverflowTooltip: true,
    },
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
    },
    {
      key: 'examRegionName',
      label: '考试片区',
      showOverflowTooltip: true,
    },
    {
      key: 'examStoreName',
      label: '考试门店',
      showOverflowTooltip: true,
    },
    {
      key: 'examAddress',
      label: '考试地点',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { examAddress } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: examAddress,
          },
          scopedSlots: {
            reference: () => h('p', examAddress),
          },
        });
      },
    },
    {
      key: 'examDate',
      label: '考试日期',
      showOverflowTooltip: true,
    },
    {
      key: 'examTime',
      label: '考试时间',
      showOverflowTooltip: true,
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('span', operationDate);
      },
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    }
  ]
];

// 考试批复-惠州深港
const HUIZHOU_EXAM_APPROVAL_LIST_REPLY = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
    },
    {
      key: 'examRegionName',
      label: '考试片区',
      showOverflowTooltip: true,
    },
    {
      key: 'examStoreName',
      label: '考试门店',
      showOverflowTooltip: true,
    },
    {
      key: 'examAddress',
      label: '考试地点',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { examAddress } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: examAddress,
          },
          scopedSlots: {
            reference: () => h('p', examAddress),
          },
        });
      },
    },
    {
      key: 'examDate',
      label: '考试日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { examDate } = params.row;
        if (examDate === undefined) return h('div', '');
        return h('span', dayjs(examDate).format('YYYY-MM-DD'));
      },
    },
    {
      key: 'examTime',
      label: '考试时间',
      showOverflowTooltip: true,
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    },
  ]
];

// 考试结果
const EXAM_RESULT_LIST_LABEL = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'acceptNumber',
      label: '受理号',
      showOverflowTooltip: true,
    },
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
    },
    {
      key: 'examRegionName',
      label: '考试片区',
      showOverflowTooltip: true,
    },
    {
      key: 'examStoreName',
      label: '考试门店',
      showOverflowTooltip: true,
    },
    {
      key: 'examAddress',
      label: '考试地点',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { examAddress } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: examAddress,
          },
          scopedSlots: {
            reference: () => h('p', examAddress),
          },
        });
      },
    },
    {
      key: 'examDate',
      label: '考试日期',
      showOverflowTooltip: true,
    },
    {
      key: 'examTime',
      label: '考试时间',
      showOverflowTooltip: true,
    },
    {
      key: 'result',
      label: '考试结果',
      showOverflowTooltip: true,
    },
    {
      key: 'remark',
      label: '取消原因',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { remark, result } = params.row;
        if (result === '取消考试') {
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
        return h('div', '');
      },
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    }
  ]
];

// 考试结果-惠州深港
const HUIZHOU_EXAM_RESULT_LIST_LABEL = [
  ...HUIZHOU_FIXED_LABELS,
  ...[
    {
      key: 'coachName',
      label: '教练',
      showOverflowTooltip: true,
    },
    {
      key: 'step',
      label: '科目',
      showOverflowTooltip: true,
    },
    {
      key: 'examRegionName',
      label: '考试片区',
      showOverflowTooltip: true,
    },
    {
      key: 'examStoreName',
      label: '考试门店',
      showOverflowTooltip: true,
    },
    {
      key: 'examAddress',
      label: '考试地点',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { examAddress } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: examAddress,
          },
          scopedSlots: {
            reference: () => h('p', examAddress),
          },
        });
      },
    },
    {
      key: 'examDate',
      label: '考试日期',
      showOverflowTooltip: true,
    },
    {
      key: 'examTime',
      label: '考试时间',
      showOverflowTooltip: true,
    },
    {
      key: 'result',
      label: '考试结果',
      showOverflowTooltip: true,
    },
    {
      key: 'remark',
      label: '取消原因',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { remark, result } = params.row;
        if (result === '取消考试') {
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
        return h('div', '');
      },
    },
    {
      key: 'operationDate',
      label: '操作日期',
      showOverflowTooltip: true,
      render(h: any, params: any) {
        const { operationDate } = params.row;
        if (operationDate === undefined) return h('div', '');
        return h('div', dayjs(operationDate).format('YYYY-MM-DD'));
      }
    },
    {
      key: 'operationName',
      label: '操作人',
      showOverflowTooltip: true,
    }
  ]
];

// 办证信息变更
const CHANGE_INFO_LIST = [
  {
    key: 'changeNo',
    label: '变更单编号',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { changeNo } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(params.row);
          }
        }
      }, changeNo);
    }
  },
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'subjects',
    label: '办证科目',
    showOverflowTooltip: true,
  },
  {
    key: 'changeNum',
    label: '变更数量',
    showOverflowTooltip: true,
  },
  {
    key: 'changeCause',
    label: '变更原因',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { changeCause } = params.row;
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: changeCause,
        },
        scopedSlots: {
          reference: () => h('p', changeCause),
        },
      });
    }
  },
  {
    key: 'applyUser',
    label: '申请人',
    showOverflowTooltip: true,
  },
  {
    key: 'applyDate',
    label: '申请时间',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { applyDate } = params.row;
      if (applyDate === undefined) return h('div', '');
      return h('div', dayjs(applyDate).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'isVerify',
    label: '审核状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { isVerify } = params.row;
      if (isVerify === undefined) return h('div', '');
      const _list = VERIFY_STRTUS.filter(item => item.id === isVerify);
      return h('span', isVerify ? _list[0].label : '');
    },
  },
  {
    key: 'verifyNode',
    label: '审批环节',
    showOverflowTooltip: true,
  },
  {
    key: 'verifyUser',
    label: '审核人',
    showOverflowTooltip: true,
  },
  {
    key: 'verifyDate',
    label: '审核时间',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { verifyDate } = params.row;
      if (!verifyDate) return h('div', '');
      return h('div', dayjs(verifyDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'assessType',
    label: '考核类型',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { assessType } = params.row;
      const _list = EXAM_TYPE.filter(item => item.id === assessType);
      return h('span', assessType !== undefined ? _list[0].label : '');
    },
  },
  {
    key: 'verifyTimeConsuming',
    label: '审核耗时(h)',
    minWidth: 80,
  },
];

// 补交资料
const SUPPLEMENTARY_INFO_LIST = [
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'capitalSubject',
    label: '办证科目',
    showOverflowTooltip: true,
    render(h: any) {
      return h('div', '补交资料');
    }
  },
  {
    key: 'type',
    label: '办证类型',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { type } = params.row;
      if (type === undefined) return h('div', '');
      let _text = '';
      if (type === 1) _text = '片区交资料';
      if (type === 2) _text = '牌证收资料';
      if (type === 3) _text = '牌证退资料';
      return h('div', _text);
    }
  },
  {
    key: 'number',
    label: '数量',
    render(h: any, params: any) {
      const { number, batchNo } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(batchNo);
          }
        }
      }, number);
    }
  },
  {
    key: 'materialStatus',
    label: '批次状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { materialStatus } = params.row;
      if (materialStatus === undefined) return h('div', '');
      let _text = '';
      if (materialStatus === 1) _text = '待处理';
      if (materialStatus === 2) _text = '已完成';
      if (materialStatus === 3) _text = '已退回';
      return h('div', _text);
    }
  },
  {
    key: 'createdDate',
    label: '操作日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { createdDate } = params.row;
      if (!createdDate) return h('div', '');
      return h('div', dayjs(createdDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'createByName',
    label: '操作人',
    showOverflowTooltip: true,
  },
];

// 补交资料
const SUPPLEMENTARY_INFO_DETAIL = [
  {
    key: 'subject',
    label: '办证科目',
    showOverflowTooltip: true,
    render(h: any) {
      return h('div', '补交资料');
    }
  },
  {
    key: 'type',
    label: '办证类型',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { type } = params.row;
      let _text = '';
      if (type === undefined) _text = '';
      if (type === 1) _text = '片区交资料';
      if (type === 2) _text = '牌证收资料';
      if (type === 3) _text = '牌证退资料';
      return h('div', _text);
    }
  },
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'acceptNumber',
    label: '受理号',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'learnDrivingSchedule',
    label: '学车进度',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { learnDrivingSchedule } = params.row;
      const _list = STUDY_STAGE.filter((item: any) => item.id === learnDrivingSchedule);
      return h('div', _list[0] ? _list[0].label : '');
    }
  },
  {
    key: 'studyStatus',
    label: '学员状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { studyStatus } = params.row;
      const _list = STUDENT_STATUS.filter((item: any) => item.id === studyStatus);
      return h('div', _list[0] ? _list[0].label : '');
    }
  },
  {
    key: 'materialName',
    label: '资料名称',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { materialName, materialStatus, type } = params.row;
      const index = params.$index;
      const componentSelectOpts = [
        { value: '流水号注销委托书', label: '流水号注销委托书' },
        { value: 'C1转C2委托书', label: 'C1转C2委托书' },
        { value: '电话号码变更委托书', label: '电话号码变更委托书' },
        { value: '取消考试委托书', label: '取消考试委托书' },
      ];
      return h(CtjtAutocomplete, {
        props: {
          value: materialName,
          list: componentSelectOpts,
          disabled: (type === 1 && materialStatus !== 1) || type >= 2,
          maxlength: 30,
          input: (val: string) => params._self.tableData._this.setItemValFunc(index, val),
          focus: () => {
            //
          }
        }
      });
    }
  },
  {
    key: 'remarks',
    label: '备注',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { remarks, materialStatus, type } = params.row;
      const index = params.$index;
      return h('el-input', {
        props: {
          type: 'text',
          value: remarks,
          disabled: (type === 1 && materialStatus !== 1) || type >= 2,
          maxlength: 300
        },
        on: {
          input: (e: any) => {
            params._self.tableData._this.setItemRemarkFunc(index, e);
          }
        }
      });
    }
  },
  {
    key: 'certificateDate',
    label: '办证日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { certificateDate } = params.row;
      if (!certificateDate) return h('div', '');
      return h('div', dayjs(certificateDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'materialStatus',
    label: '状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { materialStatus } = params.row;
      let _text = '';
      if (materialStatus === undefined) _text = '';
      if (materialStatus === 1) _text = '待处理';
      if (materialStatus === 2) _text = '已完成';
      if (materialStatus === 3) _text = '已退回';
      return h('div', _text);
    }
  },
  {
    key: 'createdDate',
    label: '操作日期',
    showOverflowTooltip: true,
  },
  {
    key: 'createByName',
    label: '操作人',
    showOverflowTooltip: true,
  },
];

// 档案归档管理
const FILE_FILING_LIST = [
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'status',
    label: '办证类型',
    showOverflowTooltip: true,
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'fileNo',
    label: '档案编号',
    showOverflowTooltip: true,
  },
  {
    key: 'remark',
    label: '备注',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { remark } = params.row;
      const index = params.$index;
      const that = params._self.tableData._this;
      return h('el-input', {
        props: {
          clearable: true,
          value: remark,
          maxlength: 300,
        },
        on: {
          // focus: () => that.getCoachList(regionId, carModel, 2),
          input: (val: string) => that.setTableItemValFunc(index, val),
        }
      });
    }
  },
  {
    key: 'operationDate',
    label: '操作日期',
    showOverflowTooltip: true,
  },
  {
    key: 'operationName',
    label: '操作人',
    showOverflowTooltip: true,
  }
];

// 档案归档管理-交档案详情
const FILE_FILING_DETAIL_LIST = [
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'fileStatus',
    label: '状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { fileStatus } = params.row;
      if (fileStatus === undefined) return h('div', '');
      const statusOptions = [
        {
          id: 1,
          label: '待处理',
        },
        {
          id: 2,
          label: '已完成',
        },
        {
          id: 3,
          label: '已退档',
        },
      ];
      const list = statusOptions.filter(item => item.id === fileStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'fileNo',
    label: '档案编号',
    showOverflowTooltip: true,
  },
  {
    key: 'createdDate',
    label: '操作日期',
    showOverflowTooltip: true,
  },
  {
    key: 'createByName',
    label: '操作人',
    showOverflowTooltip: true,
  },

];

// 批次号管理
const BATCH_NUMBER_LIST = [
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'subjects',
    label: '办证科目',
    showOverflowTooltip: true,
  },
  {
    key: 'number',
    label: '数量',
    render(h: any, params: any) {
      const {
        number,
        batchNo,
        subjects,
        operatorName,
        operatorDate,
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            const item = {
              batchNo,
              subjects,
              operatorName,
              operatorDate,
              number
            };
            params._self.tableData._this.jumpDetail(item);
          }
        }
      }, number);
    }
  },
  {
    key: 'operatorDate',
    label: '操作日期',
    showOverflowTooltip: true,
  },
  {
    key: 'operatorName',
    label: '操作人',
    showOverflowTooltip: true,
  },
];

// 办证信息撤销
const CANCEL_INFO_LIST = [
  {
    key: 'seq',
    label: '撤销单编号',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { seq } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(params.row);
          }
        }
      }, seq);
    }
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'coachName',
    label: '教练',
    showOverflowTooltip: true,
  },
  {
    key: 'currentNode',
    label: '工单当前待办科目',
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    key: 'taggerNode',
    label: '撤销至',
    showOverflowTooltip: true,
  },
  {
    key: 'batchNo',
    label: '撤销批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'status',
    label: '状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const list = VERIFY_STRTUS.filter(item => item.id === status);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'applyDateTime',
    label: '申请时间',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { applyDateTime } = params.row;
      if (!applyDateTime) return h('div', '');
      return h('div', dayjs(applyDateTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'applyUserName',
    label: '申请人',
    showOverflowTooltip: true,
  },
  {
    key: 'taskName',
    label: '审批环节',
    showOverflowTooltip: true,
  },
  {
    key: 'updatedTime',
    label: '审核日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { updatedTime, taskName, status } = params.row;
      // status === 0 : 审核中
      if (!updatedTime || (taskName === '客服主管审批' && status === 0)) return h('div', '');
      return h('div', dayjs(updatedTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'reviewerName',
    label: '审核人',
    showOverflowTooltip: true,
  },
];

// 转门店申请
const CHANGE_STORE_APPROVAL_LIST = [
  {
    key: 'seq',
    label: '申请单号',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { seq, approveId } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(approveId);
          }
        }
      }, seq);
    }
  },
  {
    key: 'regionNameOld',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeNameOld',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '手机号',
    showOverflowTooltip: true,
  },
  {
    key: 'regionNameNew',
    label: '转入片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeNameNew',
    label: '转入门店',
    showOverflowTooltip: true,
  },
  {
    key: 'createdName',
    label: '申请人',
    showOverflowTooltip: true,
  },
  {
    key: 'createdTime',
    label: '申请时间',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { createdTime } = params.row;
      if (!createdTime) return h('div', '');
      return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'auditStatus',
    label: '审核状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { auditStatus } = params.row;
      if (auditStatus === undefined) return h('div', '');
      const list = VERIFY_STRTUS.filter(item => item.id === auditStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'verifyNode',
    label: '审批环节',
    showOverflowTooltip: true,
  },
  {
    key: 'verifyUser',
    label: '审核人',
    showOverflowTooltip: true,
  },
  {
    key: 'updatedTime',
    label: '审核日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { updatedTime, taskName, status } = params.row;
      // status === 0 : 审核中
      if (!updatedTime || (taskName === '客服主管审批' && status === 0)) return h('div', '');
      return h('div', dayjs(updatedTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'duration',
    label: '耗时(h)',
  }
];

// 转历史申请
const TURN_HISTORY_APPROVAL_LIST = [
  {
    key: 'seq',
    label: '申请单号',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { seq } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(params.row);
          }
        }
      }, seq);
    }
  },
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'acceptNumber',
    label: '受理号',
    showOverflowTooltip: true,
  },
  {
    key: 'classesName',
    label: '班别',
    showOverflowTooltip: true,
  },
  {
    key: 'registrationTime',
    label: '报名日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { registrationTime } = params.row;
      if (!registrationTime) return h('div', '');
      return h('div', dayjs(registrationTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'learnDrivingSchedule',
    label: '学车进度',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { learnDrivingSchedule } = params.row;
      if (learnDrivingSchedule === undefined) return h('div', '');
      const list = STUDY_STAGE.filter(item => item.id === Number(learnDrivingSchedule));
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'salePrice',
    label: '订单金额',
    isPrice: true
  },
  {
    key: 'balance',
    label: '待收金额',
    isPrice: true
  },
  {
    key: 'createdName',
    label: '申请人',
    showOverflowTooltip: true,
  },
  {
    key: 'createdTime',
    label: '申请时间',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { createdTime } = params.row;
      if (!createdTime) return h('div', '');
      return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'auditStatus',
    label: '审核状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { auditStatus } = params.row;
      if (auditStatus === undefined) return h('div', '');
      const list = VERIFY_STRTUS.filter(item => item.id === auditStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },

  {
    key: 'verifyNode',
    label: '审批环节',
    showOverflowTooltip: true,
  },
  {
    key: 'verifyUser',
    label: '审核人',
    showOverflowTooltip: true,
  },
  {
    key: 'updatedTime',
    label: '审核日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { updatedTime } = params.row;
      if (!updatedTime) return h('div', '');
      return h('div', dayjs(updatedTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'duration',
    label: '耗时(h)'
  }
];

// 考试结果变更
const EXAM_RESULTS_CHANGE_LIST = [
  {
    key: 'seq',
    label: '变更单编号',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { seq } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail({ seq });
          }
        }
      }, seq);
    }
  },
  {
    key: 'step',
    label: '考试科目',
    showOverflowTooltip: true,
  },
  {
    key: 'batchNo',
    label: '批次号',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '学员姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true,
  },
  {
    key: 'reason',
    label: '变更内容',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { examResultOld, examResultNew } = params.row;
      return h('div', `${examResultOld}->${examResultNew}`);
    }
  },
  {
    key: 'reason',
    label: '变更原因',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { reason } = params.row;
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: reason,
        },
        scopedSlots: {
          reference: () => h('p', reason),
        },
      });
    }
  },
  {
    key: 'applicantTime',
    label: '申请时间',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { applicantTime } = params.row;
      if (!applicantTime) return h('div', '');
      return h('div', dayjs(applicantTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'applicantName',
    label: '申请人',
    showOverflowTooltip: true,
  },
  {
    key: 'status',
    label: '审核状态',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { status } = params.row;
      if (status === undefined) return h('div', '');
      const _list = VERIFY_STRTUS.filter(item => item.id === status);
      return h('span', status ? _list[0].label : '');
    },
  },
  {
    key: 'verifyNode',
    label: '审批环节',
    showOverflowTooltip: true,
  },
  {
    key: 'auditorName',
    label: '审核人',
    showOverflowTooltip: true,
  },
  {
    key: 'verifyDate',
    label: '审核时间',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { verifyDate } = params.row;
      if (!verifyDate) return h('div', '');
      return h('div', dayjs(verifyDate).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'type',
    label: '考核类型',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { type } = params.row;
      const typeList = [{
        label: '客观出错',
        id: 1,
      }, {
        label: '主观出错',
        id: 2,
      },
      ];
      const _list = typeList.filter(item => item.id === type);
      return h('span', type !== undefined ? _list[0].label : '');
    },
  },
  // {
  //   key: 'verifyTimeConsuming',
  //   label: '审核耗时(h)',
  //   minWidth: 80,
  // },
];

// 学员转出
const TRANSFER_OUT_LIST = [
  // {
  //   key: 'batchNo',
  //   label: '批次号',
  //   minWidth: 150,
  // },
  // {
  //   key: 'regionName',
  //   label: '片区',
  //   minWidth: 100,
  //   showOverflowTooltip: true,
  // },
  {
    key: 'storeName',
    label: '门店',
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '姓名',
    showOverflowTooltip: true,
  },
  {
    key: 'idNo',
    label: '证件号',
    showOverflowTooltip: true,
  },
  {
    key: 'mobile',
    label: '联系电话',
    showOverflowTooltip: true,
  },
  {
    key: 'operationDate',
    label: '操作日期',
    showOverflowTooltip: true,
  },
  {
    key: 'operationName',
    label: '操作人',
    showOverflowTooltip: true,
  },
];

export {
  DELETED_FIXED_LABELS,
  PAPERLESS_COLLECT_LIST_LABEL,
  SITE_DELIVERY_TABLE_LIST_LABEL,
  LICENSE_RECEIPT_FORM_LIST_LABEL,
  AREA_DELIVERY_TABLE_LIST_LABEL,
  VEHICLE_APPROVAL_LIST_LABEL,
  CLASS_SITUATION_LIST_LABEL,
  REPORT_CARD_LIST_LABEL,
  APPLY_EXAM_LIST_LABEL,
  EXAM_RESULT_LIST_LABEL,
  HUIZHOU_EXAM_RESULT_LIST_LABEL,
  SUPERVISION_HOURS_LIST_LABEL,
  SUBJECT_TRAINING_LIST_LABEL,
  ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTWO,
  ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTHREE,
  EXAM_FEE_LIST_OTHER,
  EXAM_FEE_LIST_SELF,
  HUIZHOU_EXAM_FEE_LIST_OTHER,
  HUIZHOU_EXAM_FEE_LIST_SELF,
  EXAM_APPROVAL_LIST_REPLY_ERROR,
  EXAM_APPROVAL_LIST_HAS_REPLY,
  HUIZHOU_EXAM_APPROVAL_LIST_REPLY,
  CAPITAL_SUPERVERION_LIST_LABEL,
  EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE,
  EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE,
  HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE,
  HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE,
  CHANGE_INFO_LIST,
  SUPPLEMENTARY_INFO_LIST,
  SUPPLEMENTARY_INFO_DETAIL,
  FILE_FILING_LIST,
  FILE_FILING_DETAIL_LIST,
  BATCH_NUMBER_LIST,
  CANCEL_INFO_LIST,
  CHANGE_STORE_APPROVAL_LIST,
  TURN_HISTORY_APPROVAL_LIST,
  EXAM_RESULTS_CHANGE_LIST,
  TRANSFER_OUT_LIST
};
