import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare } from '@/assets/js/common';
import { VERIFY_STRTUS, ORDER_TYPE } from '@/enums';
import { API_FINANCE_V1_APPROVAL_EXPORTAPPROVALLIST } from '@/api';
import { setTableLabels, marginTableLabels } from '@/views/finance/_common/common';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const tableOptionList = [
  {
    id: 1,
    label: '通过',
    type: 'success',
    path: 'btn_pass'
  },
  {
    id: 2,
    label: '驳回',
    type: 'danger',
    path: 'btn_reject'
  },
  {
    id: 3,
    label: '撤回',
    type: 'warning',
    path: 'btn_revoke'
  },
  {
    id: 4,
    label: '导出',
    path: 'btn_export'
  },
];
const name = '收据变更管理';
@Component
export default class FinanceReceiptChangeMg extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('finance/queryApprovalPageList') private queryApprovalPageList!: (data: any) => ParamsType;

  @Action('finance/receiptApprove') private receiptApprove!: (data: any) => ParamsType;

  @Action('finance/receiptModifyStatus') private receiptModifyStatus!: (data: any) => ParamsType;

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
              label: '申请日期',
            },
            {
              id: 2,
              label: '审核日期',
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
    selectList: [
      {
        label: '订单类型',
        key: 'orderType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: ORDER_TYPE,
      },
      {
        label: '审核状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: VERIFY_STRTUS,
      },
    ],
    checkedList: [
      {
        key: 'isMe',
        value: true,
        label: '只看我审批',
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

  private dialogName = '';

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
    const isHasPass = selectionList.filter((a: any) => a.status !== VERIFY_STRTUS[0].id).length > 0; // 存在已通过、已撤回、已驳回数据
    if (id === 1) {
      // 通过
      if (_len >= 1) {
        if (isHasPass) this.$message.warning('请选择状态为审核中的收据变更单');
        else this._passFun(selectionList);
      } else {
        this.$message.warning('请勾选状态为审核中的收据变更单!');
      }
    }
    if (id === 2) {
      // 驳回
      if (_len === 1) {
        if (isHasPass) this.$message.warning('请选择1个状态为审核中的收据变更单');
        else this._rejectFunc(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请勾选1个状态为审核中的收据变更单');
      } else {
        this.$message.warning('请勾选1个状态为审核中的收据变更单');
      }
    }
    if (id === 3) {
      // 撤回
      if (_len >= 1) {
        if (isHasPass) this.$message.warning('请选择状态为审核中的收据变更单');
        else this._cncelFunc(selectionList);
      } else {
        this.$message.warning('请勾选状态为审核中的收据变更单!');
      }
    }
    if (id === 4) {
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
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    // 处理数据
    const sendData = { ..._data, idList };
    const body = await this.$http.post(API_FINANCE_V1_APPROVAL_EXPORTAPPROVALLIST, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /**
 * @description 跳转详情界面
 */
  jumpDetail(val: ParamsType) {
    this.$router.push({
      path: '/finance/transaction_review/receipt_change_mg/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...val })) }
    });
  }

  /** 提交审批 */
  async submitApprove(val: any, msg: string) {
    const sendData = JSON.parse(JSON.stringify(val));
    await this.receiptApprove(sendData)
      .then(() => {
        this.querFirstPageList();
        this.$message.success(`${msg}成功`);
      });
  }

  /** @description 通过 */
  private _passFun(selectionList: any) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        orderId: _item.orderId,
        payId: _item.payId,
        opinion: '同意',
        status: 1,
        taskId: _item.taskId,
      };
      sendData.push(data);
    });
    this.$confirm('确定通过审核?', '通过', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.submitApprove(sendData, '审核');
      this.querFirstPageList();
    }).catch(() => {
      this.$message.info('已取消审核');
    });
  }

  /**
   * @description 撤回
   */
  private _cncelFunc(selectionList: any) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        orderId: _item.orderId,
        payId: _item.payId,
        opinion: '',
        status: 3
      };
      sendData.push(data);
    });
    this.$confirm('确定撤回申请?', '撤回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await this.receiptModifyStatus(sendData).then((res: any) => {
        const { code, msg } = res;
        if (code === 200) {
          this.querFirstPageList();
          this.$message.success('撤回成功');
        } else {
          this.$message.error(msg);
        }
      });
    }).catch(() => {
      this.$message.info('已取消撤回');
    });
  }

  /**
 * @description 驳回
 */
  private _rejectFunc(params: any) {
    this.$prompt('请输入驳回理由', '驳回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[^ \x22]+/,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(val.length < 1 || val.length > 300);
      },
      inputErrorMessage: '输入内容长度为1-300,不能全输入空格',
      inputPlaceholder: '输入内容长度为1-300',
      inputType: 'textarea'
    }).then((val: any) => {
      const sendData: any = [];
      const data = {
        orderId: params.orderId,
        payId: params.payId,
        opinion: val.value.trim(),
        status: 2,
        taskId: params.taskId,
      };
      sendData.push(data);
      this.submitApprove(sendData, '驳回');
      this.querFirstPageList();
    }).catch((error: any) => {
      this.$message.info('已取消驳回');
    });
  }

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
      const body = await this.queryApprovalPageList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
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
    this.queryList();
    this.initSearch();
    this.tableLabelType = 'RECEIPT_CHANGE_MG_LIST_LABEL';
    this.initSetTableLabel();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
