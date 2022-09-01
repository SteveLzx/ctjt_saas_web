/** 补录办证、变更办证数据预览表格配置 */
import { SUBJECT } from '@/enums/accreditation';

const FIXED_LABELS = [
  {
    key: 'userName',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 200,
  },
];
// 无纸化采集
const PAPERLESS_COLLECT_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'collectDate',
      label: '采集日期',
      minWidth: 120
    },
  ],
];
// 场点交表
const SITE_DELIVERY_TABLE_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'deliverDate',
      label: '场点交表日期',
    },
  ],
];
// 牌证收表
const LICENSE_RECEIPT_FORM_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'recoveryDate',
      label: '牌证收表日期',
    },
  ],
];
// 上课情况
const CLASS_SITUATION_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'remark',
      label: '备注',
      minWidth: 150,
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
    },
  ]];

// 片区交表
const AREA_DELIVERY_TABLE_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'areaDate',
      label: '片区交表日期',
    },
  ],
];
// 车管所送审
const VEHICLE_APPROVAL_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'inspectionDate',
      label: '送审日期',
    },
  ],
];
// 资金监管存入
const CAPITAL_SUPERVISION_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'carModel',
      label: '车型',
      minWidth: 80,
    },
    {
      key: 'step',
      label: '资金科目',
      minWidth: 80,
      render(h: any, params: any) {
        const { step } = params.row;
        const options = [
          {
            label: '存入一期',
            id: 1,
          },
          {
            label: '存入二期',
            id: 2,
          },
          {
            label: '存入三期',
            id: 3,
          },
          {
            label: '存入全款',
            id: 4
          }
        ];
        return h('span', Number.isFinite(Number(step)) && step ? options.filter(item => item.id === step)[0].label : step);
      }
    },
    {
      key: 'superviseDate',
      label: '监管日期',
    },
    {
      key: 'payType',
      label: '付款方式',
    },
    {
      key: 'transferCode',
      label: '转账码',
      winth: 150
    },
  ],
];
// 考场受理
const EXAM_ACCEPTANCE_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'carModel',
      label: '车型',
    },
    {
      key: 'acceptNumber',
      label: '受理号',
      minWidth: 200,
    },
    {
      key: 'acceptDate',
      label: '受理日期',
    },
    {
      key: 'acceptFailReason',
      label: '失败原因',
      minWidth: 150,
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
      }
    },
    {
      key: 'acceptRemark',
      label: '备注',
      minWidth: 150,
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
  ],
];
// 考场受理
const HUIZHOU_EXAM_ACCEPTANCE_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'carModel',
      label: '车型',
    },
    {
      key: 'acceptDate',
      label: '受理日期',
    },
    {
      key: 'acceptFailReason',
      label: '失败原因',
      minWidth: 150,
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
      }
    },
    {
      key: 'acceptRemark',
      label: '备注',
      minWidth: 150,
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
  ],
];
// 学科培训
const SUBJECT_TRAINING_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '培训科目',
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    },
    {
      key: 'remark',
      label: '备注',
    },
    {
      key: 'subjectTrainDate',
      label: '培训日期',
    },
  ],
];
// 考试报考
const APPLY_EXAM_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'subject',
      label: '科目',
    },
    {
      key: 'acceptNumber',
      label: '受理号',
      minWidth: 200,
    },
    {
      key: 'examAddress',
      label: '考试地点',
      minWidth: 150,
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
      minWidth: 110,
    },
  ],
];
// 考试批复
const EXAM_APPROVAL_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '科目',
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    },
    // {
    //   key: 'acceptNumber',
    //   label: '受理号',
    //   minWidth: 150,
    // },
    {
      key: 'carModel',
      label: '车型',
      minWidth: 80,
    },
    {
      key: 'examDate',
      label: '考试日期',
    },
    {
      key: 'examTime',
      label: '考试时间',
    },
    {
      key: 'examAddress',
      label: '考试地点',
      minWidth: 150,
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
      key: 'replyAbnormal',
      label: '批复异常',
      minWidth: 200,
      render(h: any, params: any) {
        const { replyAbnormal } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: replyAbnormal,
          },
          scopedSlots: {
            reference: () => h('p', replyAbnormal),
          },
        });
      },
    }
  ],
];
// 考试批复-惠州深港
const HUIZHOU_EXAM_APPROVAL_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '科目',
      minWidth: 80,
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    },
    {
      key: 'carModel',
      label: '车型',
      minWidth: 80,
    },
    {
      key: 'examDate',
      label: '考试日期',
      minWidth: 110,
    },
    {
      key: 'examTime',
      label: '考试时间',
      minWidth: 90,
    },
    {
      key: 'examAddress',
      label: '考试地点',
      minWidth: 150,
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
    }
  ],
];

// 考试批复-惠州深港(从导入模板导入的数据-优化)
const HUIZHOU_EXAM_APPROVAL_TABLE_IMPORT = {
  labels: [
    {
      key: 'userName',
      label: '学员姓名',
      minWidth: 100,
    },
    {
      key: 'idNo',
      label: '身份证明号码',
      minWidth: 200,
    },
    {
      key: 'step',
      label: '考试科目',
      minWidth: 180,
    },
    {
      key: 'carModel',
      label: '考试车型',
      minWidth: 80,
    },
    {
      key: 'examDate',
      label: '约考日期',
      minWidth: 130,
    },
    {
      key: 'examTime',
      label: '考试场次',
      minWidth: 130,
    },
    {
      key: 'examAddress',
      label: '考试场地',
      minWidth: 150,
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
  ],
};
// 考试交费
const EXAM_FEE_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'storeName',
      label: '门店',
    },
    // {
    //   key: 'acceptNumber',
    //   label: '受理号',
    //   minWidth: 150,
    // },
    {
      key: 'step', // todo
      label: '科目',
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    },
    {
      key: 'fee',
      label: '金额',
    },
    {
      key: 'payType',
      label: '交费方式',
      render(h: any, params: any) {
        const { payType } = params.row;
        let type = '';
        if (Number.isFinite(Number(payType)) && payType) {
          type = Number(payType) === 1 ? '代交' : '自交';
        } else {
          type = payType;
        }
        return h('span', type);
      },
    },
    {
      key: 'feeSubject',
      label: '费用科目',
    },
    {
      key: 'payNumber',
      label: '缴费流水号',
      minWidth: 200,
    },
    {
      key: 'costDate',
      label: '交费日期',
      minWidth: 110,
    }
  ],
];
// 考试交费-惠州深港
const HUIZHOU_EXAM_FEE_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'storeName',
      label: '门店',
    },
    {
      key: 'step',
      label: '科目',
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    },
    {
      key: 'fee',
      label: '金额',
    },
    {
      key: 'payType',
      label: '交费方式',
      render(h: any, params: any) {
        const { payType } = params.row;
        let type = '';
        if (Number.isFinite(Number(payType)) && payType) {
          type = Number(payType) === 1 ? '代交' : '自交';
        } else {
          type = payType;
        }
        return h('span', type);
      },
    },
    {
      key: 'feeSubject',
      label: '费用科目',
    },
    {
      key: 'payNumber',
      label: '缴费流水号',
      minWidth: 200,
    },
    {
      key: 'costDate',
      label: '交费日期',
      minWidth: 110,
    }
  ],
];
// 考试结果
const EXAM_RESULTS_TABLE = [
  ...FIXED_LABELS,
  ...[
    // {
    //   key: 'acceptNumber',
    //   label: '受理号',
    //   minWidth: 120,
    // },
    {
      key: 'step',
      label: '科目',
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    },
    {
      key: 'examResult',
      label: '考试结果',
    },
    {
      key: 'examDate',
      label: '考试日期',
    },
    {
      key: 'remark',
      label: '取消原因',
      minWidth: 120,
    },
  ],
];
// 考试结果-惠州深港
const HUIZHOU_EXAM_RESULTS_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '科目',
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    },
    {
      key: 'examResult',
      label: '考试结果',
    },
    {
      key: 'examDate',
      label: '考试日期',
    },
    {
      key: 'remark',
      label: '取消原因',
      minWidth: 120,
    },
  ],
];
// 成绩单
const REPORT_CARD_TABLE = [
  ...FIXED_LABELS,
  ...[
    {
      key: 'step',
      label: '科目',
      render(h: any, params: any) {
        const { step } = params.row;
        return h('span', Number.isFinite(Number(step)) && step ? SUBJECT[step - 1].label : step);
      },
    }
  ],
];
// 学员转出
const TRANSFER_OUT_TABLE = [
  ...FIXED_LABELS,
];
export {
  PAPERLESS_COLLECT_TABLE,
  SITE_DELIVERY_TABLE_TABLE,
  LICENSE_RECEIPT_FORM_TABLE,
  CLASS_SITUATION_TABLE,
  AREA_DELIVERY_TABLE_TABLE,
  VEHICLE_APPROVAL_TABLE,
  CAPITAL_SUPERVISION_TABLE,
  EXAM_ACCEPTANCE_TABLE,
  HUIZHOU_EXAM_ACCEPTANCE_TABLE,
  SUBJECT_TRAINING_TABLE,
  APPLY_EXAM_TABLE,
  EXAM_APPROVAL_TABLE,
  HUIZHOU_EXAM_APPROVAL_TABLE,
  HUIZHOU_EXAM_APPROVAL_TABLE_IMPORT,
  EXAM_FEE_TABLE,
  HUIZHOU_EXAM_FEE_TABLE,
  EXAM_RESULTS_TABLE,
  HUIZHOU_EXAM_RESULTS_TABLE,
  REPORT_CARD_TABLE,
  TRANSFER_OUT_TABLE
};
