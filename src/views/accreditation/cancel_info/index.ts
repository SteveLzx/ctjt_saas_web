import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  ParamsType, TableOptionsValue, VueComponentParent, StaticDataType
} from '@/type';
import {
  setFormDataFunc,
  marginTableLabels, setTableLabels,
} from '@/views/accreditation/_common/common';
import { deepClone, drivingSchool, timestampSizeCompare } from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';
import { VERIFY_STRTUS } from '@/enums';

const cancelSubjectOptions = [
  {
    id: 1,
    label: '考场受理',
  },
  {
    id: 4,
    label: '学科培训科目一',
  },
  {
    id: 5,
    label: '学科培训科目二',
  },
  {
    id: 6,
    label: '学科培训科目三',
  },
  {
    id: 7,
    label: '文明培训'
  },
  {
    id: 8,
    label: '考试批复科目一',
  },
  {
    id: 9,
    label: '考试批复科目二',
  },
  {
    id: 10,
    label: '考试批复科目三',
  },

  {
    id: 11,
    label: '考试批复文明'
  },
  {
    id: 12,
    label: '考试交费科目一'
  },
  {
    id: 12,
    label: '考试交费科目二'
  },
  {
    id: 13,
    label: '考试交费科目三'
  },
  {
    id: 14,
    label: '考试交费文明'
  },
  {
    id: 15,
    label: '考试结果科目一'
  },
  {
    id: 16,
    label: '考试结果科目二'
  },
  {
    id: 17,
    label: '考试结果科目三'
  },
  {
    id: 18,
    label: '考试结果文明'
  },
  {
    id: 19,
    label: '考试结束'
  },
  {
    id: 22,
    label: '文明已交费'
  },
];
const huizhouCancelSubjectOptions = [
  {
    id: 25,
    label: '牌证收表',
  },
  {
    id: 26,
    label: '车管所送审',
  },
  {
    id: 1,
    label: '考场受理',
  },
  {
    id: 27,
    label: '上课情况',
  },
  {
    id: 4,
    label: '学科培训科目一',
  },
  {
    id: 5,
    label: '学科培训科目二',
  },
  {
    id: 6,
    label: '学科培训科目三',
  },
  {
    id: 7,
    label: '文明培训'
  },
  {
    id: 8,
    label: '考试批复科目一',
  },
  {
    id: 9,
    label: '考试批复科目二',
  },
  {
    id: 10,
    label: '考试批复科目三',
  },

  {
    id: 11,
    label: '考试批复文明'
  },
  {
    id: 12,
    label: '考试交费科目一'
  },
  {
    id: 12,
    label: '考试交费科目二'
  },
  {
    id: 13,
    label: '考试交费科目三'
  },
  {
    id: 14,
    label: '考试交费文明'
  },
  {
    id: 15,
    label: '考试结果科目一'
  },
  {
    id: 16,
    label: '考试结果科目二'
  },
  {
    id: 17,
    label: '考试结果科目三'
  },
  {
    id: 18,
    label: '考试结果文明'
  },
  {
    id: 19,
    label: '考试结束'
  },
  {
    id: 22,
    label: '文明已交费'
  },
];
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
const name = '办证信息撤销';

@Component({
  filters: {
    auditStatusFilter: (val: number) => {
      if (val === undefined || val === null) return '';
      const list = VERIFY_STRTUS.filter(item => item.id === val);
      return list[0] ? list[0].label : '';
    }
  }
})
export default class CancelInfoListIndex extends mixins(ctjtAreaStoreSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins, accreditationOperationLogMixins) {
  @Action('workflow/queryRevocationDetail') private queryRevocationDetail!: (data: any) => any;

  @Action('workflow/queryRevocationApproveList') private queryRevocationApproveList!: (data: any) => any;

  @Action('workflow/queryRevocationSave') private queryRevocationSave!: (data: any) => any;

  @Action('workflow/queryRevocationApprove') private queryRevocationApprove!: (data: any) => any;

  @Action('workflow/queryApprovalModifyStatus') private queryApprovalModifyStatus!: (data: any) => any;

  @Action('workflow/queryApprovalDetail') private queryApprovalDetail!: (data: any) => any;

  @Action('workflow/queryByIdNo') private queryByIdNo!: (data: any) => any;

  // 列表搜索项配置
  public localSearchForm: ParamsType = {
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
        label: '撤销单编号',
        key: 'seq',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入撤销单编号',
        clearable: true,
      },
      {
        label: '撤销批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入撤销批次号',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '撤销办证',
        key: 'subject',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
        customOptions: {
          value: 'label',
          label: 'label'
        },
      },
      {
        label: '状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: VERIFY_STRTUS,
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
    if (key === 'log') {
      this.queryOperationLogPage(name);
      this.logshow = true;
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

  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name: '办证信息撤销'
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
    const isNotUnderReview = selectionList.filter((a: any) => a.status !== VERIFY_STRTUS[0].id).length > 0; // 存在已通过、已撤回、已驳回数据
    if (id === 1) {
      // 新增办证信息撤销
      this.drawer = true;
    }
    if (id === 2) {
      // 通过
      if (_len >= 1) {
        if (isNotUnderReview) this.$message.warning('请选择状态为审核中的撤销单');
        else this._passFun(selectionList);
      } else {
        this.$message.warning('请勾选状态为审核中的撤销单!');
      }
    }
    if (id === 3) {
      // 驳回
      if (_len === 1) {
        if (isNotUnderReview) this.$message.warning('请选择1个状态为审核中的撤销单');
        else this._rejectFunc(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请勾选1个状态为审核中的撤销单');
      } else {
        this.$message.warning('请勾选1个状态为审核中的撤销单');
      }
    }
    if (id === 4) {
      // 撤回
      if (_len >= 1) {
        if (isNotUnderReview) this.$message.warning('请选择状态为审核中的撤销单');
        else this._cncelFunc(selectionList);
      } else {
        this.$message.warning('请勾选状态为审核中的撤销单!');
      }
    }
    if (id === 5) {
      // 导出
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
        this.recordExportCount(selectionList.length, name);
      } else {
        this.$message.warning('请先勾信息!');
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

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 底部统计
  private statisticsData: StaticDataType[] = [];

  private queryStatics(list: any) {
    const _list = VERIFY_STRTUS;
    const shenhe = list.length > 0 ? list.filter((item: any) => item.status === _list[0].id).length : 0;
    const pass = list.length > 0 ? list.filter((item: any) => item.status === _list[1].id).length : 0;
    const bohui = list.length > 0 ? list.filter((item: any) => item.status === _list[2].id).length : 0;
    const cancel = list.length > 0 ? list.filter((item: any) => item.status === _list[3].id).length : 0;
    this.statisticsData = [
      {
        label: _list[0].label,
        value: shenhe,
      },
      {
        label: _list[1].label,
        value: pass,
      },
      {
        label: _list[2].label,
        value: bohui,
      },
      {
        label: _list[3].label,
        value: cancel,
      },
    ];
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
    classesName: '',
    carModel: '',
    cancelInfo: null, // 撤销办证数据
    batchNo: '',
    nodeDtoList: [] // 撤销办证list
  }

  // 抽屉搜索
  private keyword = '';

  private formDataRules = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    userName: [
      { required: true, message: '找不到学员', trigger: ['change', 'blur'] }
    ],
    classesName: [
      { required: true, message: '找不到班别', trigger: ['change', 'blur'] }
    ],
    carModel: [
      { required: true, message: '找不到车型', trigger: ['change', 'blur'] }
    ],
    cancelInfo: [
      { required: true, message: '请选择撤销办证', trigger: ['change', 'blur'] }
    ]
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
      const body = await this.queryByIdNo({ idNo: val });
      this.idNoOption.options = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数
  */
  async formDataSelectCallback(val: any) {
    this.idNoOption.options = [];
    // 设置根据证件号拿到的用户信息
    const data = await this.queryRevocationDetail({ idNo: val });
    const {
      orderId,
      idNo,
      userName,
      carModel,
      classesName,
      nodeDtoList
    } = data;
    this.formData.orderId = orderId;
    this.formData.idNo = idNo;
    this.formData.userName = userName;
    this.formData.carModel = carModel;
    this.formData.classesName = classesName;
    this.formData.nodeDtoList = nodeDtoList; // 设置撤销办证表格数据
  }

  /** 下拉搜索框change */
  idNoChange(item: any) {
    this.idNoOption.options = []; // 清空历史记录
  }

  private submitLoading = false;

  // 撤销办证抽屉列表配置
  private formTableData: ParamsType = {
    _this: {},
    selection: true,
    index: false,
    options: [],
    labels: [
      {
        key: 'name',
        label: '工单当前待办科目',
        minWidth: 170,
      },
      {
        key: 'sourceName',
        label: '可撤销至',
        minWidth: 170,
      },
    ],
    list: [],
    selectionList: [],
  };

  /**
    * @description 撤销办证抽屉列表选中每一列切换回调
    */
  private formTableSelectionChange(val: any) {
    // 实现单选
    if (val.length > 1) {
      (this.$refs.singleCheckTable as VueComponentParent).clearSelection(); // 清空列表的选中
      // 只显示选中最后一个 这时val还是多选的列表
      (this.$refs.singleCheckTable as VueComponentParent).toggleRowSelection(val[val.length - 1], true);
    } else if (val.length === 1) {
      this.formTableData.selectionList = val[val.length - 1];
    } else {
      this.formTableData.selectionList = [];
    }
    this.formData.cancelInfo = this.formTableData.selectionList; // 选中切换后设置form 中的撤销办证节点数据
  }

  /**
   * @description 关闭抽屉，清空数据
   */
  closeDrawer() {
    this.drawer = false;
    (this.$refs.drawerForm as VueComponentParent).resetFields();
    this.formData.nodeDtoList = [];
    (this.$refs.singleCheckTable as VueComponentParent).clearSelection(); // 清空列表的选中
  }

  /** 新增办证信息撤销提交 */
  submitCancel() {
    (this.$refs.drawerForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const { formData } = this;
          const sendData = {
            batchNo: formData.cancelInfo.batchNo,
            currentNode: formData.cancelInfo.name,
            nodeId: formData.cancelInfo.id,
            orderId: formData.orderId,
            processInstanceId: formData.cancelInfo.processInstanceId,
            taggerNode: formData.cancelInfo.sourceName
          };
          this.queryRevocationSave(sendData).then(() => {
            this.$message.success('新增撤销成功');
          }).finally(() => {
            this.closeDrawer();
            this.paginationData.current = 1;
            this.queryList();
          });
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  // 抽屉详情弹出框
  private drawerDeatil = false;

  // 抽屉弹窗详情表单
  private detailFormData: ParamsType = {
    id: 0,
    nodeId: 0,
    seq: '', // 撤销单编号
    status: null, // 审核状态 1通过，2驳回，3撤回
    taskId: '',
    idNo: '',
    userName: '',
    classesName: '',
    carModel: '',
    currentNode: '',
    taggerNode: '',
    approveResult: null, // 审核结果 1:通过，2：驳回
    opinion: '', // 驳回原因
    nodeDtoList: [], // 撤销办证表格数据
    approveList: [], // 审批表格list
    isApprove: null, // 是否审核中
  };

  // 抽屉详情审批详情表格配置
  private approveTablelabels = [
    {
      key: 'taskName',
      label: '审批环节',
      minWidth: 170,
    },
    {
      key: 'userName',
      label: '审核人',
      minWidth: 80,
    },
    {
      key: 'status',
      label: '审核操作',
      minWidth: 80,
      render(h: any, params: any) {
        const { status } = params.row;
        if (status === undefined) return h('div', '');
        const list = VERIFY_STRTUS.filter(item => item.id === status);
        return h('div', list[0] ? list[0].label : '');
      }
    },
    {
      key: 'opinion',
      label: '审核意见',
      minWidth: 80,
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

  private opinionDisabled = false;

  @Watch('detailFormData.approveResult', { deep: true, immediate: false })
  private approveResultChangeFun(val: any) {
    this.detailFormData.opinion = '';
    const passRules = {
      approveResult: [
        { required: true, message: '请选择审核结果', trigger: 'blur' }
      ],
    };
    const rejectRules = {
      ...passRules,
      opinion: [
        { required: true, message: '请选择驳回原因', trigger: 'blur' }
      ],
    };
    if (!val || val === 2) {
      this.opinionDisabled = false;
      this.detailFormDataRules = rejectRules;
    } else {
      (this.$refs.drawerDetailForm as VueComponentParent).clearValidate();
      this.opinionDisabled = true;
      this.detailFormDataRules = passRules;
    }
  }

  /** 撤销详情 */
  async jumpDetail(val: ParamsType) {
    this.drawerDeatil = true;
    this.detailFormData = setFormDataFunc(val, this.detailFormData);
    const { currentNode, taggerNode } = this.detailFormData;
    this.detailFormData.nodeDtoList = [
      {
        currentNode,
        taggerNode
      }
    ];
    const { seq } = val;
    const body = await this.queryApprovalDetail({ seq });
    this.detailFormData.approveList = body;
    if (body && body.length > 0) {
      const lastPro = body[body.length - 1];
      const { status = 0 } = lastPro;
      if (status === 0) this.detailFormData.isApprove = true;
    }
  }

  /**
  * @description 关闭详情抽屉，清空数据
  */
  closeDetailDrawer() {
    this.drawerDeatil = false;
    (this.$refs.drawerDetailForm as VueComponentParent).clearValidate();
  }

  /** 详情更改审核状态 */
  submitStatus(id: string) {
    (this.$refs.drawerDetailForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const {
            nodeId,
            opinion,
            seq,
            approveResult,
            taskId,
            approveList
          } = this.detailFormData;
          const sendData: any = [];
          const data = {
            nodeId,
            opinion: approveResult === 1 ? '同意' : opinion,
            seq,
            status: approveResult,
            taskId
          };
          sendData.push(data);
          if (approveList) {
            const lastPro = approveList[approveList.length - 1];
            const { status } = lastPro;
            if (status === 0) {
              const msg = approveResult === 1 ? '审核' : '驳回';
              this.submitApprove(sendData, msg);
            }
          }
          this.closeDetailDrawer();
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** 提交审批 */
  async submitApprove(val: any, msg: string) {
    const sendData = JSON.parse(JSON.stringify(val));
    await this.queryRevocationApprove(sendData).then(() => {
      this.paginationData.current = 1;
      this.queryList();
      this.$message.success(`${msg}成功`);
    });
  }

  /** @description 通过 */
  private _passFun(selectionList: any) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        nodeId: _item.nodeId,
        opinion: '同意',
        seq: _item.seq,
        status: 1,
        taskId: _item.taskId
      };
      sendData.push(data);
    });
    this.$confirm('确定通过审核?', '通过', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.submitApprove(sendData, '审核');
      this.paginationData.current = 1;
      this.queryList();
    }).catch(() => {
      this.$message.info('已取消审核');
    });
  }

  /**
   * @description 撤回
   */
  private _cncelFunc(selectionList: any) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        nodeId: _item.nodeId,
        opinion: '',
        seq: _item.seq,
        status: 3,
        taskId: _item.taskId
      };
      sendData.push(data);
    });
    this.$confirm('确定撤回申请?', '撤回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await this.queryApprovalModifyStatus(sendData).then(() => {
        this.paginationData.current = 1;
        this.queryList();
        this.$message.success('撤回成功');
      });
    }).catch(() => {
      this.$message.info('已取消撤回');
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
      const sendData: any = [];
      const data = {
        nodeId: params.nodeId,
        opinion: val.value.trim(),
        seq: params.seq,
        status: 2,
        taskId: params.taskId
      };
      sendData.push(data);
      this.submitApprove(sendData, '驳回');
      this.paginationData.current = 1;
      this.queryList();
    }).catch((error: any) => {
      this.$message.info('已取消驳回');
    });
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const { drivingSchoolId } = this.userInfo;
    // 处理数据
    const sendData = {
      ..._data,
      drivingSchoolId,
    };
    const body = await this.queryRevocationApproveList(sendData);
    const {
      data = [], current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.queryStatics(data);
    this.tableData.loading = false;
  }

  /** 根据驾校id获取下拉框撤销办证科目数据 */
  private gotCancelAccreditionSubject(drivingSchoolId: string) {
    const { selectList } = this.searchForm;
    selectList[2].options = drivingSchool(drivingSchoolId) === 'huizhou' ? huizhouCancelSubjectOptions : cancelSubjectOptions;
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    this.tableLabelType = 'CANCEL_INFO_LIST';
    this.queryList();
    this.gotCancelAccreditionSubject(drivingSchoolId);
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
