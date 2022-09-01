import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare, FILTER_EXCEL_TYPE, matchNumberList } from '@/assets/js/common';
import { TRANSACTION_TYPE } from '@/enums';
import {
  API_FINANCE_V1_BANKTRANSFERACCOUNT_EXPORTBANKTRANSFEREXCEL,
  API_FINANCE_V1_BANKTRANSFERACCOUNT_IMPORTBANKTRANSFER,
} from '@/api';
import download from '@/assets/js/download';
import { setTableLabels, marginTableLabels, getTemplateDownloadProps } from '@/views/finance/_common/common';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const name = '银行转账流水';
const tableOptionList = [
  {
    id: 1,
    label: '删除',
    type: 'danger',
    path: 'btn_del',
  },
  {
    id: 2,
    label: '下载导入模板',
    type: 'primary',
    path: 'btn_xzdrmb',
  },
  {
    id: 3,
    label: '导出',
    path: 'btn_export',
  },
];
@Component
export default class FinanceCollectionFlow extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, financeOperationLogMixins) {
  @Action('finance/queryAllBankAccountList') private queryAllBankAccountList!: () => ParamsType;

  @Action('finance/queryBankTransferList') private queryBankTransferList!: (data: any) => ParamsType;

  @Action('finance/bankTransferDelete') private bankTransferDelete!: (data: any) => ParamsType;

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
        label: '收款账号',
        key: 'collectionNo',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        filterable: true,
        width: 200,
        options: [],
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
    if (id === 3) {
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
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    // 处理数据
    const sendData = { ..._data, idList };
    const body = await this.$http.post(API_FINANCE_V1_BANKTRANSFERACCOUNT_EXPORTBANKTRANSFEREXCEL, sendData, {
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
      this.bankTransferDelete(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('删除成功');
      });
    }).catch(() => {
      this.$message.info('已取消删除');
    });
  }

  // 导入发票API路径
  private uploadPath = API_FINANCE_V1_BANKTRANSFERACCOUNT_IMPORTBANKTRANSFER;

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
    this.dialogName = 'import';
    const { description = '', failLogDtoList } = val.body;
    const list: any = matchNumberList(description);
    this.resultData = {
      ...val,
      importSuccess: (list && list[0]) || 0,
      imporError: (failLogDtoList && failLogDtoList.length) || 0,
      failLogDtoList,
    };
    this.querFirstPageList();
  }

  /** 获取所有收款账号 */
  async queryBankAccountList() {
    const { selectList } = this.searchForm;
    this.queryAllBankAccountList().then((res: any) => {
      selectList[0].options = res;
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
    // 处理数据
    const sendData = { ..._data };
    try {
      const body = await this.queryBankTransferList(sendData);
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
    this.queryBankAccountList();
    this.queryList();
    this.tableLabelType = 'BANK_TRANSFER_FLOW_LIST_LABEL';
    this.initSetTableLabel();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
