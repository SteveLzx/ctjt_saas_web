import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtSelect,
  CtjtSetField,
  CtjtStatistics,
  CtjtAutoUpload,
  CtjtOperationLog
} from '@/components';
import { CtjtCertificateResultDialog } from '@/views/accreditation/_components';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  ParamsType, TableOptionsValue, VueComponentParent
} from '@/type';
import {
  deepClone, timestampSizeCompare, FILTER_EXCEL_TYPE, matchNumberList
} from '@/assets/js/common';
import {
  marginTableLabels, setTableLabels, getTemplateDownloadProps
} from '@/views/accreditation/_common/common';
import download from '@/assets/js/download';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const typeOptions = [
  {
    label: '门店交档案',
  },
  {
    label: '片区交档案',
  },
  {
    label: '牌证收档案',
  },
  {
    label: '牌证收档案（无实物）',
  },
  {
    label: '退档案',
  },
];

const tableOptionList = [
  {
    id: 7,
    label: '下载导入模板',
    type: 'primary',
    path: 'btn_import_temp'
  },
  {
    id: 9,
    label: '导出',
    type: 'primary',
    path: 'btn_export'
  },
  {
    id: 1,
    label: '门店交档案',
    type: 'primary',
    path: 'btn_mdjda'
  },
  {
    id: 2,
    label: '片区交档案',
    type: 'primary',
    path: 'btn_pqjda'
  },
  {
    id: 3,
    label: '牌证收档案',
    type: 'primary',
    path: 'btn_pzsda'
  },
  {
    id: 4,
    label: '牌证收档案（无实物）',
    type: 'primary',
    path: 'btn_pzsdawsw'
  },
  {
    id: 5,
    label: '退档案',
    type: 'primary',
    path: 'btn_tda'
  },
  {
    id: 6,
    label: '保存修改',
    type: 'primary',
    path: 'btn_save'
  },
  {
    id: 10,
    label: '删除',
    type: 'danger',
    path: 'btn_delete'
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
    CtjtSelect,
    CtjtAutoUpload,
    CtjtCertificateResultDialog,
    CtjtOperationLog
  },
})
export default class AccreditationFileFilingManage extends mixins(accreditationSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins, accreditationOperationLogMixins) {
  @Action('license/queryFilesList') private queryFilesList!: (data: any) => any;

  @Action('license/queryFilesListExport') private queryFilesListExport!: (data: any) => any;

  @Action('license/postFilesDispose') private postFilesDispose!: (data: any) => any;

  @Action('license/queryFilesFuzzyUsers') private queryFilesFuzzyUsers!: (data: any) => any;

  @Action('license/editFilesList') private editFilesList!: (data: any) => any;

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
        width: 200,
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
        width: 120,
        options: [],
      },
      {
        label: '',
        key: 'storeId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: [],
      },
      {
        label: '办证类型',
        key: 'fileStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: typeOptions,
        customOptions: {
          value: 'label',
          label: 'label'
        }
      }
    ],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、证件号',
        width: 200,
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
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        path: 'btn_search'
      },
      {
        label: '操作日志',
        key: 'log',
        path: 'btn_log'
      },
    ]
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
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.searchForm.selectList[1].options = [];
    }
    if (key === 'log') {
      this.queryOperationLogPage('档案归档/退档');
      this.logshow = true;
    }
  }

  // 表格配置
  tableData: ParamsType = {
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
   * @description 列表选中每一列切换回调
   */
  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  setTableItemValFunc(index: number, val: any) {
    this.tableData.list[index].remark = val;
  }

  /**
   * @description 表格操作回调
   */
  async tableOptionCallback(val: TableOptionsValue) {
    const { id: _id, label } = val;
    const { list, selectionList } = this.tableData;
    if (_id === 7) {
      download(getTemplateDownloadProps('档案归档导入'));
    }
    if (_id === 9) {
      this.exportData();
    }
    if (_id === 1 || _id === 2 || _id === 3 || _id === 4 || _id === 5) {
      this.formData.status = label;
      this.drawer = true;
      window.addEventListener('keydown', this.keydownFn);
    }
    if (_id === 6) {
      const remarkList: any[] = [];
      list.forEach((item: any) => {
        const { recordId, remark } = item;
        remarkList.push({
          recordId, remark
        });
      });
      await this.editFilesList(remarkList);
      this.$message.success('修改成功');
      this.queryList();
    }
    if (_id === 10) {
      const len = selectionList.length;
      if (len === 0) {
        this.$message.warning('请先勾选信息');
        return;
      }
      this.$prompt('请输入删除原因', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[^ \x22]+/,
        inputValidator: res => {
          if (res === null) {
            return true;
          }
          return !(res.length < 1 || res.length > 200);
        },
        inputErrorMessage: '输入内容长度为1-200,不能全输入空格',
        inputPlaceholder: '输入内容长度为1-200',
        inputType: 'textarea',
      }).then(async (res: any) => {
        const flowData: any = [];
        selectionList.forEach((item: any) => {
          const { recordId, idNo } = item;
          flowData.push({ recordId, idNo });
        });
        const sendData = {
          code: 12,
          flowData,
          deleteReason: res.value.trim(),
        };
        await this.deleteFlowData(sendData);
        this.$message.success('删除成功！');
        this.queryList();
      });
    }
  }

  keydownFn(event: any) {
    if (event.keyCode === 13) {
      this.submitForm();
    }
  }

  /** 导出 */
  async exportData() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    // 处理数据
    const sendData = {
      ..._data,
      isExport: 1,
    };
    const body = await this.queryFilesListExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `档案归档/退档${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  dialogVisible = false

  importData = {}

  // 导入API路径
  private uploadPath = '/license/v1/files/readExcel';

  // 导入文件上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    fileAccept: FILTER_EXCEL_TYPE // 限制上传文件格式
  };

  // 数据上传回调
  uploadCallback(val: any) {
    const { body } = val;
    if (body) {
      const { description = '', failLogDtoList } = body;
      const list: any = matchNumberList(description);
      this.importData = {
        ...body,
        importSuccess: (list && list[0]) || 0,
        imporError: (failLogDtoList && failLogDtoList.length) || 0,
      };
      this.dialogVisible = true;
    }
    this.queryList();
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

  // 抽屉弹窗
  private drawer = false;

  // 抽屉弹窗表单
  private formData: ParamsType = {
    batchNo: '',
    idNo: '',
    mobile: '',
    regionName: '',
    remark: '',
    status: '',
    storeName: '',
    userName: ''
  }

  // 交收档案列表
  formList: Array<any> = [];

  formDataRules = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    userName: [
      { required: true, message: '找不到学员', trigger: ['change', 'blur'] }
    ],
    regionName: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    storeName: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    status: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ]
  }

  /**
   * @description 抽屉弹窗表单搜索下拉框回调函数
   */
  private formDataSelectCallback(val: any) {
    if (val) {
      const {
        idNo, userName, regionName, storeName
      } = val;
      this.formData.idNo = idNo;
      this.formData.userName = userName;
      this.formData.regionName = regionName;
      this.formData.storeName = storeName;
    }
  }

  /**
   * @description 搜索身份证联想函数
   */
  private async queryIdNoSearch(val: string, cb: any) {
    if (val === '') {
      cb([]);
    } else {
      const body = await this.queryFilesFuzzyUsers({ keyword: val });
      cb(body);
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
          this.formList.unshift(deepClone(this.formData));
          this.formTableData.list = this.formList;
        }
        const { status } = this.formData;
        (this.$refs.drawerForm as VueComponentParent).resetFields();
        this.formData.status = status;
      }
    });
  }

  // 抽屉列表配置
  formTableData: ParamsType = {
    _this: {},
    selection: true,
    index: true,
    list: [],
    selectionList: [],
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
        type: 'info'
      },
    ],
    labels: [
      {
        key: 'userName',
        label: '姓名',
        minWidth: 100,
      },
      {
        key: 'idNo',
        label: '证件号码',
        minWidth: 170,
      },
      {
        key: 'regionName',
        label: '片区',
        minWidth: 100,
      },
      {
        key: 'storeName',
        label: '门店',
        minWidth: 100,
      },
      {
        key: 'status',
        label: '办证类型',
        minWidth: 100,
      },
      {
        key: 'batchNo',
        label: '补录批次号',
        minWidth: 100,
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 200,
        render(h: any, params: any) {
          const { remark } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remark,
            },
            scopedSlots: {
              reference: () => h('p', remark),
            },
          });
        }
      },
    ]
  };

  /**
   * @description 关闭抽屉，清空数据
   */
  closeDrawer() {
    this.drawer = false;
    this.formList = [];
    this.formTableData.list = [];
    window.removeEventListener('keydown', this.keydownFn, false);
    (this.$refs.drawerForm as VueComponentParent).resetFields();
  }

  /**
   * @description 列表操作回调
   */
  private formTableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, list } = this.formTableData;
    if (id === 3) {
      this.closeDrawer();
      return;
    }
    if (id === 2) {
      if (list.length > 0) {
        this.listsubmitFunc();
      } else {
        this.$message.warning('列表为空，请添加数据!');
      }
      return;
    }
    const _len = selectionList.length;
    if (_len >= 1) {
      if (id === 1) {
        this.deteleFunc(selectionList);
      }
    } else {
      this.$message.warning('请勾选删除项！');
    }
  }

  /**
   * @description 删除
   */
  deteleFunc(val: Array<any>) {
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
    this.$confirm('确定保存?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const body = await this.postFilesDispose(this.formList);
      // 刷新列表
      if (body) {
        const { description = '', failLogDtoList } = body;
        const list: any = matchNumberList(description);
        this.importData = {
          ...body,
          importSuccess: (list && list[0]) || 0,
          imporError: (failLogDtoList && failLogDtoList.length) || 0,
        };
        this.dialogVisible = true;
      }
      this.paginationData.current = 1;
      this.queryList();
      this.closeDrawer();
    });
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private formTableSelectionChange(val: []) {
    this.formTableData.selectionList = val;
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const body = await this.queryFilesList(sendData);
    const { data = [], current, total } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.tableLabelType = 'FILE_FILING_LIST';
    this.initSetTableLabel();
    this.queryList();

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
