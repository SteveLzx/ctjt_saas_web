import dayjs from 'dayjs';
import { formatPrice } from '@/assets/js/common';
import { IN_LIBRARY_STATUS, STUDENT_STATUS, STUDY_STAGE } from '@/enums';
// 学员综合档案列表
const STUDENT_INTEGRATION_FILE_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'storeName',
    label: '门店',
  },
  {
    key: 'userName',
    label: '姓名',
    render(h: any, params: any) {
      const { userName } = params.row;
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
      }, userName);
    }
  },
  {
    key: 'idNo',
    label: '证件号码',
  },
  {
    key: 'acceptNumber',
    label: '受理号',
  },
  {
    key: 'mobile',
    label: '联系电话',
  },
  {
    key: 'learnDrivingSchedule',
    label: '学车进度',
    render(h: any, params: any) {
      const { learnDrivingSchedule } = params.row;
      if (learnDrivingSchedule === undefined) return h('div', '');
      const list = STUDY_STAGE.filter((item) => item.id === learnDrivingSchedule);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'classesName',
    label: '班别',
  },
  {
    key: 'carModel',
    label: '车型',
  },
  {
    key: 'learnType',
    label: '学车类型',
  },
  {
    key: 'coachName',
    label: '教练',
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
    key: 'payAmount',
    label: '支出金额',
    render(h: any, params: any) {
      const { payAmount } = params.row;
      return h('div', !payAmount ? '0' : formatPrice(payAmount));
    }
  },
  {
    key: 'isArrears',
    label: '是否欠费',
    render(h: any, params: any) {
      const { balance } = params.row;
      return h('div', !balance ? '否' : '是');
    }
  },
  {
    key: 'registerTime',
    label: '报名日期',
    render(h: any, params: any) {
      const { registerTime } = params.row;
      if (!registerTime) return h('div', '');
      return h('div', dayjs(registerTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'examDate',
    label: '科目一合格日期(学习证)',
    minWidth: 180,
    render(h: any, params: any) {
      const { examDate } = params.row;
      if (!examDate) return h('div', '');
      return h('div', dayjs(examDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'studyStatus',
    label: '学员状态',
    render(h: any, params: any) {
      const { studyStatus } = params.row;
      if (studyStatus === undefined) return h('div', '');
      const list = STUDENT_STATUS.filter(item => item.id === studyStatus);
      return h('div', list[0] ? list[0].label : '');
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
  {
    key: 'remark',
    label: '订单备注',
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
    },
  },
];

const HUIZHOU_STUDENT_INTEGRATION_FILE_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'storeName',
    label: '门店',
  },
  {
    key: 'userName',
    label: '姓名',
    render(h: any, params: any) {
      const { userName } = params.row;
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
      }, userName);
    }
  },
  {
    key: 'idNo',
    label: '证件号码',
  },
  {
    key: 'acceptNumber',
    label: '受理档案号',
    minWidth: 100,
  },
  {
    key: 'mobile',
    label: '联系电话',
  },
  {
    key: 'learnDrivingSchedule',
    label: '学车进度',
    render(h: any, params: any) {
      const { learnDrivingSchedule } = params.row;
      if (learnDrivingSchedule === undefined) return h('div', '');
      const list = STUDY_STAGE.filter((item) => item.id === learnDrivingSchedule);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'classesName',
    label: '班别',
  },
  {
    key: 'carModel',
    label: '车型',
  },
  {
    key: 'learnType',
    label: '学车类型',
  },
  {
    key: 'coachName',
    label: '教练',
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
    key: 'payAmount',
    label: '支出金额',
    render(h: any, params: any) {
      const { payAmount } = params.row;
      return h('div', !payAmount ? '0' : formatPrice(payAmount));
    }
  },
  {
    key: 'isArrears',
    label: '是否欠费',
    render(h: any, params: any) {
      const { balance } = params.row;
      return h('div', !balance ? '否' : '是');
    }
  },
  {
    key: 'registerTime',
    label: '报名日期',
    render(h: any, params: any) {
      const { registerTime } = params.row;
      if (!registerTime) return h('div', '');
      return h('div', dayjs(registerTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'examDate',
    label: '科目一合格日期（学习证）',
    minWidth: 180,
    render(h: any, params: any) {
      const { examDate } = params.row;
      if (!examDate) return h('div', '');
      return h('div', dayjs(examDate).format('YYYY-MM-DD'));
    }
  },
  {
    key: 'studyStatus',
    label: '学员状态',
    render(h: any, params: any) {
      const { studyStatus } = params.row;
      if (studyStatus === undefined) return h('div', '');
      const list = STUDENT_STATUS.filter(item => item.id === studyStatus);
      return h('div', list[0] ? list[0].label : '');
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
  {
    key: 'remark',
    label: '订单备注',
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
    },
  },
];

export {
  STUDENT_INTEGRATION_FILE_LIST_LABEL,
  HUIZHOU_STUDENT_INTEGRATION_FILE_LIST_LABEL,
};
