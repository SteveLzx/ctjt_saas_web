import Component, { mixins } from 'vue-class-component';
import { State, Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  formatPrice, FILTER_EXCEL_TYPE, isCustomNumber, matchNumberList, timestampSizeCompare
} from '@/assets/js/common';
import {
  CANCEL_STATUS, CAPITAL_STEP, FLOW_TYPE, IN_LIBRARY_STATUS
} from '@/enums';
import download from '@/assets/js/download';
import { setTableLabels, marginTableLabels, getTemplateDownloadProps } from '@/views/finance/_common/common';
import {
  API_FINANCE_V1_SUPERVISE_READEXCEL,
  API_FINANCE_V1_SUPERVISE_EXPORT,
} from '@/api';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';

const name = '资金监管复核';
@Component
export default class FinanceCapitalSupervisionReviewSet extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, financeOperationLogMixins) {
  @Action('finance/querySupervisePageList') private querySupervisePageList!: (data: any) => ParamsType;

  @Action('finance/querySuperviseCount') private querySuperviseCount!: (data: any) => ParamsType;

  @Action('finance/superviseDelete') private superviseDelete!: (data: any) => ParamsType;

  @Action('finance/superviseCancellation') private superviseCancellation!: (data: any) => ParamsType;

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
        width: 300,
        placeholder: '请输入流水ID、账号、学员姓名、证件号码',
        clearable: true,
      },
    ],
    cascaderList: [
      {
        label: '在库状态',
        key: 'studentStatus',
        value: [IN_LIBRARY_STATUS[0].id, IN_LIBRARY_STATUS[1].id],
        placeholder: '请选择',
        clearable: true,
        width: 180,
        options: IN_LIBRARY_STATUS,
        optionProps: {
          emitPath: false, // 只展示最后一级
          multiple: true, // 可多选
          collapseTags: true,
          value: 'id',
          label: 'label',
          children: 'children',
        },
      },
    ],
    selectList: [
      {
        label: '流水类别',
        key: 'type',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: FLOW_TYPE,
        customOptions: {
          value: 'label',
          label: 'label'
        }
      },
      {
        label: '阶段',
        key: 'stage',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: CAPITAL_STEP,
        customOptions: {
          value: 'label',
          label: 'label'
        }
      },
      {
        label: '作废状态',
        key: 'status',
        value: 1,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: CANCEL_STATUS,
      },
    ],
    checkedList: [],
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
      }
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

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '下载导入模板',
        type: 'primary',
        path: 'btn_xzdrmb'
      },
      {
        id: 2,
        label: '删除',
        type: 'danger',
        path: 'btn_del'
      },
      {
        id: 4,
        label: '作废',
        type: 'warning',
        path: 'btn_cancel'
      },
      {
        id: 3,
        label: '导出',
        path: 'btn_export'
      },
    ],
    labels: [],
    list: [],
    selectionList: [],
    showSummary: true,
    summariesMethod: (param: any) => {
      const mainList = [10, 11, 12];
      const { columns, data } = param;
      const sums: any = [];
      columns.forEach((column: any, index: number) => {
        if (index === 1) {
          sums[index] = '总计';
          return;
        }
        const that = this.tableData._this;
        const { tradingAmount, fee, amount } = that.staticData;
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
                // return jsAddFunc(prev, curr);
                if (index === 10) return tradingAmount;
                if (index === 11) return fee;
                return amount;
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

  private staticData: any = { tradingAmount: null, fee: null, amount: null };

  async queryStaticData() {
    const {
      searchForm, paginationData,
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatus = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const sendData = { ..._data, studentStatus };
    try {
      const body = await this.querySuperviseCount(sendData);
      this.staticData = body;
    } catch (error) {
      //
    }
  }

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
      // 下载导入模板
      download(getTemplateDownloadProps(name));
    }
    if (id === 2) {
      // 删除
      if (_len >= 1) {
        const isHistory = selectionList.filter((a: any) => a.studentStatus === IN_LIBRARY_STATUS[2].id).length > 0; // 存在历史学员
        if (isHistory) this.$message.warning('历史学员不可删除，请重新选择!');
        else this._deleteFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 3) {
      // 导出
      this._exportData(selectionList);
    }
    if (id === 4) {
      // 作废
      if (_len === 1) {
        // 流水类型==存入 且 阶段==一阶段/二阶段/三阶段/一次性
        const hasZuofei = selectionList.filter((a: any) => a.status === CANCEL_STATUS[1].id).length > 0; // 存在已作废数据
        if (hasZuofei) this.$message.warning('已作废数据不可作废，请重新选择!');
        else this._cancelFunc(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请先勾学员！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
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

  /** 导出 */
  private async _exportData(selectionList: any) {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const ids: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      ids.push(_item.id);
    });
    // 处理数据
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatus = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const sendData = { ..._data, ids, studentStatus };
    const body = await this.$http.post(API_FINANCE_V1_SUPERVISE_EXPORT, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
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

  /** @description 删除 */
  private _deleteFun(selectionList: any) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      sendData.push(_item.id);
    });
    this.$confirm('确定删除？', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.superviseDelete(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('删除成功');
      });
    }).catch(() => {
      this.$message.info('已取消删除');
    });
  }

  /**
   * @description 作废
   */
  private _cancelFunc(item: any) {
    this.$prompt('请输入作废理由', '驳回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{1,100}$/,
      inputErrorMessage: '输入内容长度为1-100',
      inputPlaceholder: '输入内容长度为1-100'
    }).then((val: any) => {
      const sendData = { id: item.id, remark: val.value.trim() };
      this.superviseCancellation(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('作废成功');
      });
    }).catch((error: any) => {
      //
    });
  }

  // 数据上传API路径
  private uploadPath = API_FINANCE_V1_SUPERVISE_READEXCEL;

  // 数据上传配置
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
    const _totalMoneyText: any = description
      ? description.substring(description.indexOf(':') + 1, description.lastIndexOf(';'))
      : '';
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

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const {
      searchForm, paginationData,
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatus = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const sendData = { ..._data, studentStatus };
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.querySupervisePageList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.queryStaticData();
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  mounted() {
    this.tableData._this = this;
    this.queryList();
    this.tableLabelType = 'CAPITAL_SUPERVISION_REVIEW_SET_LIST_LABEL';
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
