import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { ParamsType, TableOptionsValue } from '@/type';
import { SUBJECT } from '@/enums';
import { deepClone } from '@/assets/js/common';
import { API_FINANCE_V1_GRADUATIONCORRECTION_EXPORTGRADUATEDETAIL } from '@/api';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

const name = '修正明细';
@Component
export default class FinanceGraduationCorrectionDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('finance/queryGraduationCorrectionDetail') private queryGraduationCorrectionDetail!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 导出表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name,
  };

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
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
        label: '门店',
      },
      {
        key: 'storePattern',
        label: '门店性质',
      },
      {
        key: 'userName',
        label: '姓名',
      },
      {
        key: 'idNo',
        label: '证件号码',
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
        key: 'classesName',
        label: '班别',
      },
      {
        key: 'withdrawExamTime',
        label: '变更日期',
        render(h: any, params: any) {
          const { withdrawExamTime } = params.row;
          if (!withdrawExamTime) return h('div', '');
          return h('div', dayjs(withdrawExamTime).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'step',
        label: '变更科目',
        render(h: any, params: any) {
          const { step } = params.row;
          const list = SUBJECT.filter(a => a.id === step);
          return h('span', list ? list[0].label : '');
        },
      },
      {
        key: 'examDate',
        label: '考试日期',
        render(h: any, params: any) {
          const { examDate } = params.row;
          if (!examDate) return h('div', '');
          return h('div', dayjs(examDate).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'examResult',
        label: '修改前成绩',
        minWidth: 100,
      },
      {
        key: 'withdrawExamResult',
        label: '修改后成绩',
        minWidth: 100,
      },
      {
        key: 'salePrice',
        label: '培训费',
        isPrice: true
      },
      {
        key: 'salePriceNotRegistration',
        label: '培训费（不含报名费）',
        minWidth: 170,
        isPrice: true
      },
      {
        key: 'amount',
        label: '实收金额',
        isPrice: true
      },
      {
        key: 'balance',
        label: '欠费金额',
        isPrice: true
      },
      {
        key: 'confirmationRatio',
        label: '确认比例',
      },
      {
        key: 'graduateIncomeAmount',
        label: '本期毕业确认收入',
        minWidth: 130,
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
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    if (id === 1) {
      // 导出
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
      } else {
        this._exportData();
      }
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

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 导出所有数据 */
  private async _exportData() {
    const { years, step } = this.detailParams;
    const sendData = { years, step };
    const body = await this.$http.post(API_FINANCE_V1_GRADUATIONCORRECTION_EXPORTGRADUATEDETAIL, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    const list = SUBJECT.filter(a => a.id === step);
    const subject = list[0] ? list[0].label : '';
    FileSaver.saveAs(blob, `${name}（${subject}）${dayjs(new Date()).format('YYYYMMDD')}`);
  }

  async queryList() {
    const { years, step } = this.detailParams;
    const { paginationData } = this;
    // 处理数据
    const sendData = {
      years,
      step,
      current: paginationData.current,
      pageSize: paginationData.pageSize,
    };
    try {
      const body = await this.queryGraduationCorrectionDetail(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async activated() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
    const permObj = await this.$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
  }
}
