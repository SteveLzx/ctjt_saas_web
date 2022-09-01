import Component, { mixins } from 'vue-class-component';
import { State, Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue, StaticDataType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare, formatPrice } from '@/assets/js/common';
import download from '@/assets/js/download';
import { getTemplateDownloadProps } from '@/views/finance/_common/common';
import { FEE_TYPE, SHENHE_STATUS } from '@/enums';
import {
  API_LICENSE_V1_QUERYDATA_QUERYBYIDNO_GET,
  API_FINANCE_V1_EXPENSES_READEXCEL,
  API_FINANCE_V1_EXPENSES_BATCHCREATEDATA,
  API_FINANCE_V1_EXPENSES_EXPORT,
} from '@/api';
import { OTHER_FEE_MG_LIST_LABEL } from '@/views/finance/_common/tablelabel';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';
import ctjtPaginationMixins from '@/mixins/pagination';

const tableOptionList = [
  {
    id: 1,
    label: '新增',
    type: 'primary',
    path: 'btn_add'
  },
  {
    id: 2,
    label: '导入',
    type: 'success',
    path: 'btn_import'
  },
  {
    id: 3,
    label: '下载导入模板',
    type: 'primary',
    path: 'btn_xzdrmb'
  },
  {
    id: 4,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
  {
    id: 5,
    label: '导出',
    path: 'btn_export'
  }
];
const name = '其他费用';
@Component
export default class FinanceOtherFeeMg extends mixins(ctjtPaginationMixins, financeOperationLogMixins) {
  @Action('finance/queryOtherFeePageList') private queryOtherFeePageList!: (data: any) => ParamsType;

  @Action('finance/queryOtherFeeCount') private queryOtherFeeCount!: (data: any) => ParamsType;

  @Action('finance/otherFeeDelete') private otherFeeDelete!: (data: any) => ParamsType;

  // 费用类型
  private feeTypeList = FEE_TYPE;

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
              label: '创建日期',
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
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
      {
        label: '创建人',
        key: 'createdName',
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
        width: 200,
        placeholder: '请输入学员姓名、证件号码',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '费用类型',
        key: 'type',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: FEE_TYPE,
      },
      {
        label: '状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: SHENHE_STATUS,
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

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: tableOptionList,
    labels: OTHER_FEE_MG_LIST_LABEL,
    list: [],
    selectionList: [],
  };

  private selctDialogName = '';

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
      // 新增
      this.selctDialogName = 'insert';
    }
    if (id === 2) {
      // 导入弹出框
      this.selctDialogName = 'import';
    }
    if (id === 3) {
      // 下载导入模板
      download(getTemplateDownloadProps(name));
    }
    if (id === 4) {
      // 删除
      const hasApproval = selectionList.filter((a: any) => a.status === SHENHE_STATUS[1].id).length > 0; // 已审核
      if (_len >= 1) {
        if (hasApproval) this.$message.warning('已审核数据不可删除，请重新选择!');
        else this._deleteFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 5) {
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
    const _data = drawSearchForm(searchForm);
    const expensesIds: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      expensesIds.push(_item.id);
    });
    // 处理数据
    const sendData = { ..._data, expensesIds };
    const body = await this.$http.post(API_FINANCE_V1_EXPENSES_EXPORT, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  private dialogName = '';

  /** 类型选择弹出框回调 */
  selectTypeCallback(val: any) {
    const { key, id } = val;
    if (key === 'submit') {
      this.operationProps.uploadPath = `${API_FINANCE_V1_EXPENSES_READEXCEL}?type=${id}`;
      this.operationProps.insertPath = `${API_FINANCE_V1_EXPENSES_BATCHCREATEDATA}?type=${id}`;
      this.operationProps.type = id;
      this.dialogName = this.selctDialogName;
      this.selctDialogName = '';
    } else {
      this.selctDialogName = '';
    }
  }

  // 导入/新增数据配置
  operationProps = {
    label: name, // 科目名称
    id: 1, // 办证类型id
    code: 'other_fee_mg', // 办证code
    type: null,
    idNoPath: API_LICENSE_V1_QUERYDATA_QUERYBYIDNO_GET, // 身份证号模糊查询基础信息
    uploadPath: API_FINANCE_V1_EXPENSES_READEXCEL, // 导入办证api
    insertPath: API_FINANCE_V1_EXPENSES_BATCHCREATEDATA, // 新增api;
  };

  // 返回结果数据
  private resultData = {};

  // 结果弹出框名
  private resultName = '';

  /** 数据上传/新增回调 */
  resultCallback(val: any) {
    this.resultData = val;
    this.resultName = this.dialogName;
    this.dialogName = '';
    this.querFirstPageList();
  }

  /** @description 删除 */
  private _deleteFun(selectionList: any) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = { id: _item.id, batchNo: _item.batchNo };
      sendData.push(data);
    });
    this.$confirm('确定删除？', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.otherFeeDelete(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('删除成功');
      });
    }).catch(() => {
      this.$message.info('已取消删除');
    });
  }

  /** 跳转详情界面 */
  jumpDetail(val: any) {
    this.$router.push({
      path: '/finance/transaction_review/other_fee_mg/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...val })) }
    });
  }

  private statisticsData: StaticDataType[] = [
    {
      label: '已审核人数',
      value: 0,
    },
    {
      label: '已审核金额',
      value: 0,
    },
    {
      label: '未审核人数',
      value: 0,
    },
    {
      label: '未审核金额',
      value: 0,
    }];

  /** 获取表格底部统计数据 */
  private async _queryStaticData() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    try {
      const body = await this.queryOtherFeeCount(sendData);
      const {
        reviewedPeopleTotal,
        reviewedAmountTotal,
        notReviewedPeopleTotal,
        notReviewedAmountTotal,
      } = body;
      this.statisticsData[0].value = reviewedPeopleTotal;
      this.statisticsData[1].value = formatPrice(reviewedAmountTotal);
      this.statisticsData[2].value = notReviewedPeopleTotal;
      this.statisticsData[3].value = formatPrice(notReviewedAmountTotal);
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
      const body = await this.queryOtherFeePageList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this._queryStaticData();
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
