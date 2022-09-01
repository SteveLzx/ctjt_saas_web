import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';
import { FEE_TYPE } from '@/enums';
import { deepClone } from '@/assets/js/common';

@Component
export default class FinanceRecord extends Vue {
  @Action('license/queryFinanceRecordList') private queryFinanceRecordList!: (data: any) => ParamsType;

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
        key: 'number',
        label: '订单号/流水ID',
        minWidth: 120,
        render(h: any, params: any) {
          const {
            number, subject, relationId, status, idNo
          } = params.row;
          const rowData: any = {
            业务费: { batchNo: number, keyword: idNo },
            代检费: { batchNo: number, keyword: idNo },
            代理佣金: { batchNo: number, keyword: idNo },
            代刷学时费: { batchNo: number, keyword: idNo },
            '支出受理费(指标费)': { batchNo: number, keyword: idNo },
            外转班受理费: { batchNo: number, keyword: idNo },
            退费总额: { batchNo: number, keyword: idNo },
            订单收款: {
              orderId: number,
              orderType: 1,
              payId: relationId
            }
          };
          const type = (status === '已结转' || status === '待结转') ? '订单收款' : subject;
          if (rowData[type]) {
            return h('el-link', {
              props: {
                type: 'primary',
                underline: false
              },
              on: {
                click: () => {
                  params._self.tableData._this.jumpDetail(rowData[type], type);
                }
              }
            }, number);
          }
          return h('div', number);
        }
      },
      {
        key: 'type',
        label: '收支类型',
      },
      {
        key: 'subject',
        label: '费用科目',
      },
      {
        key: 'amount',
        label: '金额',
      },
      {
        key: 'payTime',
        label: '收/付款时间',
        minWidth: 120,
        render(h: any, params: any) {
          const { payTime } = params.row;
          if (!payTime) return h('div', '');
          return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'status',
        label: '状态',
      },
      {
        key: 'operationName',
        label: '操作人',
      },
      {
        key: 'operationTime',
        label: '操作时间',
        minWidth: 150,
        render(h: any, params: any) {
          const { operationTime } = params.row;
          if (!operationTime) return h('div', '');
          return h('div', dayjs(operationTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 130,
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
    selectionList: [],
  };

  private jumpDetail(val: any, type: string) {
    const feeType = deepClone(FEE_TYPE);
    const feeArry = feeType.map((item: any) => item.label);
    if (type === '退费总额' && val) {
      this.$router.push({
        path: '/finance/transaction_review/student_refund_mg/detail',
        query: { obj: encodeURIComponent(JSON.stringify({ ...val })) }
      });
    }
    if ((feeArry.includes(type)) && val) {
      this.$router.push({
        path: '/finance/transaction_review/other_fee_mg/detail',
        query: { obj: encodeURIComponent(JSON.stringify({ ...val })) }
      });
    }
    if (type === '订单收款' && val) {
      const isDetail = true;
      this.$router.push({
        path: '/finance/transaction_mg/system_flow/detail',
        query: { obj: encodeURIComponent(JSON.stringify({ ...val, isDetail })) }
      });
    }
  }

  async queryList() {
    const { id } = this.detailParams;
    try {
      const body = await this.queryFinanceRecordList({ orderId: id });
      this.tableData.list = body;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
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
