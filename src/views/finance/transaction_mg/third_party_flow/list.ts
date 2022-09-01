import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  FILTER_EXCEL_TYPE, matchNumberList, timestampSizeCompare, drivingSchool
} from '@/assets/js/common';
import { TRANSACTION_TYPE, THIRD_CHANNELS_OPTS, THIRD_CHANNELS_IMPORT_TYPE } from '@/enums';
import download from '@/assets/js/download';
import {
  API_FINANCE_V1_THIRDTRADE_EXPORTTHIRDTRADEEXCEL,
  API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE,
  API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE_GUANGREN,
} from '@/api';
import { setTableLabels, marginTableLabels, getTemplateDownloadProps } from '@/views/finance/_common/common';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const name = '第三方交易流水';
// 惠州
const tableOptionList = [
  {
    id: 1,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
  {
    id: 2,
    label: '下载导入模板',
    type: 'primary',
    path: 'btn_xzdrmb'
  },
  {
    id: 3,
    label: '导出',
    path: 'btn_export'
  },
];
// 广仁
const guanrenTableOptionList = [
  {
    id: 4,
    label: '导入数据',
    type: 'success',
    path: 'btn_drsj'
  },
  {
    id: 1,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
  {
    id: 2,
    label: '下载导入模板',
    type: 'primary',
    path: 'btn_xzdrmb'
  },
  {
    id: 3,
    label: '导出',
    path: 'btn_export'
  },
];
@Component
export default class FinanceThirdPartyFlowIndex extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, financeOperationLogMixins) {
  @Action('finance/queryThirdTradeList') private queryThirdTradeList!: (data: any) => ParamsType;

  @Action('finance/thirdTradeDelete') private thirdTradeDelete!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

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
              label: '交易日期',
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
      {
        label: '交易状态',
        key: 'status',
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
        label: '订单号/券码',
        key: 'orderNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
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
      },
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
      * @description 列表搜索 操作按钮回调
    */
  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.querFirstPageList();
    }
    if (key === 'log') {
      this.queryOperationLogPage(name);
      this.logshow = true;
    }
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
    const hasApproval = selectionList.filter((a: any) => a.status === TRANSACTION_TYPE[1].id).length > 0; // 存在已结转数据
    if (id === 1) {
      // 删除
      // 数据是否已结转,提示"已结转数据不可删除，请重新选择"
      if (_len >= 1) {
        if (hasApproval) this.$message.warning('已结转数据不可删除，请重新选择!');
        else this._deleteFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 2) {
      // 数据模板下载
      download(getTemplateDownloadProps(name));
    }

    if (id === 4) { // 广仁才需要选择模板，惠州不用选择模板
      // 导入数据
      const { drivingSchoolId } = this.userInfo;
      // 广仁用自己的模板
      this.chanelDataTypeList = drivingSchool(drivingSchoolId) === 'guangren' ? THIRD_CHANNELS_IMPORT_TYPE : [];
      this.chanelDataType = this.chanelDataTypeList[0].id;
      this.dialogName = 'import';
    }
    if (id === 3) {
      // 导出
      this._exportData(selectionList);
    }
  }

  // 惠州
  isHuizhou = true;

  // pos数据类型list
  private chanelDataTypeList = THIRD_CHANNELS_IMPORT_TYPE;

  // 选择的pos数据类型
  private chanelDataType = 0;

  // 导入发票API路径 -默认惠州
  private uploadPath = API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE;

  /** 关闭pos数据类型选择弹出框 */
  cancelDialog() {
    this.chanelDataType = 0;
    this.dialogName = '';
  }

  @Watch('chanelDataType', { deep: true, immediate: true })
  private chanelDataTypeChange(val: number) {
    const { drivingSchoolId } = this.userInfo;
    this.uploadPath = drivingSchool(drivingSchoolId) === 'guangren'
      ? `${API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE_GUANGREN}?type=${val}`
      : API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE;
  }

  // 导入发票文件上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    fileAccept: FILTER_EXCEL_TYPE // 限制上传文件格式
  };

  // 返回的导入结果
  resultData: any = {};

  /** 数据上传回调 */
  uploadCallback(val: any) {
    this.cancelDialog();
    this.dialogName = 'importResult';
    const { description = '', failLogDtoList } = val.body;
    const _totalMoneyText: any = description ? description.substring(description.lastIndexOf(',') + 1) : '';
    const list: any = matchNumberList(description);
    this.resultData = {
      ...val,
      importSuccess: (list && list[0]) || 0,
      importSuccessTotalMoney: _totalMoneyText || '',
      imporError: (failLogDtoList && failLogDtoList.length) || 0,
      failLogDtoList
    };
    this.querFirstPageList();
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
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    // 处理数据
    const sendData = { ..._data, idList };
    const body = await this.$http.post(API_FINANCE_V1_THIRDTRADE_EXPORTTHIRDTRADEEXCEL, sendData, {
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

  /** @description 删除 */
  private _deleteFun(selectionList: any) {
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const sendData = { idList };
    this.$confirm('确定删除？', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.thirdTradeDelete(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('删除成功');
      });
    }).catch(() => {
      this.$message.info('已取消删除');
    });
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
      const body = await this.queryThirdTradeList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async mounted() {
    this.tableData._this = this;
    this.queryList();

    this.initSetTableLabel();
  }

  perm = {};

  async created() {
    const { drivingSchoolId } = this.userInfo;
    this.tableLabelType = drivingSchool(drivingSchoolId) === 'guangren' ? 'THIRD_PARTY_FLOW_LIST_LABEL_GUANGREN'
      : 'THIRD_PARTY_FLOW_LIST_LABEL';
    this.isHuizhou = drivingSchool(drivingSchoolId) === 'huizhou';
    this.tableData.options = this.isHuizhou ? tableOptionList : guanrenTableOptionList;
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
