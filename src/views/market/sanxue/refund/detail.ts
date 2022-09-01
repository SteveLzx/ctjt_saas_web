import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import dayjs from 'dayjs';
import {
  jsReduceFunc, jsAddFunc, OSS_BASEURL, REG_PRICE_OR_ZONE, Sum, REG_ZERO_INTEGER, REG_TWO_FLOAT_NUMBER
} from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import {
  REFUND_TYPE, INVOICING_TYPE, STUDY_STAGE, SCATTERED_TYPE
} from '@/enums';
import {
  refundReasonOpts, haveOrNoOpts, auditStatusOpts
} from '@/views/market/_enums';
import {
  SearchTable, CtjtCard, CtjtTable, CtjtAllTypeUpload, CtjtRejectDialog
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import PrintDetail from './_components/print_detail.vue';

@Component({
  components: {
    SearchTable, CtjtCard, CtjtTable, CtjtAllTypeUpload, PrintDetail, CtjtRejectDialog
  },
  filters: {
    auditStatusFilter(val: number): string {
      const _item = auditStatusOpts.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    scatteredTypeFilter(val: number): string {
      const _item = SCATTERED_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    invoicingFilter(val: number): string {
      const _item = INVOICING_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
  }
})
export default class MarketOrderApprovalRefundDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('order/getScatteredRefundDetail') private getScatteredRefundDetail!: (
    data: any
  ) => any;

  @Action('order/passApprove') private passApprove!: (
    data: any
  ) => any;

  @Action('order/noPassApprove') private noPassApprove!: (
    data: any
  ) => any;

  @Action('order/undoApprove') private undoApprove!: (
    data: any
  ) => any;

  @Action('order/getRefundInfoByIdNo') private getRefundInfoByIdNo!: (
    data: any
  ) => any;

  @Action('order/updateSanXueScatteredOrder') private updateSanXueScatteredOrder!: (
    data: any
  ) => any;

  private openFileFunc(val: any) {
    window.open(`${OSS_BASEURL}${val}`);
  }

  private tableData = {
    _this: {},
    labels: [
      {
        key: 'verifyNode',
        label: '审批环节',
      },
      {
        key: 'createdName',
        label: '审核人',
      },
      {
        key: 'verifyOperation',
        label: '审核操作',
      },
      {
        key: 'verifyOpinion',
        label: '审核意见',
        showOverflowTooltip: true
      },
      {
        key: 'verifyDate',
        label: '申请/审核时间',
      },
    ],
    list: []
  }

  private isNotEdit = true

  // 新增变更数据表格抽屉列表配置
  private formTableData: ParamsType = {
    _this: {},
    index: false,
    options: [],
    height: 200,
    labels: [
      {
        key: 'storeName',
        label: '门店',
        minWidth: 100,
      },
      {
        key: 'seq',
        label: '订单号',
        minWidth: 120,
      },
      {
        key: 'registerTime',
        label: '报名日期',
        minWidth: 100,
        render(h: any, params: any) {
          const { registerTime } = params.row;
          if (registerTime === undefined) return h('div', '');
          return h('div', dayjs(registerTime).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'examClasses',
        label: '班别',
        minWidth: 100,
      },
      {
        key: 'carModel',
        label: '车型',
        minWidth: 80,
      },
      {
        key: 'period',
        label: '散学学时',
        minWidth: 100,
      },
      {
        key: 'presentPeriod',
        label: '赠送学时',
        minWidth: 100,
      },
      {
        key: '',
        label: '总学时',
        minWidth: 100,
        render(h: any, params: any) {
          const { period, presentPeriod } = params.row;
          return h('div', Number(period) + Number(presentPeriod));
        }
      },
      {
        key: '',
        label: '剩余学时',
        minWidth: 100,
        render(h: any, params: any) {
          const { period, presentPeriod, usedPeriod } = params.row;
          return h('div', Number(period) + Number(presentPeriod) - Number(usedPeriod));
        }
      },
      {
        key: 'salePrice',
        label: '订单金额',
        minWidth: 100,
      },
      {
        key: 'amount',
        label: '实收金额',
        minWidth: 100,
      },
    ],
    list: [],
    selectionList: [],
  };

  rejectShow = false;

  rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { id } = this.formData;
    const sendData = { id, verifyOpinion: remark, verifyNode: data.verifyNode };
    this.noPassApprove(sendData).then(() => {
      this.$message.success('操作成功！');
      this.goback();
    });
  }

  private async applyFunc(id: number) {
    const { id: _id } = this.formData;
    if (id === 1) {
      this.$prompt('请输入通过理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{0,300}$/,
        inputErrorMessage: '输入内容长度为0-300'
      }).then((res: any) => {
        const { value } = res;
        if (value === null || value.length <= 300) {
          const sendData = { id: _id, verifyOpinion: value ? `同意，${value}` : '同意' };
          this.passApprove(sendData).then(() => {
            this.$message.success('操作成功！');
            this.goback();
          });
        } else {
          this.$message.warning('输入内容长度为1-300');
        }
      });
    }
    if (id === 2) {
      this.rejectShow = true;
      // this.$prompt('请输入不通过理由', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   inputPattern: /^.{1,30}$/,
      //   inputErrorMessage: '输入内容长度为1-30'
      // }).then((res: any) => {
      //   if (res.value.length <= 30 && res.value.length !== 0) {
      //     const sendData = { id: _id, verifyOpinion: res.value };
      //     this.noPassApprove(sendData).then(() => {
      //       this.$message.success('操作成功！');
      //       this.goback();
      //     });
      //   } else {
      //     this.$message.warning('输入内容长度为1-30');
      //   }
      // });
    }
    if (id === 3) {
      this.$confirm('是否撤销申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sendData = { id: _id, };
        this.undoApprove(sendData).then(() => {
          this.$message.success('操作成功！');
          this.goback();
        });
      });
    }

    if (id === 4) {
      this.isNotEdit = false;
    }
  }

  private formData: ParamsType = {
    idNo: '',
    userName: '',
    userInfo: { idNo: '', userName: '' },
    mobile: '',
    storeName: '',
    totalHours: null, // 总学时合计
    totalLeftHours: null, // 总剩余学时
    totalOrderMoney: null, // 总订单金额
    totalRealMoney: null, //  总实收金额
    learnedPeriod: null, // 已学学时
    learnedPeriodFee: null, // 已学学时费
    deductTrainFee: null, // 应扣服务费
    deductTotalFee: 0, // 应扣金额合计
    refundableFee: 0, // 应退费用
    reason: '', // 退费原因
    remark: '', // 备注
    accountName: '', // 账户名
    cardNo: '', // 银行卡号
    bankMainName: '', // 银行名称
    bankName: '', // 支行名称
  }

  private refundPrintShow = false;

  private btnLoading = false;

  printDetailData = { }

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/market/sxpj/refund' });
  }

  private payTableData = {
    _this: {},
    list: [],
    labels: [
      {
        key: 'orderType',
        label: '单据类型',
        render(h: any, params: any) {
          const { orderType } = params.row;
          return h('span', orderType === 1 ? '招生订单' : '其他订单');
        }
      },
      {
        key: 'orderNo',
        label: '单据号码',
      },
      {
        key: 'goodsType',
        label: '商品类型(其他订单)',
      },
      {
        key: 'amount',
        label: '订单金额',
      },
      {
        key: 'realityAmount',
        label: '已缴金额',
      },
      {
        key: 'delayAmount',
        label: '欠费金额',
      },
    ],
    showSummary: true,
    summariesMethod: (param: any) => {
      let _sum1 = 0;
      let _sum2 = 0;
      let _sum3 = 0;
      param.data.forEach((item: any) => {
        const { amount, realityAmount, delayAmount } = item;
        if (amount) {
          _sum1 = jsAddFunc(_sum1, amount);
        }
        if (realityAmount) {
          _sum2 = jsAddFunc(_sum2, realityAmount);
        }
        if (delayAmount) {
          _sum3 = jsAddFunc(_sum3, delayAmount);
        }
      });
      return ['合计', '', '', _sum1, _sum2, _sum3];
    }
  }

  /** 请求处理 */
  /** 根据id获取订单详情 */
  async queryDetail() {
    const { id } = this.$route.query;
    if (id) {
      const data = await this.getScatteredRefundDetail({ approveId: id });
      // 处理返回来的字段
      this._setFormDataFunc(data);
      this.formDataRules = this.getFormDataRules();
    }
  }

  private _setFormDataFunc(data: any) {
    console.log(1111, this.formData);
    this.formData = {
      ...this.formData,
      ...data
    };
    this.tableData.list = data.recordDoList;
    this.formTableData.list = data.orderInfoList;
    const val = data.orderInfoList;
    const totalHoursArr = val.map((a: any) => Number(a.period) + Number(a.presentPeriod));
    const totalHours = Sum(totalHoursArr);

    const totalLeftHoursArr = val.map((a: any) => Number(a.period) + Number(a.presentPeriod) - Number(a.usedPeriod));
    const totalLeftHours = Sum(totalLeftHoursArr);

    const totalOrderMoneyArr = val.map((a: any) => a.salePrice);
    const totalOrderMoney = Sum(totalOrderMoneyArr);

    const totalRealMoneyArr = val.map((a: any) => a.amount);
    const totalRealMoney = Sum(totalRealMoneyArr);
    this.formData.totalHours = totalHours; // 总学时合计
    console.log(this.formData, totalHours);
    this.formData.totalLeftHours = totalLeftHours; // 总剩余学时
    this.formData.totalOrderMoney = totalOrderMoney; // 总订单金额
    this.formData.totalRealMoney = totalRealMoney; //  总实收金额
    this.printDetailData = {
      ...data,
      totalHours, // 总学时合计
      totalLeftHours, // 总剩余学时
      totalOrderMoney, // 总订单金额
      totalRealMoney, //  总实收金额
    };
  }

  submitLoading = false;

  private formDataRules ={}

  private getFormDataRules() {
    return {
      idNo: [
        { required: true, message: '请输入证件号码搜索学员', trigger: 'blur' }
      ],
      userName: [
        { required: true, message: '未找到学员', trigger: 'blur' }
      ],
      mobile: [
        { required: true, message: '未找到联系电话', trigger: ['change', 'blur'] }
      ],
      storeName: [
        { required: true, message: '未找到门店', trigger: ['change', 'blur'] }
      ],
      totalHours: [
        { required: true, message: '未正确计算总学时合计', trigger: 'blur' }
      ],
      totalLeftHours: [
        { required: true, message: '未正确计算总剩余学时', trigger: 'blur' }
      ],
      totalOrderMoney: [
        { required: true, message: '未正确计算总订单金额', trigger: 'blur' }
      ],
      totalRealMoney: [
        { required: true, message: '未正确计算总实收金额', trigger: 'blur' }
      ],
      learnedPeriod: [
        { required: true, message: '请输入已学学时', trigger: ['change', 'blur'] },
        { pattern: REG_ZERO_INTEGER, message: '请输入正确的格式, >=0正整数' },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (Number(value) > Number(this.formData.totalHours)) {
              callback(new Error('已学学时不能超过总学时'));
            }
            callback();
          },

        }
      ],
      learnedPeriodFee: [
        { required: true, message: '请输入已学学时费', trigger: ['change', 'blur'] },
        { pattern: REG_TWO_FLOAT_NUMBER, message: '请输入最多保留两位小数的数值' },

      ],
      deductTrainFee: [
        { required: true, message: '请输入应扣服务费', trigger: ['change', 'blur'] },
        { pattern: REG_TWO_FLOAT_NUMBER, message: '请输入最多保留两位小数的数值' },
      ],
      deductTotalFee: [
        { required: true, message: '未正确计算应扣金额合计', trigger: ['change', 'blur'] }
      ],
      refundableFee: [
        { required: true, message: '未正确计算应退费用', trigger: ['change', 'blur'] },
        {
          validator: (rule: any, value: any, callback: any) => {
            if (Number(value) <= 0) {
              callback(new Error('应退费用金额应＞0'));
            }
            callback();
          },
        }
      ],
      reason: [
        { required: true, message: '请输入退费原因', trigger: ['change', 'blur'] }
      ],
      accountName: [
        { required: true, message: '请输入账户名', trigger: ['change', 'blur'] }
      ],
      cardNo: [
        { required: true, message: '请输入银行卡号', trigger: ['change', 'blur'] }
      ],
      bankMainName: [
        { required: true, message: '请输入银行名称', trigger: ['change', 'blur'] }
      ],
      bankName: [
        { required: true, message: '请输入支行名称', trigger: ['change', 'blur'] }
      ],
    };
  }

  private submit() {
    (this.$refs.formDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const { id } = this.formData;
        if (id) {
          this.updateSanXueScatteredOrder(this.formData).then(() => {
            this.goback();
            this.$message.success('修改成功！');
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  // 计算应扣金额合计
  get countTotalKouMoney() {
    const { learnedPeriodFee, deductTrainFee } = this.formData;
    console.log(learnedPeriodFee, deductTrainFee, jsAddFunc(learnedPeriodFee, deductTrainFee));
    return jsAddFunc(learnedPeriodFee, deductTrainFee) || 0;
  }

  @Watch('countTotalKouMoney')
  gotTotalKouMoney(val: any) {
    this.formData.deductTotalFee = val;
  }

  // 计算应退费用
  get countRefundMoney() {
    const { totalRealMoney, deductTotalFee } = this.formData;
    return jsReduceFunc(totalRealMoney, deductTotalFee) || 0;
  }

  @Watch('countRefundMoney')
  goRefundMoney(val: any) {
    this.formData.refundableFee = val;
  }

  // 生命周期
  perm = {};

  async activated() {
    const { id } = this.$route.query;
    if (id && typeof id === 'string') {
      this.queryDetail();
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
