import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { deepClone, timestampSizeCompare } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { ParamsType, VueComponentParent } from '@/type';
import { approveStatusOpts, changeCauseOpts, examSubjectsOpt } from '@/views/educational/_enums';
import { setTableLabels, marginTableLabels } from '@/views/educational/_common/common';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtSetField, CtjtSelect, CtjtSelectDialog
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const subjectOpts = [
  {
    id: 2, label: '科目二'
  },
  {
    id: 3, label: '科目三'
  },
];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtSetField,
    CtjtSelect,
    CtjtSelectDialog
  },
  filters: {
    applyStatusFilter: (value: number) => {
      const _list = approveStatusOpts.filter((item: any) => item.id === value);
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    subjectsFilter: (value: number) => {
      const _list = examSubjectsOpt.filter((item: any) => item.value === Number(value));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    }
  }
})
export default class EducationalTeachMgCoachChangeApprove extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryTeachCoachChangeList') private queryTeachCoachChangeList!: (data: any) => ParamsType;

  @Action('assignment/queryTeachCoachByIdDetail') private queryTeachCoachByIdDetail!: (data: any) => ParamsType;

  @Action('assignment/saveTeachCoachChange') private saveTeachCoachChange!: (data: any) => ParamsType;

  @Action('assignment/teachCoachChangeVerify') private teachCoachChangeVerify!: (data: any) => ParamsType;

  @Action('assignment/queryChangeCoachList') private queryChangeCoachList!: (data: any) => ParamsType;

  @Action('license/queryOrderStudentByIdNo') private queryOrderStudentByIdNo!: (data: any) => ParamsType;

  @Action('license/queryOrderTeachStudentByIdNo') private queryOrderTeachStudentByIdNo!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo!: ParamsType;

  private changeCauseOpts = changeCauseOpts;

  // 弹窗名称
  private dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
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

  // 通过身份证搜索出来的数组
  private handleIdNoSelect: Array<any> = [];

  // 搜索时的loading
  private handleIdNoSelectLoading = false;

  /**
   * @description 抽屉弹窗表单搜索下拉框回调函数
   */
  private formDataSelectCallback(val: any) {
    const _list = this.handleIdNoSelect.filter(item => item.idNo === val);
    if (_list.length > 0) {
      const { idNo } = _list[0];
      const { subjectsStep } = this;
      const sendData = { idNo, step: subjectsStep || 2 };
      this.queryOrderTeachStudentByIdNo(sendData).then((res: any) => {
        const { regionId, carModel, step } = res;
        this.queryCoachesListFunc(regionId, carModel, step);
        Object.keys(this.formData).forEach(key => {
          if (key !== 'changeCause' && key !== 'remarks') {
            if (key === 'subjects' || key === 'examSubjects') {
              this.formData[key] = step;
            } else {
              this.formData[key] = res[key];
            }
          }
        });
      });
    }
  }

  /**
   * @description 搜索身份证联想函数
   */
  private async queryIdNoSearch(val: any) {
    this.handleIdNoSelectLoading = true;
    if (val.length >= 2) {
      const { subjectsStep } = this;
      const sendData = { idNo: val, step: subjectsStep || 2 };
      this.queryOrderStudentByIdNo(sendData).then((res: any) => {
        this.handleIdNoSelect = res;
      }).finally(() => {
        this.handleIdNoSelectLoading = false;
      });
    }
  }

  // 列表搜索项
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '申请时间',
        key: 'beginDate',
        value: '',
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        placeholder: '结束时间',
        type: 'date',
        width: 140,
      },
    ],
    inputList: [
      {
        label: '关键词',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 300,
        clearable: true,
        placeholder: '请输入证件号码、学员姓名',
      }
    ],
    selectList: [
      {
        label: '片区',
        key: 'regionId',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '门店',
        key: 'storeId',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '审核状态',
        key: 'status',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: approveStatusOpts,
      },
      {
        label: '是否批复',
        key: 'isReply',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [{
          id: 0,
          label: '否'
        }, {
          id: 1,
          label: '是'
        }]
      }
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
        plain: false,
        path: 'btn_search'
      },
    ]
  }

  /**
   * @description 列表搜索项下拉回调函数
   */
  private searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        this.selectFunc('store', value);
      }
    }
  }

  private searchTableCallBack(key: string) {
    this.paginationData.current = 1;
    if (key === 'reset') {
      this.searchForm.selectList[1].options = [];
    }
    this.queryList();
  }

  // 分页列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    options: [
      {
        id: 1,
        label: '新增申请',
        path: 'btn_xzsq'
      }
    ],
    labels: [],
    list: [],
    selectionList: [],
    setCellClassName: (val: any) => {
      const { status } = val.row;
      return status === 0 ? 'td_text_red' : '';
    }
  }

  private selectDialogData = subjectOpts;

  private tableOptionCallback(val: ParamsType) {
    this.dialogName = 'chooseSubject';
  }

  private subjectsStep = null;

  private selectDialogCallback(val: ParamsType) {
    const { id } = val;
    if (id) {
      this.subjectsStep = id;
      this.drawerDetail = true;
    }
    this.dialogName = '';
  }

  private newCoachNameChange(val: string) {
    const _list = this.coachesListOpts.filter((item: any) => item.userName === val);
    if (_list.length > 0) {
      this.formData.newCoachId = _list[0].id;
      this.formData.coachMobile = _list[0].mobile;
    }
  }

  private isEdit = false;

  private close() {
    this.drawerDetail = false;
  }

  private jumpDetail(id: string) {
    this.isEdit = true;
    this.queryTeachCoachByIdDetail({ id }).then((res: any) => {
      const { verifyRecordList } = res;
      this.detailTableData.list = verifyRecordList;
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = res[key];
      });
      this.drawerDetail = true;
    });
  }

  /**
   * @description 分页组件每页请求数量切换
   */
  private tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  /**
   * @description 分页组件页数切换
   */
  private tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  async queryList() {
    const _data = drawSearchForm(this.searchForm, this.paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data
    };
    this.tableData.loading = true;
    try {
      const body = await this.queryTeachCoachChangeList(sendData);
      const {
        current, total, data
      } = body;
      this.tableData.loading = false;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 抽屉
  private drawerDetail = false;

  @Watch('drawerDetail')
  private handleWatchDrawerDetail(val: boolean) {
    if (!val) {
      this.isEdit = false;
      this.coachesListOpts = [];
      this.formData = {
        carModel: '',
        changeCause: '',
        classesId: 0,
        classesName: '',
        coachMobile: '',
        examDate: '',
        examTime: '',
        examSubjects: '',
        idNo: '',
        isArrears: 0,
        isReply: 0,
        mobile: '',
        newCoachId: 0,
        newCoachName: '',
        orderId: '',
        originalCoachId: 0,
        originalCoachName: '',
        regionId: 0,
        regionName: '',
        storeId: 0,
        storeName: '',
        subjects: '',
        userName: '',
        taskId: '',
        verifyStatus: null,
        remarks: ''
      };
    } else {
      this.$nextTick(() => {
        (this.$refs.detailFormRef as VueComponentParent).clearValidate();
      });
    }
  }

  private formData: ParamsType = {
    carModel: '',
    changeCause: '',
    classesId: 0,
    classesName: '',
    coachMobile: '',
    examDate: '',
    examTime: '',
    examSubjects: null,
    idNo: '',
    isArrears: 0,
    isReply: 0,
    mobile: '',
    newCoachId: 0,
    newCoachName: '',
    orderId: '',
    originalCoachId: 0,
    originalCoachName: '',
    regionId: 0,
    regionName: '',
    storeId: 0,
    storeName: '',
    subjects: null,
    userName: '',
    taskId: '',
    verifyStatus: null,
    remarks: ''
  }

  private formRules: ParamsType = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    newCoachName: [
      { required: true, message: '请选教练', trigger: ['change', 'blur'] }
    ],
    changeCause: [
      { required: true, message: '请选变更原因', trigger: ['change', 'blur'] }
    ]
  }

  private detailTableData: ParamsType = {
    _this: {},
    labels: [
      {
        key: 'verifyNode',
        label: '审批环节'
      },
      {
        key: 'verifyUser',
        label: '审核人'
      },
      {
        key: 'verifyOperation',
        label: '审核操作'
      },
      {
        key: 'verifyOpinion',
        label: '审核意见'
      },
      {
        key: 'verifyDate',
        label: '审核时间'
      },
    ],
    list: [],
  }

  /**
   * @description 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = deepClone(data);
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'region') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'store') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  private coachesListOpts: ParamsType = []; // 教练列表

  /**
   * @description 查询可变更教练列表
   */
  private queryCoachesListFunc(regionId: string, carModel: string, subject: number) {
    this.queryChangeCoachList({ carModel, regionId, subject }).then((res: any) => {
      this.coachesListOpts = res;
    });
  }

  private btnLoading = false;

  private applySubmit(val: number) {
    if (val === 1) {
      this.$confirm('审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit(val, '同意');
      });
    }
    if (val === 2) {
      this.$prompt('请输入驳回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '输入内容长度为1-30'
      }).then((res: any) => {
        const { value } = res;
        if (value && value.length > 30) {
          //
        } else {
          this.submit(val, res.value);
        }
      });
    }
    if (val === 3) {
      this.$confirm('是否撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit(val, '撤销');
      });
    }
  }

  private submit(code: number, verifyOpinion: string) {
    const { taskId } = this.formData;
    const sendData = {
      taskId,
      verifyOpinion,
      code,
    };
    this.btnLoading = true;
    this.teachCoachChangeVerify(sendData).then(() => {
      this.queryList();
      this.$message.success('操作成功!');
      this.drawerDetail = false;
    }).finally(() => {
      this.btnLoading = false;
    });
  }

  private btnSubmit() {
    (this.$refs.detailFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = deepClone(this.formData);
        this.btnLoading = true;
        this.saveTeachCoachChange(sendData).then(() => {
          this.$message.success('新增成功！');
          this.paginationData.current = 1;
          this.queryList();
          this.drawerDetail = false;
        }).finally(() => {
          this.btnLoading = false;
        });
      } else {
        this.$message.warning('请按错误提示修改！');
      }
    });
  }

  // 生命周期
  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'TEACH_MG_COACH_CHANGE_APPROVE_LABEL';
    this.initSetTableLabel();
    // 先默认请求驾校

    const { drivingSchoolId } = this.userInfo;
    this.selectFunc('region', drivingSchoolId);
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
