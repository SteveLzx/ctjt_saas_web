import Component, { mixins } from 'vue-class-component';
import { State, Action } from 'vuex-class';
import { ParamsType, TableOptionsValue } from '@/type';
import {
  formatPrice, deepClone, isCustomNumber, jsAddFunc, timestampSizeCompare
} from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { DIFF_LIST, THIRD_CHANNELS_OPTS } from '@/enums';
import { PAY_CHANEL_LIST_LABEL } from '@/views/finance/_common/tablelabel';
import ctjtPaginationMixins from '@/mixins/pagination';

const tableOptionList = [
  {
    id: 1,
    label: '导出',
    path: 'btn_export_pay'
  }
];
const name = '支付渠道收入统计';
@Component
export default class PayChanel extends mixins(ctjtPaginationMixins) {
  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: () => ParamsType;

  @Action('finance/queryPayChannelList') private queryPayChannelList!: (data: any) => ParamsType;

  private beginDate = new Date();

  private endDate = new Date();

  // 列表搜索项配置
  private searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: '',
          placeholder: '',
          value: 1,
          width: 110,
          options: [
            {
              id: 1,
              label: '收款日期',
            },
          ],
        }
      },
    ],
    datePickerList: [
      {
        label: '',
        key: 'beginDate',
        value: this.beginDate,
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: this.endDate,
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      }
    ],
    selectList: [
      {
        label: '终端号',
        key: 'payContent',
        value: '',
        placeholder: '请输入终端号',
        multiple: false,
        clearable: true,
        width: 200,
        options: [],
        filterable: true,
        customOptions: {
          value: 'label',
          label: 'label',
        },
      },
      {
        label: '是否有差异',
        key: 'difference',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: DIFF_LIST,
      },
    ],
    inputList: [],
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
      this.queryList();
    }
    if (key === 'reset') {
      this.queryList();
    }
  }

  // 导出表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: tableOptionList,
    labels: PAY_CHANEL_LIST_LABEL,
    list: [],
    selectionList: [],
    showSummary: true,
    summariesMethod: (param: any) => {
      const mainList = [3, 4, 5, 6];
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
            sums[index] = formatPrice(sums[index]);
          } else {
            sums[index] = '';
          }
        } else {
          sums[index] = '';
        }
      });
      return sums;
    }
  };

  /**
  * @description 表格操作回调
  */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, labels, list } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    if (id === 1) {
      // 导出
      this.downTableData.list = deepClone(list);
      this.downTableData.labels = deepClone(labels);
    }
  }

  /** 获取终端号 */
  private async queryTerminalNoList() {
    const { selectList } = this.searchForm;
    const thirdOp = THIRD_CHANNELS_OPTS;
    const cashMonyOp = [{
      id: '上缴现金',
      label: '上缴现金'
    }];
    this.queryAllPosTerminalNoList().then((res: any) => {
      selectList[0].options = [...res, ...thirdOp, ...cashMonyOp];
    });
  }

  async queryList() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryPayChannelList(sendData);
      this.tableData.list = body;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async mounted() {
    this.tableData._this = this;
    this.queryList();
    this.queryTerminalNoList();
  }

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
