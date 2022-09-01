import dayjs from 'dayjs';
import { IN_LIBRARY_STATUS, STUDY_STAGE, REFUND_TYPE } from '@/enums';
import { auditStatusOpts, approveStatusOpts, delayTypeOpts } from '@/views/market/_enums';
import { formatPrice } from '@/assets/js/common';
// 订单审批申请-退费申请
const MARKET_ORDER_APPROVAL_REFUND_LIST_LABEL = [
  {
    key: 'applyNo',
    label: '申请单号',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { applyNo, id } = params.row;
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
      applyNo);
    }
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
    key: 'refundType',
    label: '退费类型',
    render(h: any, params: any) {
      const { refundType } = params.row;
      const _list = REFUND_TYPE;
      const _item = _list.filter(item => item.id === refundType);
      if (_item.length === 0) {
        return h('div', '');
      }
      return h('div', `${_item[0].label}`);
    }
  },
  {
    key: 'returnMoney',
    label: '退费金额(元)',
    render(h: any, params: any) {
      const { returnMoney } = params.row;
      return h('div', Number(returnMoney) === 0 ? '' : formatPrice(returnMoney));
    }
  },
  {
    key: 'auditStatus',
    label: '审核状态',
    render(h: any, params: any) {
      const { auditStatus } = params.row;
      const _list = auditStatusOpts;
      const _item = _list.filter(item => item.id === auditStatus);
      if (_item.length === 0) {
        return h('div', '');
      }
      return h('div', `${_item[0].label}`);
    }
  },
  {
    key: 'payer',
    label: '付款人',
  },
  {
    key: 'paymentDate',
    label: '付款日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { paymentDate } = params.row;
      return h('div', paymentDate ? dayjs(paymentDate).format('YYYY-MM-DD') : '');
    }
  },
  {
    key: 'verifyNode',
    label: '审批环节',
  },
  {
    key: 'verifyUser',
    label: '审核人',
  },
  {
    key: 'applicantName',
    label: '申请人',
  },
  {
    key: 'applicantDate',
    label: '申请日期',
    showOverflowTooltip: true
  },
  {
    key: 'duration',
    label: '耗时(h)',
  }
];

// 转车型
const MARKET_ORDER_APPROVAL_TURN_CARMODEL_LIST_LABEL = [
  {
    key: 'seq',
    label: '申请单号',
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
    key: 'auditStatus',
    label: '审核状态',
    render(h: any, params: any) {
      const { auditStatus, id, orderId } = params.row;
      const _list = approveStatusOpts;
      let _test = '';
      const _item = _list.filter(item => item.id === auditStatus);
      if (_item.length !== 0) {
        _test = _item[0].label;
      }
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            const that = params._self.tableData._this;
            if (that.perm.btn_detail) {
              that.jumpDetail(id, orderId, 1, auditStatus);
            } else {
              that.$message.warning('暂无权限查看');
            }
          }
        }
      },
      _test);
    }
  },
  {
    key: 'verifyNode',
    label: '审批环节',
  },
  {
    key: 'verifyUser',
    label: '审核人',
  },
  {
    key: 'createdName',
    label: '申请人',
  },
  {
    key: 'createdTime',
    label: '申请日期',
    showOverflowTooltip: true
  },
  {
    key: 'duration',
    label: '耗时(h)',
  }
];

// 转班别
const MARKET_ORDER_APPROVAL_TURN_CLASSTYPE_LIST_LABEL = [
  {
    key: 'seq',
    label: '申请单号',
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
    key: 'auditStatus',
    label: '审核状态',
    render(h: any, params: any) {
      const { auditStatus, id, orderId } = params.row;
      const _list = approveStatusOpts;
      let _test = '';
      const _item = _list.filter(item => item.id === auditStatus);
      if (_item.length !== 0) {
        _test = _item[0].label;
      }
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            const that = params._self.tableData._this;
            if (that.perm.btn_detail) {
              that.jumpDetail(id, orderId, 1, auditStatus);
            } else {
              that.$message.warning('暂无权限查看');
            }
          }
        }
      },
      _test);
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
  },
  {
    key: 'createdName',
    label: '申请人',
  },
  {
    key: 'createdTime',
    label: '申请日期',
    showOverflowTooltip: true
  },
  {
    key: 'duration',
    label: '耗时(h)',
  }
];

// 订单审批列表
const MARKET_ORDER_APPROVAL_CHANGE_LIST_LABEL = [
  {
    key: 'regionName',
    label: '片区',
    showOverflowTooltip: true
  },
  {
    key: 'storeName',
    label: '门店',
  },
  {
    key: 'userName',
    label: '学员姓名',
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
    render(h: any, params: any) {
      const { auditStatus, id, orderId } = params.row;
      const _list = approveStatusOpts;
      let _test = '';
      const _item = _list.filter(item => item.id === auditStatus);
      if (_item.length !== 0) {
        _test = _item[0].label;
      }
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
      _test);
    }
  },
  {
    key: 'verifyNode',
    label: '审批环节',
  },
  {
    key: 'verifyUser',
    label: '审核人',
  },
  {
    key: 'createdName',
    label: '申请人',
  },
  {
    key: 'createdTime',
    label: '申请日期',
    showOverflowTooltip: true
  },
];

const MARKET_ORDER_APPROVAL_DELAYED_LEARNING_LIST_TABLE = [
  {
    key: 'applyNo',
    label: '申请单号',
    showOverflowTooltip: true
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
    label: '学员姓名',
    showOverflowTooltip: true
  },
  {
    key: 'idNo',
    label: '证件号码',
    showOverflowTooltip: true
  },
  {
    key: 'mobile',
    label: '手机号',
    showOverflowTooltip: true
  },
  {
    label: '受理号',
    key: 'acceptNumber',
    showOverflowTooltip: true
  },
  {
    key: 'registerDate',
    label: '报名日期',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { registerDate } = params.row;
      if (!registerDate) return h('div', '');
      return h('div', dayjs(registerDate).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'classesName',
    label: '班别',
    showOverflowTooltip: true
  },
  {
    key: 'carModel',
    label: '车型',
    showOverflowTooltip: true
  },
  {
    key: 'learnDrivingSchedule',
    label: '学车进度',
    minWidth: 80,
    render(h: any, params: any) {
      const { learnDrivingSchedule } = params.row;
      if (learnDrivingSchedule === undefined) return h('div', '');
      const list = STUDY_STAGE.filter(item => item.id === learnDrivingSchedule);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'auditStatus',
    label: '审核状态',
    render(h: any, params: any) {
      const {
        auditStatus, id, applyNo, createdName, verifyUser
      } = params.row;
      const _list = approveStatusOpts;
      let _test = '';
      const _item = _list.filter(item => item.id === auditStatus);
      if (_item.length !== 0) {
        _test = _item[0].label;
      }
      let type = 0;
      if (verifyUser === createdName) {
        type = 1;
      }
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            const that = params._self.tableData._this;
            if (that.perm.btn_detail) {
              that.jumpDetail(id, auditStatus, applyNo, type);
            } else {
              that.$message.warning('暂无权限查看');
            }
            // params._self.tableData._this.jumpDetail(id, auditStatus, applyNo, type);
          }
        }
      }, _test);
    }
  },
  {
    key: 'postponeType',
    label: '延期类型',
    minWidth: 100,
    render(h: any, params: any) {
      const { postponeType } = params.row;
      if (postponeType === undefined) return h('div', '');
      const list = delayTypeOpts.filter(a => a.id === postponeType);
      return h('span', list[0] ? list[0].label : '');
    },
  },
  {
    key: 'postponeFee',
    label: '延期费用(元)',
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
    key: 'createdName',
    label: '申请人',
  },
  {
    key: 'createdTime',
    label: '申请时间',
    showOverflowTooltip: true
  },
  {
    key: 'verifyNode',
    label: '审批环节',
    showOverflowTooltip: true
  },
  {
    key: 'verifyUser',
    label: '审核人',
  },
  // {
  //   key: 'applicantDate',
  //   label: '审核时间',
  //   minWidth: 170,
  // },
  {
    key: 'duration',
    label: '耗时(h)',
  }
];
export {
  MARKET_ORDER_APPROVAL_REFUND_LIST_LABEL,
  MARKET_ORDER_APPROVAL_TURN_CARMODEL_LIST_LABEL,
  MARKET_ORDER_APPROVAL_TURN_CLASSTYPE_LIST_LABEL,
  MARKET_ORDER_APPROVAL_CHANGE_LIST_LABEL,
  MARKET_ORDER_APPROVAL_DELAYED_LEARNING_LIST_TABLE
};
