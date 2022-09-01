import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import {
  jsReduceFunc, jsAddFunc, OSS_BASEURL, REG_PRICE_OR_ZONE
} from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import { REFUND_TYPE, INVOICING_TYPE, STUDY_STAGE } from '@/enums';
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
    refundTypeFilter(val: number): string {
      const _list = REFUND_TYPE.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    haveOrNoFilter(val: number): string {
      const _list = haveOrNoOpts.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    refundCauseFilter(val: number): string {
      const _list = refundReasonOpts.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    fileNameFilter(val: string): string {
      const list = val.split('/');
      return list[list.length - 1];
    },
    subjectsFilter(val: number): string {
      if (val === null) return '';
      const _list = STUDY_STAGE.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
  }
})
export default class MarketOrderApprovalRefundDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('order/queryRefundDetail') private queryRefundDetail!: (data: any) => ParamsType;

  @Action('order/backOutApproveRefund') private backOutApproveRefund!: (data: any) => ParamsType;

  @Action('order/noPassApproveRefund') private noPassApproveRefund!: (data: any) => ParamsType;

  @Action('order/passApproveRefund') private passApproveRefund!: (data: any) => ParamsType;

  @Action('order/queryRefundInfoByIdNo') private queryRefundInfoByIdNo!: (data: any) => ParamsType;

  @Action('order/putInsertRefund') private putInsertRefund!: (data: any) => ParamsType;

  @Action('order/updateFinanceFee') private updateFinanceFee!: (data: any) => ParamsType;

  @Action('order/editInsertRefund') private editInsertRefund!: (data: any) => any;

  private openFileFunc(val: any) {
    window.open(`${OSS_BASEURL}${val}`);
  }

  private idNoBlurFunc() {
    const { idNo, refundType } = this.formData;
    if (idNo) {
      this.queryRefundInfoByIdNo({ idNo, flag: refundType !== 6 }).then((res: any) => {
        Object.keys(res).forEach(key => {
          if (res[key] !== undefined) {
            this.formData[key] = res[key];
          }
        });
        const { paymentInfo } = res;
        this.payTableData.list = paymentInfo;
      });
    }
  }

  private invoiceTypeOpts = INVOICING_TYPE;

  private refundTypeOpts = REFUND_TYPE;

  private refundReasonOpts = refundReasonOpts;

  private haveOrNoOpts = haveOrNoOpts;

  rejectShow = false;

  rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { id } = this.formData;
    const sendData = { id, verifyOpinion: remark, verifyNode: data.verifyNode };
    this.noPassApproveRefund(sendData).then(() => {
      this.$message.success('操作成功！');
      this.goback();
    });
  }

  private applyFunc(id: number) {
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
          this.passApproveRefund(sendData).then(() => {
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
    }
    if (id === 3) {
      this.$confirm('是否撤销申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sendData = { id: _id, };
        this.backOutApproveRefund(sendData).then(() => {
          this.$message.success('操作成功！');
          this.goback();
        });
      });
    }
    if (id === 4) {
      this.type = 1;
    }
  }

  @Watch('formData.refundType', { deep: true, immediate: true })
  watchRefundType(newVal: number) {
    this.formRules.remark[0].required = newVal === 7;
  }

  @Watch('formData.bankNo', { deep: true, immediate: true })
  private watchBankNoFunc(newVal: any) {
    if (newVal && newVal.length > 4) {
      let _idcard = '';
      _idcard = newVal.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      this.formData.bankNo = _idcard;
    }
  }

  // 培训协议
  private trainProtocolFileOpts: ParamsType = {
    business: 'market/order_approval',
    limit: 5,
    showFileList: true,
    fileList: []
  }

  @Watch('trainProtocolFileOpts', { deep: true })
  watchTrainProtocolFileOpts(newVal: any) {
    const { fileList } = newVal;
    this.formData.trainProtocolFile = fileList;
  }

  // 上传成功
  private trainProtocolFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.trainProtocolFileOpts.fileList.push(_obj);
  }

  // 删除
  private trainProtocolFileUploadRemove(val: any): void {
    const { name } = val;
    let _index = null;
    this.trainProtocolFileOpts.fileList.forEach((item: any, index: number) => {
      if (item.name === name) {
        _index = index;
      }
    });
    this.trainProtocolFileOpts.fileList.splice(_index, 1);
  }

  // 培训发票
  private trainInvoiceFileOpts: ParamsType = {
    business: 'market/order_approval',
    limit: 5,
    showFileList: true,
    fileList: []
  }

  @Watch('trainInvoiceFileOpts', { deep: true })
  watchTrainInvoiceFileOpts(newVal: any) {
    const { fileList } = newVal;
    this.formData.trainInvoiceFile = fileList;
  }

  // 上传成功
  private trainInvoiceFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.trainInvoiceFileOpts.fileList.push(_obj);
  }

  // 删除
  private trainInvoiceFileUploadRemove(val: any): void {
    const { name } = val;
    let _index = null;
    this.trainInvoiceFileOpts.fileList.forEach((item: any, index: number) => {
      if (item.name === name) {
        _index = index;
      }
    });
    this.trainInvoiceFileOpts.fileList.splice(_index, 1);
  }

  // 银行卡复印件
  private bankCardCopiesFileOpts: ParamsType = {
    business: 'market/order_approval',
    limit: 5,
    showFileList: true,
    fileList: []
  }

  @Watch('bankCardCopiesFileOpts', { deep: true })
  watchBankCardCopiesFileOpts(newVal: any) {
    const { fileList } = newVal;
    this.formData.bankCardCopiesFile = fileList;
  }

  // 上传成功
  private bankCardCopiesFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.bankCardCopiesFileOpts.fileList.push(_obj);
  }

  // 删除
  private bankCardCopiesFileUploadRemove(val: any): void {
    const { name } = val;
    let _index = null;
    this.bankCardCopiesFileOpts.fileList.forEach((item: any, index: number) => {
      if (item.name === name) {
        _index = index;
      }
    });
    this.bankCardCopiesFileOpts.fileList.splice(_index, 1);
  }

  // 单位证明
  private firmProveFileOpts: ParamsType = {
    business: 'market/order_approval',
    limit: 5,
    showFileList: true,
    fileList: []
  }

  @Watch('firmProveFileOpts', { deep: true })
  watchFirmProveFileOpts(newVal: any) {
    const { fileList } = newVal;
    this.formData.firmProveFile = fileList;
  }

  // 上传成功
  private firmProveFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.firmProveFileOpts.fileList.push(_obj);
  }

  // 删除
  private firmProveFileUploadRemove(val: any): void {
    const { name } = val;
    let _index = null;
    this.firmProveFileOpts.fileList.forEach((item: any, index: number) => {
      if (item.name === name) {
        _index = index;
      }
    });
    this.firmProveFileOpts.fileList.splice(_index, 1);
  }

  // 委托书
  private powerOfAttorneyFileOpts: ParamsType = {
    business: 'market/order_approval',
    limit: 5,
    showFileList: true,
    fileList: []
  }

  @Watch('powerOfAttorneyFileOpts', { deep: true })
  watchPowerOfAttorneyFileOpts(newVal: any) {
    const { fileList } = newVal;
    this.formData.powerOfAttorney = fileList;
  }

  // 上传成功
  private powerOfAttorneyFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.powerOfAttorneyFileOpts.fileList.push(_obj);
  }

  // 删除
  private powerOfAttorneyFileUploadRemove(val: any): void {
    const { name } = val;
    let _index = null;
    this.powerOfAttorneyFileOpts.fileList.forEach((item: any, index: number) => {
      if (item.name === name) {
        _index = index;
      }
    });
    this.powerOfAttorneyFileOpts.fileList.splice(_index, 1);
  }

  // 其他资料
  private otherInformationFileOpts: ParamsType = {
    business: 'market/order_approval',
    limit: 5,
    showFileList: true,
    fileList: []
  }

  @Watch('otherInformationFileOpts', { deep: true })
  watchOtherInformationFileOpts(newVal: any) {
    const { fileList } = newVal;
    this.formData.otherInformation = fileList;
  }

  // 上传成功
  private otherInformationFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.otherInformationFileOpts.fileList.push(_obj);
  }

  // 删除
  private otherInformationFileUploadRemove(val: any): void {
    const { name } = val;
    let _index = null;
    this.otherInformationFileOpts.fileList.forEach((item: any, index: number) => {
      if (item.name === name) {
        _index = index;
      }
    });
    this.otherInformationFileOpts.fileList.splice(_index, 1);
  }

  // 客服应扣金额合计
  get customerServiceDeductedTotalAmount() {
    const {
      refundType, registeringCost = 0, trainCost = 0, otherCost = 0, differCost = 0, idNo
    } = this.formData;
    let _sum = 0;
    if (idNo) {
      if (refundType === 6) {
        _sum = differCost;
      } else {
        _sum = jsAddFunc(jsAddFunc(registeringCost, trainCost), otherCost);
      }
    }
    return _sum;
  }

  // 客服应退费用
  get customerServiceRefundableTotalAmount() {
    const { paidCost, refundType } = this.formData;
    const { customerServiceDeductedTotalAmount } = this;
    if (refundType === 6) {
      return customerServiceDeductedTotalAmount;
    }
    const _sum = jsReduceFunc(paidCost, customerServiceDeductedTotalAmount);
    return _sum;
  }

  // 应扣金额合计
  get deductedTotalAmount() {
    const {
      refundType, financeRegisteringCost = 0, financeTrainCost = 0, financeOtherCost = 0, financeDifferCost = 0, idNo
    } = this.formData;
    let _sum = 0;
    if (idNo) {
      if (refundType === 6) {
        _sum = financeDifferCost;
      } else {
        _sum = jsAddFunc(jsAddFunc(financeRegisteringCost, financeTrainCost), financeOtherCost);
      }
    }
    return _sum;
  }

  // 应退费用
  get refundableTotalAmount() {
    const { paidCost = 0, refundType } = this.formData;
    const { deductedTotalAmount } = this;
    if (refundType === 6) {
      return deductedTotalAmount;
    }
    const _sum = jsReduceFunc(paidCost, deductedTotalAmount);
    return _sum;
  }

  private formData: ParamsType = {
    auditStatus: null,
    account: '',
    bankCardCopies: 1,
    bankCardCopiesFile: [],
    bankName: '',
    bankNo: '',
    carModel: '',
    classesId: null,
    classesName: '',
    differCost: null,
    firmProve: 1,
    firmProveFile: [],
    idNo: '',
    marketingChannel: '',
    mobile: '',
    regionId: null,
    otherCost: null,
    otherInformation: [],
    oweCost: null,
    paidCost: null,
    powerOfAttorney: [],
    refundCause: '',
    refundType: null,
    regionName: '',
    registerCost: null,
    registerDate: '',
    registeringCost: null,
    remark: '',
    storeId: null,
    storeName: '',
    subjects: null,
    trainCost: null,
    trainInvoice: 1,
    trainInvoiceFile: [],
    trainProtocol: 1,
    trainProtocolFile: [],
    transactWay: 1,
    userId: null,
    userName: '',
    applyNo: '',
    createdTime: '',
    id: null,
    orderId: '',
    financeAuditAmount: null,
    financeDifferCost: null,
    financeOtherCost: null,
    financeRegisteringCost: null,
    financeTrainCost: null,
    invoiceType: null,
    bankMainName: ''
  }

  private formRules = {
    remark: [
      { required: false, message: '必填项', trigger: ['change', 'blur'] }
    ],
    refundType: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    idNo: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    refundCause: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    account: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    bankNo: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    bankName: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    bankMainName: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    registeringCost: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    trainCost: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    otherCost: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    differCost: [
      { required: false, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    financeRegisteringCost: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    financeTrainCost: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    financeOtherCost: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    financeDifferCost: [
      { required: false, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    financeAuditAmount: [
      { required: false, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    invoiceType: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] },
    ],
    transactWay: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] },
    ],
    trainProtocol: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    trainInvoice: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    bankCardCopies: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    firmProve: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    powerOfAttorney: [
      { required: true, message: '请上传附件', trigger: ['change', 'blur'] }
    ],
    trainProtocolFile: [
      { required: true, message: '请上传附件', trigger: ['change', 'blur'] }
    ],
    trainInvoiceFile: [
      { required: true, message: '请上传附件', trigger: ['change', 'blur'] }
    ],
    bankCardCopiesFile: [
      { required: true, message: '请上传附件', trigger: ['change', 'blur'] }
    ],
    firmProveFile: [
      { required: true, message: '请上传附件', trigger: ['change', 'blur'] }
    ]
  }

  // 退费类型切换
  private refundTypeChange(val: number) {
    this.editRefundTypeChange(val);
    if (val === 6) {
      this.formData.registeringCost = null;
      this.formData.trainCost = null;
      this.formData.otherCost = null;
      this.formData.financeRegisteringCost = null;
      this.formData.financeTrainCost = null;
      this.formData.financeOtherCost = null;
    } else {
      this.formData.differCost = null;
      this.formData.financeDifferCost = null;
    }
    this.idNoBlurFunc();
  }

  // 办理方式切换
  private transactWayChange(val: number) {
    if (val === 1) {
      this.powerOfAttorneyFileOpts.fileList = [];
      this.otherInformationFileOpts.fileList = [];
    }
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
        label: '审核时间',
      },
    ],
    list: []
  }

  private btnLoading = false;

  async submit() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = { ...this.formData };
        const _list = [
          'bankCardCopiesFile', 'firmProveFile', 'otherInformation', 'powerOfAttorney', 'trainInvoiceFile', 'trainProtocolFile'
        ];
        Object.keys(sendData).forEach(key => {
          if (_list.includes(key)) {
            const _arr: string[] = [];
            sendData[key].forEach((i: any) => {
              _arr.push(i.url);
            });
            sendData[key] = _arr.join(',');
          }
        });
        // 校验扣费，不能高于订单金额
        const {
          registerCost, registeringCost, trainCost, otherCost, differCost, refundType, paymentInfo, orderId
        } = sendData;
        const _text = '扣费总和不可高于订单总金额';
        if (refundType !== 6) {
          if (registerCost < (Number(registeringCost) + Number(trainCost) + Number(otherCost))) {
            this.$message.warning(_text);
            return;
          }
        } else if (registerCost < differCost) {
          this.$message.warning(_text);
          return;
        }
        // 特殊处理
        sendData.refundOrderData = { order: '', orderExt: [] };
        sendData.refundOrderData.order = orderId;
        if (Array.isArray(paymentInfo)) {
          paymentInfo.forEach((item: any) => {
            const { orderType, orderNo } = item;
            if (orderType === 1) {
              sendData.refundOrderData.order = orderNo;
            } else {
              sendData.refundOrderData.orderExt.push(orderNo);
            }
          });
        }

        this.btnLoading = true;
        delete sendData.paymentInfo;
        if (sendData.id) {
          this.editInsertRefund(sendData).then(() => {
            this.$message.success('修改成功！');
            this.goback();
          }).finally(() => {
            this.btnLoading = false;
          });
        } else {
          delete sendData.id;
          this.putInsertRefund(sendData).then(() => {
            this.$message.success('新增成功！');
            this.goback();
          }).finally(() => {
            this.btnLoading = false;
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  // 财务提交修改
  async financeSubmit() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const {
          registerCost, financeAuditAmount, financeDifferCost, financeOtherCost, financeRegisteringCost, financeTrainCost, id, invoiceType, refundType
        } = this.formData;
        // 校验扣费，不能高于订单金额
        const _text = '扣费总和不可高于订单总金额';
        if (refundType !== 6) {
          if (registerCost < (Number(financeRegisteringCost) + Number(financeTrainCost) + Number(financeOtherCost))) {
            this.$message.warning(_text);
            return;
          }
        } else if (registerCost < financeDifferCost) {
          this.$message.warning(_text);
          return;
        }

        const sendData = {
          financeAuditAmount,
          financeDifferCost,
          financeOtherCost,
          financeRegisteringCost,
          financeTrainCost,
          id,
          invoiceType
        };
        this.btnLoading = true;
        this.updateFinanceFee(sendData).then(() => {
          this.$message.success('财务保存成功！');
          this.goback();
        }).finally(() => {
          this.btnLoading = false;
        });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  printDetailData = {}

  async queryDetail(id: string) {
    const body = await this.queryRefundDetail({ id });
    const { approveRecord, paymentInfo } = body;
    this.printDetailData = body;
    const _list = [
      'bankCardCopiesFile', 'firmProveFile', 'otherInformation', 'powerOfAttorney', 'trainInvoiceFile', 'trainProtocolFile'
    ];
    Object.keys(this.formData).forEach(key => {
      if (_list.includes(key)) {
        if (body[key]) {
          this.formData[key] = body[key].split(',');
        }
      } else {
        this.formData[key] = body[key];
      }
    });
    this.editRefundTypeChange(body.refundType);
    this.tableData.list = approveRecord;
    this.payTableData.list = paymentInfo;
    this.$nextTick(() => {
      (this.$refs.formRef as VueComponentParent).clearValidate();
    });
  }

  private editRefundTypeChange(val: number) {
    if (val === 6) {
      this.formRules.registeringCost[0].required = false;
      this.formRules.trainCost[0].required = false;
      this.formRules.otherCost[0].required = false;
      this.formRules.differCost[0].required = true;
      this.formRules.financeRegisteringCost[0].required = false;
      this.formRules.financeTrainCost[0].required = false;
      this.formRules.financeOtherCost[0].required = false;
      this.formRules.financeDifferCost[0].required = true;
    } else {
      this.formRules.registeringCost[0].required = true;
      this.formRules.trainCost[0].required = true;
      this.formRules.otherCost[0].required = true;
      this.formRules.differCost[0].required = false;
      this.formRules.financeRegisteringCost[0].required = true;
      this.formRules.financeTrainCost[0].required = true;
      this.formRules.financeOtherCost[0].required = true;
      this.formRules.financeDifferCost[0].required = false;
    }
  }

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/market/order_approval/refund' });
  }

  private isFinance = false;

  private refundPrintShow = false;

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
        isPrice: true
      },
      {
        key: 'realityAmount',
        label: '已缴金额',
        isPrice: true
      },
      {
        key: 'delayAmount',
        label: '欠费金额',
        isPrice: true
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

  // 生命周期
  type = 0 // 0新增 1编辑 2查看

  perm = {};

  async activated() {
    const { id, isEdit } = this.$route.query;
    this.type = isEdit ? 2 : 0;
    if (id && typeof id === 'string') {
      this.queryDetail(id);
      this.formRules.financeAuditAmount[0].required = true;
      // 广仁客服不可以查看财务填写数据
      const { drivingSchoolId } = this.userInfo;
      const userRoleName = localStorage.getItem('user_roleName');
      this.isFinance = !(drivingSchoolId === '370' && userRoleName?.includes('客服'));
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
