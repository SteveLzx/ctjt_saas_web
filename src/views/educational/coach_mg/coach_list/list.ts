import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import { deepClone, modifyFormatJsonToObject } from '@/assets/js/common';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  MARKET_SERVICE_STATUS
} from '@/enums';
import { setTableLabels, marginTableLabels } from '@/views/educational/_common/common';
import { teachingStatusOpts } from '@/views/educational/_enums/index';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtSetField
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField
  }
})
export default class EducationalCoach extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryCoachListPage') private queryCoachListPage!: (data: any) => ParamsType;

  @Action('assignment/queryTeachCarsList') private queryTeachCarsList!: () => ParamsType;

  @Action('assignment/getExamPlaceBySubjects') private getExamPlaceBySubjects!: (data: any) => ParamsType;

  @Action('car/queryAllCarBrand') private queryAllCarBrand!: () => ParamsType;

  @Action('assignment/queryTeachTypeList') private queryTeachTypeList!: () => ParamsType;

  @Action('assignment/queryCoachesCarPropertyList') private queryCoachesCarPropertyList!: () => ParamsType;

  @Action('goods/queryClassesList') private queryClassesList!: (data: any) => ParamsType;

  @Action('assignment/allocationCoachByIds') private allocationCoachByIds!: (data: any) => ParamsType;

  @Action('assignment/exportCoachList') private exportCoachList!: (data: any) => any;

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
              label: '教练姓名',
            },
            {
              id: 2,
              label: '教练车牌号',
            }
          ],
        },
        input: {
          key: 'optionValue',
          value: '',
          width: 200,
          clearable: true,
          placeholder: '请输入教练姓名',
        },
      },
    ],
    selectList: [
      {
        label: '驾校',
        key: 'drivingSchoolId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        disabled: true,
        options: []
      },
      {
        label: '所属片区',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '关联门店',
        key: 'storeId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '带教车型',
        key: 'teachCar',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: []
      },
      {
        label: '带教班别',
        key: 'teachingClass',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: [],
        customOptions: {
          value: 'name',
          label: 'name'
        }
      },
      {
        label: '带教状态',
        key: 'teachingStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: teachingStatusOpts,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      },
      {
        label: '供职状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: MARKET_SERVICE_STATUS,
      },
      {
        label: '考场',
        key: 'examPlace',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: [],
      },
      {
        label: '车辆品牌',
        key: 'carBrand',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: [],
        customOptions: {
          value: 'name',
          label: 'name'
        }
      },
      {
        label: '使用性质',
        key: 'property',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: []
      },
      {
        label: '教练车',
        key: 'isCoachCar',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: [
          {
            id: 0,
            label: '无教练车'
          },
          {
            id: 1,
            label: '有教练车'
          }
        ]
      },
      {
        label: '带教类型',
        key: 'teachingSubjects',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: [],
        customOptions: {
          value: 'name',
          label: 'name'
        }
      },
      {
        label: '是否机器人教练',
        key: 'isIntelligentCar',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 200,
        options: [
          {
            id: 0,
            label: '否'
          },
          {
            id: 1,
            label: '是'
          }
        ]
      },
    ],
    checkedList: [
      {
        key: 'isShowLeaveOfficeCoach',
        value: '',
        label: '显示离职教练',
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

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.searchForm.selectInputList[0].select.value = 1;
      this.searchForm.selectInputList[0].input.value = '';
      const { drivingSchoolName } = this.userInfo;
      this.searchForm.selectList[0].value = drivingSchoolName;
      this.searchForm.selectList[2].options = [];
      this.searchForm.selectList[4].options = [];
    }
  }

  /** 列表 开始 */
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    sortIndex: true,
    options: [
      {
        id: 1,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
      {
        id: 3,
        label: '正常分配',
        type: 'success',
        path: 'btn_zcfp'
      },
      {
        id: 4,
        label: '暂停分配',
        type: 'warning',
        path: 'btn_ztfp'
      },
      {
        id: 5,
        label: '申请修改',
        path: 'btn_sqxg'
      },
      {
        id: 6,
        label: '导出',
        type: 'primary',
        path: 'btn_export'
      }
    ],
    labels: [],
    list: [],
    selectionList: [],
    spanMethod: ({
      row, column, rowIndex, columnIndex
    }: any) => {
      const mainList = [0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      if (mainList.includes(columnIndex)) {
        if (row.marge !== undefined) {
          return {
            rowspan: row.marge,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      return {
        rowspan: 1,
        colspan: 1
      };
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

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 1) {
      // 新增
      this.jumpDetail('');
      return;
    }
    if (id === 6) {
      // 导出
      this._exportData();
      return;
    }
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) {
      this.$message.warning('请先勾选一项，再进行操作！');
      return;
    }
    if (id === 3 || id === 4) {
      const _ids: string[] = [];
      selectionList.forEach((item: any) => {
        _ids.push(item.id);
      });
      if (id === 3) {
        // 正常分配
        this.normalDistributionFunc(_ids);
      }
      if (id === 4) {
        // 暂停分配
        this.stopDistributionFunc(_ids);
      }
    } else {
      // 子项选中列表，必须是单选
      if (_len > 1) this.$message.warning('只能单选一项进行操作！');
      if (_len === 1) {
        const { id: _id, drivingSchoolName: _drivingSchoolName } = selectionList[0];
        if (id === 2 || id === 5) {
          // 编辑
          // 判断当前用户，和要编辑的驾校是否是一家驾校
          const { drivingSchoolName } = this.userInfo;
          if (_drivingSchoolName === drivingSchoolName) {
            if (id === 2) {
              this.jumpDetail(_id);
            }
            if (id === 5) {
              // 申请修改
              this.applyDodificationFunc(_id);
            }
          } else {
            this.$message.warning('当前用户和选中教练非同一家驾校！');
          }
        }
      }
    }
  }

  /** 导出所有数据 */
  private async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData = {
      ..._data,
    };
    sendData.drivingSchoolId = '';
    const { selectInputList } = searchForm;
    const { isShowLeaveOfficeCoach } = sendData;
    sendData.option = selectInputList[0].select.value;
    sendData.optionValue = selectInputList[0].input.value || null;
    sendData.isShowLeaveOfficeCoach = isShowLeaveOfficeCoach === 1;
    const body = await this.exportCoachList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `教练列表${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /**
   * @description 正常分配
   */
  private normalDistributionFunc(list: string[]) {
    this.$confirm('正常分配?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const sendData = {
        ids: list,
        status: 1
      };
      this.allocationCoachByIds(sendData).then(() => {
        this.queryList();
        this.$message.success('正常分配成功！');
      });
    });
  }

  /**
   * @description 暂停分配
   */
  private stopDistributionFunc(list: string[]) {
    this.$confirm('暂停分配?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const sendData = {
        ids: list,
        status: 2
      };
      this.allocationCoachByIds(sendData).then(() => {
        this.queryList();
        this.$message.success('暂停分配成功！');
      });
    });
  }

  /**
   * @description 申请修改
   */
  private applyDodificationFunc(id: string) {
    this.$confirm('申请修改?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.jumpDetail(id, '', '1');
    });
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }
  /** 列表 结束 */

  /** 业务处理 开始 */
  private jumpDetail(val: string, isEdit?: string, isApplyChange?: string): void {
    this.$router.push({ path: '/educational/coach_mg/coach_list/detail', query: { id: val, edit: isEdit, isApplyChange } });
  }

  /** 搜索下拉框筛选 */
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
      if (type === 'store') {
        this.searchForm.selectList[2].options = _data;
      }
    }
  }

  /** 搜索筛选框选择回调 */
  searchSelectChange(val: ParamsType) {
    const { value, key, options } = val;
    if (key === 'option') {
      const _list = options.filter((item: any) => item.id === value);
      this.searchForm.selectInputList[0].input.placeholder = `请输入${_list[0].label}`;
      this.searchForm.selectInputList[0].input.value = '';
    }
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      this.searchForm.selectList[4].value = '';
      this.searchForm.selectList[4].options = '';
      if (value) {
        this.selectFunc('region', value);
      }
    }
    if (key === 'regionId') {
      this.searchForm.selectList[2].options = [];
      this.searchForm.selectList[2].value = '';
      if (value) {
        this.selectFunc('store', value);
      }
    }
  }

  searchSelectVisibleChange(val: ParamsType) {
    const { key } = val;
    if (key === 'teachingClass') {
      if (!this.searchForm.selectList[0].value) {
        this.$message.warning('选择班别前，请先选择驾校！');
      }
    }
  }

  /** 业务处理 结束 */

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /**
   * 请求场地列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
    };
    sendData.drivingSchoolId = '';
    const { selectInputList } = searchForm;
    const { isShowLeaveOfficeCoach } = sendData;
    sendData.option = selectInputList[0].select.value;
    sendData.optionValue = selectInputList[0].input.value || null;
    sendData.isShowLeaveOfficeCoach = isShowLeaveOfficeCoach === 1;
    const body = await this.queryCoachListPage(sendData);
    const {
      data, current, total
    } = body;
    // 处理后端数据,树形结构
    this.tableData.list = this.setTreeData(data);
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  private setTreeData(data: Array<any>) {
    const _data = deepClone(data);
    const _list: any = [];
    _data.forEach((item: any, sortIndex: number) => {
      const {
        carBrand, number, carType, property, carId
      } = item;
      if (!carId) {
        const _obj = {
          ...item,
          ...{
            marge: 1,
            nosort: sortIndex + 1
          }
        };
        _list.push(_obj);
      } else {
        // 后端返回都是json字符串数组
        const _number = modifyFormatJsonToObject(number);
        const _carBrand = modifyFormatJsonToObject(carBrand);
        const _carType = modifyFormatJsonToObject(carType);
        const _property = modifyFormatJsonToObject(property);
        const _carId = modifyFormatJsonToObject(carId);
        _number.forEach((i: any, index: number) => {
          const _obj = {
            ...item,
            ...{
              number: i,
              carBrand: _carBrand[index],
              carType: _carType[index],
              property: _property[index],
              carId: _carId[index],
            }
          };
          if (index === 0) {
            _obj.marge = _number.length;
            _obj.nosort = sortIndex + 1;
          }
          _list.push(_obj);
        });
      }
    });
    return _list;
  }

  private initSearch() {
    const { drivingSchoolId, drivingSchoolName } = this.userInfo;
    this.searchForm.selectList[0].value = drivingSchoolName;
    this.selectFunc('region', drivingSchoolId);
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
    this.getExamPlaceBySubjects({ subjects: 1 }).then((res: Array<any>) => {
      const _list = deepClone(res);
      const _arr: Array<any> = [];
      _list.forEach((item: any) => {
        _arr.push({
          id: item, label: item
        });
      });
      this.searchForm.selectList[7].options = _arr;
    });
    this.queryAllCarBrand().then((res: Array<any>) => {
      this.searchForm.selectList[8].options = res;
    });
    this.queryCoachesCarPropertyList().then((res: Array<any>) => {
      const _list = deepClone(res);
      const _arr: Array<any> = [];
      _list.forEach((item: any) => {
        _arr.push({
          id: item, label: item
        });
      });
      this.searchForm.selectList[9].options = _arr;
    });
    this.queryTeachTypeList().then((res: Array<any>) => {
      this.searchForm.selectList[11].options = res;
    });
    this.queryClassesList({ type: 1 }).then((res: any) => {
      const arr: string[] = [];
      const _nameArr: ParamsType = [];
      res.forEach((item: any) => {
        if (!arr.includes(item.name)) {
          arr.push(item.name);
          _nameArr.push(item);
        }
      });
      this.searchForm.selectList[4].options = _nameArr;
    });
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'COACH_MG_COACH_LIST_LABEL';
    this.initSetTableLabel();
    this.queryList();
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
