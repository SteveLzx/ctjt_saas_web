import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType, VueComponentParent } from '@/type';
import { VERIFY_STRTUS, ORDER_PAY_TYPE } from '@/enums';
import clearCacheMixins from '@/mixins/clearCache';

@Component
export default class FinanceReceiptChangeMgDetail extends mixins(clearCacheMixins) {
  @Action('finance/receiptApprove') private receiptApprove!: (data: any) => ParamsType;

  @Action('finance/queryReceiptDetail') private queryReceiptDetail!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 支付方式
  private payTypeList = ORDER_PAY_TYPE;

  private orderPaytableData: ParamsType = {
    _this: {},
    index: true,
    labels: [
      {
        key: 'payType',
        label: '收款方式',
        render(h: any, params: any) {
          const { payType } = params.row;
          if (!payType) return h('div', '-');
          const _list = ORDER_PAY_TYPE.filter(item => item.id === payType);
          return h('div', _list.length > 0 ? _list[0].label : '');
        }
      },
      {
        key: 'receipt',
        label: '收据编号',
      },
      {
        key: 'amount',
        label: '收款金额(元)',
      },
      {
        key: '',
        label: '收据信息',
        render(h: any, params: any) {
          const {
            payType, payContent, outTradeNo, transactionId
          } = params.row;
          if (payType === 5) {
            return h('div', '');
          }
          if (payType === 2) {
            return h('div', { style: 'white-space: pre-line;' }, `POS机号：${payContent || ''}\n交易参考号：${outTradeNo || ''}`);
          }
          if (payType === 4) {
            return h('div', { style: 'white-space: pre-line;' }, `收款二维码编号：${payContent || ''}\n交易参考号：${outTradeNo || ''}`);
          }
          if (payType === 3) {
            return h('div', { style: 'white-space: pre-line;' }, `付款账号：${transactionId || ''}\n收款账号：${payContent || ''}`);
          }
          if (payType === 1) {
            return h('div', { style: 'white-space: pre-line;' }, `第三方渠道名称：${payContent || ''}\n第三方订单号：${transactionId || ''}\n核销码：${outTradeNo || ''}`);
          }
          return h('div', '');
        }
      },
      {
        key: 'payTime',
        label: '收据日期',
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
      // {
      //   key: '',
      //   label: '操作',
      //   render(h: any, params: any) {
      //     const { payType } = params.row;
      //     const that = params._self.tableData._this;
      //     return h('el-link', {
      //       props: {
      //         type: 'primary',
      //         underline: false,
      //         disabled: payType === 5 || that.isEdit
      //       },
      //       on: {
      //         click: () => {
      //           that.editOrderPayVos(params.$index);
      //         }
      //       }
      //     },
      //     '操作');
      //   }
      // },
    ],
    list: [],
  }

  // 详情数据
  private formData: ParamsType = {
    id: 0,
    orderRecord: {}, // 订单记录数据
    balance: 0, // 代收金额
    orderPayDetail: { // 支付信息
      id: null, // 支付id
      amount: '', // 支付金额，单位（分）
      payContent: '', // 支付类容，pos机终端号或二维码
      payTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 支付完成时间
      payType: 1, // 支付类型，1微信小程序支付，2pos刷卡，3现金支付，4收款二维码，99其他线上支付
      receipt: '', // 收据编号
      refNum: '', // 交易参考号
      isDetail: false, // 是否可以编辑
    },
    changeList: [],
    approveList: [],
    isApprove: true, // 审核中
    approveResult: null, // 审核结果： 1:通过、2:驳回
    opinion: '', // 驳回原因
  }

  // 表格配置
  private changeTableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'key',
        label: '字段',
        render(h: any, params: any) {
          const {
            key, oldPayType, newPayType, remark
          } = params.row;
          const changeKeyList = [
            {
              key: 'payType',
              label: '收款方式',
            },
            {
              key: 'receipt',
              label: '收据编号',
            },
            {
              key: 'amount',
              label: '收款金额(元)',
            },
            {
              key: 'payTime',
              label: '收款时间',
            },
            {
              key: 'remark',
              label: '备注',
            },
          ];
          if (key === 'payContent') {
            const payContentLabel: any = {
              1: '第三方渠道名称',
              2: 'POS机号',
              3: '收款账号',
              4: '收款二维码编号'
            };
            const old = payContentLabel[oldPayType];
            const after = payContentLabel[newPayType];
            const fixLabel = (old && after) ? `${old}→${after}` : (old || after);
            return h('div', fixLabel || '');
          }
          if (key === 'transactionId') {
            const transactionIdLabel: any = {
              1: '第三方订单号',
              3: '付款账号',
            };
            const old = transactionIdLabel[oldPayType];
            const after = transactionIdLabel[newPayType];
            const fixLabel = (old && after) ? `${old}→${after}` : (old || after);
            return h('div', fixLabel || '');
          }
          if (key === 'outTradeNo') {
            const payContentLabel: any = {
              1: '核销码',
              2: '交易参考号',
              4: '交易参考号'
            };
            const old = payContentLabel[oldPayType];
            const after = payContentLabel[newPayType];
            const fixLabel = (old && after) ? `${old}→${after}` : (old || after);
            return h('div', fixLabel || '');
          }
          const list = changeKeyList.filter(item => item.key === key);
          return h('div', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'oldValue',
        label: '变更前',
        render(h: any, params: any) {
          const { key, oldValue } = params.row;
          if (key === 'payType') {
            const value = oldValue ? Number(oldValue) : null;
            const list = ORDER_PAY_TYPE.filter(item => item.id === value);
            return h('div', list[0] ? list[0].label : '');
          }
          if (key === 'payTime') {
            if (!oldValue) return h('div', '');
            return h('div', dayjs(oldValue).format('YYYY-MM-DD HH:mm:ss'));
          }
          return oldValue;
        }
      },
      {
        key: 'newValue',
        label: '变更后',
        render(h: any, params: any) {
          const { key, newValue } = params.row;
          if (key === 'payType') {
            const value = newValue ? Number(newValue) : null;
            const list = ORDER_PAY_TYPE.filter(item => item.id === value);
            return h('div', list[0] ? list[0].label : '');
          }
          if (key === 'payTime') {
            if (!newValue) return h('div', '');
            return h('div', dayjs(newValue).format('YYYY-MM-DD HH:mm:ss'));
          }
          return newValue;
        }
      },
    ],
    list: [],
    selectionList: [],
  };

  // 表格配置
  private approveTableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'taskName',
        label: '审批环节',
        minWidth: 170,
      },
      {
        key: 'userName',
        label: '审核人',
        minWidth: 100,
      },
      {
        key: 'status',
        label: '审核操作',
        minWidth: 80,
        render(h: any, params: any) {
          const { status } = params.row;
          if (status === undefined) return h('div', '');
          const list = VERIFY_STRTUS.filter(item => item.id === status);
          return h('div', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'opinion',
        label: '审核意见',
        minWidth: 80,
      },
      {
        key: 'updatedTime',
        label: '申请/审核时间',
        minWidth: 170,
        render(h: any, params: any) {
          const { updatedTime, status } = params.row;
          if (status === VERIFY_STRTUS[0].id) return h('div', '');
          return h('div', updatedTime);
        }
      },
    ],
    list: [],
    selectionList: [],
  };

  // 审核结果验证规则
  private formRules = {
    approveResult: [
      { required: true, message: '请选择审核结果', trigger: 'blur' }
    ],
  };

  private opinionDisabled = false;

  @Watch('formData.approveResult', { deep: true, immediate: false })
  private approveResultChangeFun(val: any) {
    this.formData.opinion = '';
    (this.$refs.formData as VueComponentParent).clearValidate();
    const passRules = {
      approveResult: [
        { required: true, message: '请选择审核结果', trigger: 'blur' }
      ],
    };
    const rejectRules = {
      ...passRules,
      opinion: [
        { required: true, message: '请输入驳回原因', trigger: 'blur' }
      ],
    };
    if (!val || val === 2) {
      this.opinionDisabled = false;
      this.formRules = rejectRules;
    } else {
      this.opinionDisabled = true;
      this.formRules = passRules;
    }
  }

  async queryDetail() {
    // 获取订单记录和支付信息
    const {
      orderType,
      orderId,
      payId,
      approvalNo
    } = this.detailParams;
    const sendData = {
      orderType,
      orderId,
      payId,
      approvalNo
    };
    const body = await this.queryReceiptDetail(sendData);
    const
      {
        orderDetail = {},
        orderPayDetail = {},
        changedList = [],
        approvalDoList = []
      } = body;
    this.formData.orderRecord = orderDetail;
    orderPayDetail.payType = orderPayDetail.payType ? Number(orderPayDetail.payType) : null;
    // this.formData.orderPayDetail = orderPayDetail;
    this.orderPaytableData.list = [];
    this.orderPaytableData.list.push(orderPayDetail);
    this.changeTableData.list = changedList;
    this.approveTableData.list = approvalDoList;
    if (approvalDoList && approvalDoList.length > 0) {
      const lastPro = approvalDoList[approvalDoList.length - 1];
      const { status = 0 } = lastPro;
      if (status === 0) this.formData.isApprove = true;
      else this.formData.isApprove = false;
    }
  }

  private submitLoading = false;

  /** 提交审核 */
  submitFun() {
    (this.$refs.formData as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          this.submitLoading = true;
          const sendData: any = [];
          const { opinion, approveResult } = this.formData;
          const { list } = this.approveTableData; // 审批流程节点
          const { orderId, payId, taskId } = this.detailParams;
          const data = {
            orderId,
            payId,
            opinion: approveResult === 1 ? '同意' : opinion,
            status: approveResult,
            taskId,
          };
          sendData.push(data);
          if (list) {
            const lastPro = list[list.length - 1];
            const { status } = lastPro;
            if (status === 0) { // 审核中
              this.receiptApprove(sendData)
                .then(() => {
                  const msg = approveResult === 1 ? '审核' : '驳回';
                  this.$message.success(`${msg}成功`);
                  (this.$refs.formData as VueComponentParent).clearValidate();
                  this.cancelFun();
                })
                .finally(() => {
                  this.submitLoading = false;
                });
            }
          }
          this.submitLoading = false;
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** 返回list页面 */
  cancelFun() {
    this.clearCache();
    this.$router.push({ path: '/finance/transaction_review/receipt_change_mg' });
  }

  perm = {};

  async activated() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryDetail();
    }
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
