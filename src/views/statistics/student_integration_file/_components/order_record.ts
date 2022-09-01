import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';
import { ORDER_PAYMENT_TYPE, ORDER_TYPE, TRANSACTION_TYPE } from '@/enums';
import { deepClone, sortCompoundObj } from '@/assets/js/common';

@Component
export default class OrderRecord extends Vue {
  @Action('finance/querySystemTransactionRecordList') private querySystemTransactionRecordList!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: [
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
      },
      {
        key: 'idNo',
        label: '证件号码',
        minWidth: 170,
      },
      {
        key: 'orderType',
        label: '订单类型',
        render(h: any, params: any) {
          const { orderType } = params.row;
          if (orderType === undefined) return h('div', '');
          const list = ORDER_TYPE.filter(a => a.id === orderType);
          return h('span', list[0] ? list[0].label : '');
        },
      },
      {
        key: 'classesName',
        label: '商品名称',
        minWidth: 110,
        render(h: any, params: any) {
          const { orderType, classesName, productName } = params.row;
          if (orderType === ORDER_TYPE[0].id) { // 招生
            return h('span', classesName);
          }
          if (orderType === ORDER_TYPE[0].id) { // 散学
            return h('span', '');
          }
          if (orderType === ORDER_TYPE[2].id) { // 其他
            return h('span', productName);
          }
          return h('span', '');
        },
      },
      {
        key: 'orderSeq',
        label: '订单号',
        minWidth: 170,
        render(h: any, params: any) {
          const { orderSeq, orderId, orderType } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(orderId, orderType);
              }
            }
          },
          orderSeq);
        }
      },
      {
        key: 'isInstallment',
        label: '缴费类型',
        render(h: any, params: any) {
          const { isInstallment } = params.row;
          if (isInstallment === undefined) return h('div', '');
          const list = ORDER_PAYMENT_TYPE.filter(a => a.id === isInstallment);
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
        key: 'receipt',
        label: '收据编号',
        minWidth: 170,
        render(h: any, params: any) {
          const {
            receipt, payId, orderId, orderType
          } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpReceiptDetail(payId, orderId, orderType);
              }
            }
          },
          receipt);
        }
      },
      {
        key: 'amount',
        label: '实收金额',
        isPrice: true
      },
      {
        key: 'payTime',
        label: '交易时间',
        minWidth: 130,
        render(h: any, params: any) {
          const { payTime } = params.row;
          if (!payTime) return h('div', '');
          return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'tradingStatus',
        label: '交易状态',
        render(h: any, params: any) {
          const { tradingStatus } = params.row;
          if (tradingStatus === undefined) return h('div', '');
          const list = TRANSACTION_TYPE.filter(item => item.id === tradingStatus);
          return h('div', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'status',
        label: '订单状态',
        render(h: any, params: any) {
          const { cancellation, orderStatus } = params.row;
          const orderStatusArray = ['未退费', '已退费'];
          if (cancellation === undefined) return h('div', '');
          if (cancellation === 1) {
            return h('div', '已作废');
          }
          return h('div', orderStatusArray[orderStatus] ? orderStatusArray[orderStatus] : '');
        }
      },
      {
        key: 'orderCreatedTime',
        label: '下单时间',
        minWidth: 100,
        render(h: any, params: any) {
          const { orderCreatedTime } = params.row;
          if (!orderCreatedTime) return h('div', '');
          return h('div', dayjs(orderCreatedTime).format('YYYY-MM-DD'));
        }
      },
    ],
    list: [],
    selectionList: [],
    spanMethod: ({
      row, columnIndex
    }: any) => {
      const mainList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16];
      if (mainList.includes(columnIndex)) {
        if (row.marge !== undefined) {
          return {
            rowspan: row.marge,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  };

  /** 跳转订单详情 */
  private jumpDetail(orderId: string, orderType: number): void {
    if (orderType === 1) { // 招生订单
      this.$router.push({ path: '/market/order/enrollment/detail', query: { id: orderId, edit: '1' } });
    }
    if (orderType === 2) { // 散学订单
      this.$router.push({ path: '/market/order/scattered/detail', query: { id: orderId, edit: '1' } });
    }
    if (orderType === 3) { // 其他订单
      this.$router.push({ path: '/market/order/other/detail', query: { id: orderId, edit: '1' } });
    }
  }

  /** 跳转支付详情 */
  private jumpReceiptDetail(payId: string, orderId: string, orderType: number): void {
    if (orderType === 1 || orderType === 3) { // 招生订单\其他订单
      this.$router.push({ path: '/finance/transaction_mg/system_flow/detail', query: { obj: encodeURIComponent(JSON.stringify({ payId, isDetail: true })) } });
    }
    if (orderType === 2) { // 散学订单
      this.$router.push({ path: '/finance/transaction_mg/collection_flow/detail', query: { obj: encodeURIComponent(JSON.stringify({ orderId, payId })) } });
    }
  }

  async queryList() {
    const { idNo, studentStatus: status } = this.detailParams;
    const studentStatus = [status];
    const sendData = { keyword: idNo, studentStatusList: studentStatus };
    try {
      const { data } = await this.querySystemTransactionRecordList(sendData);
      this.tableData.list = this.setTreeData(data);
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  private setTreeData(data: Array<any>) {
    const _list: any = [];
    let _data = deepClone(data);
    _data = _data.sort(sortCompoundObj('orderSeq')); // 把数据根据订单号排序
    // 根据订单号拿到需要合并的order数组
    const orderSeqObj: any = {};
    _data.forEach((item: any, index: number) => {
      if (orderSeqObj[item.orderSeq]) {
        orderSeqObj[item.orderSeq].push(index);
      } else {
        orderSeqObj[item.orderSeq] = [];
        orderSeqObj[item.orderSeq].push(index);
      }
    });
    let rowIndex = 0;
    _data.forEach((_item: any, sortIndex: number) => {
      const mergeOrderCount = orderSeqObj[_item.orderSeq].length;
      const hasExistMergeOrder = _list.filter((a: any) => a.orderSeq === _item.orderSeq).length > 0;
      rowIndex = hasExistMergeOrder ? rowIndex + 1 : 0;// 如果存在相同的已经合并的，就不merge，否则重新计算需要merge的order行
      if (orderSeqObj[_item.orderSeq] && mergeOrderCount > 1) {
        if (rowIndex === 0) { // 从第一行开始合并
          const _obj = {
            ..._item,
            ...{
              marge: mergeOrderCount,
              nosort: sortIndex + 1
            }
          };
          _list.push(_obj);
        } else { // 第二行相同order数据不merge，正常_item
          _list.push(_item);
        }
      } else {
        const _obj = {
          ..._item,
          ...{
            marge: 1,
            nosort: sortIndex + 1
          }
        };
        _list.push(_obj);
      }
    });
    return _list;
  }

  mounted() {
    this.tableData._this = this;
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
  }
}
