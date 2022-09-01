import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import {
  CARMODEL_LIST,
  TRANSFER_ACCOUNT,
} from '@/enums';
import {
  ParamsType,
  VueComponentParent,
  TableOptionsValue,
  StaticDataType,
} from '@/type';
import { REG_TWO_FLOAT_NUMBER, deepClone, timestampSizeCompare } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  setFormDataFunc,
  marginTableLabels,
  setTableLabels,
  getAccreditationProps,
  getTemplateDownloadProps,
} from '@/views/accreditation/_common/common';
import download from '@/assets/js/download';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '监管学时';
@Component({
  filters: {
    transferSubjectsFilter(val: number) {
      const list = TRANSFER_ACCOUNT.filter(a => a.id === val);
      return list[0] ? list[0].label : '';
    },
  }
})
export default class AccreditationSupervisionHours extends mixins(accreditationSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins, accreditationOperationLogMixins) {
  @Action('license/querySupervisePeriodList') private querySupervisePeriodList!: (data: any) => any;

  @Action('license/postPeriodUpdate') private postPeriodUpdate!: (data: any) => any;

  // 本地搜索项
  public searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 7,
          width: 110,
          options: [
            {
              id: 7,
              label: '考试日期',
            },
            {
              id: 5,
              label: '学时更新日期',
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
        label: '片区门店',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '',
        key: 'storeId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '车型',
        key: 'carModel',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: CARMODEL_LIST
      },
      {
        label: '班别',
        key: 'classesName',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
        customOptions: {
          value: 'label',
          label: 'label'
        }
      },
      {
        label: '划拨科目',
        key: 'transferSubjects',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: TRANSFER_ACCOUNT,
      },
      {
        label: '学时考核',
        key: 'periodAssess',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [
          { label: '未完成', id: '未完成' },
          { label: '已完成', id: '已完成' },
        ],
      },
    ],
    inputList: [
    ],
    checkedList: [
      {
        key: 'isArrears',
        value: '',
        label: '只看有欠费',
      },
    ],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、手机号码、证件号、订单号、受理号',
        width: 320,
        maxlength: 60,
        clearable: true,
        options: [],
      },
    ],
  }

  /** 表格配置 */
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name
  };

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '导入学时',
        path: 'btn_drxs',
      },
      {
        id: 3,
        label: '录入学时更新',
        type: 'primary',
        path: 'btn_lrxsgx',
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
    const _currentLabelList = setTableLabels(_originalLabelList, tableLabelType);
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  private submitLoading = false;

  // 导入办证数据结果弹出框是否可见
  certificateResult = '';

  // 返回的导入办证结果
  importData: any = {};

  // 弹出框类型
  dialogName = '';

  /** singleForm 验证 */
  private singleFormRules = {
    periodMachine: [
      {
        required: true,
        message: '请输入模拟机学时',
        trigger: 'blur',
      },
      { pattern: REG_TWO_FLOAT_NUMBER, message: '请输入最多保留两位小数的数值' }
    ],
    periodCar: [
      {
        required: true,
        message: '请输入真车学时',
        trigger: 'blur',
      },
      { pattern: REG_TWO_FLOAT_NUMBER, message: '请输入最多保留两位小数的数值' }
    ],
    periodAssess: [
      {
        required: true,
        message: '请选择学时考核',
        trigger: 'change',
      }
    ],
  };

  @Watch('userBaseInfoData.periodAssess', { deep: true, immediate: true })
  private watchUserBaseInfoDataPeriodAssess(value: string) {
    this.singleFormRules.periodMachine[0].required = value !== '已完成';
    this.singleFormRules.periodCar[0].required = value !== '已完成';
  }

  // 学员详情数据
  userBaseInfoData: ParamsType = {
    superviseId: 0, // 监管id
    id: '', // id
    userName: '', // 姓名
    idNo: '', // 证件号码
    classesName: '', // 班别
    carModel: '', // 车型
    learnType: '', // 学车类型
    balance: null, // 欠费金额
    acceptNumber: '', // 受理号/ 受理状态
    transferSubjects: '', // 划拨科目
    // periodTheory: '', // 理论学时 暂时无需更新理论学时
    periodMachine: '', // 模拟机学时
    periodCar: '', // 真车学时
    periodAssess: '', // 学时考核
  };

  // 导入办证数据类型选择弹出框
  selectDialogVisible = false;

  // 导入办证数据类型选择
  accreTypeData = [
    {
      id: 2,
      label: '划拨科目二',
      hours: {
        theory: 0,
        simulator: 6,
        realCar: 12,
      },
    },
    {
      id: 3,
      label: '划拨科目三',
      hours: {
        theory: 0,
        simulator: 6,
        realCar: 12,
      },
    },
  ];

  // 办证数据配置
  private importProps = {};

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** @description 列表搜索 操作按钮回调 */
  searchTableCallBack(key: string) {
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
    this.searchForm.selectTimeList[0].select.value = 7;
    this.searchSelectChange({ key: 'regionId', value: null });
    this.queryList();
  }

  /** @description 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const { id } = val;
    if (id === 1) {
      // 导入办证数据
      this.importProps = getAccreditationProps(name);
      this.dialogName = 'import';
      return;
    }
    if (id === 9) {
      // 数据模板下载
      download(getTemplateDownloadProps(name));
      return;
    }
    // 导出
    if (id === 10) {
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
        this.recordExportCount(selectionList.length, name);
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
    // 学时更新
    if (id === 3) {
      if (_len === 1) {
        this.dialogName = 'singleForm';
        this.jumpDetail(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请先勾学员！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
  }

  /** @description singleForm弹出框按钮回调 */
  singleInfoButtonCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.submitSingleForm(data);
      }
    } else {
      this.dialogName = '';
      this._resetSingForm();
    }
  }

  // 清空singleForm
  _resetSingForm() {
    (this.$refs.singleFormDialog as VueComponentParent).resetFields();
  }

  /** @description 上传excel后返回回调 */
  importResultCallback(val: any) {
    this.dialogName = '';
    this.certificateResult = 'import';
    this.importData = val;
    this.querFirstPageList();
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
    * @description 列表单项点击绑定详情数据
    */
  private jumpDetail(val: ParamsType) {
    this.userBaseInfoData = setFormDataFunc(val, this.userBaseInfoData);
  }

  /** 下面是从api获取、发送数据的方法 */

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
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.querySupervisePeriodList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data || [];
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  /** @description 提交单选更新 */
  submitSingleForm(updateData: ParamsType) {
    const sendData = { ...updateData };
    this.postPeriodUpdate(sendData).then(() => {
      this.querFirstPageList();
      this.$message.success('学时更新成功');
      this._resetSingForm();
    }).finally(() => {
      this.dialogName = '';
      this._resetSingForm();
    });
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = 'SUPERVISION_HOURS_LIST_LABEL';
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
