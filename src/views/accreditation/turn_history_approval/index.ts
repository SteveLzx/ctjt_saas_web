import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  ParamsType, TableOptionsValue, VueComponentParent, StaticDataType
} from '@/type';
import {
  setFormDataFunc, marginTableLabels, setTableLabels,
} from '@/views/accreditation/_common/common';
import { deepClone, timestampSizeCompare } from '@/assets/js/common';
import { TURN_HISTORY_REASON, VERIFY_STRTUS, STUDY_STAGE } from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';

const tableOptionList = [
  {
    id: 1,
    label: '新增',
    type: 'primary',
    path: 'btn_add',
  },
  {
    id: 2,
    label: '通过',
    type: 'success',
    path: 'btn_pass',
  },
  {
    id: 3,
    label: '驳回',
    type: 'danger',
    path: 'btn_reject',
  },
  {
    id: 4,
    label: '撤回',
    type: 'warning',
    path: 'btn_revoke',
  },
  {
    id: 6,
    label: '重新编辑',
    type: 'primary',
    path: 'btn_revoke',
  },
  {
    id: 5,
    label: '导出',
    path: 'btn_export',
  },
];
const name = '转历史审批';

@Component({
  filters: {
    auditStatusFilter: (val: number) => {
      if (val === undefined || val === null) return '';
      const list = VERIFY_STRTUS.filter(item => item.id === val);
      return list[0] ? list[0].label : '';
    },
    learnDrivingScheduleFilter: (val: number) => {
      if (val === undefined || val === null) return '';
      const list = STUDY_STAGE.filter(item => item.id === val);
      return list[0] ? list[0].label : '';
    }
  }
})
export default class AccreditationTurnHistoryApproval extends mixins(ctjtAreaStoreSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('order/queryOrderInfoByNameOrIdNo') private queryOrderInfoByNameOrIdNo!: (data: any) => any;

  @Action('license/queryTurnHistoryList') private queryTurnHistoryList!: (data: any) => any;

  @Action('license/exportTurnHistoryList') private exportTurnHistoryList!: (data: any) => any;

  @Action('license/queryTurnHistoryListCount') private queryTurnHistoryListCount!: (data: any) => any;

  @Action('license/queryAddTurnHistory') private queryAddTurnHistory!: (data: any) => any;

  @Action('license/queryPassApprove') private queryPassApprove!: (data: any) => any;

  @Action('license/queryUndoApprove') private queryUndoApprove!: (data: any) => any;

  @Action('license/queryNoPassApprove') private queryNoPassApprove!: (data: any) => any;

  @Action('license/queryTurnHistoryDetail') private queryTurnHistoryDetail!: (data: any) => any;

  // 列表搜索项配置
  private localSearchForm: ParamsType = {
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
        label: '申请单号',
        key: 'seq',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入申请单号',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '审核状态',
        key: 'auditStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: VERIFY_STRTUS,
      },
    ],
    checkedList: [],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、证件号、手机号',
        maxlength: 60,
        clearable: true,
        options: [],
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
      }
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

  /**
   * @description 列表搜索 操作按钮回调
   */
  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
    }
  }

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
  async tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    if (id === 1) {
      // 新增办证信息撤销
      this.drawer = true;
      return;
    }
    if ([2, 3, 4].includes(id)) {
      if (_len === 0 || _len > 1) {
        this.$message.warning('请选择1个状态为审核中的单据');
        return;
      }
      const isNotUnderReview = selectionList.filter((a: any) => a.auditStatus !== VERIFY_STRTUS[0].id).length > 0;
      if (isNotUnderReview) {
        this.$message.warning('请勾选状态为审核中的单据');
      } else {
        const { approveId } = selectionList[0];
        // 通过
        if (id === 2) {
          this._passFun(selectionList);
        }
        if (id === 3) {
        // 驳回
          this.rejectShow = true;
          this.rejectId = approveId;
        }
        if (id === 4) {
        // 撤回
          this._cncelFunc(selectionList);
        }
      }
    }
    if (id === 6) {
      // 重新编辑
      if (_len === 0 || _len > 1) {
        this.$message.warning('请选择1个状态为已撤回的单据');
        return;
      }
      const isNotUnderReview = selectionList.filter((a: any) => a.auditStatus !== VERIFY_STRTUS[3].id).length > 0;
      if (isNotUnderReview) {
        this.$message.warning('请选择1个状态为已撤回的单据');
      } else {
        const { approveId } = selectionList[0];
        const body = await this.queryTurnHistoryDetail({ approveId });
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = body[key];
          if (key === 'isAppears') {
            this.formData[key] = body.balance > 0 ? '是' : '否';
          }
        });
        this.formData.approveId = approveId;
        this.drawer = true;
      }
    }
    if (id === 5) {
      // 导出
      this._exportData();
    }
  }

  rejectShow = false;

  rejectId = ''

  rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { rejectId } = this;
    const sendData = { id: rejectId, verifyOpinion: remark, verifyNode: data.verifyNode };
    this.queryNoPassApprove(sendData).then(() => {
      this.$message.success('驳回成功！');
      this.paginationData.current = 1;
      this.queryList();
      this.rejectShow = false;
      this.rejectId = '';
    });
  }

  /** 导出所有数据 */
  async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData = { isExport: 1, ..._data };
    const body = await this.exportTurnHistoryList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${dayjs(new Date()).format('YYYYMMDD')}`);
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

  // 弹窗名称
  dialogName = '';

  // 抽屉弹窗
  drawer = false;

  // 抽屉弹窗表单
  deepFormData: ParamsType = {
    orderId: '', // 订单id
    idNo: '',
    userName: '',
    registerTime: '', // 报名日期
    learnDrivingSchedule: '', // 学车进度
    mobile: '', // 联系电话
    acceptNumber: '', // 受理号
    classesName: '', // 班别
    salePrice: '', // 订单金额
    balance: '', // 待收金额
    isAppears: '', // 是否欠费
    reason: '', // 原因
    remark: '', // 备注
    approveId: '', // 审批id
  }

  formData = deepClone(this.deepFormData)

  // 新增转门店申请表单验证
  private formDataRules = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    userName: [
      { required: true, message: '找不到学员', trigger: ['change', 'blur'] }
    ],
    registerTime: [
      { required: true, message: '找不到报名日期', trigger: ['change', 'blur'] }
    ],
    learnDrivingSchedule: [
      { required: true, message: '找不到学车进度', trigger: ['change', 'blur'] }
    ],
    mobile: [
      { required: true, message: '找不到联系电话', trigger: ['change', 'blur'] }
    ],
    acceptNumber: [
      { required: true, message: '找不到受理号', trigger: ['change', 'blur'] }
    ],
    classesName: [
      { required: true, message: '找不到班别', trigger: ['change', 'blur'] }
    ],
    salePrice: [
      { required: true, message: '找不到订单金额', trigger: ['change', 'blur'] }
    ],
    balance: [
      { required: true, message: '找不到代收金额', trigger: ['change', 'blur'] }
    ],
    isAppears: [
      { required: true, message: '找不到欠费信息', trigger: ['change', 'blur'] }
    ],
    reason: [
      { required: true, message: '请选择原因', trigger: ['change', 'blur'] }
    ]
  }

  // 转入历史原因list
  turnHistoryReasonList = TURN_HISTORY_REASON;

  // 身份证搜索下拉配置项
  idNoOption = {
    options: [],
    loading: false,
  };

  /**
   * @description 根据证件模糊搜索，查询可退节点信息以及学员基础信息
   */
  async queryIdNoSearch(val: any) {
    this.idNoOption.loading = true;
    if (val.length >= 2) {
      const body = await this.queryOrderInfoByNameOrIdNo({ keyword: val });
      this.idNoOption.options = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数，根据证件号查询出来的信息绑定文本框
  */
  formDataSelectCallback(val: any) {
    const { options } = this.idNoOption;
    // 设置根据证件号拿到的用户信息
    const _item: any = options.filter((i: any) => i.idNo === val);
    this.idNoOption.options = [];
    const data = _item[0] ? _item[0] : {};
    Object.keys(data).forEach((key) => {
      const _value = data[key];
      if (key === 'learnDrivingSchedule') {
        this.formData[key] = this.learnDrivingSchedule(_value);
      } else if (key === 'balance') {
        this.formData.isAppears = this.isQianfei(_value);
        this.formData[key] = _value;
      } else if (key === 'registerTime') {
        this.formData[key] = _value ? this.$dayjs(_value).format('YYYY-MM-DD HH:mm:ss') : '';
      } else {
        this.formData[key] = _value;
      }
    });
  }

  /** 下拉搜索框change */
  idNoChange(item: any) {
    this.idNoOption.options = []; // 清空历史记录
  }

  isQianfei(val: number) {
    return val === undefined || val === 0 ? '否' : '是';
  }

  learnDrivingSchedule(val: number) {
    if (val === undefined || val === null) return '';
    const list = STUDY_STAGE.filter(item => item.id === val);
    return list[0] ? list[0].label : '';
  }

  submitLoading = false;

  /** 新增转历史 */
  addTurnHistory() {
    (this.$refs.drawerForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const {
            idNo, orderId, reason, remark, approveId
          } = this.formData;
          const sendData = {
            idNo, orderId, reason, remark
          };
          if (approveId) {
            this.$message.success('编辑转历史成功！');
          } else {
            this.queryAddTurnHistory(sendData).then(() => {
              this.paginationData.current = 1;
              this.$message.success('新增转历史成功！');
              this.queryList();
              this.closeDrawer();
            });
          }
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /**
   * @description 新增转历史 关闭抽屉，清空数据
   */
  closeDrawer() {
    this.formData = deepClone(this.deepFormData);
    (this.$refs.drawerForm as VueComponentParent).resetFields();
    this.drawer = false;
  }

  // 抽屉详情弹出框
  drawerDeatil = false;

  // 抽屉弹窗详情表单
  detailFormData = {};

  // 抽屉详情审批详情表格配置
  approveTablelabels = [
    {
      key: 'verifyNode',
      label: '审批环节',
      minWidth: 170,
    },
    {
      key: 'createdName',
      label: '审核人',
      minWidth: 80,
    },
    {
      key: 'verifyOperation',
      label: '审核操作',
      minWidth: 80,
    },
    {
      key: 'verifyOpinion',
      label: '审核意见',
      minWidth: 80,
    },
    {
      key: 'updatedTime',
      label: '申请/审核时间',
      minWidth: 170
    },
  ];

  /** 获取详情信息 */
  async jumpDetail(val: ParamsType) {
    const { approveId } = val;
    const body = await this.queryTurnHistoryDetail({ approveId });
    this.detailFormData = body;
    this.drawerDeatil = true;
  }

  /**
  * @description 关闭详情抽屉，清空数据
  */
  closeDetailDrawer() {
    this.drawerDeatil = false;
    (this.$refs.drawerDetailForm as VueComponentParent).clearValidate();
  }

  /** @description 通过 */
  private _passFun(selectionList: any) {
    this.$prompt('请输入通过理由', '通过', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[^ \x22]+/,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(val.length > 200);
      },
      inputErrorMessage: '输入内容长度为0-200,不能全输入空格',
      inputPlaceholder: '输入内容长度为0-200',
      inputType: 'textarea'
    }).then(async (val: any) => {
      const { approveId, auditStatus } = selectionList[0];
      const sendData = {
        id: approveId,
        auditStatus,
        verifyOpinion: val.value.trim() ? val.value.trim() : '同意'
      };
      await this.queryPassApprove(sendData);
      this.$message.success('审核通过！');
      this.paginationData.current = 1;
      this.queryList();
    });
  }

  /**
   * @description 撤回
   */
  private _cncelFunc(selectionList: any) {
    this.$confirm('确定撤回申请?', '撤回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const { approveId } = selectionList[0];
      const sendData = {
        id: approveId
      };
      await this.queryUndoApprove(sendData);
      this.$message.success('撤回成功');
      this.paginationData.current = 1;
      this.queryList();
    });
  }

  // 底部统计
  private statisticsData: StaticDataType[] = [];

  async queryStatics(data: any) {
    const body = await this.queryTurnHistoryListCount(data);
    const deepBody = deepClone(body);
    deepBody.forEach((item: any) => {
      const _item = item;
      _item.value = item.num;
      if (item.auditStatus === 0) _item.label = '审核中';
      if (item.auditStatus === 1) _item.label = '已通过';
      if (item.auditStatus === 2) _item.label = '已驳回';
      if (item.auditStatus === 3) _item.label = '已撤回';
    });
    this.statisticsData = deepBody;
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
    this.tableData.loading = true;
    this.queryTurnHistoryList(sendData).then((res: any) => {
      const {
        data = [], current, total
      } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.queryStatics(sendData);
    }).finally(() => {
      this.tableData.loading = false;
    });
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    this.tableLabelType = 'TURN_HISTORY_APPROVAL_LIST';
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
