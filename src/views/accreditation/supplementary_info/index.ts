import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtSelect,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import {
  ParamsType, TableOptionsValue, StaticDataType, VueComponentParent
} from '@/type';
import { searchTableKeyword, timestampSizeCompare, } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  marginTableLabels,
  setTableLabels,
} from '@/views/accreditation/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';

const tableOptionList = [
  {
    id: 1,
    label: '片区交资料',
    type: 'primary',
    path: 'btn_pqjzl'
  },
  {
    id: 2,
    label: '牌证收资料',
    type: 'primary',
    path: 'btn_pzszl'
  },
  {
    id: 3,
    label: '牌证退资料',
    type: 'primary',
    path: 'btn_pztzl'
  },
  {
    id: 4,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
];

const statusOptions = [
  {
    id: 1,
    label: '待处理',
  },
  {
    id: 2,
    label: '已完成',
  },
  {
    id: 3,
    label: '已退回',
  },
];

const typeOptions = [
  {
    id: 1,
    label: '片区交资料',
  },
  {
    id: 2,
    label: '牌证收资料',
  },
  {
    id: 3,
    label: '牌证退资料',
  },
];

const nameOptions = [
  {
    value: '流水号注销委托书',
    label: '流水号注销委托书',
  },
  {
    value: 'C1转C2委托书',
    label: 'C1转C2委托书',
  },
  {
    value: '电话号码变更委托书',
    label: '电话号码变更委托书',
  },
  {
    value: '取消考试委托书',
    label: '取消考试委托书',
  },
];

const formTableOptions = [
  {
    id: 1,
    label: '删除',
    type: 'danger'
  },
  {
    id: 2,
    label: '保存',
    type: 'primary'
  },
  {
    id: 3,
    label: '取消',
    type: 'info'
  },
];

const formTableLabels = [
  {
    key: 'userName',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'regionName',
    label: '片区',
    minWidth: 80,
  },
  {
    key: 'storeName',
    label: '门店',
    minWidth: 80,
  },
  {
    key: 'materialName',
    label: '资料名称',
    minWidth: 120,
  },
  {
    key: 'remarks',
    label: '备注',
    width: 200,
    render(h: any, params: any) {
      const { remarks } = params.row;
      if (remarks) {
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: remarks,
          },
          scopedSlots: {
            reference: () => h('p', remarks),
          },
        });
      }
      return h('span', '');
    }
  },
  {
    key: 'certificateDate',
    label: '办证日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { certificateDate } = params.row;
      const index = params.$index;
      const that = params._self.tableData._this;
      if (that.drawerType === 2) {
        return h('el-date-picker', {
          props: {
            type: 'date',
            value: certificateDate,
            clearable: false,
          },
          on: {
            input: (val: any) => that.setformTableItemDateFunc(index, val),
          }
        });
      }
      if (!certificateDate) return h('div', '');
      return h('div', dayjs(certificateDate).format('YYYY-MM-DD'));
    }
  },
];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtStatistics,
    CtjtCard,
    CtjtSelect
  },
})
export default class AccreditationSupplementaryInformation extends mixins(accreditationSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('license/queryMaterialsList') private queryMaterialsList!: (data: any) => any;

  @Action('license/deleteMaterialsBatchNo') private deleteMaterialsBatchNo!: (data: any) => any;

  @Action('license/queryMaterialsDispose') private queryMaterialsDispose!: (data: any) => any;

  @Action('license/queryMaterialsFuzzyUsers') private queryMaterialsFuzzyUsers!: (data: any) => any;

  @Action('license/queryMaterialsUsers') private queryMaterialsUsers!: (data: any) => any;

  // 资料名称筛选项
  private nameOptions = nameOptions;

  // 弹窗名称
  private dialogName = '';

  // 列表搜索项配置
  public searchForm: ParamsType = {
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
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 240,
        placeholder: '请输入批次号',
        clearable: true,
      },
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
        label: '办证类型',
        key: 'type',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: typeOptions
      },
      {
        label: '批次状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: statusOptions,
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
      {
        label: '资料名称',
        key: 'materialName',
        value: '',
        placeholder: '请输入内容',
        width: 160,
        maxlength: 30,
        clearable: true,
        options: nameOptions,
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
    ]
  }

  /**
   * @description 表单搜索回调函数
   */
  private autocompleteMaterialNameQuerySearch(val: string, cb: (result: any) => void) {
    const restaurants = this.nameOptions;
    const results = val ? restaurants.filter(this.createFilter(val)) : restaurants;
    // 调用 callback 返回建议列表的数据
    cb(results);
  }

  /**
   * @description 抽屉表单搜索回调函数
   */
  private drawerAutocompleteQuerySearch(val: string, cb: (result: any) => void) {
    const restaurants = this.nameOptions;
    const results = val ? restaurants.filter(this.createFilter(val)) : restaurants;
    // 调用 callback 返回建议列表的数据
    cb(results);
  }

  /**
   * @description 过滤器函数
   */
  createFilter(val: string) {
    return (restaurant: any) => (restaurant.value.toLowerCase().indexOf(val.toLowerCase()) === 0);
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
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
    }
    if (key === 'reset') {
      this.searchForm.selectTimeList[0].select.value = 3;
      this.searchForm.autocompleteList[0].value = '';
      this._resetSearchFunc();
    }
  }

  /** 重置列表搜索回调 */
  private _resetSearchFunc() {
    this.paginationData.current = 1;
    this.queryList();
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
   * @description 列表操作回调
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id, label } = val;
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (id === 1 || id === 2 || id === 3) {
      this.drawerTitle = label;
      this.drawerType = id;
      if (id === 2 || id === 3) {
        this.queryUsersList(selectionList);
      }
      this.drawer = true;
    }
    if (id === 4) {
      if (_len < 1) {
        this.$message.warning('请先勾选批次号');
      } else {
        this.deteleFunc(selectionList);
      }
    }
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
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

  /**
   * @description 字段设置保存回调
   */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /**
   * @description 列表分页页数切换回调
   * @param { number } val
   */
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  /**
   * @description 列表分页下一页切换回调
   * @param { number } val
   */
  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  // 表单底部统计
  private statisticsData: StaticDataType[] = [];

  // 抽屉弹窗
  private drawer = false;

  private drawerTitle = '';

  private drawerType = 1;

  // 抽屉弹窗表单
  private formData: ParamsType = {
    idNo: '',
    userName: '',
    regionName: '',
    storeName: '',
    certificateDate: '',
    materialName: '',
    remarks: '',
    orderId: ''
  }

  // 交收档案列表
  private formList: Array<any> = [];

  // 抽屉搜索
  private keyword = '';

  private formDataRules = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    userName: [
      { required: true, message: '找不到学员', trigger: ['change', 'blur'] }
    ],
    regionName: [
      { required: true, message: '片区必填', trigger: ['change', 'blur'] }
    ],
    storeName: [
      { required: true, message: '门店必填', trigger: ['change', 'blur'] }
    ],
    certificateDate: [
      { required: true, message: '办证日期必填', trigger: ['change', 'blur'] }
    ],
    materialName: [
      { required: true, message: '资料名称必填', trigger: ['change', 'blur'] }
    ]
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
      const _obj = _list[0];
      Object.keys(_obj).forEach(key => {
        if (_obj[key]) {
          this.formData[key] = _obj[key];
        }
      });
    }
  }

  /**
   * @description 搜索身份证联想函数
   */
  private async queryIdNoSearch(val: any) {
    this.handleIdNoSelectLoading = true;
    if (val.length >= 2) {
      const body = await this.queryMaterialsFuzzyUsers({
        idNo: val,
        type: this.drawerType === 1 ? 1 : 2
      });
      this.handleIdNoSelect = body;
      this.handleIdNoSelectLoading = false;
    }
  }

  /**
   * @description 添加到本地列表
   */
  submitForm() {
    (this.$refs.drawerForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 先判断一下是否存在当前数据
        const { formData } = this;
        const idNoFlag = this.formList.filter(item => item.idNo === formData.idNo);
        if (idNoFlag.length > 0) {
          this.$message.warning('添加用户已存在当前列表中，请勿重复添加！');
        } else {
          this.formData.certificateDate = this.$dayjs(formData.certificateDate).format('YYYY-MM-DD');
          this.formList.unshift(JSON.parse(JSON.stringify(this.formData)));
          this.formTableData.list = this.formList;
          (this.$refs.drawerForm as VueComponentParent).resetFields();
        }
      }
    });
  }

  // 抽屉表单配置列表
  private formTableData: ParamsType = {
    _this: {},
    selection: true,
    index: true,
    options: formTableOptions,
    labels: formTableLabels,
    list: [],
    selectionList: [],
  }

  /**
   * @description 关闭抽屉，清空数据
   */
  closeDrawer() {
    this.formList = [];
    this.formTableData.list = [];
    this.handleIdNoSelect = [];
    (this.$refs.drawerForm as VueComponentParent).resetFields();
    this.drawer = false;
  }

  /**
   * @description 列表操作回调
   */
  private formTableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, list } = this.formTableData;
    const _len = selectionList.length;
    if (id === 1) {
      if (_len >= 1) {
        this.drawerDeteleFunc(selectionList);
      } else {
        this.$message.warning('请先勾选信息');
      }
    }
    if (id === 2) {
      if (list.length > 0) {
        this.listsubmitFunc();
      } else {
        this.$message.warning('列表为空，请添加数据');
      }
    }
    if (id === 3) {
      this.closeDrawer();
    }
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private formTableSelectionChange(val: Array<any>) {
    this.formTableData.selectionList = val;
  }

  /**
   * @description 搜索本地列表
   */
  private searchTableFunc() {
    const { formList, keyword } = this;
    this.formTableData.list = searchTableKeyword(keyword, formList);
  }

  /**
   * @description 修改抽屉列表办证日期
   */
  setformTableItemDateFunc(index: number, val: any) {
    if (val !== null) {
      const _time = this.$dayjs(val).format('YYYY-MM-DD');
      this.formTableData.list[index].certificateDate = _time;
      // 替换本地列表数据
      const _idNo = this.formTableData.list[index].idNo;
      this.formList.forEach(item => {
        if (item.idNo === _idNo) {
          const _item = item;
          _item.certificateDate = _time;
        }
      });
    }
  }

  /**
   * @description 抽屉删除
   */
  private drawerDeteleFunc(val: Array<any>) {
    this.$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 剪切本地列表
      const _idNos: Array<string> = [];
      val.forEach(item => _idNos.push(item.idNo));
      const _newList = this.formList.filter(item => !_idNos.includes(item.idNo));
      this.formList = _newList;
      this.formTableData.list = this.formList;
    });
  }

  /**
   * @description 提交列表保存
   */
  private async listsubmitFunc() {
    const sendData = this.formList;
    this.$confirm('确定保存?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await this.queryMaterialsDispose({ type: this.drawerType, sendData });
      // 刷新列表
      this.paginationData.current = 1;
      this.queryList();
      this.$message.success('保存成功！');
      this.closeDrawer();
    });
  }

  /**
   * @description  请求列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const body = await this.queryMaterialsList(sendData);
    const { data = [], current, total } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
    this.statisticsData = [{ label: '批次总数：', value: total }];
  }

  /**
   * @description 跳转补交资料明细列表
   */
  jumpDetail(batchNo: string) {
    this.$router.push({ path: '/accreditation/student/supplementary_info/detail', query: { batchNo } });
  }

  /**
   * @description 删除
   */
  deteleFunc(val: Array<any>) {
    const _flagList = val.filter(item => item.type === 1 && item.status > 1);
    if (_flagList.length > 0) {
      this.$message.warning('片区交资料已完成或已退回状态不可删除');
      return;
    }
    this.$confirm('确定删除所选的批次号数据?', '', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const sendData: Array<any> = [];
      val.forEach(item => {
        sendData.push(item.batchNo);
      });
      await this.deleteMaterialsBatchNo({ batchNos: sendData });
      this.$message.success('删除成功');
      this.paginationData.current = 1;
      this.queryList();
    });
  }

  /**
   * @description 根据批次号获取学员列表
   */
  private async queryUsersList(val: Array<any>) {
    const sendData: string[] = [];
    val.forEach(item => {
      sendData.push(item.batchNo);
    });
    const body = await this.queryMaterialsUsers({ batchNos: sendData });
    this.formList = body;
    this.formTableData.list = body;
  }

  async mounted() {
    this.tableData._this = this;

    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.tableLabelType = 'SUPPLEMENTARY_INFO_LIST';
    this.formTableData._this = this;
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
