import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { POS_STATUS } from '@/enums';
import { COLLECTION_ACCOUNT_MG_LIST_LABEL } from '@/views/finance/_common/tablelabel';
import ctjtPaginationMixins from '@/mixins/pagination';

const tableOptionList = [
  {
    id: 1,
    label: '新增',
    type: 'primary',
    path: 'btn_add'
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
export default class FinanceCollectionAccountMg extends mixins(ctjtPaginationMixins) {
  @Action('finance/queryBankAccountPageList') private queryBankAccountPageList!: (data: any) => ParamsType;

  @Action('finance/bankAccountModify') private bankAccountModify!: (data: any) => ParamsType;

  @Action('finance/bankAccountDelete') private bankAccountDelete!: (data: any) => ParamsType;

  @Action('finance/bankAccountChangeStatus') private bankAccountChangeStatus!: (data: any) => ParamsType;

  // 列表搜索项配置
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '收款账号',
        key: 'cardNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
      {
        label: '银行',
        key: 'name',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      }
    ],
    selectList: [
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
      }
    ]
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
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
    labels: COLLECTION_ACCOUNT_MG_LIST_LABEL,
    list: [],
    selectionList: [],
  };

  /**
  * @description 表格操作回调
  */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    // const isAllUsing = !(selectionList.filter((a: any) => a.status === 0).length > 0); // 0：停用，1：启用
    if (id === 1) {
      // 新增
      this.dialogShow = true;
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

  // 新增弹出框是否可见
  private dialogShow = false;

  // 新增表单数据
  private formData: ParamsType = {
    id: 0,
    cardNo: '', // 存款账号
    name: '', // 银行
    holder: '', // 持有人
    remark: ''// 备注
  }

  // 表单验证规则
  private formDataRules = {
    cardNo: [
      {
        required: true,
        message: '请输入存款账号',
        trigger: 'blur'
      },
    ],
    name: [
      {
        required: true,
        message: '请输入银行',
        trigger: 'blur'
      }
    ],
    holder: [
      {
        required: true,
        message: '请输入持有人',
        trigger: 'blur'
      }
    ],
  };

  /** @description 弹出框关闭事件 */
  private dialogClose() {
    this.dialogShow = false;
    (this.$refs.add_form as VueComponentParent).resetFields(); // 清空表单
  }

  /** 提交新增form */
  private submitForm() {
    (this.$refs.add_form as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const { formData } = this;
          formData.id = null;
          const sendData = { ...formData };
          this.bankAccountModify(sendData).then(() => {
            this.querFirstPageList();
            this.$message.success('新增账户成功');
          })
            .finally(() => {
              this.dialogClose();
            });
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
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
    this.$confirm('确定删除收款账号?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.bankAccountDelete(sendData).then(() => {
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
        status
      };
      sendData.push(data);
    });
    this.bankAccountChangeStatus(sendData).then(() => {
      const _msg = status === 0 ? '启用' : '停用';
      this.$message.success(`账号已${_msg}！`);
    }).finally(() => {
      this.queryList();
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
      const body = await this.queryBankAccountPageList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  mounted() {
    this.queryList();
  }

  async created() {
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
