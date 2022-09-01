import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import {
  ParamsType, TableOptionsValue, VueComponentParent
} from '@/type';
import { deepClone, drivingSchool } from '@/assets/js/common';
import { getAccreditationProps } from '@/views/accreditation/_common/common';
import {
  PAPERLESS_COLLECT_TABLE,
  SITE_DELIVERY_TABLE_TABLE,
  AREA_DELIVERY_TABLE_TABLE,
  VEHICLE_APPROVAL_TABLE,
  EXAM_ACCEPTANCE_TABLE,
  HUIZHOU_EXAM_ACCEPTANCE_TABLE,
  EXAM_APPROVAL_TABLE,
  HUIZHOU_EXAM_APPROVAL_TABLE,
  EXAM_FEE_TABLE,
  HUIZHOU_EXAM_FEE_TABLE,
  EXAM_RESULTS_TABLE,
  HUIZHOU_EXAM_RESULTS_TABLE,
  SUBJECT_TRAINING_TABLE,
  LICENSE_RECEIPT_FORM_TABLE,
  CLASS_SITUATION_TABLE,
  REPORT_CARD_TABLE,
  FILE_FILING_TABLE
} from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '批次号详情';
interface ElementDOMS extends Element {
  offsetHeight: number;
}
@Component
export default class AccreditationBatchNumberDetail extends mixins(accreditationOperationLogMixins, ctjtPaginationMixins, clearCacheMixins) {
  @Action('license/queryBatchNoMsg') private queryBatchNoMsg!: (data: any) => any;

  @Action('license/saveBatchOpLog') private saveBatchOpLog!: (data: any) => any;

  @Action('license/exportBatchNoManageCost') private exportBatchNoManageCost!: (data: any) => any;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 列表搜索项配置
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '请输入学员姓名、证件号',
        clearable: true,
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
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
    if (key === 'search') {
      this.queryList();
    }
    if (key === 'log') {
      this.queryOperationLogPage('批次号详情操作日志');
      this.logshow = true;
    }
  }

  // 下载表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name,
  };

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '导出',
        path: 'btn_export',
      },
    ],
    labels: [],
    list: [],
    selectionList: [],
  };

  /**
   * @description 表格操作回调
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const { id } = val;
    // 导出
    if (id === 1) {
      const { code, } = this.importProps;
      const { subjects } = this.detailParams;
      if (code === 'exam_fee') {
        this._exportData(subjects);
      } else if (_len >= 1) {
        const exportLabels = deepClone(labels);
        exportLabels.splice(0, 1);
        this.downTableData.labels = exportLabels;
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
        this.downTableData.name = `${name}-${subjects}`;
        const batchNo = _len > 0 ? selectionList[0].batchNo : '';
        this._recordBacthDeatailExportCount(batchNo, _len, '批次号详情操作日志');
      } else {
        this.$message.warning('请先勾选信息！');
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

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 导出 */
  private async _exportData(subjects: string) {
    const { searchForm } = this;
    const { inputList } = searchForm;
    const keyword = inputList[0].value;
    const { batchNo } = this.detailParams;
    const sendData = {
      batchNo,
      keyword
    };
    const body = await this.exportBatchNoManageCost(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}-${subjects}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** 记录批次号详情导出条数 */
  private async _recordBacthDeatailExportCount(batchNo: string, num: number, type: string) {
    await this.saveBatchOpLog({
      batchNo, node: this.detailParams.subjects, num, type
    });
  }

  // 办证数据配置
  private importProps: any = getAccreditationProps('无纸化采集');

  private setTableLabels() {
    const { code } = this.importProps;
    const { drivingSchoolId } = this.detailParams;
    switch (code) {
      case 'paperless_collect':
        this.tableData.labels = PAPERLESS_COLLECT_TABLE;
        break;
      case 'area_delivery_table':
        this.tableData.labels = AREA_DELIVERY_TABLE_TABLE;
        break;
      case 'site_delivery_table':
        this.tableData.labels = SITE_DELIVERY_TABLE_TABLE;
        break;
      case 'license_receipt_form':
        this.tableData.labels = LICENSE_RECEIPT_FORM_TABLE;
        break;
      case 'class_situation':
        this.tableData.labels = CLASS_SITUATION_TABLE;
        break;
      case 'vehicle_approval':
        this.tableData.labels = VEHICLE_APPROVAL_TABLE;
        break;
      case 'exam_acceptance':
        this.tableData.labels = drivingSchool(drivingSchoolId) === 'huizhou' ? HUIZHOU_EXAM_ACCEPTANCE_TABLE : EXAM_ACCEPTANCE_TABLE;
        break;
      case 'exam_approval':
        this.tableData.labels = drivingSchool(drivingSchoolId) === 'huizhou' ? HUIZHOU_EXAM_APPROVAL_TABLE : EXAM_APPROVAL_TABLE;
        break;
      case 'exam_fee':
        this.tableData.labels = drivingSchool(drivingSchoolId) === 'huizhou' ? HUIZHOU_EXAM_FEE_TABLE : EXAM_FEE_TABLE;
        break;
      case 'exam_results':
        this.tableData.labels = drivingSchool(drivingSchoolId) === 'huizhou' ? HUIZHOU_EXAM_RESULTS_TABLE : EXAM_RESULTS_TABLE;
        break;
      case 'report_card':
        this.tableData.labels = REPORT_CARD_TABLE;
        break;
      case 'file_filing':
        this.tableData.labels = FILE_FILING_TABLE;
        break;
      case 'subject_training':
        this.tableData.labels = SUBJECT_TRAINING_TABLE;
        break;
      default:
        break;
    }
    const { labels } = this.tableData;
    this.tableData.labels = [
      ...labels,
      ...[
        {
          key: 'storeName',
          label: '门店',
          minWidth: 80,
          showOverflowTooltip: true
        }
      ]
    ];
  }

  async queryList() {
    const {
      searchForm, paginationData
    } = this;
    const { inputList } = searchForm;
    const { current, pageSize } = paginationData;
    const keyword = inputList[0].value;
    const { subjects, batchNo } = this.detailParams;
    let _subjects = subjects;
    if (subjects.indexOf('学科培训') > -1) _subjects = '学科培训';
    try {
      const sendData = {
        subjects: _subjects, batchNo, current, pageSize, keyword
      };
      if (keyword === '' || keyword === null) {
        delete sendData.keyword;
      }
      const body = await this.queryBatchNoMsg(sendData);
      const { data = [], current: currentPage, total } = body;
      data.forEach((item: any) => {
        const _item = item;
        _item.batchNo = batchNo;
      });
      this.tableData.list = data;
      this.paginationData.current = currentPage;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  perm = {};

  historyParams: any = '';

  async activated() {
    let { obj } = this.$route.query;
    const { historyParams } = this;
    if (obj !== historyParams) {
      this.searchForm.inputList[0].value = '';
    }
    this.historyParams = obj;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      let { subjects } = this.detailParams;
      if (subjects.indexOf('学科培训') > -1) subjects = '学科培训';
      this.importProps = getAccreditationProps(subjects);
      this.setTableLabels();
      this.queryList();
      this.downTableData.name = `${name}-${subjects}`;
    }
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
