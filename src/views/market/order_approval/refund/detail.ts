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
      this.$message.success('???????????????');
      this.goback();
    });
  }

  private applyFunc(id: number) {
    const { id: _id } = this.formData;
    if (id === 1) {
      this.$prompt('?????????????????????', '??????', {
        confirmButtonText: '??????',
        cancelButtonText: '??????',
        inputPattern: /^.{0,300}$/,
        inputErrorMessage: '?????????????????????0-300'
      }).then((res: any) => {
        const { value } = res;
        if (value === null || value.length <= 300) {
          const sendData = { id: _id, verifyOpinion: value ? `?????????${value}` : '??????' };
          this.passApproveRefund(sendData).then(() => {
            this.$message.success('???????????????');
            this.goback();
          });
        } else {
          this.$message.warning('?????????????????????1-300');
        }
      });
    }
    if (id === 2) {
      this.rejectShow = true;
    }
    if (id === 3) {
      this.$confirm('???????????????????', '??????', {
        confirmButtonText: '??????',
        cancelButtonText: '??????',
        type: 'warning'
      }).then(() => {
        const sendData = { id: _id, };
        this.backOutApproveRefund(sendData).then(() => {
          this.$message.success('???????????????');
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

  // ????????????
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

  // ????????????
  private trainProtocolFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.trainProtocolFileOpts.fileList.push(_obj);
  }

  // ??????
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

  // ????????????
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

  // ????????????
  private trainInvoiceFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.trainInvoiceFileOpts.fileList.push(_obj);
  }

  // ??????
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

  // ??????????????????
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

  // ????????????
  private bankCardCopiesFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.bankCardCopiesFileOpts.fileList.push(_obj);
  }

  // ??????
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

  // ????????????
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

  // ????????????
  private firmProveFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.firmProveFileOpts.fileList.push(_obj);
  }

  // ??????
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

  // ?????????
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

  // ????????????
  private powerOfAttorneyFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.powerOfAttorneyFileOpts.fileList.push(_obj);
  }

  // ??????
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

  // ????????????
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

  // ????????????
  private otherInformationFileUploadSuccess(val: string): void {
    const arr = val.split('/');
    const _obj = {
      name: arr[arr.length - 1],
      url: val
    };
    this.otherInformationFileOpts.fileList.push(_obj);
  }

  // ??????
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

  // ????????????????????????
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

  // ??????????????????
  get customerServiceRefundableTotalAmount() {
    const { paidCost, refundType } = this.formData;
    const { customerServiceDeductedTotalAmount } = this;
    if (refundType === 6) {
      return customerServiceDeductedTotalAmount;
    }
    const _sum = jsReduceFunc(paidCost, customerServiceDeductedTotalAmount);
    return _sum;
  }

  // ??????????????????
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

  // ????????????
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
      { required: false, message: '?????????', trigger: ['change', 'blur'] }
    ],
    refundType: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    idNo: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    refundCause: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    account: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    bankNo: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    bankName: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    bankMainName: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    registeringCost: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    trainCost: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    otherCost: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    differCost: [
      { required: false, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    financeRegisteringCost: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    financeTrainCost: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    financeOtherCost: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    financeDifferCost: [
      { required: false, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    financeAuditAmount: [
      { required: false, message: '?????????', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '??????0-999999,?????????????????????' }
    ],
    invoiceType: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
    ],
    transactWay: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] },
    ],
    trainProtocol: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    trainInvoice: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    bankCardCopies: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    firmProve: [
      { required: true, message: '?????????', trigger: ['change', 'blur'] }
    ],
    powerOfAttorney: [
      { required: true, message: '???????????????', trigger: ['change', 'blur'] }
    ],
    trainProtocolFile: [
      { required: true, message: '???????????????', trigger: ['change', 'blur'] }
    ],
    trainInvoiceFile: [
      { required: true, message: '???????????????', trigger: ['change', 'blur'] }
    ],
    bankCardCopiesFile: [
      { required: true, message: '???????????????', trigger: ['change', 'blur'] }
    ],
    firmProveFile: [
      { required: true, message: '???????????????', trigger: ['change', 'blur'] }
    ]
  }

  // ??????????????????
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

  // ??????????????????
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
        label: '????????????',
      },
      {
        key: 'createdName',
        label: '?????????',
      },
      {
        key: 'verifyOperation',
        label: '????????????',
      },
      {
        key: 'verifyOpinion',
        label: '????????????',
        showOverflowTooltip: true
      },
      {
        key: 'verifyDate',
        label: '????????????',
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
        // ???????????????????????????????????????
        const {
          registerCost, registeringCost, trainCost, otherCost, differCost, refundType, paymentInfo, orderId
        } = sendData;
        const _text = '???????????????????????????????????????';
        if (refundType !== 6) {
          if (registerCost < (Number(registeringCost) + Number(trainCost) + Number(otherCost))) {
            this.$message.warning(_text);
            return;
          }
        } else if (registerCost < differCost) {
          this.$message.warning(_text);
          return;
        }
        // ????????????
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
            this.$message.success('???????????????');
            this.goback();
          }).finally(() => {
            this.btnLoading = false;
          });
        } else {
          delete sendData.id;
          this.putInsertRefund(sendData).then(() => {
            this.$message.success('???????????????');
            this.goback();
          }).finally(() => {
            this.btnLoading = false;
          });
        }
      } else {
        this.$message.warning('??????????????????????????????????????????????????????');
      }
    });
  }

  // ??????????????????
  async financeSubmit() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const {
          registerCost, financeAuditAmount, financeDifferCost, financeOtherCost, financeRegisteringCost, financeTrainCost, id, invoiceType, refundType
        } = this.formData;
        // ???????????????????????????????????????
        const _text = '???????????????????????????????????????';
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
          this.$message.success('?????????????????????');
          this.goback();
        }).finally(() => {
          this.btnLoading = false;
        });
      } else {
        this.$message.warning('??????????????????????????????????????????????????????');
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
        label: '????????????',
        render(h: any, params: any) {
          const { orderType } = params.row;
          return h('span', orderType === 1 ? '????????????' : '????????????');
        }
      },
      {
        key: 'orderNo',
        label: '????????????',
      },
      {
        key: 'goodsType',
        label: '????????????(????????????)',
      },
      {
        key: 'amount',
        label: '????????????',
        isPrice: true
      },
      {
        key: 'realityAmount',
        label: '????????????',
        isPrice: true
      },
      {
        key: 'delayAmount',
        label: '????????????',
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
      return ['??????', '', '', _sum1, _sum2, _sum3];
    }
  }

  // ????????????
  type = 0 // 0?????? 1?????? 2??????

  perm = {};

  async activated() {
    const { id, isEdit } = this.$route.query;
    this.type = isEdit ? 2 : 0;
    if (id && typeof id === 'string') {
      this.queryDetail(id);
      this.formRules.financeAuditAmount[0].required = true;
      // ?????????????????????????????????????????????
      const { drivingSchoolId } = this.userInfo;
      const userRoleName = localStorage.getItem('user_roleName');
      this.isFinance = !(drivingSchoolId === '370' && userRoleName?.includes('??????'));
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
