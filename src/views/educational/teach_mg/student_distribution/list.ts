import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
import { deepClone, getLastDay, timestampSizeCompare } from '@/assets/js/common';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { setTableLabels, marginTableLabels } from '@/views/educational/_common/common';
import { distributionModeOpts } from '@/views/educational/_enums/index';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtSetField
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtSetField
  }
})
export default class EducationalTeachMgStudentDistribution extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryAllotRecords') private queryAllotRecords!: (data: any) => ParamsType;

  @Action('assignment/queryAllotRecordsDetails') private queryAllotRecordsDetails!: (data: any) => ParamsType;

  @Action('goods/queryClassesList') private queryClassesList!: (data: any) => ParamsType;

  @Action('assignment/queryTeachTypeList') private queryTeachTypeList!: () => ParamsType;

  @Action('assignment/queryTeachCarsList') private queryTeachCarsList!: () => ParamsType;

  @Action('assignment/queryCoachesAllLeaders') private queryCoachesAllLeaders!: () => ParamsType;

  @State(state => state.base.userInfo) private userInfo!: ParamsType;

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

  // 列表搜索项
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '分配日期',
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
        placeholder: '请输入学员证件号码、姓名、受理号',
      },
      {
        label: '教练姓名',
        key: 'coachName',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入教练姓名',
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
        options: []
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
        label: '带教类型',
        key: 'teachType',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'name',
          label: 'name'
        }
      },
      {
        label: '带教车型',
        key: 'teachCar',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '教学组长',
        key: 'leaderId',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'userName'
        }
      },
      {
        label: '班别',
        key: 'classesName',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'name',
          label: 'name'
        }
      },
      {
        label: '分配方式',
        key: 'mode',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: distributionModeOpts,
        customOptions: {
          value: 'value',
          label: 'label',
        }
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
        this.selectFunc('region', value);
      }
    }
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      if (key === 'reset') {
        this.setQuarter();
        this.searchForm.selectList[1].options = [];
      }
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 分页列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [],
    labels: [],
    list: [],
    selectionList: []
  }

  private drawerFormData: ParamsType = {};

  private closeDrawerDetail() {
    this.drawerDetail = false;
    this.detailPaginationData.current = 1;
    this.detailPaginationData.pageSize = 10;
    this.drawerFormData = {};
  }

  private jumpDetail(id: string, coachName: string, mode: number) {
    this.drawerDetail = true;
    this.drawerFormData = {
      id,
      coachName,
      mode
    };
    this.queryAllotRecordsDetailsFunc(id, coachName, mode);
  }

  private async queryAllotRecordsDetailsFunc(id: string, coachName: string, mode: number) {
    const { searchForm, detailPaginationData } = this;
    const _data = drawSearchForm(searchForm, detailPaginationData);
    const sendData = {
      ..._data,
      coachId: id,
      mode
    };
    this.drawerTableData.loading = true;
    const body = await this.queryAllotRecordsDetails(sendData);
    const {
      data, current, total
    } = body;
    data.forEach((item: any) => {
      const _item = item;
      _item.coachName = coachName;
    });
    this.drawerTableData.list = data;
    this.detailPaginationData.current = current;
    this.detailPaginationData.total = total;
    this.drawerTableData.loading = false;
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
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
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
    const body = await this.queryAllotRecords(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  // 抽屉-学员分配记录明细
  private drawerDetail = false;

  private drawerTableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    labels: [
      {
        key: 'regionName',
        label: '片区'
      },
      {
        key: 'storeName',
        label: '门店'
      },
      {
        key: 'studentName',
        label: '学员姓名'
      },
      {
        key: 'mobile',
        label: '联系电话'
      },
      {
        key: 'idNo',
        label: '证件号码'
      },
      {
        key: 'subject',
        label: '学车状态',
        render(h: any, params: any) {
          const { subject } = params.row;
          return h('div', subject === 3 ? '科目三' : '科目二');
        },
      },
      {
        key: 'coachName',
        label: '教练姓名'
      },
      {
        key: 'createdTime',
        label: '分配时间'
      },
      {
        key: 'createdName',
        label: '分配操作人'
      }
    ],
    list: [],
  };

  // 未分配教练列表分页
  private detailPaginationData = {
    pageSize: 10,
    current: 1,
    total: 0
  };

  /**
   * @description 分页组件每页请求数量切换
   */
  private detailTableSizeChange(val: number) {
    this.detailPaginationData.pageSize = val;
    this.detailPaginationData.current = 1;
    const { id, coachName, mode } = this.drawerFormData;
    this.queryAllotRecordsDetailsFunc(id, coachName, mode);
  }

  /**
   * @description 分页组件页数切换
   */
  private detailTableCurrentChange(val: number) {
    this.detailPaginationData.current = val;
    const { id, coachName, mode } = this.drawerFormData;
    this.queryAllotRecordsDetailsFunc(id, coachName, mode);
  }

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'driverSchool') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'region') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  private setQuarter() {
    // 获取当前时间，
    const nowTime = new Date();
    const _ym = this.$dayjs(nowTime).format('YYYY-MM');
    // 获取下个月
    const _nextDay = getLastDay(nowTime.getFullYear(), nowTime.getMonth() + 1);
    this.searchForm.datePickerList[0].value = `${_ym}-01`;
    this.searchForm.datePickerList[1].value = `${_ym}-${_nextDay}`;
  }

  private async initSearch() {
    this.setQuarter();
    // 先默认请求驾校

    const { drivingSchoolId } = this.userInfo;
    this.selectFunc('driverSchool', drivingSchoolId);
    this.queryList();
    this.queryClassesList({ type: 1 }).then((res: any) => {
      const arr: string[] = [];
      const _nameArr: ParamsType = [];
      res.forEach((item: any) => {
        if (!arr.includes(item.name)) {
          arr.push(item.name);
          _nameArr.push(item);
        }
      });
      this.searchForm.selectList[5].options = _nameArr;
    });
    this.queryTeachTypeList().then((res: Array<any>) => {
      this.searchForm.selectList[2].options = res;
    });
    this.queryTeachCarsList().then((res: Array<any>) => {
      const _list = deepClone(res);
      const _arr: Array<any> = [];
      _list.forEach((item: any) => {
        _arr.push({
          id: item, label: item
        });
      });
      this.searchForm.selectList[3].options = _arr;
    });
    this.queryCoachesAllLeaders().then((res: any) => {
      this.searchForm.selectList[4].options = res;
    });
  }

  // 生命周期
  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'TEACH_MG_STUDENT_DISTRIBUTION_LABEL';
    this.initSetTableLabel();
    this.initSearch();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
