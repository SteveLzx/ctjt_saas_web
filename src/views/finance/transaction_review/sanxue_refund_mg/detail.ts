import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { INVOICING_TYPE, REFUND_TYPE, STUDY_STAGE } from '@/enums';
import { API_FINANCE_V1_SANXUEREFUND_EXPORTREFUNDEXCEL } from '@/api';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import { timestampSizeCompare } from '@/assets/js/common';

@Component
export default class FinanceStudentRefundMgDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('finance/querySanXueRefundDetailList') private querySanXueRefundDetailList!: (data: any) => ParamsType;

  @Action('finance/querySanXueRefundDetailCount') private querySanXueRefundDetailCount!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 列表搜索项配置
  private searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 1,
          width: 110,
          options: [
            {
              id: 1,
              label: '付款日期',
            }
          ],
        }
      },
    ],
    datePickerList: [
      {
        label: '',
        key: 'beginDate',
        value: '',
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      }
    ],
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 310,
        placeholder: '请输入学员姓名、手机号、证件号码',
        clearable: true,
      }
    ],
    selectList: [],
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
      },
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

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [{
      id: 1,
      label: '导出',
      type: 'primary',
      path: 'btn_export'
    }],
    labels: [
      {
        key: 'seq',
        label: '退费单号',
        minWidth: 110,
        render(h: any, params: any) {
          const { seq, approveId } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                console.log(3333, params.row);
                params._self.tableData._this.jumpOrderDetail(approveId);
              }
            }
          },
          seq);
        }
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
        key: 'paymentDate',
        label: '付款日期',
        minWidth: 100,
        render(h: any, params: any) {
          const { paymentDate } = params.row;
          if (!paymentDate) return h('div', '');
          return h('div', dayjs(paymentDate).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'learnedPeriodFee',
        label: '已学学时费',
      },
      {
        key: 'deductTrainFee',
        label: '应扣服务费',
      },
      {
        key: 'deductTotalFee',
        label: '应扣金额合计',
        minWidth: 110,
      },
      {
        key: 'refundableFee',
        label: '应退费用',
        minWidth: 110,
      },
      {
        key: 'invoiceAmount',
        label: '发票金额',
        minWidth: 100,
      },
      {
        key: 'blueTicketAmount',
        label: '蓝票金额',
        minWidth: 100,
      },
      {
        key: 'invoiceType',
        label: '类型',
        minWidth: 80,
        render(h: any, params: any) {
          const { invoiceType } = params.row;
          if (invoiceType === undefined) return h('div', '');
          const list = INVOICING_TYPE.filter(item => item.id === invoiceType);
          return h('div', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'duration',
        label: '退费周期（天）',
        minWidth: 120,
      },
      {
        key: 'reason',
        label: '退费原因',
        minWidth: 100,
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 100,
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
      }
    ],
    list: [],
    selectionList: [],
  };

  /**
  * @description 表格操作回调
  */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    if (id === 1) {
      // 导出
      this._exportData(selectionList);
    }
  }

  /**
   * @description 跳转到散学退费详情
   */
  private jumpOrderDetail(val: string): void {
    this.$router.push({ path: '/market/sxpj/detail', query: { id: val } });
  }

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

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 导出 */
  private async _exportData(selectionList: any) {
    const { searchForm } = this;
    const { batchNo } = this.detailParams;
    const _data = drawSearchForm(searchForm);
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    // 处理数据
    const sendData = {
      ..._data, idList, batchNo
    };
    const body = await this.$http.post(API_FINANCE_V1_SANXUEREFUND_EXPORTREFUNDEXCEL, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });

    FileSaver.saveAs(blob, `散学退费明细表${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const { batchNo, keyword = '', invoiceType } = this.detailParams;
    if (keyword) {
      const { inputList } = this.searchForm;
      inputList[0].value = keyword;
    }
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data,
      batchNo,
      invoiceType
    };
    try {
      const body = await this.querySanXueRefundDetailList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.getStaticData();
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  // 表格底部统计数据
  private staticData: any = {
    countNum: 0, countFinanceAuditAmount: 0, countFinanceTrainCost: 0, countFinanceRegisteringCost: 0, countFinanceDifferCost: 0,
  };

  /** 获取表格底部统计数据 */
  async getStaticData() {
    const { searchForm } = this;
    const { batchNo, invoiceType } = this.detailParams;
    const _data = drawSearchForm(searchForm);
    const sendData = { ..._data, batchNo, invoiceType };
    try {
      const body = await this.querySanXueRefundDetailCount(sendData);
      this.staticData = body;
    } catch (error) {
      //
    }
  }

  historyParams: any = '';

  async activated() {
    let { obj } = this.$route.query;
    const { historyParams } = this;
    if (obj !== historyParams) {
      this.searchForm.selectTimeList[0].select.value = 1;
      this.searchForm.datePickerList[0].value = '';
      this.searchForm.datePickerList[1].value = '';
      this.searchForm.inputList[0].value = '';
    }
    this.historyParams = obj;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.tableData._this = this;
      this.queryList();
      const permObj = await this.$getPerm(
        this,
        this.tableData.options,
        this.searchForm.buttonList
      );
      this.tableData.options = permObj.tablePerm;
      this.searchForm.buttonList = permObj.searchPerm;
    }
  }
}
