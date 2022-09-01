import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { INVOICING_TYPE, REFUND_TYPE, STUDY_STAGE } from '@/enums';
import { API_FINANCE_V1_REFUNDRECORD_EXPORTREFUNDEXCEL } from '@/api';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import { timestampSizeCompare } from '@/assets/js/common';

@Component
export default class FinanceStudentRefundMgDetail extends mixins(ctjtPaginationMixins, ctjtAreaStoreSeachTableMixins, clearCacheMixins) {
  @Action('finance/queryRefundDetailList') private queryRefundDetailList!: (data: any) => ParamsType;

  @Action('finance/queryRefundDetailCount') private queryRefundDetailCount!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 列表搜索项配置
  private localSearchForm: ParamsType = {
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
            },
            {
              id: 2,
              label: '报名日期',
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
    buttonList: []
  }

  /**
* @description 初始化列表搜索项
*/
  private initSearch() {
    // 合并混入的公共搜索项，和本地的搜索项
    const { searchForm, localSearchForm } = this;
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
  }

  /**
 * @param { ParamsType } val 搜索项 下拉选中返回当前对象
 * @description 搜索组件 下拉项选中回调函数
 */
  private searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        // 请求该片区下的门店列表
        this.queryStoreList(value);
      }
    }
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
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
        key: 'regionName',
        label: '片区',
        minWidth: 110,
      },
      {
        key: 'storeName',
        label: '门店',
        minWidth: 110,
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
        minWidth: 170,
      },
      {
        key: 'classesName',
        label: '班别',
        minWidth: 110,
      },
      {
        key: 'carModel',
        label: '车型',
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
        key: 'financeAuditAmount',
        label: '退费金额',
        minWidth: 100,
      },
      {
        key: 'financeTrainCost',
        label: '退培训费金额',
        minWidth: 120,
      },
      {
        key: 'financeLongTrainCost',
        label: '退长训费',
        minWidth: 100,
      },
      {
        key: 'financeRegisteringCost',
        label: '退代缴注册费',
        minWidth: 120,
      },
      {
        key: 'financeDifferCost',
        label: '退差价',
        minWidth: 100,
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
        key: 'registerDate',
        label: '报名日期',
        minWidth: 100,
        render(h: any, params: any) {
          const { registerDate } = params.row;
          if (!registerDate) return h('div', '');
          return h('div', dayjs(registerDate).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'learnDriveStatus',
        label: '学车状态',
        minWidth: 80,
      },
      {
        key: 'subjects',
        label: '学车进度',
        minWidth: 80,
        render(h: any, params: any) {
          const { subjects } = params.row;
          if (subjects === undefined) return h('div', '');
          const list = STUDY_STAGE.filter(item => item.id === subjects);
          return h('div', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'taxCalculation',
        label: '计税/不计税',
        minWidth: 100,
      },
      {
        key: 'refundType',
        label: '退费类型',
        minWidth: 100,
        render(h: any, params: any) {
          const { refundType } = params.row;
          if (refundType === undefined) return h('div', '');
          const list = REFUND_TYPE.filter(item => item.id === refundType);
          return h('div', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'marketingChannel',
        label: '营销渠道',
        minWidth: 100,
      },
      {
        key: 'referrerName',
        label: '介绍提成人',
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
    const body = await this.$http.post(API_FINANCE_V1_REFUNDRECORD_EXPORTREFUNDEXCEL, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });

    FileSaver.saveAs(blob, `已审金额统计表（${batchNo}）${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const { batchNo, keyword = '' } = this.detailParams;
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
    const sendData = { ..._data, batchNo };
    try {
      const body = await this.queryRefundDetailList(sendData);
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
    const { batchNo } = this.detailParams;
    const _data = drawSearchForm(searchForm);
    const sendData = { ..._data, batchNo };
    try {
      const body = await this.queryRefundDetailCount(sendData);
      this.staticData = body;
    } catch (error) {
      //
    }
  }

  mounted() {
    this.initSearch();
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
      this.searchForm.selectList[0].value = '';
      this.searchForm.selectList[1].value = '';
    }
    this.historyParams = obj;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.tableData._this = this;
      // 以下接口依赖于驾校id
      const { drivingSchoolId } = this.userInfo;
      this.queryRegionList(drivingSchoolId);
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
