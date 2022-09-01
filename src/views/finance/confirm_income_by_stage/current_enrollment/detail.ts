import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { ParamsType, TableOptionsValue } from '@/type';
import { deepClone } from '@/assets/js/common';
import {
  API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORT,
  API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORTADMISSIONSCOUNT,
} from '@/api';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

const name = '招生明细';
@Component
export default class FinanceCurrentEnrollmentDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('finance/queryCurrentEnrollmentDetail') private queryCurrentEnrollmentDetail!: (data: any) => ParamsType;

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
        label: '导出明细',
        path: 'btn_export' // 修改权限名称
      },
      {
        id: 2,
        label: '导出汇总',
        path: 'btn_exporttotal' // 添加权限
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
        key: 'classesName',
        label: '班别',
      },
      {
        key: 'carModel',
        label: '车型',
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
        key: 'userName',
        label: '姓名',
      },
      {
        key: 'idNo',
        label: '证件号码',
      },
      {
        key: 'seq',
        label: '订单号',
      },
      {
        key: 'salePrice',
        label: '应收金额',
        isPrice: true
      },
      {
        key: 'accountsTrainPrice',
        label: '应收培训费',
        width: 100,
        isPrice: true
      },
      {
        key: 'registerPrice',
        label: '代缴注册费',
        width: 100,
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
        key: 'admissionIncome',
        label: '招生收入',
        isPrice: true
      },
      {
        key: 'recognizedIncome',
        label: '不含税确认收入',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'valueAddedTax',
        label: '增值税',
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
      // 导出明细
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
      } else {
        this._exportData();
      }
    }
    if (id === 2) {
      this._exportTotalData();
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
    const { years } = this.detailParams;
    const sendData = { years };
    const body = await this.$http.post(API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORT, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** 导出汇总 */
  private async _exportTotalData() {
    const { years } = this.detailParams;
    const sendData = { years };
    const body = await this.$http.post(API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORTADMISSIONSCOUNT, sendData, { // todo 导出汇总接口
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}导出汇总${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  async queryList() {
    const { years } = this.detailParams;
    const { paginationData } = this;
    // 处理数据
    const sendData = {
      years,
      current: paginationData.current,
      pageSize: paginationData.pageSize,
    };
    try {
      const body = await this.queryCurrentEnrollmentDetail(sendData);
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
