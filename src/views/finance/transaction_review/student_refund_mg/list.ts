import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare } from '@/assets/js/common';
import { INVOICING_TYPE } from '@/enums';
import { setTableLabels, marginTableLabels } from '@/views/finance/_common/common';
import { API_FINANCE_V1_REFUNDRECORD_EXPORTREFUNDEXCEL } from '@/api';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const tableOptionList = [
  {
    id: 1,
    label: '导出列表数据',
    type: 'primary',
    path: 'btn_dclbsj'
  },
  // {
  //   id: 2,
  //   label: '导出汇总',
  //   type: 'primary',
  //   path: 'btn_dchz'
  // },
  // {
  //   id: 3,
  //   label: '删除',
  //   type: 'danger',
  //   path: 'btn_del'
  // },
];
@Component
export default class FinanceStudentRefundMg extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('finance/queryRefundPageList') private queryRefundPageList!: (data: any) => ParamsType;

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
              label: '操作日期',
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
      },
      {
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 250,
        placeholder: '',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '票据类型',
        key: 'invoiceType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: INVOICING_TYPE,
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
    ]
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
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
    if (id === 1) {
      // 导出
      this._exportData(selectionList);
    }
    if (id === 3) {
      // 删除
      if (_len >= 1) {
        this._deleteFunc(selectionList);
      } else {
        this.$message.warning('请勾选数据！');
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
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const batchNoList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      batchNoList.push(_item.batchNo);
    });
    const sendData = { ..._data, batchNoList };
    const body = await this.$http.post(API_FINANCE_V1_REFUNDRECORD_EXPORTREFUNDEXCEL, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `学员退费明细${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** 删除 */
  private _deleteFunc(selectionList: any) {
    //
  }

  /**
 * @description 跳转详情界面
 */
  jumpDetail(val: ParamsType) {
    this.$router.push({
      path: '/finance/transaction_review/student_refund_mg/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...val })) }
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
      const body = await this.queryRefundPageList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  mounted() {
    this.tableData._this = this;
    this.queryList();
    this.tableLabelType = 'STUDENT_REFUND_MG_LIST_LABEL';
    this.initSetTableLabel();
  }

  perm = {};

  async created() {
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
