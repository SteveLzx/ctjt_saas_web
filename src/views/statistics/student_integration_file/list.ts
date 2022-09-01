import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { setTableLabels, marginTableLabels, setFormDataFunc } from '@/views/statistics/_common/common';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  ORDER_LEARN_TYPE, STUDENT_STATUS,
  IN_LIBRARY_STATUS, STUDY_STAGE,
  SERVICES_FROM, SERVICES_WAY,
  RESULT_FEEDBACK,
  TURN_HISTORY_REASON,
  CARMODEL_LIST,
} from '@/enums';
import {
  DateAdd, deepClone, drivingSchool, timestampSizeCompare
} from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';

const tableOptionList = [
  {
    id: 1,
    label: '新增服务跟踪',
    type: 'primary',
    path: 'btn_addservicestrack'
  },
  {
    id: 2,
    label: '转入历史',
    type: 'warning',
    path: 'btn_turnhistory'
  },
  {
    id: 3,
    label: '恢复历史学员',
    type: 'danger',
    path: 'btn_renewhistory'
  },
  {
    id: 4,
    label: '修改学习证有效期',
    type: 'primary',
    path: 'btn_editstudycarddate'
  },
  {
    id: 5,
    label: '修改学车进度',
    type: 'primary',
    path: 'btn_studystage'
  },
  {
    id: 6,
    label: '导出',
    path: 'btn_export',
  },
];
// 拉取服务类型json
const servicesTypeJson = require('@/assets/json/services_options.json');

@Component
export default class StatisticsStudentIntegrationFile extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => ParamsType;

  @Action('license/queryRecordList') private queryRecordList!: (data: any) => ParamsType;

  @Action('license/queryWorkflowByIdNo') private queryWorkflowByIdNo!: (data: any) => any;

  @Action('license/createTracking') private createTracking!: (data: any) => ParamsType;

  @Action('license/modifyPeriodStudyDate') private modifyPeriodStudyDate!: (data: any) => ParamsType;

  @Action('license/turnHistory') private turnHistory!: (data: any) => ParamsType;

  @Action('license/restoreTurnHistory') private restoreTurnHistory!: (data: any) => ParamsType;

  @Action('license/exportRecord') private exportRecord!: (data: any) => any;

  @Action('license/modifyStudentRecord') private modifyStudentRecord!: (data: any) => ParamsType;

  // 列表搜索项配置
  private localSearchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        select: {
          key: 'dateType',
          placeholder: '',
          value: 1,
          width: 120,
          options: [
            {
              id: 1,
              label: '报名日期',
            },
            {
              id: 15,
              label: '科目一合格日期',
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
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 140,
        placeholder: '请输入学员姓名、证件号码',
        clearable: true,
      },
    ],
    cascaderList: [
      {
        label: '在库状态',
        key: 'studentStatus',
        value: [IN_LIBRARY_STATUS[0].id, IN_LIBRARY_STATUS[1].id],
        placeholder: '请选择',
        clearable: true,
        width: 180,
        options: IN_LIBRARY_STATUS,
        optionProps: {
          emitPath: false, // 只展示最后一级
          multiple: true, // 可多选
          collapseTags: true,
          value: 'id',
          label: 'label',
          children: 'children',
        },
      },
    ],
    selectList: [
      {
        label: '学员状态',
        key: 'studyStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: STUDENT_STATUS,
      },
      {
        label: '学车类型',
        key: 'learnType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: ORDER_LEARN_TYPE,
        customOptions: {
          value: 'label',
          label: 'label'
        },
      },
      {
        label: '学车进度',
        key: 'learnDrivingSchedule',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: STUDY_STAGE,
      },
      {
        label: '分配教练',
        key: 'isDistribution',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: [
          {
            id: 1,
            label: '已分配'
          },
          {
            id: 2,
            label: '未分配',
          },
        ],
      },
      {
        label: '车型',
        key: 'carModel',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: CARMODEL_LIST
      },
      {
        label: '班别',
        key: 'classesName',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: [],
        customOptions: {
          value: 'label',
          label: 'label'
        }
      },
      {
        label: '是否欠费',
        key: 'isArrears',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: [
          {
            id: 0,
            label: '否'
          },
          {
            id: 1,
            label: '是',
          },
        ],
      },
    ],
    checkedList: [],
    buttonList: []
  }

  /**
   * @param {string} val 需要传入驾校id
   * @description 请求驾校下的班别
   */
  async queryClassesList(val?: string) {
    const sendData = { type: 1 }; // 1:学车班别;2:散学班别
    const body = await this.queryClassesInfoList(sendData);
    // 深拷贝，处理数据
    const _data = JSON.parse(JSON.stringify(body));
    _data.forEach((item: any) => {
      const _item = item;
      _item.label = _item.name;
    });
    this.searchForm.selectList[7].options = _data;
    this.searchForm.inputList[0].width = 400;
    const { drivingSchoolId } = this.userInfo;
    this.searchForm.inputList[0].placeholder = drivingSchool(drivingSchoolId) === 'huizhou' ? '请输入学员姓名、手机号、证件号、受理档案号' : '请输入学员姓名、手机号、证件号、受理号';
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
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
      this.querFirstPageList();
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

  private submitLoading = false;

  // 弹出框名
  private dialogName = '';

  /**
* @description 表格操作回调
*/
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    if (id === 1) {
      // 新增服务跟踪
      this.drawer = true;
      this.queryServicesList(selectionList); // 把选中的数据填充进新增服务表格
    }
    if (id === 2) {
      // 转入历史
      const isHistory = selectionList.filter((a: any) => a.studentStatus === IN_LIBRARY_STATUS[2].id).length; // 存在在库状态==历史学员
      if (_len === 1) {
        if (isHistory) this.$message.warning('仅在学学员和超期学员可转入历史，请重新选择！');
        else {
          const item = selectionList[0];
          this.turnHistoryForm.orderId = item.id;
          this.turnHistoryForm.idNo = item.idNo;
          this.dialogName = '转入历史';
        }
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 3) {
      // 恢复历史学员
      const isHistory = selectionList.filter((a: any) => a.studentStatus === IN_LIBRARY_STATUS[2].id).length === selectionList.length; // 在库状态==历史学员
      if (_len === 1) {
        if (!isHistory) this.$message.warning('仅历史学员可进行恢复，请重新选择！');
        else this._renewHistoryFunc(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 4) {
      // 修改学习证有效期
      if (_len === 1) {
        const isZaikuStatus = selectionList.filter((a: any) => a.studentStatus !== IN_LIBRARY_STATUS[2].id).length === selectionList.length; // 在库状态==在学学员|超期学员
        const isStudentStatus = selectionList.filter((a: any) => a.studyStatus === STUDENT_STATUS[0].id || a.studyStatus === STUDENT_STATUS[2].id).length === selectionList.length; // 学员状态==正常|暂停
        if (!isZaikuStatus || !isStudentStatus) this.$message.warning('仅学员状态为正常或暂停，在库状态为在学学员或超期学员的数据可以修改学习证有效期，请重新选择！');
        else if (!selectionList[0].examDate) {
          this.$message.warning('该学员未出科一成绩单，暂不能修改学习证有效期,请重新选择！');
        } else {
          this.queryStudyDetail(selectionList[0]);
          this.dialogName = '修改学习证有效期';
        }
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 5) {
      // 修改学车进度
      if (_len === 1) {
        this.queryStudyStageDetail(selectionList[0]);
        this.dialogName = '修改学车进度';
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    // 导出
    if (id === 6) {
      this._exportData();
    }
  }

  /** 导出 */
  private async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatus = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const sendData = { ..._data, studentStatus };
    const body = await this.exportRecord(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, '学员综合档案');
  }

  // 新增服务跟踪抽屉是否可见
  private drawer = false;

  // 新增服务跟踪表格
  private previewData: ParamsType = {
    loading: false,
    index: true,
    selection: true,
    labels: [
      {
        key: 'userName',
        label: '姓名',
      },
      {
        key: 'idNo',
        label: '证件号码',
        minWidth: 170,
      },
      {
        key: 'mobile',
        label: '联系电话',
        minWidth: 120,
      },
      {
        key: 'learnDrivingSchedule',
        label: '学车进度',
        render(h: any, params: any) {
          const { learnDrivingSchedule } = params.row;
          const _list = STUDY_STAGE;
          const _item = _list.filter(item => item.id === learnDrivingSchedule);
          if (_item.length === 0) return h('div', '');
          return h('div', `${_item[0].label}`);
        }
      },
      {
        key: 'classesName',
        label: '班别',
        minWidth: 110,
      },
      {
        key: 'carModel',
        label: '车型',
      }
    ],
    options: [
      {
        id: 1,
        label: '删除',
        type: 'danger',
      }
    ],
    list: [],
    totalList: []
  };

  // 新增服务列表选中每一列切换回调
  private servicesTableSelectionChange(val: []) {
    this.previewData.selectionList = val;
  }

  /** 新增服务列表操作回调 */
  private servicesTableOptionCallback(val: TableOptionsValue) {
    const { selectionList } = this.previewData;
    const idList: Array<number> = [];
    if (selectionList) {
      selectionList.forEach((item: any) => {
        const _item = item;
        idList.push(_item.index);
      });
    }
    const _len = selectionList ? selectionList.length : 0;
    const { id } = val;
    if (id === 1) {
      // 删除
      if (_len >= 1) {
        this.previewData.totalList = this.previewData.totalList.filter(
          (item: any) => !idList.includes(item.index)
        );
        const { totalList } = this.previewData;
        this.servicesPaginationData.current = 1;
        this.servicesPaginationData.total = totalList.length;
        const { pageSize } = this.servicesPaginationData;
        this.previewData.list = this.pagination(1, pageSize, totalList); // 设置表格数据
        this.$message.success('删除成功');
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
  }

  // 新增服务列表分页配置对象
  private servicesPaginationData = {
    current: 1,
    pageSize: 5,
    total: 0,
    pageCount: [5, 10, 15, 20]
  };

  // 列表分页
  public servicesTableSizeChange(val: number) {
    this.servicesPaginationData.pageSize = val;
    this.servicesPaginationData.current = 1;
    this.queryServicesList();
  }

  public servicesTableCurrentChange(val: number) {
    this.servicesPaginationData.current = val;
    this.queryServicesList();
  }

  /** 获取新增服务列表数据 */
  private queryServicesList(selectionList?: any) {
    const { current, pageSize } = this.servicesPaginationData;
    if (selectionList && selectionList.length > 0) {
      const { totalList } = this.previewData;
      const list: any = deepClone(selectionList);
      const data:any = [];
      list.forEach((item: any, index: number) => {
        const _item = item;
        _item.index = index + this._getMax(totalList) + 1;
        _item.id = item.id;
        data.push(_item);
      });
      this.previewData.totalList = data;
      this.previewData.list = this.pagination(current, pageSize, data);
      this.servicesPaginationData.total = data.length;
    } else {
      const { totalList } = this.previewData;
      this.previewData.list = this.pagination(current, pageSize, totalList);
    }
  }

  private pagination(current: number, pageSize: number, array: any) {
    const pageCount = current * pageSize;
    const pagepev = (current - 1) * pageSize;
    const data = array.filter((item: any, index: any) => index < pageCount && index >= pagepev);
    return data;
  }

  // 服务来源list
  private servicesFromList = SERVICES_FROM;

  // 服务方式list
  private servicesWayList = SERVICES_WAY;

  // 服务类型一级分类list
  private servicesTypeList = servicesTypeJson;

  // 服务类型二级分类list
  private servicesChildTypeList = [];

  // 结果反馈list
  private resultFeedbackList = RESULT_FEEDBACK;

  // 新增服务跟踪抽屉弹窗表单
  private servicesFormData: ParamsType = {
    source: '', // 服务来源
    pattern: '', // 服务方式
    firstType: '', // 服务类型一级分类
    secondType: '', // 服务类型二级分类
    feedback: '', // 结果反馈
    content: '', // 服务内容
  }

  private servicesFormDataRules = {
    source: [
      { required: true, message: '请选择服务来源', trigger: 'change' }
    ],
    pattern: [
      { required: true, message: '请选择服务方式', trigger: 'change' }
    ],
    firstType: [
      { required: true, message: '请选择一级分类', trigger: 'change' }
    ],
    secondType: [
      { required: true, message: '请选择二级分类', trigger: 'change' }
    ],
    feedback: [
      { required: true, message: '请选择结果反馈', trigger: 'change' }
    ],
    content: [
      { required: true, message: '请输入服务内容', trigger: 'blur' }
    ],
  }

  /** 获取服务类型二级下拉框数据 */
  private servicesTypeChange(val: any) {
    if (val) {
      const child = servicesTypeJson.find((a: any) => a.label === val);
      this.servicesChildTypeList = child ? child.children : [];
    } else {
      this.servicesChildTypeList = [];
      this.servicesFormData.servicesChildType = '';
    }
  }

  // 身份证搜索下拉配置项
  private idNoOption = {
    options: [],
    loading: false,
  };

  /**
   * @description 新增服务跟踪记录-根据证件模糊搜索
   */
  private async queryIdNoSearch(val: any) {
    this.idNoOption.loading = true;
    if (val.length >= 2) {
      const body = await this.queryWorkflowByIdNo({ idNo: val });
      this.idNoOption.options = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数,根据身份证拿到的信息填充表格
  */
  private formDataSelectCallback(val: any) {
    const { options } = this.idNoOption;
    // 设置根据证件号拿到的用户信息
    const _item: any = options.filter((i: any) => i.idNo === val);
    const item = _item[0] ? _item[0] : {};
    this.idNoOption.options = [];
    const { totalList } = this.previewData;
    const sendData = { ...item, index: totalList ? this._getMax(totalList) + 1 : 1 };
    const totalData = [sendData, ...totalList];// 总数据
    this.servicesPaginationData.total = totalData.length;
    const { current, pageSize } = this.servicesPaginationData;
    this.previewData.totalList = totalData;
    this.previewData.list = this.pagination(current, pageSize, totalData); // 设置表格数据
  }

  /** 获取最大的id */
  _getMax(array: []) {
    let max = 0;
    array.map((obj: any) => {
      if (obj.index > max) max = obj.index;
      return max;
    });
    return max;
  }

  /** 新增服务跟踪 */
  private _addServicesTrack(val: any) {
    (this.$refs.drawerForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          this.submitLoading = true;
          // 学员信息表格
          const { list } = this.previewData;
          if (list && list.length > 0) {
            const { servicesFormData } = this;
            const sendData :any = [];
            list.forEach((item: any, index: number) => {
              const _item: any = {};
              _item.idNo = item.idNo;
              _item.orderId = item.id;
              sendData.push({ ..._item, ...servicesFormData });
            });
            this.createTracking(sendData).then(() => {
              this.$message.success('新增服务跟踪记录成功！');
              this.closeDrawer();
            })
              .finally(() => {
                this.submitLoading = false;
              });
          } else {
            this.$message.warning('请先添加学员信息');
          }
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /**
 * @description 关闭服务跟踪抽屉，清空数据
 */
  closeDrawer() {
    this.drawer = false;
    (this.$refs.drawerForm as VueComponentParent).resetFields();
    this.previewData.list = [];
    this.previewData.totalList = [];
    this.servicesPaginationData.current = 1;
    this.servicesPaginationData.pageSize = 5;
    this.servicesPaginationData.total = 0;
  }

  // 学习证有效期弹窗是否可见
  private studyVisible = false;

  // 学习证有效期弹窗表单
  private studyPeriodForm: ParamsType = {
    id: '',
    userName: '',
    idNo: '',
    examDate: null, // 科目一合格日期
    expireDate: null, // 现有效期
  }

  /** 原有效日期 */
  get expireDates() {
    let reDate = '';
    const { examDate } = this.studyPeriodForm;
    if (examDate) {
      const d1 = new Date(examDate);
      const newDate = DateAdd('y', 3, d1);
      reDate = newDate ? dayjs(newDate).format('YYYY-MM-DD') : '';
    }
    return reDate;
  }

  // 学习证有效期验证
  private studyPeriodFormRules = {
    expireDate: [
      { required: true, message: '请选择现有效期', trigger: 'change' }
    ]
  }

  /** 获取选中修改学习证有效期的基本信息 */
  private queryStudyDetail(val: ParamsType) {
    const {
      id, idNo, userName, examDate, expireDate,
    } = val;
    this.studyPeriodForm.id = id;
    this.studyPeriodForm.idNo = idNo;
    this.studyPeriodForm.userName = userName;
    this.studyPeriodForm.examDate = examDate;
    this.studyPeriodForm.expireDate = expireDate;
  }

  /** 修改学习证有效期 */
  private _editStudyCardFunc() {
    (this.$refs.studyPeriodForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const { expireDates } = this;
          const { expireDate, id } = this.studyPeriodForm;
          if (new Date(expireDate) <= new Date(expireDates)) {
            this.$message.warning('现有效期需大于原有效期,请重新选择！');
          } else {
            this.submitLoading = true;
            const _nowDate = this.$dayjs(expireDate).format('YYYY-MM-DD'); // 处理日期
            const sendData = { orderId: id, periodStudyDate: _nowDate };
            this.modifyPeriodStudyDate(sendData).then(() => {
              this.modifyPeriodStudyDate(sendData);
              this.querFirstPageList();
              this.closeStudyPeriodDialog();
              this.$message.success('修改学习证有效期成功！');
            })
              .finally(() => {
                this.submitLoading = false;
              });
          }
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** 学习证有效期弹出框关闭 */
  closeStudyPeriodDialog() {
    (this.$refs.studyPeriodForm as VueComponentParent).resetFields();
    this.dialogName = '';
  }

  // 转入历史表单
  private turnHistoryForm: ParamsType = {
    orderId: '',
    idNo: '',
    reason: '', // 原因
    remark: '', // 备注
  }

  // 转入历史验证
  private turnHistoryFormRules = {
    reason: [
      { required: true, message: '请选择原因', trigger: 'change' }
    ]
  }

  // 转入历史原因list
  private turnHistoryReasonList = TURN_HISTORY_REASON;

  /** 转入历史 */
  private _turnHistoryFunc() {
    (this.$refs.turnHistoryForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          this.submitLoading = true;
          const { turnHistoryForm } = this;
          const sendData: any = [];
          sendData.push(turnHistoryForm);
          this.turnHistory(sendData).then(() => {
            this.$message.success('转入历史成功！');
            this.querFirstPageList();
            this.closeTurnHistoryDialog();
          })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** 关闭转入历史弹出框 */
  private closeTurnHistoryDialog() {
    (this.$refs.turnHistoryForm as VueComponentParent).resetFields();
    this.dialogName = '';
  }

  /**
* @description 恢复历史学员
*/
  private _renewHistoryFunc(params: any) {
    this.$prompt('原因备注:', '恢复历史学员', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[^ \x22]+/,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(val.length < 1 || val.length > 200);
      },
      inputErrorMessage: '请输入恢复历史原因，限200字以内',
      inputPlaceholder: '输入内容长度为1-200,不能全输入空格',
      inputType: 'textarea'
    }).then((val: any) => {
      const sendData: any = { orderId: params.id, idNo: params.idNo, reason: val.value };
      this.restoreTurnHistory(sendData).then(() => {
        this.$message.success('恢复历史成功！');
        this.querFirstPageList();
      })
        .finally(() => {
          //
        });
    }).catch((error: any) => {
      this.$message.info('已取消恢复历史学员');
    });
  }

  // 修改学车进度表单
  private studyStageForm: ParamsType = {
    idNo: '',
    userName: '',
    learnDrivingSchedule: null, // 原学车进度
    studyStage: '', // 学车进度
  }

  // 修改学车进度验证
  private studyStageFormRules = {
    studyStage: [
      { required: true, message: '请选择现学车进度', trigger: 'change' }
    ]
  }

  // 学车进度list
  private studyStageList = STUDY_STAGE;

  /** 获取选中修改学车进度的基本信息 */
  private queryStudyStageDetail(val: ParamsType) {
    const {
      idNo, userName, learnDrivingSchedule,
    } = val;
    this.studyStageForm.idNo = idNo;
    this.studyStageForm.userName = userName;
    this.studyStageForm.learnDrivingSchedule = learnDrivingSchedule;
  }

  /** 修改学车进度 */
  private _studyStageFunc() {
    (this.$refs.studyStageForm as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          this.submitLoading = true;
          const { idNo, studyStage } = this.studyStageForm;
          const sendData = { idNo, studyStage };
          this.modifyStudentRecord(sendData).then(() => {
            this.$message.success('修改学车进度成功！');
            this.querFirstPageList();
            this.closeStudyStageDialog();
          })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** 关闭修改学车进度弹出框 */
  private closeStudyStageDialog() {
    (this.$refs.studyStageForm as VueComponentParent).resetFields();
    this.dialogName = '';
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

  /** 字段设置保存回调 */
  submitField(val: any) {
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

  /** 跳转详情界面 */
  jumpDetail(item: any) {
    this.$router.push({
      path: '/statistics/student_integration_file/detail',
      query: { obj: encodeURIComponent(JSON.stringify(item)) }
    });
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatus = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const sendData = { ..._data, studentStatus };
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryRecordList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async mounted() {
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = drivingSchool(drivingSchoolId) === 'huizhou' ? 'HUIZHOU_STUDENT_INTEGRATION_FILE_LIST_LABEL' : 'STUDENT_INTEGRATION_FILE_LIST_LABEL';
    this.initSearch();
    this.queryList();
    this.initSetTableLabel();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
