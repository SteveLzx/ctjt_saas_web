import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { SUBJECT, APPROVAL_TAB } from '@/enums';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import download from '@/assets/js/download';
import { drivingSchool, timestampSizeCompare } from '@/assets/js/common';
import {
  marginTableLabels,
  setTableLabels,
  getAccreditationProps,
  getTemplateDownloadProps,
} from '@/views/accreditation/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '考试批复';
const tableOptions = [
  {
    id: 11,
    label: '快速录入',
    type: 'primary',
    path: 'btn_quick_entry',
  },
  {
    id: 1,
    label: '导入办证数据',
    path: 'btn_drbzsj',
  },
  {
    id: 2,
    label: '补录办证数据',
    type: 'primary',
    path: 'btn_blbzsj',
  },
  {
    id: 9,
    label: '数据模板下载',
    path: 'btn_sjmbxz',
  },
  {
    id: 10,
    label: '导出',
    path: 'btn_export',
  },
];

const searchDateOptions = [
  {
    id: 3,
    label: '操作日期',
  },
  {
    id: 7,
    label: '考试日期',
  },
  {
    id: 8,
    label: '批复日期（批复异常）',
  },

];
const huizhouSearchDateOptions = [
  {
    id: 3,
    label: '操作日期',
  },
  {
    id: 7,
    label: '考试日期',
  },
];
@Component
export default class AccreditationExamApprovalList extends mixins(accreditationSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins, accreditationOperationLogMixins) {
  @Action('license/queryReplyPage') private queryReplyPage!: (data: any) => ParamsType;

  @Action('license/queryReplyExport') private queryReplyExport!: (data: any) => any;

  // 本地搜索项
  private localSearchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 3,
          width: 110,
          options: [],
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
        label: '科目',
        key: 'step',
        value: null,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: SUBJECT,
        customOptions: {
          value: 'label',
          label: 'label',
        },
      },
      {
        label: '教练',
        key: 'coachId',
        value: '',
        placeholder: '请先选择科目',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '考试地点',
        key: 'examAddress',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
        customOptions: {
          value: 'label',
          label: 'label',
        },
      },
    ],
    inputList: [
      {
        label: '批次号',
        key: 'batchNos',
        type: 'text',
        value: '',
        width: 315,
        placeholder: '多个批次号之间请英文用分号[;]分隔',
        clearable: true,
      },
    ],
    checkedList: [
      // {
      //   value: '',
      //   key: 'isPay',
      //   label: '只看已交费',
      // },
    ],
  };

  /**
   * @description 初始化列表搜索项
   */
  private initSearch() {
    // 合并混入的公共搜索项，和本地的搜索项
    const { searchForm, localSearchForm } = this;
    const { drivingSchoolId } = this.userInfo;
    localSearchForm.selectTimeList[0].select.options = drivingSchool(drivingSchoolId) === 'huizhou' ? huizhouSearchDateOptions : searchDateOptions;
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
    this.searchForm.autocompleteList[0].placeholder = drivingSchool(drivingSchoolId) === 'huizhou' ? '请输入学员姓名、手机号、证件号、订单号' : '请输入学员姓名、手机号、证件号、订单号、受理号';
    this.queryAllsExamPlaceList().then((res: any) => {
      this.searchForm.selectList[7].options = res;
    });
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: tableOptions,
    labels: [],
    list: [],
    selectionList: [],
    setCellClassName: (val: any) => {
      const { balance } = val.row;
      return balance || balance !== 0 ? 'td_text_red' : '';
    }
  };

  /**
* @description 表格初始化设置
*/
  private initSetTableLabel() {
    const { tableLabelType } = this;
    const _originalLabelList = marginTableLabels(tableLabelType);
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(
      _originalLabelList,
      tableLabelType
    );
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  // 办证数据配置
  private importProps = {};

  // tab list
  private tabList = APPROVAL_TAB;

  // 当前tab
  private activeTab = 1;// 已批复：1

  // 导入办证数据结果弹出框是否可见
  private certificateResult = '';

  // 返回的导入办证结果
  importData: any = {};

  // 弹出框类型
  dialogName = '';

  /** @description 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** tab 选中回调 */
  @Watch('activeTab', { immediate: false })
  async checkTab(val: number) {
    this.querFirstPageList();
    const _typeDta: ParamsType = {
      1: 'EXAM_APPROVAL_LIST_HAS_REPLY',
      2: 'EXAM_APPROVAL_LIST_REPLY_ERROR',
    };
    this.tableLabelType = _typeDta[val];
    this.initSetTableLabel();
  }

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this._resetSearchFunc();
    }
    if (key === 'log') {
      this.queryOperationLogPage(name);
      this.logshow = true;
    }
  }

  /** 重置列表搜索回调 */
  private _resetSearchFunc() {
    this.searchSelectChange({ key: 'regionId', value: null });
    this.searchSelectChange({ key: 'subject', value: null });
    this.queryList();
  }

  /** @description 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    // 子项选中列表，必须是单选
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const { id } = val;
    if ([1, 2, 11].includes(id)) {
      const { drivingSchoolId } = this.userInfo;
      this.importProps = getAccreditationProps(name, drivingSchoolId);
    }
    if (id === 1) {
      // 导入办证数据
      this.dialogName = 'import';
      return;
    }
    if (id === 2) {
      // 补录办证数据
      this.dialogName = 'supplement';
      return;
    }
    if (id === 11) {
      // 快速录入办证数据
      this.dialogName = 'quickEntry';
      return;
    }
    if (id === 9) {
      // 数据模板下载
      const { drivingSchoolId } = this.userInfo;
      download(getTemplateDownloadProps(name, drivingSchoolId));
      return;
    }
    // 导出
    if (id === 10) {
      this._exportData();
    }
  }

  /** 导出 */
  private async _exportData() {
    const { searchForm, activeTab } = this;
    const _data = drawSearchForm(searchForm);
    const { batchNos, } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      replyStatus: activeTab
    };
    const body = await this.queryReplyExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** @description 上传excel后返回回调 */
  importResultCallback(val: any) {
    this.dialogName = '';
    this.certificateResult = 'import';
    this.importData = val;
    this.querFirstPageList();
  }

  // 补录按钮点击回调
  submitSupplementCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.certificateResult = 'supplement';
        this.dialogName = '';
        this.importData = data;
        this.querFirstPageList();
      }
    } else {
      this.dialogName = '';
    }
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
    if (key === 'step') {
      this.searchForm.selectList[6].options = [];
      this.searchForm.selectList[6].value = null;
      if (value && value !== 1 && value !== 4) {
        this.queryAllsCoachList(value).then((res: any) => {
          this.searchForm.selectList[6].options = res;
        });
      }
    }
  }

  // 快速录入确定回调
  async submitQuickEntryCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.certificateResult = 'quickEntry';
        this.dialogName = '';
        this.importData = data;
        this.querFirstPageList();
      }
    } else {
      this.dialogName = '';
    }
  }

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
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  /** @description 获取表格数据 */
  async queryList() {
    const {
      searchForm, paginationData, activeTab
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { batchNos, beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      replyStatus: activeTab
    };
    try {
      const body = await this.queryReplyPage(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  /** 判断是否是惠州深港 */
  isHuiZhouSchool() {
    const { drivingSchoolId } = this.userInfo;
    return drivingSchool(drivingSchoolId) === 'huizhou';
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = drivingSchool(drivingSchoolId) === 'huizhou' ? 'HUIZHOU_EXAM_APPROVAL_LIST_REPLY' : 'EXAM_APPROVAL_LIST_HAS_REPLY';
    this.tabList = drivingSchool(drivingSchoolId) === 'huizhou' ? [] : this.tabList; // 惠州深港没得批复异常
    this.queryList();
    this.initSearch();
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
