import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtSelect,
  CtjtPrint,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import {
  ParamsType, TableOptionsValue, VueComponentParent
} from '@/type';
import { searchTableKeyword } from '@/assets/js/common';
import {
  marginTableLabels, setTableLabels
} from '@/views/accreditation/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import clearCacheMixins from '@/mixins/clearCache';

const tableOptionList = [
  {
    id: 1,
    label: '补录办证数据',
    type: 'primary',
    path: 'btn_blbzsj'
  },
  {
    id: 2,
    label: '打印',
    type: 'warning',
    path: 'btn_print'
  },
  {
    id: 3,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
];

const typeList = [
  {
    id: 1,
    label: '门店交档案',
  },
  {
    id: 2,
    label: '片区交档案',
  },
  {
    id: 3,
    label: '牌证收档案',
  },
  {
    id: 4,
    label: '牌证收档案（无实物）',
  },
  {
    id: 5,
    label: '退档案',
  },
];

const getLabelFunc = (type: number) => {
  const _list = typeList.filter(item => item.id === type);
  const _text = _list.length > 0 ? _list[0].label : '';
  return _text;
};

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtStatistics,
    CtjtCard,
    CtjtSelect,
    CtjtPrint
  },
  filters: {
    typeFilter(type: number): string {
      return getLabelFunc(type);
    }
  }
})
export default class AccreditationFileFilingManageDetail extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, clearCacheMixins) {
  @Action('license/queryFilesDetails') private queryFilesDetails!: (data: any) => any;

  @Action('license/postFilesDispose') private postFilesDispose!: (data: any) => any;

  @Action('license/deleteFilesDispose') private deleteFilesDispose!: (data: any) => any;

  @Action('license/queryFilesFuzzyUsers') private queryFilesFuzzyUsers!: (data: any) => any;

  // 弹窗名称
  private dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  // 列表搜索项配置
  public searchForm: ParamsType = {
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '请输入学员姓名、证件号',
        clearable: true,
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
      },
    ]
  }

  /**
   * @description 列表搜索 操作按钮回调
   */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      const keyword = this.searchForm.inputList[0].value;
      this.tableData.list = searchTableKeyword(keyword, this.list);
    }
    if (key === 'reset') {
      this._resetSearchFunc();
    }
  }

  /**
   * @description 重置列表搜索回调
   */
  private _resetSearchFunc() {
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

  // 打印列表配置
  private printTableData: ParamsType = {};

  // 打印列表展示
  private printShow = false;

  /**
   * @description 表格操作回调
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const { batchNo, type } = this.changeDetailData;
    if (id === 1) {
      // 补录
      if (type === 1 || type === 2) {
        const { list } = this;
        const _flagList = list.filter((item: any) => item.fileStatus > 1);
        if (_flagList.length > 0) {
          this.$message.warning('不可补录');
          return;
        }
      }
      this.drawer = true;
    }
    if (id === 2) {
      // 打印
      const { list, labels } = this.tableData;
      this.printTableData = {
        index: true,
        list,
        labels,
        title: `档案归档-${getLabelFunc(type)}`,
        batchNo
      };
      this.printShow = true;
    }
    if (id === 3) {
      // 删除
      if (selectionList.length > 0) {
        this.deteleUserFunc(selectionList);
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
  }

  /**
   * @description 删除学员档案
   */
  private async deteleUserFunc(val: Array<any>) {
    // 先判断，是什么类型的，然后判断列表状态都为待处理，
    const { type } = this.changeDetailData;
    if (type === 1 || type === 2) {
      const _flagList = val.filter(item => item.fileStatus > 1);
      if (_flagList.length > 0) {
        this.$message.warning('已完成或已退回状态不可删除');
        return;
      }
    }
    this.$confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const idNos: Array<string> = [];
      val.forEach(item => {
        idNos.push(item.idNo);
      });
      const { batchNo } = val[0];
      await this.deleteFilesDispose({ idNos, type, batchNo });
      this.queryList();
      this.$message.success('删除成功！');
    });
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 抽屉弹窗
  private drawer = false;

  private drawerTitle = '';

  // 抽屉弹窗表单
  private formData: ParamsType = {
    idNo: '',
    userName: '',
    orderId: '',
    fileId: ''
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
      const {
        idNo, userName, orderId, fileId
      } = _list[0];
      this.formData.idNo = idNo;
      this.formData.userName = userName;
      this.formData.orderId = orderId;
      this.formData.fileId = fileId;
    }
  }

  /**
   * @description 搜索身份证联想函数
   */
  private async queryIdNoSearch(val: string, cb: any) {
    this.handleIdNoSelectLoading = true;
    if (val.length >= 2) {
      const { type } = this.changeDetailData;
      const body = await this.queryFilesFuzzyUsers({
        idNo: val,
        type
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
          this.formList.unshift(JSON.parse(JSON.stringify(this.formData)));
          this.formTableData.list = this.formList;
          (this.$refs.drawerForm as VueComponentParent).resetFields();
        }
      }
    });
  }

  // 抽屉列表配置
  private formTableData: ParamsType = {
    _this: {},
    selection: true,
    index: true,
    options: [
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
        type: ''
      },
    ],
    labels: [
      {
        key: 'userName',
        label: '姓名',
        minWidth: 170,
      },
      {
        key: 'idNo',
        label: '证件号码',
        minWidth: 170,
      },
    ],
    list: [],
    selectionList: [],
  };

  /**
   * @description 关闭抽屉，清空数据
   */
  closeDrawer() {
    this.drawer = false;
    this.formList = [];
    this.formTableData.list = [];
    this.handleIdNoSelect = [];
    (this.$refs.drawerForm as VueComponentParent).resetFields();
  }

  /**
   * @description 列表操作回调
   */
  private formTableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.formTableData;
    const _len = selectionList.length;
    if (id === 3) {
      this.closeDrawer();
      return;
    }
    if (id === 2) {
      this.listsubmitFunc(selectionList);
      return;
    }
    if (_len >= 1) {
      if (id === 1) {
        this.deteleFunc(selectionList);
      }
    } else {
      this.$message.warning('请先勾列表项！');
    }
  }

  /**
   * @description 删除
   */
  deteleFunc(val: Array<any>) {
    this.$confirm('确定删除?', '', {
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
  private async listsubmitFunc(val: Array<any>) {
    this.$confirm('确定保存?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const { type, batchNo } = this.changeDetailData;
      const sendData = {
        list: this.formList,
        type,
        batchNo
      };
      await this.postFilesDispose(sendData);
      // 刷新列表
      this.paginationData.current = 1;
      this.queryList();
      this.$message.success('保存成功！');
      this.closeDrawer();
    });
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private formTableSelectionChange(val: []) {
    this.formTableData.selectionList = val;
  }

  /**
   * @description 搜索本地列表
   */
  searchTable() {
    const { formList, keyword } = this;
    this.formTableData.list = searchTableKeyword(keyword, formList);
  }

  // 返回列表数据
  private list: Array<any> = [];

  async queryList() {
    const { batchNo } = this.changeDetailData;
    // 处理数据
    const sendData = {
      batchNo,
    };
    const body = await this.queryFilesDetails(sendData);
    this.tableData.list = body;
    this.list = body;
    this.tableData.loading = false;
  }

  get statusText() {
    let _index1 = 0;
    let _index2 = 0;
    let _index3 = 0;
    const { list } = this;
    list.forEach(item => {
      const { fileStatus } = item;
      if (fileStatus === 1) _index1 += 1;
      if (fileStatus === 2) _index2 += 1;
      if (fileStatus === 3) _index3 += 1;
    });
    return `待处理：${_index1}，  已完成：${_index2}， 已退档：${_index3}`;
  }

  // 列表传过来的对象
  private changeDetailData: any = {};

  perm = {};

  historyParams: any = '';

  async activated() {
    this.tableData._this = this;
    this.tableLabelType = 'FILE_FILING_DETAIL_LIST';
    const { obj } = this.$route.query;
    const { historyParams } = this;
    if (obj !== historyParams) {
      this.searchForm.inputList[0].value = '';
    }
    this.historyParams = obj;
    if (typeof obj === 'string') {
      this.changeDetailData = JSON.parse(decodeURIComponent(obj));
      // 以下接口依赖于驾校id
      this.queryList();
      this.initSetTableLabel();
      this.drawerTitle = getLabelFunc(this.changeDetailData.type);
    }
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
