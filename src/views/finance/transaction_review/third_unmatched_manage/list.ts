import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { THIRD_CHANNELS_OPTS, TRANSACTION_TYPE } from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';

const name = '第三方未匹配管理';
@Component
export default class FinanceThirdUnmatchedManageIndex extends mixins(ctjtPaginationMixins) {
  @Action('finance/queryThirdUnMatchList') private queryThirdUnMatchList!: (data: any) => ParamsType;

  @Action('finance/queryTransactionListByOrderNo') private queryTransactionListByOrderNo!: (data: any) => ParamsType;

  @Action('finance/updateReceiptTime') private updateReceiptTime!: (data: any) => any;

  // 列表搜索项配置
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '交易日期',
        key: 'payDate',
        value: '',
        type: 'date',
        placeholder: '',
        width: 140,
      },
    ],
    selectList: [
      {
        label: '收款渠道',
        key: 'channelName',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: THIRD_CHANNELS_OPTS,
        customOptions: {
          value: 'label',
          label: 'label',
        },
      },
    ],
    inputList: [
      {
        label: '订单号/券码',
        key: 'orderNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入订单号/券码',
        clearable: true,
      },
      {
        label: '交易金额',
        key: 'payAmount',
        type: 'number',
        value: undefined,
        controls: false,
        width: 200,
        placeholder: '请输入数字',
        clearable: true,
        hasZero: true,
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        type: '',
        plain: false,
        path: 'btn_search'
      }
    ]
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this.querFirstPageList();
    }
  }

  // 弹出框名
  dialogName = '';

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'channelName',
        label: '收款渠道',
      },
      {
        key: 'orderNo',
        label: '订单号/券码',
        render(h: any, params: any) {
          const { orderNo, diffAmount, id } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.openOrderDetail({ orderNo, diffAmount, id });
              }
            }
          }, orderNo);
        }
      },
      {
        key: 'payAmount',
        label: '交易金额',
        isPrice: true
      },
      {
        key: 'diffAmount',
        label: '差异金额',
        isPrice: true
      },
      {
        key: 'payTime',
        label: '交易时间',
        render(h: any, params: any) {
          const { payTime } = params.row;
          if (!payTime) return h('div', '');
          return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
    ],
    list: [],
    selectionList: [],
  };

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    try {
      const body = await this.queryThirdUnMatchList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  drawer = false;

  sureFormData = { canSure: false, id: '', receiptDate: '' };

  // 表单规则校验
  private sureFormRules = {
    receiptDate: [
      { required: true, message: '请选择票据日期', trigger: ['change'] }
    ],
  }

  /** 打开订单明细弹出框 */
  openOrderDetail(val: any) {
    const { orderNo, diffAmount, id } = val;
    this.sureFormData.canSure = diffAmount === 0;
    this.sureFormData.id = id;
    this.queryListDrawer(orderNo);
    this.drawer = true;
  }

  // 表格配置
  private drawerTableData: ParamsType = {
    loading: true,
    selection: false,
    index: true,
    list: [],
    selectionList: [],
    options: [{
      id: 1,
      label: '核对确认',
      type: 'primary',
      path: 'btn_hdqr'
    }],
    labels: [
      {
        key: 'regionName',
        label: '片区',
      },
      {
        key: 'storeName',
        label: '门店',
        sortable: 'custom',
      },
      {
        key: 'userName',
        label: '学员姓名',
      },
      {
        key: 'idNo',
        label: '证件号码',
      },
      {
        key: 'orderType',
        label: '订单类型',
        render(h: any, params: any) {
          const { orderType } = params.row;
          if (orderType === undefined) return h('div', '');
          const orderTypeOption = [{
            id: 1,
            label: '招生订单',
          },
          {
            id: 2,
            label: '散学订单',
          },
          {
            id: 3,
            label: '其他订单',
          }
          ];
          const list = orderTypeOption.filter(a => a.id === orderType);
          return h('span', list ? list[0].label : '');
        },
      },
      {
        key: 'productName',
        label: '班别/商品名称',
        minWidth: 100,
        showOverflowTooltip: true,
      },
      {
        key: 'feeName',
        label: '费用类型',
        showOverflowTooltip: true,
      },
      {
        key: 'receipt',
        label: '收据编号',
      },
      {
        key: 'orderSeq',
        label: '订单号',
      },
      {
        key: 'salePrice',
        label: '订单金额(元)',
        minWidth: 110,
      },
      {
        key: 'amount',
        label: '实收金额(元)',
        minWidth: 110,
      },
      {
        key: 'payTime',
        label: '交易时间',
        render(h: any, params: any) {
          const { payTime } = params.row;
          if (!payTime) return h('div', '');
          return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      // {
      //   key: 'flowPayTime',
      //   label: '流水交易时间',
      //   render(h: any, params: any) {
      //     const { flowPayTime } = params.row;
      //     if (!flowPayTime) return h('div', '');
      //     return h('div', dayjs(flowPayTime).format('YYYY-MM-DD'));
      //   }
      // },
      {
        key: 'tradingStatus',
        label: '交易状态',
        render(h: any, params: any) {
          const { tradingStatus } = params.row;
          if (tradingStatus === undefined) return h('div', '');
          const list = TRANSACTION_TYPE.filter(a => a.id === tradingStatus);
          return h('span', list ? list[0].label : '');
        },
      },
      {
        key: 'transactionId',
        label: '第三方订单号',
        minWidth: 110,
        sortable: 'custom',
      },
      {
        key: 'diffAmount',
        label: '第三方订单号差异金额',
        minWidth: 140,
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
        },
      },
      // {
      //   key: 'isMatch',
      //   label: '匹配状态',
      //   render(h: any, params: any) {
      //     const { isMatch } = params.row;
      //     return h('div', isMatch === 0 ? '未匹配' : '已匹配');
      //   },
      // },
    ]
  }

  /**
 * @description 表格操作回调
 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id: pId } = val;
    const { list } = this.drawerTableData;
    if (pId === 1) {
      // 核对确认
      // const { canSure } = this.sureFormData;
      if (list.length > 0) {
        const canSure = list[0].diffAmount === 0;
        if (!canSure) this.$message.warning('该券码还存在差异金额，不可操作!');
        else this.dialogName = '核对确认';
      } else {
        this.$message.warning('暂无可核对确认的数据!');
      }
    }
  }

  submitLoading = false;

  /** 核对确认 */
  sureFun() {
    (this.$refs.sureForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const { id, receiptDate } = this.sureFormData;
          const _receiptDate = this.$dayjs(receiptDate).format('YYYY-MM-DD');
          const sendData = { id, receiptDate: _receiptDate };
          this.updateReceiptTime(sendData).then(() => {
            this.$message.success('核对成功');
          })
            .finally(() => {
              this.querFirstPageList();
              this.dialogClose();
              this.drawer = false;
            });
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** @description 弹出框关闭事件 */
  private dialogClose() {
    (this.$refs.sureForm as VueComponentParent).resetFields(); // 清空表单
    this.dialogName = '';
  }

  queryListDrawer(transactionId: string) {
    this.queryTransactionListByOrderNo({ transactionId, status: 2 }).then((res: any) => {
      this.drawerTableData.list = res;
    }).finally(() => {
      this.drawerTableData.loading = false;
    });
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    this.queryList();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
