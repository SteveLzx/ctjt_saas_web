import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { SUBJECT } from '@/enums';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  marginTableLabels,
  setTableLabels,
  getAccreditationProps,
  getTemplateDownloadProps,
} from '@/views/accreditation/_common/common';
import download from '@/assets/js/download';
import {
  deepClone, drivingSchool, timestampSizeCompare
} from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '考试结果';
@Component
export default class AccreditationExamResultsList extends mixins(
  accreditationSeachTableMixins,
  ctjtPaginationMixins,
  ctjttablefieldMixins,
  accreditationOperationLogMixins
) {
  @Action('license/queryResultPage') private queryResultPage!: (data: any) => ParamsType;

  @Action('license/queryResultExport') private queryResultExport!: (data: any) => any;

  /** 列表搜索配置 */
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
          options: [
            {
              id: 3,
              label: '操作日期',
            },
            {
              id: 7,
              label: '考试日期',
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
        customOptions: {
          value: 'label',
          label: 'label',
        },
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
      // {
      //   label: '考试次数',
      //   key: 'examNumber',
      //   type: 'number',
      //   value: undefined,
      //   max: 1000,
      //   controls: false,
      //   width: 150,
      //   placeholder: '请输入考试次数',
      //   clearable: true,
      //   hasZero: true,
      // },
    ],
  };

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
    const { drivingSchoolId } = this.userInfo;
    this.searchForm.autocompleteList[0].placeholder = drivingSchool(drivingSchoolId) === 'huizhou' ? '请输入学员姓名、手机号、证件号、订单号' : '请输入学员姓名、手机号、证件号、订单号、受理号';
    this.queryAllsExamPlaceList().then((res: any) => {
      this.searchForm.selectList[7].options = res;
    });
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: false,
    index: true,
    options: [
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
    ],
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

  // 导入办证数据结果弹出框是否可见
  certificateResult = '';

  // 返回的导入办证结果
  importData: any = {};

  // 弹出框类型
  dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
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

  /** 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    // 子项选中列表，必须是单选
    const { selectionList, labels } = this.tableData;
    const cancelReqList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      cancelReqList.push({ orderId: _item.id, subject: _item.subject });
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
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const { batchNos } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
    };
    const body = await this.queryResultExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  // 上传excel 后返回回调
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
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  /** @description 获取表格数据 */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { batchNos, beginDate, endDate } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
    };
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryResultPage(sendData);
      const { data = [], current, total } = body;
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
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = drivingSchool(drivingSchoolId) === 'huizhou' ? 'HUIZHOU_EXAM_RESULT_LIST_LABEL' : 'EXAM_RESULT_LIST_LABEL';
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
