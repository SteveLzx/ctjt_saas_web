import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { VueComponentParent, ParamsType } from '@/type';
import { REG_INTEGER, deepClone } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { teachingStatusOpts, coachPostTypeOpts } from '@/views/educational/_enums/index';
import {
  EDUCATIONAL_STAR, EDUCATIONAL_COACH_TYPE, EDUCATIONAL_SEX,
  MARKET_SERVICE_STATUS
} from '@/enums';
import {
  CtjtCard, SearchTable, CtjtTable, CtjtPagination
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';

const pauseSubjectOpts = [
  { label: '全部暂停分配', value: 1 },
  { label: '科目二暂停分配', value: 2 },
  { label: '科目三暂停分配', value: 3 }
];

@Component({
  components: {
    CtjtCard, SearchTable, CtjtTable, CtjtPagination
  },
  filters: {
    sexFilter: (val: number) => {
      const _list = EDUCATIONAL_SEX;
      const _item = _list.filter(item => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    postTypeFilter: (val: number) => {
      const _list = coachPostTypeOpts;
      const _item = _list.filter(item => item.value === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    statusFilter: (val: number) => {
      const _list = MARKET_SERVICE_STATUS;
      const _item = _list.filter(item => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    teachingClassFilter: (val: string) => {
      if (!val || val.length === 0) return '';
      const _data = JSON.parse(val);
      const _text: Array<string> = [];
      _data.forEach((item: any) => _text.push(`${item.name}-${item.carModel}`));
      return _text.join('，');
    },
    spaceTrainingPlaceFilter: (val: string) => {
      if (!val || val.length === 0) return '';
      const _data = JSON.parse(val);
      const _text: Array<string> = [];
      _data.forEach((item: any) => _text.push(item.name));
      return _text.join('，');
    },
    arrayToString: (val: string) => {
      if (!val || val.length === 0) return '';
      const _data = JSON.parse(val);
      return _data.join('，');
    },
    secondaryStoreFilter: (val: string) => {
      if (!val || val.length === 0) return '';
      const _data = JSON.parse(val);
      const _text: Array<string> = [];
      _data.forEach((item: any) => _text.push(item.name));
      return _text.join('，');
    },
    typeFilter: (val: number) => {
      const list = EDUCATIONAL_COACH_TYPE;
      const _item = list.filter((item: any) => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    teachingStatusFilter: (val: number) => {
      const list = teachingStatusOpts;
      const _item = list.filter((item: any) => item.value === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    pauseSubjectFilter: (val: number) => {
      const list = pauseSubjectOpts;
      const _item = list.filter((item: any) => item.value === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    }
  }
})
export default class CoachDetail extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryCoachesInfoById') private queryCoachesInfoById!: (data: any) => ParamsType;

  @Action('assignment/saveCoachInfo') private saveCoachInfo!: (data: any) => ParamsType;

  @Action('assignment/updateCoachInfo') private updateCoachInfo!: (data: any) => ParamsType;

  @Action('assignment/queryTeachTypePullFrame') private queryTeachTypePullFrame!: () => ParamsType;

  @Action('assignment/queryTeachCarsList') private queryTeachCarsList!: () => ParamsType;

  @Action('goods/queryClassesList') private queryClassesList!: (data: any) => ParamsType;

  @Action('assignment/getExamPlaceBySubjects') private getExamPlaceBySubjects!: (data: any) => ParamsType;

  @Action('user/queryUserCoachList') private queryUserCoachList!: (data: any) => ParamsType;

  @Action('space/queryTrainingPlaceByDrivingSchoolIdList') private queryTrainingPlaceByDrivingSchoolIdList!: () => ParamsType;

  @Action('car/queryCarInfoByIdNo') private queryCarInfoByIdNo!: (data: any) => ParamsType;

  // 选择员工抽屉
  private changestaffDrawer = false; // 选择员工抽屉展示

  /**
   * @description 打开选择教练抽屉
   */
  private async openDrawer() {
    this.changestaffDrawer = true;
    const { drivingSchoolId } = this.userInfo;
    // 获取列表片区列表
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.searchForm.selectList[0].options = data;
    this.queryList();
  }

  private searchForm: ParamsType = {
    selectInputList: [
      {
        label: '输入方式',
        select: {
          key: 'option',
          placeholder: '',
          value: 1,
          width: 120,
          options: [
            {
              id: 0,
              label: '手机号码',
            },
            {
              id: 1,
              label: '员工姓名',
            }
          ],
        },
        input: {
          key: 'optionValue',
          value: '',
          width: 200,
          clearable: true,
          placeholder: '请输入员工姓名',
        },
      },
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
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false
      },
      {
        label: '重置',
        key: 'reset',
        plain: false
      },
    ]
  };

  /** 搜索筛选框选择回调 */
  searchSelectChange(val: ParamsType) {
    const { value, key, options } = val;
    if (key === 'option') {
      const _list = options.filter((item: any) => item.id === value);
      this.searchForm.selectInputList[0].input.placeholder = `请输入${_list[0].label}`;
      this.searchForm.selectInputList[0].input.value = '';
    }
  }

  private searchTableCallBack(key: string) {
    if (key === 'reset') {
      this.searchForm.selectInputList[0].input.value = '';
    }
    this.paginationData.current = 1;
    this.queryList();
  }

  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '确定',
        type: 'primary',
      },
      {
        id: 2,
        label: '取消',
        type: 'info'
      },
    ],
    labels: [
      {
        key: 'userName',
        label: '员工姓名',
      },
      {
        key: 'mobile',
        label: '手机号码',
      },
      {
        key: 'regionName',
        label: '片区',
      },
      {
        key: 'postType',
        label: '职位',
        render(h: any, params: any) {
          const { postType } = params.row;
          const _list = coachPostTypeOpts.filter((item: any) => item.value === postType);
          return h('div', _list[0].label ? _list[0].label : '');
        }
      },
    ],
    list: [],
    selectionList: []
  }

  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 2) {
      this.changestaffDrawer = false;
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      // 提交选中的教练
      this.setCoachToFormFunc(selectionList[0]);
      this.changestaffDrawer = false;
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /**
   * @description 选中教练，设置信息到本地列表
   */
  private setCoachToFormFunc(val: ParamsType) {
    const { formData } = this;
    const { regionId, idNo } = val;
    // 获取该教练下片区门店
    this.selectFunc('region', regionId);
    const _keysList = [
      'userName', 'mobile', 'sex', 'entryTime', 'postType', 'leaderName', 'drivingSchoolName', 'regionName',
      'status', 'idNo', 'driverLicenseNo', 'quasiDrivingModel', 'issueDate', 'validDate', 'certificateNo',
      'certificateLevel', 'certificateValidDate', 'coachGroupId', 'leaderId', 'id', 'drivingSchoolId', 'regionId',
      'totalLoad', 'subjectThreeLoad', 'subjectTwoLoad'
    ];
    Object.keys(formData).forEach(key => {
      if (_keysList.includes(key)) {
        if (key === 'regionName') {
          this.formData.teachingRegion = [val[key]];
        }
        this.formData[key] = val[key];
      }
    });
    this.queryCarInfoByIdNo({ idNo }).then((res: any) => {
      this.carInformation = res;
    });
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

  private async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { select, input } = searchForm.selectInputList[0];
    const sendData = {
      ..._data
    };
    if (select.value === 1) {
      sendData.userName = input.value;
      sendData.mobile = '';
    }
    if (select.value === 0) {
      sendData.mobile = input.value;
      sendData.userName = '';
    }
    this.tableData.loading = true;
    try {
      const body = await this.queryUserCoachList(sendData);
      const {
        data, current, total
      } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 科目二考场
  private subjectTwoExamPlaceOpts = [];

  // 科目三考场
  private subjectThreeExamPlaceOpts = [];

  // 培训车型
  private carModelList = [];

  // 星级
  private starList = EDUCATIONAL_STAR;

  // 教练类型
  private coachTypeList = EDUCATIONAL_COACH_TYPE;

  // 带教班别
  private teachingClassList = [];

  // 带教类型
  private teachingSubjectsList: ParamsType = [];

  // 门店列表
  private storeList: ParamsType = [];

  // 训练场
  private spaceTrainingPlaceOpts: ParamsType = [];

  // 带教片区
  private teachingRegionOpts: ParamsType = [];

  private statusOpts = teachingStatusOpts;

  private pauseSubjectOpts = pauseSubjectOpts;

  private disabled = true; // 表单禁止修改

  private hadleStoreChange(val: string) {
    const { storeList, formData } = this;
    const _list = storeList.filter((item: any) => item.name === val);
    this.formData.storeId = _list[0] ? _list[0].id : 0;
    // 判断次要门店是否选中该门店，是：删除，不可勾选，否，不可勾选
    const { secondaryStore, storeId } = formData;
    const _lenId = secondaryStore.indexOf(storeId);
    if (_lenId > -1) {
      this.formData.secondaryStore.splice(_lenId, 1);
    }
  }

  /** 表单数据配置  */
  private isEdit = false; // 是否可以编辑

  private submitLoading = false; // 提交loading

  private formData: ParamsType = {
    certificateLevel: '',
    certificateNo: '',
    certificateValidDate: '',
    coachGroupId: null,
    distributionStudentMax: null,
    driverLicenseNo: '',
    drivingSchoolId: null,
    drivingSchoolName: '',
    entryTime: '',
    id: null,
    idNo: '',
    isApplyChange: true,
    isIntelligentCar: 0,
    issueDate: '',
    leaderId: null,
    leaderName: '',
    mobile: '',
    postType: 0,
    praiseNum: 0,
    quasiDrivingModel: '',
    realStart: 0,
    regionId: null,
    regionName: '',
    secondaryStore: [],
    sex: 0,
    showStar: null,
    spaceTrainingPlace: [],
    status: 0,
    storeId: null,
    storeName: '',
    subjectThreeExamPlace: [],
    subjectThreeLoad: null,
    subjectTwoExamPlace: [],
    subjectTwoLoad: null,
    teachCar: '',
    teachingClass: [],
    teachingRegion: [],
    teachingStatus: null,
    teachingSubjects: '',
    teachId: null,
    totalLoad: null,
    type: 1,
    userName: '',
    validDate: '',
    pauseSubject: 1
  }

  // 表单校验
  private formRules = {
    teachCar: [
      { required: true, message: '请选择车辆类型', trigger: ['change', 'blur'] }
    ],
    distributionStudentMax: [
      { required: true, message: '请输入可分配学员最大值', trigger: 'blur' },
      { pattern: REG_INTEGER, message: '请输入正确的格式, >0正整数' },
      {
        type: 'number', min: 1, max: 9999, message: '请输入正确的1-9999的数字'
      },
    ],
    storeName: [
      { required: true, message: '请选择主要门店', trigger: ['change', 'blur'] }
    ],
    teachingStatus: [
      { required: true, message: '请选择带教状态', trigger: ['change', 'blur'] }
    ],
    teachingClass: [
      { required: true, message: '请选择带教班别', trigger: ['change', 'blur'] }
    ],
    teachId: [
      { required: true, message: '请选择带教类型', trigger: ['change', 'blur'] }
    ],
    type: [
      { required: true, message: '请选择教练类型', trigger: ['change', 'blur'] }
    ],
    teachingRegion: [
      { required: true, message: '请选择可带教片区', trigger: ['change', 'blur'] }
    ]
  }

  /** 事件处理 */

  private teachingSubjectsChange(val: number) {
    const _list = this.teachingSubjectsList.filter((item: any) => item.id === val);
    this.formData.teachingSubjects = _list.length > 0 ? _list[0].name : '';
    this.formData.pauseSubject = 1;
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = deepClone(data);
      if (type === 'drivingSchool') {
        this.teachingRegionOpts = _data;
      }
      if (type === 'region') {
        this.storeList = _data;
      }
    }
  }

  // 车辆信息列表
  private carInformation: ParamsType = [];

  /**
   * @description 可带教片区切换
   */
  private handleTeachingRegion(val: string) {
    this.storeList = [];
    this.teachingRegionOpts.forEach(async (item: any) => {
      if (this.formData.teachingRegion.includes(item.name)) {
        this.queryGroupMechanismData({ pid: item.id }).then((data: any) => {
          this.storeList = this.storeList.concat(data);
        });
      }
    });
    // 片区切换,清空选中的门店
    this.formData.secondaryStore = [];
    this.formData.storeName = '';
    this.formData.storeId = '';
  }

  /**
   * @description 根据id获取到详情，设置表单数据
   */
  private async _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const { isEdit } = this;
    const _data = deepClone(param);
    Object.keys(this.formData).forEach(key => {
      if (_data[key] !== undefined || key === 'teachingRegion') {
        if (!isEdit) {
          if (key === 'spaceTrainingPlace') {
            const _list = JSON.parse(_data[key]);
            _list.forEach((item: any) => {
              this.formData[key].push(item.id);
            });
          } else if (key === 'teachingClass') {
            const _list = JSON.parse(_data[key]);
            _list.forEach((item: any) => {
              this.formData[key].push(item.id);
            });
          } else if (key === 'teachingRegion') {
            // 如果当前教练没有可带教片区,直接赋值教练所在片区
            this.formData[key] = _data[key] ? JSON.parse(_data[key]) : [_data.regionName];
          } else if (key === 'subjectThreeExamPlace' || key === 'subjectTwoExamPlace') {
            this.formData[key] = _data[key] ? JSON.parse(_data[key]) : [];
          } else if (key === 'secondaryStore') {
            // 处理次要门店
            const _list = JSON.parse(_data[key]) || [];
            _list.forEach((item: any) => {
              this.formData[key].push(item.id);
            });
          } else {
            this.formData[key] = _data[key];
          }
        } else {
          this.formData[key] = _data[key];
        }
      }
    });
    const {
      carInformation, drivingSchoolId
    } = _data;
    // 查询片区列表
    await this.selectFunc('drivingSchool', drivingSchoolId);
    // 根据可带教片区，查询门店
    this.teachingRegionOpts.forEach(async (item: any) => {
      if (this.formData.teachingRegion.includes(item.name)) {
        this.queryGroupMechanismData({ pid: item.id }).then((data: any) => {
          this.storeList = this.storeList.concat(data);
        });
      }
    });
    // 处理车辆信息
    if (carInformation) {
      const _carInformation = JSON.parse(carInformation);
      this.carInformation = _carInformation;
    }
    this.$nextTick(() => {
      (this.$refs.coachForm as VueComponentParent).clearValidate();
    });
  }

  /**
   * 提交表单前，处理特殊字段
   */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = deepClone(this.formData);
    const {
      teachingClass, spaceTrainingPlace, subjectTwoExamPlace, subjectThreeExamPlace,
      secondaryStore, teachingRegion
    } = sendData;
    // 处理 带教班别
    const _teachingClass: ParamsType = [];
    this.teachingClassList.forEach((item: any) => {
      if (teachingClass.includes(item.id)) {
        _teachingClass.push(item);
      }
    });
    sendData.teachingClass = JSON.stringify(_teachingClass);
    // 处理带教训练场
    const _spaceTrainingPlace: ParamsType = [];
    this.spaceTrainingPlaceOpts.forEach((item: any) => {
      if (spaceTrainingPlace.includes(item.id)) {
        _spaceTrainingPlace.push(item);
      }
    });
    sendData.spaceTrainingPlace = JSON.stringify(_spaceTrainingPlace);
    // 处理次要门店
    const _secondaryStore: ParamsType = [];
    this.storeList.forEach((item: any) => {
      if (secondaryStore.includes(item.id)) {
        _secondaryStore.push(item);
      }
    });
    sendData.secondaryStore = JSON.stringify(_secondaryStore);
    // 处理科目二考场
    sendData.subjectTwoExamPlace = JSON.stringify(subjectTwoExamPlace || []);
    // 处理科目三考场
    sendData.subjectThreeExamPlace = JSON.stringify(subjectThreeExamPlace || []);
    // 处理带教片区
    sendData.teachingRegion = JSON.stringify(teachingRegion || []);
    return sendData;
  }

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /**
   * 根据id教练详情
   */
  async queryDetail(id: string) {
    const data = await this.queryCoachesInfoById({ id });
    // 处理返回来的字段
    this._setFormDataFunc(data);
  }

  /**
   * 新增/修改
   */
  async submit() {
    (this.$refs.coachForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 特殊字段处理
        const sendData = this._specialHandleFormData();
        const { id } = this.$route.query;
        this.submitLoading = true;
        if (!id) {
          this.saveCoachInfo(sendData).then(() => {
            this.$message.success('新增成功！');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          this.updateCoachInfo(sendData).then(() => {
            this.$message.success('修改成功！');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /**
   * 取消提交
   * 返回上一页
   */
  cancelSubmit() {
    (this.$parent as any).goback();
    this.$router.push({ path: '/educational/coach_mg/coach_list' });
  }

  private async initSearch() {
    this.queryTeachTypePullFrame().then((res: any) => {
      this.teachingSubjectsList = res;
    });

    this.queryTeachCarsList().then((res: any) => {
      this.carModelList = res;
    });

    this.queryClassesList({ type: 1 }).then((res: any) => {
      this.teachingClassList = res;
    });

    await this.getExamPlaceBySubjects({ subjects: 2 }).then((res: any) => {
      this.subjectTwoExamPlaceOpts = res;
    });

    this.getExamPlaceBySubjects({ subjects: 3 }).then((res: any) => {
      this.subjectThreeExamPlaceOpts = res;
    });

    this.queryTrainingPlaceByDrivingSchoolIdList().then((res: any) => {
      this.spaceTrainingPlaceOpts = res;
    });
  }

  // 生命周期钩子函数
  perm = {};

  async mounted() {
    const { id, edit, isApplyChange } = this.$route.query;
    if (edit) this.isEdit = true;
    if (typeof id === 'string' && id) {
      if (!isApplyChange) this.formData.isApplyChange = false;
      this.queryDetail(id);
    } else {
      // 新增的时候根据当前用户，获取驾校

      const { drivingSchoolId } = this.userInfo;
      this.selectFunc('drivingSchool', drivingSchoolId);
    }
    // this.formData.isApplyChange = false;
    if (!this.isEdit) {
      this.initSearch();
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
