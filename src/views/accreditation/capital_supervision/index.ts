import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import {
  CAPITAL_ACCOUNT, CARMODEL_LIST,
} from '@/enums';
import {
  ParamsType,
  TableOptionsValue,
  VueComponentParent,
  StaticDataType,
} from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare, formatPrice } from '@/assets/js/common';
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

const name = '资金监管存入';
@Component
export default class AccreditationCapitalSupervision extends mixins(
  accreditationSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins
) {
  @Action('license/querySupervises') private querySupervises!: (data: any) => any;

  @Action('license/postSupervisesExportExcel') private postSupervisesExportExcel!: (data: any) => any;

  @Action('license/postSupervisesTransferCode') private postSupervisesTransferCode!: (data: any) => any;

  @Action('license/delSupervisesTransferCode') private delSupervisesTransferCode!: (data: any) => any;

  @Action('license/queryOpLogPageByType') private queryOpLogPageByType!: (data: any) => any;

  // 显示操作日志
  private showlog = false;

  private logtableData = []

  // 日志分页
  private logPaginationData = {
    current: 1,
    pageSize: 10,
    total: 0,
  }

  private logTableCurrentChange(val: number) {
    this.logPaginationData.current = val;
    this.getLog();
  }

  private logTableSizeChange(val: number) {
    this.logPaginationData.pageSize = val;
    this.logPaginationData.current = 1;
    this.getLog();
  }

  /** 列表搜索配置 */
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
              label: '报名日期',
            },
            {
              id: 9,
              label: '监管日期',
            },
            {
              id: 11,
              label: '录入日期',
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
        label: '资金科目',
        key: 'step',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: CAPITAL_ACCOUNT,
      },
      {
        label: '录入状态',
        key: 'superviseStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [
          { label: '待录入', id: 1 },
          { label: '已录入', id: 2 },
        ],
      },
      {
        label: '存入状态',
        key: 'depositStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [
          { label: '待存入', id: 1 },
          { label: '已存入', id: 2 },
        ],
      },
    ],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、手机号码、证件号',
        width: 320,
        maxlength: 60,
        clearable: true,
        options: [],
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
      {
        key: 'isArrears',
        value: '',
        label: '只看有欠费',
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
  };

  /** 表格配置 */
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '导入转账码',
        icon: '',
        path: 'btn_drzzm'
      },
      {
        id: 2,
        label: '补录转账码',
        type: 'primary',
        path: 'btn_blzzm'
      },
      {
        id: 3,
        label: '录入转账码',
        type: 'primary',
        path: 'btn_lrzzm'
      },
      {
        id: 4,
        label: '导出银行存入表',
        type: 'warning',
        path: 'btn_dcyhcrb'
      },
      {
        id: 5,
        label: '删除转账码',
        type: 'danger',
        path: 'btn_sczzm'
      },
      {
        id: 9,
        label: '数据模板下载',
        path: 'btn_sjmbxz'
      },
    ],
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

  /**
   * @description 跳转到里订单详情
   */
  private jumpOrderDetail(val: string): void {
    this.$router.push({ path: '/market/order/enrollment/detail', query: { id: val, edit: '1' } });
  }

  // 办证数据配置
  private importProps = {};

  // 导入办证数据结果弹出框是否可见
  certificateResult = '';

  // 返回的导入办证结果
  importData: any = {};

  // 弹出框类型
  dialogName = '';

  /** singleForm 验证 */
  private singleFormRules = {
    superviseDate: [
      {
        required: true,
        message: '请选择监管日期',
        trigger: 'change',
      },
    ],
    transferCode: [
      {
        required: true,
        message: '请输入转账码',
        trigger: 'blur',
      },
      {
        max: 50,
        message: '长度在50个字以内',
        trigger: 'change'
      }
    ],
  };

  // 学员详情数据
  userBaseInfoData: ParamsType = {
    batchNo: '', // 批次号
    userName: '', // 姓名
    idNo: '', // 证件号码
    classesName: '', // 班别
    carModel: '', // 车型
    learnType: '', // 学车类型
    balance: null, // 欠费金额
    acceptNumber: '', // 受理号/ 受理状态
    step: null, // 资金科目
    superviseAmount: null, // 监管金额
    payType: '', // 付款方式
    superviseDate: this.$dayjs(new Date()).format('YYYY-MM-DD'), // 监管日期
    superviseId: '', // 监管id
    transferCode: '', // 转账码
    orderId: '', // 订单id
  };

  private statisticsData: StaticDataType[] = [];

  /** @description 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** @description 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this._resetSearchFunc();
    }
    if (key === 'log') {
      this.getLog();
      this.showlog = true;
    }
  }

  /** 重置列表搜索回调 */
  private _resetSearchFunc() {
    this.searchSelectChange({ key: 'regionId', value: null });
    this.queryList();
  }

  bankOpts = [
    { label: '民生银行', value: 1 },
    { label: '交通银行', value: 2 }
  ]

  showBanck = false

  bankType = 1;

  handleBanckClose() {
    this.showBanck = false;
  }

  handleBanckSubmit() {
    this.exportExcelFunc();
    this.handleBanckClose();
  }

  /** @description 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    const { id } = val;
    if ([1, 2].includes(id)) {
      this.setImportProps();
    }
    if (id === 1) {
      // 导入办证数据
      this.dialogName = 'import';
    }
    if (id === 2) {
      // 补录办证数据
      this.dialogName = 'supplement';
    }
    // 录入转账码
    if (id === 3) {
      if (_len === 1) {
        this.jumpDetail(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请先勾学员！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 4) {
      this.showBanck = true;
    }
    if (id === 5) {
      if (_len === 0) {
        this.$message.warning('请先勾学员！');
      } else {
        this.deleteCodeFunc(selectionList);
      }
    }
    if (id === 9) {
      // 数据模板下载
      download(getTemplateDownloadProps(name));
    }
  }

  /**
     * @description 导出银行存入表
     */
  private async exportExcelFunc() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const { batchNos } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      bankType: this.bankType
    };
    const body = await this.postSupervisesExportExcel(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `深圳广仁-${this.bankType === 1 ? '民生银行' : '交通银行'}资金监管存入表${this.$dayjs(new Date()).format('YYYY-MM-DD')}`);
    this.bankType = 1;
  }

  /**
     * @description 删除转账码
     */
  private deleteCodeFunc(val: any) {
    const _list: Array<any> = [];
    val.forEach((item: any) => {
      const { superviseStatus } = item;
      if (superviseStatus === 2) {
        const { superviseId, transferCode } = item;
        _list.push({ superviseId, transferCode });
      }
    });
    if (_list.length > 0) {
      this.$confirm('确定删除转账码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const sendData = _list;
        await this.delSupervisesTransferCode(sendData);
        this.$message.success('删除成功！');
        this.querFirstPageList();
      });
    } else {
      this.$message.warning('请勾选已录入转账码的数据！');
    }
  }

  // singleForm弹出框按钮回调
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

  // 清空singleForm
  _resetSingForm() {
    (this.$refs.singleFormDialog as VueComponentParent).resetFields();
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
    // 判断是否已经有转账码
    const { transferCode } = val;
    if (transferCode) {
      this.$message.warning('当前项已有转账码，请重新选择！');
      return;
    }
    this.userBaseInfoData = setFormDataFunc(val, this.userBaseInfoData);
    this.userBaseInfoData.step = val.step;
    this.userBaseInfoData.superviseDate = this.$dayjs(new Date()).format('YYYY-MM-DD');
    this.dialogName = 'singleForm';
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
      const body = await this.querySupervises(sendData);
      const { pageData } = body;
      this.tableData.list = pageData.data;
      this.paginationData.current = pageData.current;
      this.paginationData.total = pageData.total;
      this.tableData.loading = false;
      this.queryStatics(body);
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  /** @description 统计数据 */
  private queryStatics(val: any) {
    const { alreadyEntryCount, forEntryCount, superviseAmount } = val;
    this.statisticsData = [
      {
        label: '待录入',
        value: forEntryCount,
      },
      {
        label: '已录入',
        value: alreadyEntryCount,
      },
      {
        label: '监管金额总额',
        value: formatPrice(superviseAmount),
      },
    ];
  }

  /** 提交单选更新 */
  submitSingleForm(updateData: ParamsType) {
    const { superviseDate } = updateData;
    const { drivingSchoolId } = this.userInfo;
    this.postSupervisesTransferCode({
      ...updateData,
      superviseDate: this.$dayjs(superviseDate).format('YYYY-MM-DD'),
      drivingSchoolId,
    }).then(() => {
      this._resetSingForm();
      this.querFirstPageList();
      this.dialogName = '';
      this.$message.success('录入成功');
    }).catch(() => {
      (this.$refs.singleFormDialog as VueComponentParent).submitLoading = false;
    });
  }

  /** 设置办证数据-导入办证api */
  setImportProps() {
    const props: any = getAccreditationProps(name);
    const { uploadPath } = props;
    const { drivingSchoolId } = this.userInfo;
    const _uploadPath = `${uploadPath}?drivingSchoolId=${drivingSchoolId}`;
    this.importProps = { ...props, uploadPath: _uploadPath };
  }

  /**
     * @description 查询操作日志
     */
  async getLog() {
    const sendData = {
      current: this.logPaginationData.current,
      pageSize: this.logPaginationData.pageSize,
      type: '资金监管存入'
    };
    const body = await this.queryOpLogPageByType(sendData);
    const {
      data,
      total,
      current
    } = body;
    this.logtableData = data;
    this.logPaginationData.current = current;
    this.logPaginationData.total = total;
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = 'CAPITAL_SUPERVERION_LIST_LABEL';
    this.initSetTableLabel();
    this.queryList();
  }

  perm={};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
