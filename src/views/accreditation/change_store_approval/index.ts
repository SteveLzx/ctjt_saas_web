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
import {
  DATATRANSFER_STATUS, STUDENT_CATEGORY, STUDY_STAGE, VERIFY_STRTUS
} from '@/enums';
import { API_ORDER_V1_APPROVECHANGESTORE_EXPORTCHANGESTOREAPPROVE } from '@/api';
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
    id: 5,
    label: '导出',
    path: 'btn_export',
  },
];
const name = '转门店审批';

@Component({
  filters: {
    auditStatusFilter: (val: number) => {
      if (val === undefined || val === null) return '';
      const list = VERIFY_STRTUS.filter(item => item.id === val);
      return list[0] ? list[0].label : '';
    },
    dataTransferFilter: (val: number) => {
      if (val === undefined || val === null) return '';
      const list = DATATRANSFER_STATUS.filter(item => item.id === val);
      return list[0] ? list[0].label : '';
    },
    studentCategoryFilter: (val: number) => {
      if (val === undefined || val === null) return '';
      const list = STUDENT_CATEGORY.filter(item => item.id === val);
      return list[0] ? list[0].label : '';
    },
  }
})
export default class AccreditationChangeStoreApproval extends mixins(ctjtAreaStoreSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('order/queryChangeStoreApproveList') private queryChangeStoreApproveList!: (data: any) => any;

  @Action('order/queryChangeStoreApproveCount') private queryChangeStoreApproveCount!: (data: any) => any;

  @Action('order/queryChangeStoreApproveDetail') private queryChangeStoreApproveDetail!: (data: any) => any;

  @Action('order/addApproveChangeStore') private addApproveChangeStore!: (data: any) => any;

  @Action('order/passApproveChangeStore') private passApproveChangeStore!: (data: any) => any;

  @Action('order/rejectApproveChangeStore') private rejectApproveChangeStore!: (data: any) => any;

  @Action('order/cancelApproveChangeStore') private cancelApproveChangeStore!: (data: any) => any;

  @Action('order/queryOrderInfoByNameOrIdNo') private queryOrderInfoByNameOrIdNo!: (data: any) => any;

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
    checkedList: [
      {
        key: 'isMe',
        value: true,
        label: '只看我审批',
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
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (id === 1) {
      // 新增办证信息撤销
      this.drawer = true;
      this.queryRegion();
    }
    if (id === 2 || id === 3 || id === 4) {
      if (_len >= 1) {
        // 只能操作审核中的数据
        const _list = selectionList.filter((item: any) => item.auditStatus === 0);
        if (_list.length !== _len) {
          this.$message.warning('只能操作审核中的数据');
          return;
        }
        if (id === 2) {
          this._passFunc(selectionList);
        }
        if (id === 3) {
          // 审核中的可操作驳回, 不允许批量操作
          if (_len === 1) {
            this._rejectFunc(selectionList[0]);
          } else {
            this.$message.warning('驳回不允许批量操作');
          }
        }
        if (id === 4) {
          this._cncelFunc(selectionList);
        }
      } else {
        this.$message.warning('请勾选需要操作的数据');
      }
    }
    if (id === 5) {
      // 导出
      this._exportData(selectionList);
    }
  }

  /** 导出所有数据 */
  private async _exportData(selectionList: any) {
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.approveId);
    });
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const { regionId, storeId } = _data;
    _data.queryRegionId = regionId;
    _data.queryStoreId = storeId;
    const sendData = { isExport: 1, ..._data, idList };
    const body = await this.$http.post(API_ORDER_V1_APPROVECHANGESTORE_EXPORTCHANGESTOREAPPROVE, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
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
  private dialogName = '';

  // 抽屉弹窗
  private drawer = false;

  // 抽屉弹窗表单
  private formData: ParamsType = {
    orderId: '', // 订单id
    idNo: '',
    userName: '',
    registerTime: '', // 报名日期
    learnDrivingSchedule: '', // 学车进度
    mobile: '', // 联系电话
    regionNameOld: '', // 原片区
    storeNameOld: '', // 原门店
    balance: '', // 是否欠费
    regionIdNew: '', // 转入片区
    regionNameNew: '', // 转入片区
    storeIdNew: '', // 转入门店
    storeNameNew: '', // 转入门店
    dataTransfer: null, // 资料移交方式
    studentCategory: '', // 学员类别
    changeReason: '', // 变更原因
    remark: '', // 备注
    transferInfo: [], // 转店资料
  }

  // 新增转门店申请表单验证
  private formDataRules = {
    idNo: [
      { required: true, message: '请输入证件号/姓名搜索学员', trigger: ['change', 'blur'] }
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
    regionNameOld: [
      { required: true, message: '找不到原片区', trigger: ['change', 'blur'] }
    ],
    storeNameOld: [
      { required: true, message: '找不到原门店', trigger: ['change', 'blur'] }
    ],
    balance: [
      { required: true, message: '找不到欠费信息', trigger: ['change', 'blur'] }
    ],
    regionIdNew: [
      { required: true, message: '请选择转入片区', trigger: ['change', 'blur'] }
    ],
    storeIdNew: [
      { required: true, message: '请选择转入门店', trigger: ['change', 'blur'] }
    ],
    dataTransfer: [
      { required: true, message: '请选择资料移交方式', trigger: ['change', 'blur'] }
    ],
    studentCategory: [
      { required: true, message: '请选择学员类别', trigger: ['change', 'blur'] }
    ]
  }

  // 学员类别
  private studentCategoryList = STUDENT_CATEGORY;

  // 资料移交方式
  private dataTransferList = DATATRANSFER_STATUS;

  private areaList = []; // 片区list

  /** 获取片区 */
  async queryRegion() {
    const { drivingSchoolId } = this.userInfo;
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId, isAuth: 0 });
    const _data = this.setFormSelectFunc(data);
    this.areaList = _data;
  }

  private storeList = []; // 门店list

  /** 片区选项值切换回调 */
  async hanldChangeRegion(val: any) {
    const _list: any = this.areaList.filter((item: any) => item.id === val);
    this.formData.regionNameNew = _list.length > 0 ? _list[0].label : '';
    if (val) {
      // 获取片区下面的门店
      const data = await this.queryGroupMechanismData({ pid: val, isAuth: 0 });
      const _data = this.setFormSelectFunc(data);
      this.storeList = _data;
    } else {
      this.storeList = [];
      this.formData.storeNameNew = '';
      this.formData.regionIdNew = '';
      this.formData.regionNameNew = '';
    }
  }

  /** 门店选项值切换回调 */
  async hanldChangeStore(val: any) {
    const _list: any = this.storeList.filter((item: any) => item.id === val);
    this.formData.storeNameNew = _list.length > 0 ? _list[0].label : '';
  }

  // 转店资料
  private transferInfoList = [{
    id: 1,
    label: '学习证'
  }, {
    id: 2,
    label: '三联单'
  }, {
    id: 3,
    label: 'IC卡'
  }, {
    id: 4,
    label: '路考档案'
  }, {
    id: 5,
    label: '科目一成绩单'
  }, {
    id: 6,
    label: '科目二成绩单'
  }];

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
      const body = await this.queryOrderInfoByNameOrIdNo({ keyword: val });
      this.idNoOption.options = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数，根据证件号查询出来的信息绑定文本框
  */
  private formDataSelectCallback(val: any) {
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
        this.formData[key] = this.isQianfei(_value);
      } else if (key === 'regionName') {
        this.formData.regionNameOld = _value;
      } else if (key === 'storeName') {
        this.formData.storeNameOld = _value;
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

  private submitLoading = false;

  /** 新增转门店 */
  private _addChangeStore() {
    (this.$refs.drawerForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const sendData = deepClone(this.formData);
          const delList = [
            'userName', 'idNo', 'registerDate', 'regionNameOld', 'storeNameOld', 'regionName', 'regionId',
            'storeName', 'storeId', 'mobile', 'balance', 'learnDrivingSchedule', 'registerTime'
          ];
          Object.keys(sendData).forEach(key => {
            if (delList.includes(key)) {
              delete sendData[key];
            }
          });
          const { transferInfo } = sendData;
          sendData.transferInfo = JSON.stringify(transferInfo);
          this.addApproveChangeStore(sendData).then(() => {
            this.tableCurrentChange(1);
            this.$message.success('新增成功');
            this.storeList = [];
          }).finally(() => {
            this.closeDrawer();
          });
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /**
   * @description 新增转门店 关闭抽屉，清空数据
   */
  private closeDrawer() {
    this.drawer = false;
    (this.$refs.drawerForm as VueComponentParent).resetFields();
  }

  // 抽屉详情弹出框
  private drawerDeatil = false;

  // 抽屉弹窗详情表单
  private detailFormData: ParamsType = {
    approveId: '',
    id: 0,
    nodeId: 0,
    taskId: '',
    auditStatus: null, // 审核状态 0 审核中 1通过，2驳回，3撤回
    seq: '', // 申请单号
    idNo: '',
    userName: '',
    registrationTime: '',
    learnDrivingSchedule: null,
    mobile: '',
    regionNameOld: '',
    storeNameOld: '',
    balance: 0,
    regionNameNew: '',
    storeNameNew: '',
    dataTransfer: null,
    studentCategory: '',
    changeReason: '', // 变更原因
    remark: '', // 备注
    transferInfo: [], // 转店资料
    isApprove: null, // 是否审核中
    approveResult: null, // 审核结果 1:通过，2：驳回
    verifyOpinion: '', // 驳回原因
    recordDoList: [], // 审批表格list
  };

  private isQianfei(val: number) {
    return val === undefined || val === 0 ? '否' : '是';
  }

  private learnDrivingSchedule(val: number) {
    if (val === undefined || val === null) return '';
    const list = STUDY_STAGE.filter(item => item.id === val);
    return list[0] ? list[0].label : '';
  }

  // 抽屉详情审批详情表格配置
  private approveTablelabels = [
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
      render(h: any, params: any) {
        const { verifyOpinion } = params.row;
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: verifyOpinion,
          },
          scopedSlots: {
            reference: () => h('p', verifyOpinion),
          },
        });
      }
    },
    {
      key: 'updatedTime',
      label: '申请/审核时间',
      minWidth: 170,
      render(h: any, params: any) {
        const { status, updatedTime } = params.row;
        const result = status === VERIFY_STRTUS[0].id;
        return h('div', result ? '' : updatedTime);
      }
    },
  ];

  // 审核结果验证规则
  private detailFormDataRules = {};

  private verifyOpinionDisabled = false;

  @Watch('detailFormData.approveResult', { deep: true, immediate: false })
  private approveResultChangeFun(val: any) {
    this.detailFormData.verifyOpinion = '';
    const passRules = {
      approveResult: [
        { required: true, message: '请选择审核结果', trigger: 'blur' }
      ],
    };
    const rejectRules = {
      ...passRules,
      verifyOpinion: [
        { required: true, message: '请选择驳回原因', trigger: 'blur' }
      ],
    };
    if (!val || val === 2) {
      this.verifyOpinionDisabled = false;
      this.detailFormDataRules = rejectRules;
      this.$nextTick(() => {
        (this.$refs.drawerDetailForm as VueComponentParent).clearValidate();
      });
    } else {
      this.verifyOpinionDisabled = true;
      this.detailFormDataRules = passRules;
    }
  }

  /** 获取详情信息 */
  async jumpDetail(val: ParamsType) {
    this.drawerDeatil = true;
    const sendData = { approveId: val };
    const body = await this.queryChangeStoreApproveDetail(sendData);
    this.detailFormData = setFormDataFunc(body, this.detailFormData);
    const { transferInfo } = this.detailFormData;
    this.detailFormData.transferInfo = transferInfo ? JSON.parse(transferInfo) : [];
    const { auditStatus } = body;
    if (auditStatus === 0) this.detailFormData.isApprove = true;
  }

  /** 详情更改审核状态 */
  submitStatus() {
    (this.$refs.drawerDetailForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const {
            approveId,
            verifyOpinion,
            approveResult,
          } = this.detailFormData;
          let data: any = {};
          if (approveResult === 1) {
            data = [
              {
                verifyOpinion: '同意',
                id: approveId
              }
            ];
          } else {
            data = {
              verifyOpinion: verifyOpinion.trim(),
              id: approveId
            };
          }
          this.submitApprove(data, approveResult);
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** 提交审批 */
  async submitApprove(val: any, type: number) {
    const data = deepClone(val);
    const publicFunc = () => {
      this.paginationData.current = 1;
      this.queryList();
      this.$message.success('操作成功');
      this.closeDetailDrawer();
    };
    if (type === 1) {
      const sendData = data;
      await this.passApproveChangeStore(sendData).then(() => {
        publicFunc();
      });
    } else if (type === 2) {
      const sendData = data;
      await this.rejectApproveChangeStore(sendData).then(() => {
        publicFunc();
      });
    } else if (type === 3) {
      const sendData = data;
      await this.cancelApproveChangeStore(sendData).then(() => {
        publicFunc();
      });
    }
  }

  /**
  * @description 关闭详情抽屉，清空数据
  */
  closeDetailDrawer() {
    this.drawerDeatil = false;
    (this.$refs.drawerDetailForm as VueComponentParent).clearValidate();
  }

  /** @description 通过 */
  private _passFunc(selectionList: any) {
    this.$confirm('确定通过审核?', '通过', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      const data: any = [];
      selectionList.forEach((item: any) => {
        data.push({
          id: item.approveId,
          verifyOpinion: '同意'
        });
      });
      this.submitApprove(data, 1);
    }).catch(() => {
      this.$message.info('取消审核');
    });
  }

  /**
   * @description 撤回
   */
  private _cncelFunc(selectionList: any) {
    const idList: any = [];
    selectionList.forEach((item: any) => {
      idList.push(item.approveId);
    });
    this.$confirm('确定撤回申请?', '撤回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      const data = idList;
      this.submitApprove(data, 3);
    }).catch(() => {
      this.$message.info('取消撤回');
    });
  }

  /**
 * @description 驳回
 */
  private _rejectFunc(params: any) {
    this.$prompt('请输入驳回理由', '驳回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[^ \x22]+/,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(val.length < 1 || val.length > 300);
      },
      inputErrorMessage: '输入内容长度为1-300,不能全输入空格',
      inputPlaceholder: '输入内容长度为1-300',
      inputType: 'textarea'
    }).then((val: any) => {
      const data = {
        verifyOpinion: val.value.trim(),
        id: params.approveId
      };
      this.submitApprove(data, 2);
    }).catch((error: any) => {
      this.$message.info('取消驳回');
    });
  }

  // 底部统计
  private statisticsData: StaticDataType[] = [];

  private async queryStatics() {
    const {
      0: item1, 1: item2, 2: item3, 3: item4
    } = VERIFY_STRTUS;
    this.statisticsData = [
      {
        label: item1.label,
        value: 0,
      },
      {
        label: item2.label,
        value: 0,
      },
      {
        label: item3.label,
        value: 0,
      },
      {
        label: item4.label,
        value: 0,
      },
    ];
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    const { regionId, storeId } = sendData;
    sendData.queryRegionId = regionId;
    sendData.queryStoreId = storeId;
    const body = await this.queryChangeStoreApproveCount(sendData);
    if (body && body.length > 0) {
      body.forEach((item: any) => {
        const { auditStatus, num } = item;
        this.statisticsData[auditStatus].value = num;
      });
    }
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const {
      beginDate, endDate, regionId, storeId
    } = sendData;
    sendData.queryRegionId = regionId;
    sendData.queryStoreId = storeId;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const body = await this.queryChangeStoreApproveList(sendData);
    const {
      data = [], current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.queryStatics();
    this.tableData.loading = false;
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    this.tableLabelType = 'CHANGE_STORE_APPROVAL_LIST';
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
