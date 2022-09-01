import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import { ACCEPTANCE_TAB } from '@/enums';
import { ParamsType, TableOptionsValue } from '@/type';
import {
  setFormDataFunc,
  marginTableLabels,
  setTableLabels,
  getAccreditationProps,
  getTemplateDownloadProps
} from '@/views/accreditation/_common/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare, deepClone, drivingSchool } from '@/assets/js/common';
import download from '@/assets/js/download';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '考场受理';
@Component
export default class AccreditationExamAcceptanceList extends mixins(accreditationSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins, accreditationOperationLogMixins) {
  @Action('license/queryExamAcceptList') private queryExamAcceptList!: (data: any) => any;

  @Action('license/examAcceptExport') private examAcceptExport!: (data: any) => any;

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
          options: [
            {
              id: 3,
              label: '操作日期',
            },
            {
              id: 2,
              label: '受理日期',
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
      {
        key: 'deletedFlag',
        value: 0, // 0：正常，1已删除
        label: '看已删除数据',
      },
    ]
  };

  /**
   * @description 初始化列表搜索项
   */
  private initSearch() {
    // 合并混入的公共搜索项，和本地的搜索项
    const { searchForm, localSearchForm } = this;
    // localSearchForm.selectTimeList[0].select.options = drivingSchool(drivingSchoolId) === 'huizhou' ? huizhouSearchDateOptions : searchDateOptions;
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
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
        id: 13,
        label: '编辑',
        path: 'btn_edit',
      },
      {
        id: 12,
        label: '删除',
        path: 'btn_delete',
        type: 'danger',
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
    const { tableLabelType, deletedLabels } = this;
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { deletedFlag } = _data;
    let _originalLabelList: any = marginTableLabels(tableLabelType);
    if (deletedFlag === 1) {
      _originalLabelList = [..._originalLabelList, ...deletedLabels];
    }
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(_originalLabelList, tableLabelType);
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  // 导入办证数据结果弹出框是否可见
  certificateResult = '';

  // 返回的导入办证结果
  importData: any = {};

  // 弹出框类型
  dialogName = '';

  // 导入办证数据配置
  private importProps: any = {};

  // tab list
  private tabList = ACCEPTANCE_TAB;

  // 当前tab
  private activeTab = 1;

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** tab 选中回调 */
  @Watch('activeTab')
  async checkTab() {
    const { activeTab } = this;
    this.querFirstPageList();
    const { drivingSchoolId } = this.userInfo;
    const _typeDta: ParamsType = drivingSchool(drivingSchoolId) === 'huizhou'
      ? {
        1: 'HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE',
        2: 'HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE',
      } : {
        1: 'EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE',
        2: 'EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE',
      };
    this.tableLabelType = _typeDta[activeTab];
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
    this.queryList();
  }

  editData: any = {};

  /** 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const { id } = val;
    if ([1, 2, 11, 13].includes(id)) {
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
    if (id === 12) {
      // 删除
      if (_len >= 1) {
        this.deleteFlowHandle(selectionList);
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
    if (id === 13) {
      // 编辑
      if (_len === 1) {
        this.dialogName = 'edit';
        const {
          userName, idNo, recordId, acceptDate, acceptFailReason, acceptRemark
        } = selectionList[0];
        const { activeTab } = this;
        this.importProps.tabType = activeTab;
        if (this.activeTab === 1) {
          this.editData = {
            userName,
            idNo,
            id: recordId,
            applyDate: acceptDate,
            remark: acceptRemark,
            code: 2,
          };
        } else {
          this.editData = {
            userName,
            idNo,
            id: recordId,
            applyDate: acceptDate,
            reason: acceptFailReason,
            remark: acceptRemark,
            code: 2,
          };
        }
        return;
      }
      if (_len < 1) {
        this.$message.warning('请先勾学员！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
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
    const { searchForm, tabList, activeTab } = this;
    const _data = drawSearchForm(searchForm);
    const { batchNos, } = _data;
    const acceptStatus = tabList.filter(a => a.id === activeTab)[0]?.label;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      acceptStatus,
    };
    const body = await this.examAcceptExport(sendData);
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

  // 编辑确定回调
  async editCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.dialogName = '';
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

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    this.tableData.loading = true;
    const {
      searchForm, paginationData, activeTab, tabList
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { batchNos, beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const acceptStatus = tabList.filter(a => a.id === activeTab)[0]?.label;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      acceptStatus,
    };
    try {
      const body = await this.queryExamAcceptList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
    this.initSetTableLabel();
  }

  /** @description 删除 */
  deleteFlowHandle(selectList: any) {
    this.$prompt('请输入删除原因', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[^ \x22]+/,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(val.length < 1 || val.length > 200);
      },
      inputErrorMessage: '输入内容长度为1-200,不能全输入空格',
      inputPlaceholder: '输入内容长度为1-200',
      inputType: 'textarea',
    })
      .then(async (val: any) => {
        const _data: any = [];
        selectList.forEach((item: any) => {
          const _item = item;
          _data.push({
            recordId: _item.recordId,
            idNo: _item.idNo,
          });
        });
        const sendData = {
          code: 2,
          flowData: _data,
          deleteReason: val.value.trim(),
        };
        await this.deleteFlowData(sendData)
          .then(() => {
            this.$message.success('删除成功！');
            this.querFirstPageList();
          })
          .catch(() => {
            //
          });
      })
      .catch((error: any) => {
        this.$message.info('已取消删除');
      });
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
    this.tableLabelType = drivingSchool(drivingSchoolId) === 'huizhou' ? 'HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE' : 'EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE';
    this.initSearch();
    this.initSetTableLabel();
    this.queryList();
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
