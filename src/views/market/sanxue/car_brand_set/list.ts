import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination
} from '@/components';
import { deepClone } from '@/assets/js/common';
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
export default class MarketSanXueCarBrandSet extends mixins(ctjtPaginationMixins) {
  @Action('order/queryScatteredBrandList') private queryScatteredBrandList!: (data: any) => any;

  @Action('order/addScatteredBrand') private addScatteredBrand!: (data: any) => any;

  @Action('order/queryScatteredBrandChangeStatus') private queryScatteredBrandChangeStatus!: (data: any) => any;

  // 搜索
  searchForm: any = {
    inputList: [
      {
        label: '车辆品牌',
        key: 'brandName',
        type: 'text',
        value: '',
        width: 200,
        clearable: true,
        placeholder: '请输入',
      }
    ],
    selectList: [
      {
        label: '状态',
        key: 'status',
        width: 100,
        value: '',
        placeholder: '请选择',
        clearable: true,
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

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 列表
  tableData: any = {
    loading: false,
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
        label: '停用',
        path: 'btn_stop',
        type: 'warning',
      },
      {
        id: 3,
        label: '启用',
        path: 'btn_open',
        type: 'primary',
      },
    ],
    labels: [
      {
        key: 'brandName',
        label: '车辆品牌',
        minWidth: 160,
        showOverflowTooltip: true
      },
      {
        key: 'status',
        label: '状态',
        minWidth: 80,
        render(h: any, params: any) {
          const { status } = params.row;
          const list = statusOpts.filter((item: any) => item.id === status);
          return h('span', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'createdTime',
        label: '创建日期',
        minWidth: 160,
      },
      {
        key: 'createdName',
        label: '创建人',
        minWidth: 160,
      },
    ]
  }

  // 列表操作回调
  tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.drawerAdd = true;
      return;
    }
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) {
      this.$message.warning('请先勾选数据！');
      return;
    }
    if (id === 2) {
      // 停用
      this.$confirm('确定将车辆品牌停用?', '停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.brandChangeStatus(1, selectionList);
      });
    }
    if (id === 3) {
      // 启用
      this.$confirm('确定将车辆品牌启用?', '启用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.brandChangeStatus(0, selectionList);
      });
    }
  }

  async brandChangeStatus(status: number, ids: any[]) {
    const idList: string[] = [];
    ids.forEach((item: any) => {
      idList.push(item.id);
    });
    const sendData = {
      status,
      idList
    };
    await this.queryScatteredBrandChangeStatus(sendData);
    this.$message.success(`${status === 0 ? '启用' : '停用'}成功`);
    this.queryList();
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表数据查询
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    this.tableData.loading = true;
    this.queryScatteredBrandList(_data).then((res: any) => {
      const {
        data, current, total
      } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).then(() => {
      this.tableData.loading = false;
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

  // 新增车辆品牌b===============================================
  drawerAdd = false;

  handleCloseAdd() {
    this.$confirm('弹窗关闭数据不会保留，确定关闭?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.resetForm();
    });
  }

  async handleSubmitAdd() {
    // 数据列表为空不添加
    const { list } = this.addTableData;
    if (list.length === 0) {
      this.$message.warning('车辆品牌列表为空，请添加数据后在保存');
      return;
    }
    const sendData: string[] = [];
    list.forEach((item: any) => {
      sendData.push(item.name);
    });
    await this.addScatteredBrand(sendData);
    this.$message.success('添加成功');
    this.queryList();
    this.resetForm();
  }

  addFormData: any = {
    name: ''
  }

  addFormRule = {
    name: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ]
  }

  resetForm() {
    (this.$refs.addFormRef as any).resetFields();
    this.addTableData.list = [];
    this.drawerAdd = false;
  }

  addTableList() {
    (this.$refs.addFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 去重
        const { addFormData, addTableData } = this;
        const list = addTableData.list.filter((item: any) => item.name === addFormData.name);
        if (list.length > 0) {
          this.$message.warning('列表已存在此车辆名称，请勿重复添加');
          return;
        }
        this.addTableData.list.push(deepClone(addFormData));
        (this.$refs.addFormRef as any).resetFields();
      }
    });
  }

  addTableData: any = {
    selection: true,
    selectionList: [],
    list: [],
    options: [
      {
        id: 1,
        label: '删除',
      },
    ],
    labels: [
      {
        key: 'name',
        label: '车辆品牌',
        showOverflowTooltip: true
      },
    ]
  }

  // 列表操作回调
  tableOptionCallbackAdd(val: any) {
    const { id } = val;
    const { selectionList, list } = this.addTableData;
    const _len = selectionList.length;
    if (_len === 0) {
      this.$message.warning('请先勾选数据！');
      return;
    }
    if (id === 1) {
      // 删除
      this.$confirm('确定将车辆品牌删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const names: string[] = [];
        selectionList.forEach((item : any) => names.push(item.name));
        const _list: any[] = [];
        list.forEach((item: any) => {
          if (!names.includes(item.name)) {
            _list.push(item);
          }
        });
        this.addTableData.list = _list;
      });
    }
  }

  tableSelectionChangeAdd(val: []) {
    this.addTableData.selectionList = val;
  }

  // 新增车辆品牌end===============================================

  async mounted() {
    this.queryList();
  }

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
