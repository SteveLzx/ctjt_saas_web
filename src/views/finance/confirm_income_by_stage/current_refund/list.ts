import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { getCurrentMonthDate, timestampSizeCompare } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';

import ctjtPaginationMixins from '@/mixins/pagination';

const name = '本期退费';
@Component
export default class FinanceCurrentRefund extends mixins(ctjtPaginationMixins) {
  @Action('finance/queryCurrentRefundList') private queryCurrentRefundList!: (data: any) => ParamsType;

  @Action('finance/queryCurrentRefundListExport') private queryCurrentRefundListExport!: (data: any) => any;

  private beginDate = getCurrentMonthDate(1);

  private endDate = getCurrentMonthDate(0);

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
              label: '退款日期',
            },
            {
              id: 2,
              label: '报名日期',
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
    inputList: [
      {
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 250,
        placeholder: '请输入学员姓名、证件号',
        clearable: true,
      },
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
      }
    ]
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.paginationData.current = 1;
      const { datePickerList } = this.searchForm;
      datePickerList[0].value = this.beginDate;
      datePickerList[1].value = this.endDate;
      this.queryList();
    }
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
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
      },
      {
        key: 'storeName',
        label: '场点',
      },
      {
        key: 'classesName',
        label: '班别',
      },
      {
        key: 'learnDrivingSchedule',
        label: '学车阶段',
      },
      {
        key: 'idNo',
        label: '身份证号',
      },
      {
        key: 'userName',
        label: '学员姓名',
      },
      {
        key: 'applyDate',
        label: '报名日期',
        render(h: any, params: any) {
          const { applyDate } = params.row;
          if (!applyDate) return h('div', '');
          return h('div', dayjs(applyDate).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'refundDate',
        label: '退款日期',
        render(h: any, params: any) {
          const { refundDate } = params.row;
          if (!refundDate) return h('div', '');
          return h('div', dayjs(refundDate).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'trainingCost',
        label: '培训费',
        isPrice: true
      },
      {
        key: 'registerCost',
        label: '代收代付',
        isPrice: true
      },
      {
        key: 'refundAmount',
        label: '退费金额',
        isPrice: true
      },
      {
        key: 'refundTrainingCost',
        label: '退培训费金额',
        minWidth: 110,
        isPrice: true
      },
      {
        key: 'refundRegisterCostAmount',
        label: '退代缴注册费金额',
        minWidth: 140,
        isPrice: true
      },
      {
        key: 'prophaseAffirmIncome',
        label: '前期已确认收入',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'prophaseAffirmIncomeRatio',
        label: '前期已确认收入比例',
        minWidth: 150,
        isPrice: true
      },
      {
        key: 'currentRefundIncome',
        label: '本期退费确认收入',
        minWidth: 140,
        isPrice: true
      },
      {
        key: 'blueBillAmount',
        label: '蓝票金额',
        isPrice: true
      },
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
      this._exportData();
    }
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

  /** 导出所有数据 */
  private async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData = { ..._data, isExport: 1 };
    const body = await this.queryCurrentRefundListExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${dayjs(new Date()).format('YYYYMMDD')}`);
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryCurrentRefundList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  mounted() {
    this.tableData._this = this;
    this.queryList();
  }

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
