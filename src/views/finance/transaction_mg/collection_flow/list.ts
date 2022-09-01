import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare, formatPrice } from '@/assets/js/common';
import { ORDER_TYPE, TRANSACTION_TYPE } from '@/enums';
import { API_FINANCE_V1_SUBSTITUTERECORD_EXPORTSUBSTITUTERECORD } from '@/api';
import { setTableLabels, marginTableLabels, getSchoolImageProps } from '@/views/finance/_common/common';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const name = '代收交易流水';
const tableOptionList = [
  {
    id: 1,
    label: '打印收据',
    type: 'primary',
    path: 'btn_dysj'
  },
  {
    id: 2,
    label: '导出',
    path: 'btn_export'
  },
];
@Component
export default class FinanceCollectionFlow extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins, financeOperationLogMixins) {
  @Action('finance/queryCollectionFlowList') private queryCollectionFlowList!: (data: any) => ParamsType;

  @Action('finance/queryCollectionFlowCount') private queryCollectionFlowCount!: (data: any) => ParamsType;

  @Action('finance/queryCollectionFlowPrintReceiptInfo') private queryCollectionFlowPrintReceiptInfo!: (data: any) => ParamsType;

  private beginDate = new Date();

  private endDate = new Date();

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
              label: '报名日期',
            },
            {
              id: 2,
              label: '交易日期',
            },
            {
              id: 3,
              label: '结转日期',
            },
          ],
        },
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
        label: '订单类型',
        key: 'orderType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: ORDER_TYPE.filter(a => a.id === 2),
      },
      {
        label: '交易状态',
        key: 'tradingStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: TRANSACTION_TYPE,
      },
    ],
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 345,
        placeholder: '请输入学员姓名、证件号码、收据编号、订单号',
        clearable: true,
      },
    ],
    buttonList: [
      {
        label: '操作日志',
        key: 'log',
        type: '',
        plain: false,
        path: 'btn_log'
      },
    ]
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
    if (key === 'log') {
      this.queryOperationLogPage(name);
      this.logshow = true;
    }
  }

  formatPrice(val: number | string) {
    return formatPrice(val);
  }

  // 弹出框名
  dialogName = '';

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: tableOptionList,
    labels: [],
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
    const _len = selectionList.length;
    if (id === 1) {
      // 打印收据
      if (_len === 1) {
        this.queryReceiptData(selectionList[0]);
        this.printShow = true;
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 2) {
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

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** 导出 */
  private async _exportData(selectionList: any) {
    const {
      searchForm, paginationData,
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const payIdList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      payIdList.push(_item.payId);
    });
    // 处理数据
    const sendData = { ..._data, payIdList };
    const body = await this.$http.post(API_FINANCE_V1_SUBSTITUTERECORD_EXPORTSUBSTITUTERECORD, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /**
  * @description 表格初始化设置
  */
  private initSetTableLabel() {
    const { tableLabelType } = this;
    const _originalLabelList = marginTableLabels(tableLabelType);
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(_originalLabelList, tableLabelType);
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  // 打印预览弹出框展示
  private printShow = false;

  // 打印列表配置
  private printTableData: ParamsType = {
    data: {},
    title: '业务受理回执单',
  };

  /** 获取打印收据数据 */
  private async queryReceiptData(item: any) {
    const _item = item;
    const sendData = {
      orderType: _item.orderType,
      payId: _item.payId
    };
    try {
      const body = await this.queryCollectionFlowPrintReceiptInfo(sendData);
      const group = require('@/assets/json/group_info.json');
      const { drivingSchoolId } = body;
      const schoolLogo = getSchoolImageProps(drivingSchoolId)?.url;
      const groupInfo = group.filter((a: any) => a.id === drivingSchoolId)[0];
      this.printTableData.data = { ...body, ...groupInfo, schoolLogo };
    } catch (error) {
      this.printTableData = {};
    }
  }

  /** 跳转详情界面 */
  jumpDetail(val: any) {
    this.$router.push({
      path: '/finance/transaction_mg/collection_flow/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...val })) }
    });
  }

  private staticData: any = { totalAmount: 0 };

  /** 获取表格底部统计数据 */
  async getStaticData() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    try {
      const body = await this.queryCollectionFlowCount(sendData);
      this.staticData = body;
    } catch (error) {
      //
    }
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = { ..._data };
    try {
      const body = await this.queryCollectionFlowList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.getStaticData();
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    this.queryList();
    this.tableLabelType = 'COLLECTION_FLOW_LIST_LABEL';
    this.initSetTableLabel();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
