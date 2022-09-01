import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import { ParamsType, VueComponentParent } from '@/type';
import { deepClone, jsAddFunc } from '@/assets/js/common';
import { ORDER_PAY_TYPE } from '@/enums';
import clearCacheMixins from '@/mixins/clearCache';

@Component
export default class FinanceCollectionFlowDetail extends mixins(clearCacheMixins) {
  @Action('finance/queryCollectionFlowDetail') private queryCollectionFlowDetail!: (data: any) => ParamsType;

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
    orderRecordList: {}, // 订单记录数据
    orderAmount: 0, // 实收订单金额
    balance: 0, // 代收金额
  }

  /** 返回list页面 */
  cancelFun() {
    (this.$refs.orderForm as VueComponentParent).resetFields();
    this.clearCache();
    this.$router.push({ path: '/finance/transaction_mg/collection_flow' });
  }

  async queryDetail() {
    // 获取订单记录和支付信息
    const { orderId, payId } = this.detailParams;
    const sendData = { orderId, payId };
    const body = await this.queryCollectionFlowDetail(sendData);
    const { orderDetailDto = {}, orderPayDetailDtoList = [] } = body;
    this.formData.orderRecordList = orderDetailDto;
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
      // 微信小程序支付不可修改
      if (_item.payType === 1) _item.isDetail = true;
      else _item.isDetail = false;
    });
    // this.formData.orderPayDetailDtoList = _data;
    this.orderPaytableData.list = _data;
    this.formData.orderAmount = _amount;
  }

  activated() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryDetail();
    }
  }
}
