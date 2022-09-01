import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { POS_STATUS, POS_TYPE } from '@/enums';
import { setTableLabels, marginTableLabels, setFormDataFunc } from '@/views/finance/_common/common';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const tableOptionList = [
  {
    id: 1,
    label: '新增',
    path: 'btn_add'
  },
  {
    id: 5,
    label: '编辑',
    type: 'primary',
    path: 'btn_edit'
  },
  {
    id: 2,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
  {
    id: 3,
    label: '启用',
    type: 'success',
    path: 'btn_enable'
  },
  {
    id: 4,
    label: '停用',
    type: 'warning',
    path: 'btn_disable'
  }
];
@Component
export default class FinancePosTerminalNumberMg extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('finance/queryAllPosAccountList') private queryAllPosAccountList!: () => ParamsType;

  @Action('finance/queryPosTerminalNumberPageList') private queryPosTerminalNumberPageList!: (data: any) => ParamsType;

  @Action('finance/posTerminalNumberModify') private posTerminalNumberModify!: (data: any) => ParamsType;

  @Action('finance/posTerminalNumberDelete') private posTerminalNumberDelete!: (data: any) => ParamsType;

  @Action('finance/posTerminalNumberChangeStatus') private posTerminalNumberChangeStatus!: (data: any) => ParamsType;

  // 列表搜索项配置
  private localSearchForm: ParamsType = {
    inputList: [
      {
        label: 'pos机终端号',
        key: 'posTerminalNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      }
    ],
    selectList: [
      {
        label: '类型',
        key: 'posType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: POS_TYPE,
      },
      {
        label: '状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: POS_STATUS,
      },
    ],
    buttonList: []
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

  // 弹出框名
  private dialogName = '';

  private isEdit = false;

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
      // 新增
      this.isEdit = false;
      this.drawerShow = true;
      this.drawerTitle = '新增';
      this.queryRegion();
      this.queryAllPosNoList();
    }
    if (id === 5) {
      // 编辑
      if (_len === 1) {
        this.isEdit = true;
        this.drawerShow = true;
        this.drawerTitle = '编辑';
        this.jumpDetail(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 2) {
      // 删除
      if (_len >= 1) {
        this._deleteFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 3) {
      // 启用
      if (_len >= 1) {
        this._changeStatusFunc(selectionList, 0);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 4) {
      // 停用
      if (_len >= 1) {
        this._changeStatusFunc(selectionList, 1);
      } else {
        this.$message.warning('请先勾选数据!');
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

  private submitLoading = false;

  // 新增/编辑弹出框是否可见
  private drawerShow = false;

  private drawerTitle = '新增';

  // 新增/编辑表单数据
  private formData: any = {
    id: null,
    posTerminalNo: '',
    posType: null,
    regionId: null,
    regionName: '',
    storeId: null,
    storeName: '',
    posAccountId: null,
    posAccount: '',
    posBank: '',
    posCompany: '',
    installDate: '', // pos公司装机日期
    revokeDate: '', // 服务店撤机日期
    recoveryDate: '', // pos公司收机日期
    handoverName: '', // 交接人
    remark: '', // 备注
  }

  /**
  * @description 列表单项点击绑定详情数据
  */
  async jumpDetail(val: ParamsType) {
    if (val) {
      await this.queryRegion();
      this.queryStore(val.regionId);
      this.formData.posAccount = val.posAccount;
      // this.queryAllPosNoList();
      this.formData = setFormDataFunc(val, this.formData);
    }
  }

  // pos类型list
  private posTypeList = POS_TYPE;

  // pos账号list
  private postNoList: any = [];

  /** 获取所有启用的pos账号信息 */
  async queryAllPosNoList() {
    try {
      const body = await this.queryAllPosAccountList();
      this.postNoList = body;
    } catch (error) {
      this.postNoList = [];
    }
  }

  /** pos账号change事件+ */
  posNoChange(val: any) {
    const { postNoList } = this;
    if (postNoList) {
      const posInfo = postNoList.filter((a:any) => a.id === val)[0];
      this.formData.posBank = posInfo.posBank;
      this.formData.posCompany = posInfo.posCompany;
    }
  }

  // 片区list
  private regionList: any = [];

  /** 获取片区 */
  async queryRegion() {
    const { drivingSchoolId } = this.userInfo;
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    const _data = this.setFormSelectFunc(data);
    this.regionList = _data;
  }

  // 门店list
  private storeList: any = [];

  /** 获取片区下面的门店 */
  async queryStore(val: any) {
    if (val) {
      const data = await this.queryGroupMechanismData({ pid: val });
      const _data = this.setFormSelectFunc(data);
      this.storeList = _data;
    }
  }

  // 表单验证规则
  private formDataRules = {
    posTerminalNo: [
      {
        required: true,
        message: '请输入pos机终端号',
        trigger: 'blur'
      },
    ],
    posType: [
      {
        required: true,
        message: '请选择pos类型',
        trigger: 'change'
      },
    ],
    regionId: [
      {
        required: true,
        message: '请选择使用片区',
        trigger: 'change'
      },
    ],
    storeId: [
      {
        required: true,
        message: '请选择使用门店',
        trigger: 'change'
      },
    ],
    posAccountId: [
      {
        required: true,
        message: '请选择pos账号',
        trigger: 'change'
      },
    ],
    posBank: [
      {
        required: true,
        message: '找不到银行',
        trigger: 'blur'
      }
    ],
    posCompany: [
      {
        required: true,
        message: '找不到pos公司',
        trigger: 'blur'
      }
    ],
  };

  /** @description 弹出框关闭事件 */
  private drawerClose() {
    (this.$refs.formData as VueComponentParent).resetFields(); // 清空表单
    this.drawerShow = false;
  }

  /** 提交新增/编辑form */
  private submitForm() {
    (this.$refs.formData as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          this.formData = this._specialHandleFormData();
          const sendData = { ...this.formData };
          this.posTerminalNumberModify(sendData).then(() => {
            this.querFirstPageList();
            const _msg = this.formData.id ? '编辑' : '新增';
            this.$message.success(`${_msg}账户成功`);
          })
            .finally(() => {
              this.formData.id = null;
              this.drawerClose();
            });
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /**
   * 提交表单前，处理特殊字段
   */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const {
      installDate, // 装机时间
      revokeDate, // 撤机时间
      recoveryDate, // 收机时间
      regionId,
      storeId,
    } = sendData;
    // 处理时间
    sendData.installDate = installDate ? this.$dayjs(installDate).format('YYYY-MM-DD') : '';
    sendData.revokeDate = revokeDate ? this.$dayjs(revokeDate).format('YYYY-MM-DD') : '';
    sendData.recoveryDate = recoveryDate ? this.$dayjs(recoveryDate).format('YYYY-MM-DD') : '';
    // 处理片区门店
    const { regionList, storeList } = this;
    const _regionName = regionList.filter((a: any) => a.id === regionId)[0].label;
    const _storeName = storeList.filter((a: any) => a.id === storeId)[0].label;
    sendData.regionName = _regionName;
    sendData.storeName = _storeName;
    return sendData;
  }

  /** @description 删除 */
  private _deleteFun(selectionList: any) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        id: _item.id,
      };
      sendData.push(data);
    });
    this.$confirm('确定删除pos机终端号？', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.posTerminalNumberDelete(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('删除账户成功');
      });
    }).catch(() => {
      this.$message.info('已取消删除');
    });
  }

  /** @description 启用/停用 */
  _changeStatusFunc(selectionList: any, status: number) {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        id: _item.id,
        posAccountId: _item.posAccountId,
        status
      };
      sendData.push(data);
    });
    this.posTerminalNumberChangeStatus(sendData).then(() => {
      const _msg = status === 0 ? '启用' : '停用';
      this.$message.success(`账号已${_msg}！`);
    }).finally(() => {
      this.queryList();
    });
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

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const {
      searchForm, paginationData,
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    // 处理数据
    const sendData = { ..._data };
    try {
      const body = await this.queryPosTerminalNumberPageList(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryList();
    this.initSearch();
    this.tableLabelType = 'POS_TERMINAL_NUMBER_MG_LIST_LABEL';
    this.initSetTableLabel();
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
