import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination
} from '@/components';
import { deepClone, REG_NUMBER } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';

const statusOpts = [
  { id: 0, label: '启用' },
  { id: 1, label: '停用' }
];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
  }
})
export default class MarketServiceStationMg extends mixins(ctjtPaginationMixins) {
  @Action('sale/queryServiceStation') private queryServiceStation!: (data: any) => any;

  @Action('sale/updateServiceStationStatus') private updateServiceStationStatus!: (data: any) => any;

  @Action('sale/modifyServiceStation') private modifyServiceStation!: (data: any) => any;

  searchForm: any = {
    inputList: [
      {
        label: '服务站编号',
        key: 'code',
        type: 'text',
        value: '',
        width: 140,
        clearable: true,
        placeholder: '请输入',
      }
    ],
    selectList: [
      {
        label: '状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        clearable: true,
        width: 120,
        options: statusOpts
      },
    ],
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
      }
    ]
  }

  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  tableData: any = {
    _this: {},
    loading: false,
    index: true,
    selection: true,
    selectionList: [],
    list: [],
    options: [
      {
        id: 1,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '编辑',
        path: 'btn_edit',
      },
      {
        id: 3,
        label: '停用',
        path: 'btn_stop',
        type: 'danger',
      },
      {
        id: 4,
        label: '启用',
        path: 'btn_open',
        type: 'primary',
      },
    ],
    labels: [
      {
        key: 'code',
        label: '服务站编号',
        showOverflowTooltip: true
      },
      {
        key: 'address',
        label: '地址',
        showOverflowTooltip: true
      },
      {
        key: 'contactName',
        label: '联系人',
        showOverflowTooltip: true
      },
      {
        key: 'mobile',
        label: '联系方式',
        showOverflowTooltip: true
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 150,
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
      {
        key: 'status',
        label: '状态',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { status } = params.row;
          return h('span', status === 0 ? '启用' : '停用');
        }
      },
      {
        key: 'createdTime',
        label: '创建日期',
        showOverflowTooltip: true
      },
      {
        key: 'createdName',
        label: '创建人',
        showOverflowTooltip: true
      },
    ]
  }

  // 列表操作回调
  tableOptionCallback(val: any) {
    const { id: _id } = val;
    if (_id === 1) {
      this.$router.push({ path: '/market/service_station/detail' });
      return;
    }
    const { selectionList } = this.tableData;
    const len = selectionList.length;
    if (_id === 2) {
      if (len === 0) {
        this.$message.warning('请先选择1条数据');
      }
      if (len === 1) {
        const { 0: data } = selectionList;
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = data[key];
        });
        this.drawer = true;
      }
      if (len > 1) {
        this.$message.warning('只允许单项操作');
      }
    }
    if (_id === 3 || _id === 4) {
      if (len === 0) {
        this.$message.warning('请先选择数据');
      }
      if (len >= 1) {
        const ids: string[] = [];
        selectionList.forEach((item: any) => {
          ids.push(item.id);
        });
        this.update(_id, ids);
      }
    }
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  update(type: number, ids: string[]) {
    this.$confirm(`确定${type === 3 ? '停用' : '启用'}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await this.updateServiceStationStatus({ ids, status: type === 3 ? 1 : 0 });
      this.$message.success(`${type === 3 ? '停用' : '启用'}成功`);
      this.queryList();
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

  // 列表数据查询
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    this.tableData.loading = true;
    this.queryServiceStation(_data).then((res: any) => {
      const {
        data, current, total
      } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).finally(() => {
      this.tableData.loading = false;
    });
  }

  // 编辑弹窗================================================================
  drawer = false;

  submitLoading = false;

  formData: any = {
    address: '',
    code: '',
    contactName: '',
    mobile: '',
    remark: '',
    id: ''
  }

  formRules: any = {
    code: [
      { required: true, message: '请输入服务站编号', trigger: ['change', 'blur'] }
    ],
    address: [
      { required: true, message: '请输入地址', trigger: ['change', 'blur'] }
    ],
    contactName: [
      { required: true, message: '请输入联系人', trigger: ['change', 'blur'] }
    ],
    mobile: [
      { required: true, message: '请输入联系方式', trigger: ['change', 'blur'] },
      { pattern: REG_NUMBER, message: '请输入数字', trigger: ['change', 'blur'] },
    ],
  }

  submit() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { formData } = this;
        this.submitLoading = true;
        this.modifyServiceStation(formData).then(() => {
          this.queryList();
          this.$message.success('修改成功');
          this.cancel();
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  cancel() {
    (this.$refs.formRef as VueComponentParent).resetFields();
    this.drawer = false;
  }

  async mounted() {
    this.tableData._this = this;
    this.queryList();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
