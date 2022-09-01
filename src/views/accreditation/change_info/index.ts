import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCreateTable,
  CtjtOperationLog,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import { deepClone, timestampSizeCompare } from '@/assets/js/common';
import {
  VERIFY_STRTUS,
  EXAM_TYPE,
} from '@/enums';
import {
  ParamsType, TableOptionsValue, StaticDataType
} from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  marginTableLabels, setTableLabels
} from '@/views/accreditation/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const tableOptionList = [
  // {
  //   id: 1,
  //   label: '通过',
  //   type: 'success'
  // },
  // {
  //   id: 2,
  //   label: '驳回',
  //   type: 'danger'
  // },
  // {
  //   id: 3,
  //   label: '撤回',
  //   type: 'warning'
  // },
  {
    id: 4,
    label: '导出',
    path: 'btn_export'
  },
];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtStatistics,
    CtjtCreateTable,
    CtjtOperationLog
  },
})
export default class ChangeInfoListIndex extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('workflow/queryMsgChangeList') private queryMsgChangeList!: (data: any) => any

  @Action('workflow/queryMsgChangeLogList') private queryMsgChangeLogList!: (data: any) => any

  @Action('workflow/queryRecordExcelExport') private queryRecordExcelExport!: (data: any) => any

  @Action('license/queryStudentByKeyword') private queryStudentByKeyword!: (data: any) => ParamsType;

  // 弹窗名称
  private dialogName = '';

  // 列表搜索项配置
  private searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 0,
          width: 110,
          options: [
            {
              id: 0,
              label: '申请日期',
            },
            {
              id: 1,
              label: '审核日期',
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
    inputList: [
      {
        label: '变更单编号',
        key: 'changeNo',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '请输入变更单编号',
        clearable: true,
      },
      {
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '请输入批次号',
        clearable: true,
      },
    ],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、证件号',
        width: 320,
        maxlength: 60,
        clearable: true,
        options: [],
      },
    ],
    selectList: [
      {
        label: '审核状态',
        key: 'isVerify',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: VERIFY_STRTUS,
        customOptions: {
          value: 'id',
          label: 'label'
        },
      },
      {
        label: '考核类型',
        key: 'assessType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: EXAM_TYPE,
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
   * @description 表单搜索回调函数
   */
  private async autocompleteQuerySearch(
    val: string,
    cb: (result: any) => void
  ) {
    // 调用 callback 返回建议列表的数据
    if (val) {
      const sendData = { keyword: val };
      await this.queryStudentByKeyword(sendData).then((res: any) => {
        cb(res);
      });
    } else {
      cb([]);
    }
  }

  /**
   * @description 列表搜索 操作按钮回调
   */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
    }
    if (key === 'reset') {
      this._resetSearchFunc();
    }
    if (key === 'log') {
      this.queryMsgChangeLogPage();
      this.logshow = true;
    }
  }

  /** 重置列表搜索回调 */
  private _resetSearchFunc() {
    this.searchForm.selectTimeList[0].select.value = 0;
    this.queryList();
  }

  /**
   * @description 跳转到详情
   */
  private jumpDetail(item: any) {
    this.$router.push({
      path: '/accreditation/student/change_info/detail',
      query: { obj: encodeURIComponent(JSON.stringify(item)) }
    });
  }

  // 表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name: '办证信息变更'
  };

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
   * @description 列表操作回调
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, labels } = this.tableData;
    const _len = selectionList.length;
    if (id === 1 || id === 3) {
      // 通过,撤回 允许批量操作
      if (_len === 0) {
        this.$message.warning('请先勾变更单！');
      } else {
        if (id === 1) {
          this._adoptFunc(selectionList);
        }
        if (id === 3) {
          this._revokeFunc(selectionList);
        }
      }
    }
    if (id === 2) {
      // 驳回
      if (_len === 1) {
        this._rejectFunc(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请先勾变更单！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 4) {
      // 导出
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
        this.getRecordExcelExport(_len);
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
  }

  /**
   * @description 通过
   */
  private _adoptFunc(val: any) {
    const _list = val;
    if (_list.length > 0) {
      this.$confirm('确定通过审核?', '通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.$message.success('审核已通过！');
        this.paginationData.current = 1;
        this.queryList();
      });
    } else {
      this.$message.warning('请勾选状态为审核中的变更单！');
    }
  }

  /**
   * @description 撤销
   */
  private _revokeFunc(val: any) {
    const _list = val;
    if (_list.length > 0) {
      this.$confirm('确定撤销申请?', '撤回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this.$message.success('审核已通过！');
        this.paginationData.current = 1;
        this.queryList();
      });
    } else {
      this.$message.warning('请选择状态为审核中的变更单');
    }
  }

  /**
   * @description 驳回
   */
  private _rejectFunc(params: any) {
    this.$prompt('请输入驳回理由', '驳回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^.{1,100}$/,
      inputErrorMessage: '输入内容长度为1-100',
      inputPlaceholder: '输入内容长度为1-100'
    }).then((val: any) => {
      console.log(val);
    }).catch((error: any) => {
      //
    });
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
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

  /**
   * @description 字段设置保存回调
   */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /**
   * @description 列表分页页数切换回调
   * @param { number } val
   */
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  /**
   * @description 列表分页下一页切换回调
   * @param { number } val
   */
  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  // 表单底部统计
  private statisticsData: StaticDataType[] = [];

  /**
   * @description 统计数据
   */
  private queryStatics(val: any) {
    const {
      passCount, rejectCount, revocationCount, verifyCount
    } = val;
    this.statisticsData = [
      {
        label: '审核中',
        value: verifyCount,
      },
      {
        label: '已通过',
        value: passCount,
      },
      {
        label: '已驳回',
        value: rejectCount,
      },
      {
        label: '已撤销',
        value: revocationCount,
      },
    ];
  }

  /**
   * @description  请求列表
   */
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
    const sendData = {
      ..._data,
    };
    try {
      const body = await this.queryMsgChangeList(sendData);
      const { data = [], current, total } = body.data;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
      this.queryStatics(body);
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  /**
   * @description 导出列表时，记录一下导出了多少条数据
   */
  private async getRecordExcelExport(len: number) {
    const sendData = {
      number: len
    };
    await this.queryRecordExcelExport(sendData);
  }

  // 日志显示
  private logshow = false;

  // 日志分页
  private logPaginationData = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  // 日志
  private logTableOptions = {
    labels: [
      {
        key: 'operationUser',
        label: '操作人',
        minWidth: 100
      },
      {
        key: 'operation',
        label: '操作',
        minWidth: 100
      },
      {
        key: 'changeNoOrResult',
        label: '操作结果',
        minWidth: 200
      },
      {
        key: 'operationDate',
        label: '操作时间',
        minWidth: 120
      },
    ]
  }

  // 日志列表
  private loglist: Array<any> = [];

  private logTableCurrentChange(val: number) {
    this.logPaginationData.current = val;
    this.queryMsgChangeLogPage();
  }

  private logTableSizeChange(val: number) {
    this.logPaginationData.pageSize = val;
    this.logPaginationData.current = 1;
    this.queryMsgChangeLogPage();
  }

  /**
   * @description 查询日志信息列表
   */
  private async queryMsgChangeLogPage() {
    const sendData = {
      current: this.logPaginationData.current,
      pageSize: this.logPaginationData.pageSize
    };
    const body = await this.queryMsgChangeLogList(sendData);
    const { data, current, total } = body;
    this.logPaginationData.current = current;
    this.logPaginationData.total = total;
    this.loglist = data;
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'CHANGE_INFO_LIST';
    this.queryList();
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
