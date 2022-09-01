import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import {
  FILTER_EXCEL_TYPE, deepClone, modifyFormatJsonToObject
} from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { ParamsType, TableOptionsValue } from '@/type';
import {
  setTableLabels, marginTableLabels, getTemplateDownloadProps
} from '@/views/educational/_common/common';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtSetField, CtjtAutoUpload
} from '@/components';
import download from '@/assets/js/download';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtSetField,
    CtjtAutoUpload
  }
})
export default class EducationalCoachMgTeachGroupMg extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryCoachGroupsList') private queryCoachGroupsList!: (data: any) => ParamsType;

  @Action('assignment/queryCoachGroupsDetailById') private queryCoachGroupsDetailById!: (data: any) => ParamsType;

  @Action('assignment/queryCoachNoCoachGroup') private queryCoachNoCoachGroup!: (data: any) => ParamsType;

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
    inputList: [
      {
        label: '关键词',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 250,
        clearable: true,
        placeholder: '请输入教学组名，教学组长姓名',
      }
    ],
    selectList: [
      {
        label: '驾校',
        key: 'drivingSchoolId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
      },
      {
        label: '片区',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
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
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        this.selectFunc('region', value);
      }
    }
  }

  /**
   * @description 搜索列表回调函数
   */
  public searchTableCallBack(val: string) {
    if (val === 'reset') {
      this.searchForm.selectList[1].options = [];
    }
    this.queryList();
  }

  // 分页列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 4,
        label: '教学组导入模板',
        path: 'btn_jxzdrmb'
      },
      {
        id: 1,
        label: '新增教学组',
        path: 'btn_xzjxz'
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
    ],
    labels: [],
    list: [],
    selectionList: [],
    deepList: []
  }

  /**
   * @description 分页列表操作项回调函数
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 1) {
      // 新增
      this.jumpDetail();
      return;
    }
    if (id === 4) {
      download(getTemplateDownloadProps('teach_group_mg'));
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      if (id === 2) {
        // 编辑
        const { id: _id } = selectionList[0];
        this.jumpDetail(_id);
      }
    }
  }

  /**
   * @description 分页列表勾选回调函数
   */
  private tableSelectionChange(val: Array<any>) {
    this.tableData.selectionList = val;
  }

  // 导入路径
  private uploadPath = '/assignment/v1/coachGroups/importExcel';

  // 导入上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    fileAccept: FILTER_EXCEL_TYPE // 限制上传文件格式
  };

  /** 文件上传回调 */
  uploadCallback() {
    this.queryList();
  }

  /**
   * @description 请求列表数据
   */
  async queryList() {
    this.tableData.loading = true;
    const _data = drawSearchForm(this.searchForm);
    this.queryCoachGroupsList(_data).then((res: any) => {
      this.tableData.list = res;
    }).finally(() => {
      this.tableData.loading = false;
    });
  }

  /**
   * @description 跳转到新增教学组详情页面
   */
  private jumpDetail(id?: string, isEdit?: string) {
    this.$router.push({ path: '/educational/coach_mg/teach_group_mg/detail', query: { id, isEdit } });
  }

  /**
   * @description 打开详情弹窗
   */
  private openDrawerDetail(id: string) {
    this.queryCoachGroupsDetailById({ id }).then((res: any) => {
      this.drawerDetail = true;
      this.drawerTableData.data = res;
      this.drawerTableData.list = res.coaches;
    });
  }

  // 抽屉-教学组详情
  private drawerDetail = false;

  private drawerTableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'userName',
        label: '教练姓名',
        render(h: any, params: any) {
          const { userName, id } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                const that = params._self.tableData._this;
                that.$router.push({ path: '/educational/coach_mg/coach_list/detail', query: { id, isEdit: '1' } });
                that.drawerDetail = false;
              }
            }
          }, userName);
        }
      },
      {
        key: 'mobile',
        label: '手机号'
      },
      {
        key: 'carInformation',
        label: '教练车车牌',
        render(h: any, params: any) {
          const { carInformation } = params.row;
          const _list = carInformation ? modifyFormatJsonToObject(carInformation) : [];
          const _text: Array<string> = [];
          _list.forEach((item: any) => _text.push(item.number));
          return h('div', _text.join(', '));
        }
      },
      {
        key: 'regionName',
        label: '片区'
      },
      {
        key: 'teachingSubjects',
        label: '带教类型'
      }
    ],
    list: [],
    data: {}
  };

  /**
   * @description 打开未分配教练弹窗
   */
  private openDrawerNoGrouping(regionId: string) {
    this.queryCoachNoCoachGroup({ regionId }).then((res: any) => {
      this.drawerNoGrouping = true;
      this.drawerNoGroupingTableData.data = res;
      this.drawerNoGroupingTableData.list = res;
    });
  }

  // 未分配教练列表抽屉
  private drawerNoGrouping = false;

  private drawerNoGroupingTableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'userName',
        label: '教练姓名'
      },
      {
        key: 'mobile',
        label: '手机号'
      },
      {
        key: 'carInformation',
        label: '教练车车牌',
        render(h: any, params: any) {
          const { carInformation } = params.row;
          const _list = carInformation ? modifyFormatJsonToObject(carInformation) : [];
          const _text: Array<string> = [];
          _list.forEach((item: any) => _text.push(item.number));
          return h('div', _text.join(', '));
        }
      },
      {
        key: 'regionName',
        label: '片区'
      },
      {
        key: 'teachingSubjects',
        label: '带教类型'
      }
    ],
    list: [],
    data: []
  };

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
      if (type === 'driverSchool') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'region') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  // 生命周期
  async mounted() {
    this.tableData._this = this;
    this.drawerTableData._this = this;
    this.tableLabelType = 'COACH_MG_TEACH_GROUP_MG_LABEL';
    this.initSetTableLabel();
    // 先默认请求驾校
    await this.selectFunc('driverSchool', '0');
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
