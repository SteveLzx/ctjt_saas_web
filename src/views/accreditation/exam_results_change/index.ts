import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  ParamsType, TableOptionsValue, VueComponentParent, StaticDataType
} from '@/type';
import { marginTableLabels, setTableLabels } from '@/views/accreditation/_common/common';
import { timestampSizeCompare } from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import {
  VERIFY_STRTUS, SUBJECT, EXAM_RESULT_CHANGE_TYPE
} from '@/enums';
import { API_LICENSE_V1_RESULTCHANGE_EXPORT } from '@/api';

const tableOptionList = [
  {
    id: 1,
    label: '新增',
    type: 'primary',
    path: 'btn_add',
  },
  {
    id: 5,
    label: '导出',
    path: 'btn_export',
  },
];
const name = '考试结果变更';

@Component
export default class AccreditationExamResultsChangeListIndex extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('license/queryWorkflowByIdNo') public queryWorkflowByIdNo!: (data: any) => ParamsType;

  @Action('license/postqueryResultChangePage') private postqueryResultChangePage!: (data: any) => ParamsType;

  @Action('license/queryResultChangeRecord') private queryResultChangeRecord!: (data: any) => any;

  @Action('license/postcreateResultChange') private postcreateResultChange!: (data: any) => any;

  private typeList = [{
    label: '客观出错',
    id: 1,
  }, {
    label: '主观出错',
    id: 2,
  },
  ];

  private beginDate = new Date();

  private endDate = new Date();

  // 列表搜索项配置
  public searchForm: ParamsType = {
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
    inputList: [
      {
        label: '变更单编号',
        key: 'seq',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入变更单编号',
        clearable: true,
      },
      {
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入批次号',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '审核状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: VERIFY_STRTUS,
      },
      {
        label: '考核类型',
        key: 'type',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: this.typeList,
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
      const sendData = { idNo: val };
      await this.queryWorkflowByIdNo(sendData).then((res: any) => {
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
    if (key === 'search' || key === 'reset') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this.querFirstPageList();
    }
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: tableOptionList,
    labels: [],
    list: [],
    selectionList: [],
  };

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

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /**
   * @description 表格操作回调
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    if (id === 1) {
      // 新增办证信息撤销
      this.drawer = true;
    }
    if (id === 5) {
      // 导出所有
      this._exportData();
    }
  }

  /** 导出 */
  private async _exportData() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    const body = await this.$http.post(API_LICENSE_V1_RESULTCHANGE_EXPORT, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
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

  // 弹窗名称
  private dialogName = '';

  // 抽屉弹窗
  private drawer = false;

  // 搜索项表单
  private saerchFormData: ParamsType = {
    idNo: '',
    userName: '',
    userInfo: { idNo: '', userName: '' },
    subject: SUBJECT[0].label
  }

  private saerchFormDataRules = {
    userName: [
      { required: true, message: '请输入证件号码搜索学员', trigger: 'blur' }
    ],
    subject: [
      { required: true, message: '请选择考试科目', trigger: ['change', 'blur'] }
    ],
  }

  // 新增抽屉弹窗表单
  private formData: ParamsType = {
    oldResult: '', // 变更前结果
    type: null, // 考核类型
    newResult: '', // 变更后考试结果
    reason: '', // 变更原因
  }

  private subjectList = SUBJECT;

  private newResultList = EXAM_RESULT_CHANGE_TYPE;

  private formDataRules = {
    type: [
      { required: true, message: '请选择考核类型', trigger: ['change', 'blur'] }
    ],
    newResult: [
      { required: true, message: '请选择变更后考试结果', trigger: ['change', 'blur'] }
    ],
  }

  /** 根据科目设置考试结果list数据-只有文明可选择未联考 */
  _setExamResultList(subject: string) {
    this.formData.newResult = '';
    const result = JSON.parse(JSON.stringify(EXAM_RESULT_CHANGE_TYPE));
    result.forEach((item: any) => {
      const _item = item;
      if (_item.id === '未联考' && subject === '文明') {
        _item.disabled = false;
      }
    });
    this.newResultList = result;
  }

  // 身份证搜索下拉配置项
  private idNoOption = {
    options: [],
    loading: false,
  };

  /**
   * @description 根据证件模糊搜索，查询可退节点信息以及学员基础信息
   */
  private async queryIdNoSearch(val: any) {
    this.idNoOption.loading = true;
    if (val.length >= 2) {
      const sendData = { idNo: val };
      const body: any = await this.queryWorkflowByIdNo(sendData);
      this.idNoOption.options = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数
  */
  async formDataSelectCallback(val: any) {
    const { options } = this.idNoOption;
    this.saerchFormData.idNo = val;
    const userInfo: any = options.filter((a: any) => a.idNo === val);
    this.saerchFormData.userInfo = userInfo ?.[0];
    this.saerchFormData.userName = userInfo ?.[0].userName;
    const { subject } = this.saerchFormData;
    this.queryResultChangeRecord({ idNo: val, subject }).then((res: any) => {
      const list = [].concat(res);
      this.formTableData.list = list;
      this.formData.oldResult = res?.result;
    }).catch((res: any) => {
      this.formTableData.list = [];
    }).finally(() => {
      this.idNoOption.options = [];
    });
  }

  async subjectChangeFun(val: string) {
    const { idNo } = this.saerchFormData.userInfo;
    if (idNo.length >= 2) {
      this.queryResultChangeRecord({ idNo, subject: val }).then((res: any) => {
        const list = [].concat(res);
        this.formTableData.list = list;
        this.formData.oldResult = res?.result;
      }).catch((res: any) => {
        this.formTableData.list = [];
      });
    }
    this._setExamResultList(val);
  }

  private submitLoading = false;

  // 新增变更数据表格抽屉列表配置
  private formTableData: ParamsType = {
    _this: {},
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'batchNo',
        label: '批次号',
        minWidth: 100,
      },
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
        minWidth: 80,
      },
      {
        key: 'idNo',
        label: '证件号码',
        width: 170,
      },
      {
        key: 'mobile',
        label: '联系电话',
        width: 120,
      },
      {
        key: 'applyDate',
        label: '报名日期',
        width: 160,
        render(h: any, params: any) {
          const { applyDate } = params.row;
          if (!applyDate) return h('div', '');
          return h('div', dayjs(applyDate).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'carModel',
        label: '车型',
        minWidth: 80,
      },
      {
        key: 'coachName',
        label: '教练',
        minWidth: 100,
      },
      {
        key: 'step',
        label: '科目',
        minWidth: 100,
      },
      {
        key: 'address',
        label: '考试地点',
        minWidth: 150,
        render(h: any, params: any) {
          const { address } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: address,
            },
            scopedSlots: {
              reference: () => h('p', address),
            },
          });
        },
      },
      {
        key: 'examDate',
        label: '考试日期',
        minWidth: 120,
      },
      {
        key: 'examTime',
        label: '考试时间',
        minWidth: 100,
      },
      {
        key: 'result',
        label: '考试结果',
        minWidth: 100,
      }
    ],
    list: [],
    selectionList: [],
  };

  /**
 * @description 关闭抽屉，清空数据
 */
  closeDrawer() {
    this.drawer = false;
    (this.$refs.drawerForm as VueComponentParent).resetFields();
    (this.$refs.searchForm as VueComponentParent).resetFields();
    this.formTableData.list = [];
    this.saerchFormData.userInfo = { idNo: '', userName: '' };
    this._setExamResultList('科目一');
  }

  /** 新增考试结果变更提交 */
  submitChange() {
    (this.$refs.drawerForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const { formData, formTableData } = this;
          const { list } = formTableData;
          const {
            oldResult,
            type,
            newResult,
            reason
          } = formData;
          if (list && list[0]) {
            if (oldResult === newResult) {
              this.$message.warning('变更后的考试结果和变更前一致，请重新选择变更后的考试结果！');
            } else {
              const sendData = {
                ...list[0],
                oldResult,
                type,
                newResult,
                reason
              };
              this.postcreateResultChange(sendData).then(() => {
                this.$message.success('新增考试结果变更成功');
              }).finally(() => {
                this.closeDrawer();
                this.querFirstPageList();
              });
            }
          } else {
            this.$message.warning('请先录入需变更的考试结果数据！');
          }
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /**
   * @description 跳转到详情
   */
  private jumpDetail(val: any) {
    this.$router.push({
      path: '/accreditation/information/exam_results_change/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...val })) }
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
    const body = await this.postqueryResultChangePage(sendData);
    const {
      data = [], current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'EXAM_RESULTS_CHANGE_LIST';
    this.queryList();
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
