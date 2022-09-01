import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { Action } from 'vuex-class';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  deepClone,
  isCustomNumber,
  jsAddFunc,
  formatPrice
} from '@/assets/js/common';
import { ParamsType, TableOptionsValue } from '@/type';
import { ORDER_TYPE } from '@/enums';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination
  },
})
export default class FinanceConfirmIncomeByStageOtherRefundFixed extends mixins(ctjtPaginationMixins) {
  @Action('finance/queryOtherIncomeCuringCount') private queryOtherIncomeCuringCount!: (data: any) => any;

  @Action('finance/queryOtherIncomeCuringDetail') private queryOtherIncomeCuringDetail!: (data: any) => any;

  @Action('finance/exportOtherIncomeCuringList') private exportOtherIncomeCuringList!: (data: any) => any;

  // 获取当前月份
  private currentDate = dayjs(new Date()).format('YYYY-MM');

  // 列表搜索项配置
  private searchForm: ParamsType = {
    datePickerList: [
      {
        key: 'years',
        label: '日期',
        formatType: 'YYYY-MM',
        value: deepClone(this.currentDate),
        placeholder: '请选择',
        type: 'month',
        clearable: false,
        width: 120,
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

  // 列表搜索 操作按钮回调
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.queryList();
    }
    if (key === 'reset') {
      const { datePickerList } = this.searchForm;
      datePickerList[0].value = this.currentDate;
      this.queryList();
    }
  }

    // 表格配置
    private tableData: ParamsType = {
      _this: {},
      loading: true,
      index: true,
      list: [],
      options: [
        {
          id: 1,
          label: '导出',
          path: 'btn_export'
        },
      ],
      labels: [
        {
          key: 'regionName',
          label: '片区',
          minWidth: 100
        },
        {
          key: 'storeName',
          label: '门店',
          minWidth: 100
        },
        {
          key: 'amount',
          label: '收款金额',
          minWidth: 100,
          render(h: any, params: any) {
            const { amount } = params.row;
            return h('el-link', {
              props: {
                type: 'primary',
                underline: false
              },
              on: {
                click: () => {
                  params._self.tableData._this.jumpDetail(params.row);
                }
              }
            }, formatPrice(amount));
          }
        },
        {
          key: 'recognizedIncome',
          label: '不含税收入',
          minWidth: 100,
          isPrice: true
        },
        {
          key: 'valueAddedTax',
          label: '增值税',
          minWidth: 100
        },
      ],
      showSummary: true,
      summariesMethod: (param: any) => {
        const mainList = [3, 4, 5];
        const { columns, data } = param;
        const sums: any = [];
        columns.forEach((column: any, index: number) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map((item: any) => {
            if (isCustomNumber(item[column.property])) {
              return item[column.property];
            }
            return 0;
          });
          if (values.every((val: any) => isCustomNumber(val))) {
            if (mainList.includes(index)) {
              sums[index] = values.reduce((prev: any, curr: any) => {
                const value = Number(curr);
                if (!Number.isNaN(value)) {
                  return jsAddFunc(prev, curr);
                }
                return prev;
              }, 0);
            } else {
              sums[index] = '';
            }
          } else {
            sums[index] = '';
          }
        });
        return sums;
      }
    }

    /**
    * @description 表格操作回调
    */
    private tableOptionCallback(val: TableOptionsValue) {
      const { id } = val;
      if (id === 1) {
        // 导出
        this.exportData(1);
      }
    }

    // 导出所有数据
    async exportData(type: number, idList?: Array<string>) {
      const { searchForm, paginationData, drawerSearchForm } = this;
      let sendData = {};
      if (type === 1) {
        // 列表导出
        sendData = drawSearchForm(searchForm);
      }
      if (type === 2) {
        // 列表导出
        sendData = drawSearchForm(searchForm, paginationData);
        if (idList && idList.length > 0) {
          sendData = { ...sendData, ...{ idList } };
        }
        sendData = { ...sendData, ...drawerSearchForm };
      }
      sendData = { ...sendData, ...{ exportType: type } };
      const body = await this.exportOtherIncomeCuringList(sendData);
      const blob = new Blob([body], { type: 'application/vnd.ms-excel' });
      const _fileName = type === 1 ? '其他收入确认汇总（固化）' : '其他收入确认明细（固化）';
      FileSaver.saveAs(blob, `${_fileName}${dayjs(new Date()).format('YYYYMMDD')}`);
    }

    queryList() {
      const { searchForm } = this;
      const sendData = drawSearchForm(searchForm);
      this.tableData.loading = true;
      this.queryOtherIncomeCuringCount(sendData).then((res: any) => {
        this.tableData.list = res;
      }).finally(() => {
        this.tableData.loading = false;
      });
    }

    jumpDetail(val: any) {
      Object.keys(this.drawerSearchForm).forEach(key => {
        this.drawerSearchForm[key] = val[key];
      });
      this.paginationData.current = 1;
      this.queryListDrawer();
      this.drawer = true;
    }

    // 弹窗
    private drawer = false;

    // 详情请求参数
    private drawerSearchForm: ParamsType = {
      regionId: '',
      storeId: '',
    }

    // 表格配置
    private drawerTableData: ParamsType = {
      loading: true,
      selection: true,
      index: true,
      list: [],
      selectionList: [],
      options: [
        {
          id: 1,
          label: '导出',
          path: 'btn_export_drawer'
        },
      ],
      labels: [
        {
          key: 'regionName',
          label: '片区',
          minWidth: 100,
          showOverflowTooltip: true
        },
        {
          key: 'storeName',
          label: '门店',
          minWidth: 100,
          showOverflowTooltip: true
        },
        {
          key: 'storePattern',
          label: '门店性质',
          minWidth: 80
        },
        {
          key: 'userName',
          label: '姓名',
          minWidth: 100
        },
        {
          key: 'idNo',
          label: '证件号码',
          minWidth: 170
        },
        {
          key: 'seq',
          label: '订单号',
          minWidth: 190
        },
        {
          key: 'applyTime',
          label: '报名时间',
          minWidth: 160,
          render(h: any, params: any) {
            const { applyTime } = params.row;
            return h('span', applyTime ? dayjs(applyTime).format('YYYY-MM-DD HH:mm:ss') : '');
          },
        },
        {
          key: 'orderType',
          label: '订单类型',
          minWidth: 100,
          render(h: any, params: any) {
            const { orderType } = params.row;
            const list = ORDER_TYPE.filter(a => a.id === orderType);
            return h('span', list[0] ? list[0].label : '');
          },
        },
        {
          key: 'productName',
          label: '商品名称',
          minWidth: 120,
          showOverflowTooltip: true
        },
        {
          key: 'feeName',
          label: '费用科目',
          minWidth: 100,
          showOverflowTooltip: true
        },
        {
          key: 'salePrice',
          label: '订单金额',
        },
        {
          key: 'amount',
          label: '收据金额',
        },
      ]
    }

    // 列表选中每一列切换回调
    private drawerTableSelectionChange(val: []) {
      this.drawerTableData.selectionList = val;
    }

    // 表格操作回调
    private drawerTableOptionCallback(val: TableOptionsValue) {
      const { id } = val;
      const { selectionList } = this.drawerTableData;
      const idList: Array<string> = [];
      selectionList.forEach((item: any) => {
        const { orderId } = item;
        idList.push(orderId);
      });
      if (id === 1) {
        // 导出
        this.exportData(2, idList);
      }
    }

    // 列表分页
    public drawerTableSizeChange(val: number) {
      this.paginationData.pageSize = val;
      this.paginationData.current = 1;
      this.queryListDrawer();
    }

    public drawertTbleCurrentChange(val: number) {
      this.paginationData.current = val;
      this.queryListDrawer();
    }

    queryListDrawer() {
      const { paginationData, searchForm, drawerSearchForm } = this;
      let sendData = drawSearchForm(searchForm, paginationData);
      sendData = { ...sendData, ...drawerSearchForm };
      this.queryOtherIncomeCuringDetail(sendData).then((res: any) => {
        const { data, current, total } = res;
        this.drawerTableData.list = data;
        this.paginationData.total = total;
        this.paginationData.current = current;
      }).finally(() => {
        this.drawerTableData.loading = false;
      });
    }

    async mounted() {
      this.tableData._this = this;
      const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
      this.tableData.options = permObj.tablePerm;
      this.searchForm.buttonList = permObj.searchPerm;
      this.$getPerm(this, this.drawerTableData.options).then((res: any) => {
        this.drawerTableData.options = res.tablePerm;
      });
      this.queryList();
    }
}
