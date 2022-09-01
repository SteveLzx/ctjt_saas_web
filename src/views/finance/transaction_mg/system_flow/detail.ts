import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import { ParamsType, VueComponentParent } from '@/type';
import {
  deepClone, jsAddFunc, REG_PRICE_OR_ZONE, NUMBER_AND_EN_REG
} from '@/assets/js/common';
import { ORDER_PAY_TYPE, THIRD_CHANNELS_OPTS } from '@/enums';
import clearCacheMixins from '@/mixins/clearCache';

@Component
export default class FinanceSystemFlowDetail extends mixins(clearCacheMixins) {
  @Action('space/queryTrainingPlaceByDrivingSchoolIdList') private queryTrainingPlaceByDrivingSchoolIdList!: () => ParamsType;

  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => ParamsType;

  @Action('finance/queryAllBankAccountList') private queryAllBankAccountList!: () => ParamsType;

  @Action('finance/querySystemTransactionRecordDetail') private querySystemTransactionRecordDetail!: (data: any) => ParamsType;

  @Action('finance/modifyReceipt') private modifyReceipt!: (data: any) => ParamsType;

  // 是否是详情界面
  private isDetail = true;

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
        label: '收款时间',
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
    ],
    list: [],
  }

  // 收款账号
  private allBankAccountOpts = [];

  // pos终端号
  private allPosTerminalNoOpts = [];

  // 第三方渠道名称
  private thirdChannelsOpts = THIRD_CHANNELS_OPTS;

  private pickerOptions = {
    selectableRange: (() => {
      const data = new Date();
      const hour = data.getHours();
      const minute = data.getMinutes();
      const second = data.getSeconds();
      return [`00:00:00 - ${hour}:${minute}:${second}`];
    })(),
    disabledDate(time: any) {
      return time.getTime() > Date.now();
    }
  }

  // 详情数据
  private formData: ParamsType = {
    id: 0,
    orderRecord: {}, // 订单记录数据
    orderAmount: 0, // 实收订单金额
    balance: 0, // 代收金额
    orderPayDetailDtoList: [
      {
        amount: '', // 支付金额，单位
        id: '', // 支付id
        payContent: '', // pos终端号，第三方渠道名称，收款账号
        payTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 支付完成时间
        payType: 2, // 支付类型
        receipt: '', // 收据编号
        outTradeNo: '', // 交易参考号、核销码、付款账号
        transactionId: '', // 收款二维码编号，第三方订单号
        isEdit: true, // 是否可以编辑
        remark: ''
      }], // 支付信息
  }

  // 编辑时表单验证
  private formRules = {
    // 循环支付列表校验
    orderPayVosPayType: [
      { required: true, message: '必选项', trigger: 'blur' }
    ],
    orderPayVosPayContent: [
      { required: true, message: '必填项', trigger: 'blur' }
    ],
    orderPayVosThirdParty: [
      { required: true, message: '必选项', trigger: 'blur' }
    ],
    orderPayVosOutTradeNo: [
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ],
    orderPayVosTransactionId: [
      { required: true, message: '必填项', trigger: 'blur' },
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ],
    orderPayVosAmount: [
      { required: true, message: '请输入收款金额', trigger: 'blur' },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    orderPayVosPayTime: [
      { required: true, message: '请选择收款日期', trigger: 'change' }
    ]
  }

  private submitLoading = false;

  /** 修改支付信息 */
  editOrderPayFun() {
    (this.$refs.orderForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const _data = this._specialHandleFormData();
        const { orderPayDetailDtoList } = this.formData;
        const { orderId } = _data;
        if (_data) {
          const { payTime, payId } = _data;
          const _payTime = this.$dayjs(payTime).format('YYYY-MM-DD HH:mm:ss');
          const orderPayChangeBo = {
            ..._data,
            payTime: _payTime,
            invoiceId: orderPayDetailDtoList && orderPayDetailDtoList[0] ? orderPayDetailDtoList[0].invoiceId : ''
          };
          const sendData = {
            orderId,
            orderPayChangeBo,
            payId
          };
          this.modifyReceipt(sendData).then(() => {
            this.$message.success('提交审批成功');
            this.cancelFun();
            this.queryDetail();
          })
            .finally(() => {
              this.submitLoading = false;
              this.queryDetail();
            });
        }
        this.submitLoading = false;
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /** 提交表单前，处理特殊字段 */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const { orderPayDetailDtoList, orderRecord } = this.formData;
    const sendData = JSON.parse(JSON.stringify(orderPayDetailDtoList[0]));
    const { balance } = orderRecord; // 代收金额
    const { list } = this.orderPaytableData;
    const { amount } = list[0]; // 上次收款金额
    if (parseFloat(sendData.amount) > jsAddFunc(balance, amount)) {
      this.$message.warning('收款金额已经大于待收金额，请检查是否输入有误');
      return false;
    }
    return sendData;
  }

  /** 返回list页面 */
  cancelFun() {
    (this.$refs.orderForm as VueComponentParent).resetFields();
    this.clearCache();
    this.$router.go(-1);
  }

  async queryDetail() {
    // 获取订单记录和支付信息
    const { payId } = this.detailParams;
    const sendData = { payId };
    const body = await this.querySystemTransactionRecordDetail(sendData);
    const { orderDetailDto = {}, orderPayDetailDtoList = [] } = body;
    this.formData.orderRecord = orderDetailDto;
    this._setOrderPayList(orderPayDetailDtoList);
  }

  /**
   * 处理支付记录
   */
  private _setOrderPayList(param: ParamsType) {
    // 深拷贝一份数据
    const _data = deepClone(param);
    let _amount = 0;
    _data.forEach((item: any) => {
      const _item = item;
      _item.amount = String(_item.amount);
      _amount = jsAddFunc(parseFloat(_item.amount), _amount);
      _item.payType = Number(_item.payType);
      _item.isEdit = true;
    });
    this.orderPaytableData.list = _data;
    this.formData.orderPayDetailDtoList = deepClone(_data);
    this.formData.orderAmount = _amount;
    this.$nextTick(() => {
      (this.$refs.orderForm as VueComponentParent).clearValidate();
    });
  }

  // private editOrderPayVos(val: number) {
  //   this.formData.orderPayDetailDtoList.forEach((item: any, index: number) => {
  //     if (index === val) {
  //       const _item = item;
  //       _item.isEdit = false;
  //     }
  //   });
  // }

  private payTypeChange(val: number) {
    let _index = 0;
    let _item: any = {};
    this.formData.orderPayDetailDtoList.forEach((item: any, index: number) => {
      if (index === val) {
        _index = index;
        _item = deepClone(item);
        _item.payContent = _item.payType === 6 ? '上缴现金' : '';
        _item.outTradeNo = '';
        _item.transactionId = '';
        _item.remark = '';
      }
    });
    this.$set(this.formData.orderPayDetailDtoList, _index, _item);
    (this.$refs.orderForm as VueComponentParent).clearValidate();
  }

  private async initFunc() {
    this.queryAllBankAccountList().then((res: any) => {
      this.allBankAccountOpts = res;
    });
    this.queryAllPosTerminalNoList({ type: 2 }).then((res: any) => {
      this.allPosTerminalNoOpts = res;
    });
  }

  perm = {};

  async activated() {
    this.orderPaytableData._this = this;
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      const { isDetail } = this.detailParams;
      this.isDetail = isDetail;
      this.initFunc();
      this.queryDetail();
    }
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
