import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtCreateTable, CtjtSetField, CtjtStatistics
} from '@/components';
import {
  ORDER_PAY_TYPE,
  TRANSACTION_TYPE,
  SYS_FLOW_TRANSACTION_TYPE
} from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import {
  ParamsType, TableOptionsValue, VueComponentParent, StaticDataType
} from '@/type';
import {
  REG_TWO_FLOAT_NUMBER,
  deepClone,
  timestampSizeCompare,
  formatPrice
} from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { setTableLabels, marginTableLabels } from '@/views/finance/_common/common';

const expName = '代收散学复核';

const tableLabels = [
  {
    key: 'regionName',
    label: '片区',
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    key: 'storeName',
    label: '门店',
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    key: 'userName',
    label: '学员姓名',
    minWidth: 100,
  },
  {
    key: 'idNo',
    label: '证件号码',
    width: 170,
  },
  {
    key: 'orderType',
    label: '订单类型',
    width: 120,
  },
  {
    key: 'source',
    label: '业务来源',
    width: 80,
  },
  {
    key: 'receipt',
    label: '收据编号',
    minWidth: 160,
  },
  {
    key: 'orderSeq',
    label: '订单号',
    minWidth: 160,
    render(h: any, params: any) {
      const { orderSeq, orderId } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            console.log(3333, params.row);
            params._self.tableData._this.jumpOrderDetail(orderId);
          }
        }
      },
      orderSeq);
    }
  },
  {
    key: 'salePrice',
    label: '订单金额(元)',
    width: 100,
  },
  {
    key: 'amount',
    label: '实收金额(元)',
    width: 100,
  },
  {
    key: 'payTime',
    label: '交易时间',
    minWidth: 200,
  },
  {
    key: 'tradingStatus',
    label: '交易状态',
    width: 100,
    render(h: any, params: any) {
      const { tradingStatus } = params.row;
      if (tradingStatus === undefined) return h('div', '');
      const list = SYS_FLOW_TRANSACTION_TYPE.filter(item => item.id === tradingStatus);
      return h('div', list[0] ? list[0].label : '');
    }
  },
  {
    key: 'carryoverDate',
    label: '结转时间',
    width: 100,
  }
];
@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtCreateTable,
    CtjtSetField,
    CtjtStatistics
  }
})
export default class MarketSanXueCxToPjMg extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('finance/queryCollectScatteredPage') private queryCollectScatteredPage!: (
    data: any
  ) => any;

  @Action('finance/queryCollectScatteredCount') private queryCollectScatteredCount!: (
    data: any
  ) => any;

  @Action('finance/collectScatteredCarryOver') private collectScatteredCarryOver!: (
    data: any
  ) => any;

  @Action('finance/exportCollectScatteredPaget') private exportCollectScatteredPaget!: (data: any) => any;

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
              label: '交易日期',
            },
            {
              id: 2,
              label: '结转日期',
            },
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
    selectList: [
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
        width: 350,
        placeholder: '请输入学员姓名、证件号码',
        clearable: true,
      },
    ],
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

  formatPrice(val: number | string) {
    return formatPrice(val);
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

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
      this.querFirstPageList();
    }
  }

  /**
   * @description 跳转到散学退费详情
   */
  private jumpOrderDetail(val: string): void {
    this.$router.push({
      path: '/market/sxpj/order/detail',
      query: { id: val, type: '1' }
    });
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '数据结转',
        type: 'success',
        path: 'btn_sjjz',
      },
      {
        id: 3,
        label: '导出',
        path: 'btn_export',
      },
    ],
    labels: tableLabels,
    list: [],
    selectionList: [],
  };

    // 导出表格配置
    private downTableData: ParamsType = {
      labels: [],
      list: [],
      name: expName,
    };

    /** 导出 */
    private async _exportData() {
      const { searchForm, paginationData } = this;
      const _data = drawSearchForm(searchForm, paginationData);
      // 处理数据
      const sendData = { ..._data, isExport: 1 };
      const body = await this.exportCollectScatteredPaget(sendData);
      const blob = new Blob([body], {
        type: 'application/vnd.ms-excel'
      });
      FileSaver.saveAs(blob, `${expName}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
    }

    /** 列表操作回调 */
    private tableOptionCallback(val: TableOptionsValue) {
      const { selectionList, labels } = this.tableData;
      const idList: Array<number> = [];
      selectionList.forEach((item: any) => {
        const _item = item;
        idList.push(_item.id);
      });
      const _len = selectionList.length;
      const { id } = val;
      // 导出
      if (id === 3) {
      // 导出
        if (_len >= 1) {
          this.downTableData.list = deepClone(selectionList);
          this.downTableData.labels = deepClone(labels);
        } else {
          this._exportData();
        }
        return;
      }

      if (id === 1) {
        if (_len >= 1) {
          this.dialogForm.selectionList = selectionList;
          this.dialogForm.id = id;
          this.dialogForm.dialogVisible = true;
        } else {
          this.$message.warning('请先勾选一项，再进行操作！');
        }
      }
    }

    private dialogForm = {
      dialogVisible: false,
      carryOverDate: this.$dayjs(new Date()).format('YYYY-MM-DD'),
      selectionList: [],
      id: 0,
    }

    private dialogFormRule = {
      carryOverDate: [
        { required: true, message: '必选项', trigger: ['blur'] }
      ]
    }

    resetDialogForm() {
      this.dialogForm = {
        dialogVisible: false,
        carryOverDate: this.$dayjs(new Date()).format('YYYY-MM-DD'),
        selectionList: [],
        id: 0,
      };
      (this.$refs.dialogFormRef as VueComponentParent).resetFields();
    }

    private submitDialog() {
      (this.$refs.dialogFormRef as VueComponentParent).validate((valid: boolean) => {
        if (valid) {
          const { selectionList, id } = deepClone(this.dialogForm);
          this._carryForwardFun(selectionList, id);
          this.dialogForm.dialogVisible = false;
        } else {
          this.$message.warning('请填写必填项！');
        }
      });
    }

    /** 数据结转 */
    private _carryForwardFun(selectionList: any, type: number) {
      const payIds: any = [];
      selectionList.forEach((item: any) => {
        const _item = item;
        payIds.push(_item.id);
      });
      const { carryOverDate } = this.dialogForm;
      const sendData: any = {
        payIds,
        carryOverDate: this.$dayjs(carryOverDate).format('YYYY-MM-DD')
      };

      this.$confirm('确定数据结转？', '结转', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.collectScatteredCarryOver(sendData).then(() => {
          this.querFirstPageList();
          this.$message.success('数据结转成功！');
          this.resetDialogForm();
        });
      }).catch(() => {
        this.$message.info('已取消数据结转');
      });
    }

    // 弹出框名
  private dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
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

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.querFirstPageList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  querFirstPageList() {
    this.paginationData.current = 1;
    this.queryList();
  }

  private statisticsData: StaticDataType[] = [
    {
      label: '订单总额',
      value: 0,
    },
    {
      label: '待结转总额',
      value: 0,
    },
    {
      label: '已结转总额',
      value: 0,
    }];

  /** 获取表格底部统计数据 */
  private async _queryStaticData() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    try {
      const body = await this.queryCollectScatteredCount(sendData);
      const {
        orderTotal,
        caryOverTotal,
        notCaryOverTotal,
      } = body;
      this.statisticsData[0].value = formatPrice(orderTotal);
      this.statisticsData[1].value = formatPrice(notCaryOverTotal);
      this.statisticsData[2].value = formatPrice(caryOverTotal);
    } catch (error) {
      //
    }
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
      const body = await this.queryCollectScatteredPage(sendData);
      const { data = [], current = 1, total = 0 } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this._queryStaticData();
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryList();
    this.initSearch();
    this.tableLabelType = 'SANXUE_REVIEW_SET_LIST_LABEL';
    this.initSetTableLabel();
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
