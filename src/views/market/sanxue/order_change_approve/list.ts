import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ctjtPaginationMixins from '@/mixins/pagination';
import { deepClone } from '@/assets/js/common';
import { approveStatusOpts } from '@/views/market/_enums';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  CtjtCard, CtjtTable, SearchTable, CtjtPagination
} from '@/components';
import { listSearchForm, listTableData } from './index';

@Component({
  components: {
    CtjtCard, CtjtTable, SearchTable, CtjtPagination
  },
  filters: {
    auditStatusFilter(val: number): string {
      const _item = approveStatusOpts.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
  }
})
export default class MarketSanXueOrderChangeApprove extends mixins(ctjtPaginationMixins) {
  @State((state) => state.base.userInfo) userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('order/queryApprovesList') private queryApprovesList!: (data: any) => any;

  @Action('order/queryScatteredCountApproves') private queryScatteredCountApproves!: (data: any) => any;

  // 跳转详情
  jumpDetail(id: string, orderId: string, auditStatus: number) {
    this.$router.push({ path: '/market/sxpj/order/change/approve/detail', query: { id, orderId, auditStatus: String(auditStatus) } });
  }

  // 搜索下拉框筛选
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = deepClone(data);
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'region') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'store') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  // 搜索筛选框选择回调
  searchSelectChange(val: any) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        this.selectFunc('store', value);
      }
    }
  }

  // 下拉框请求参数处理
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  // 列表搜索配置
  searchForm = deepClone(listSearchForm);

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.searchForm.selectList[1].options = [];
    }
  }

  // 表格
  private tableData = deepClone(listTableData);

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
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

  countApprovesData = []

  // 请求订单列表
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
      type: 4
    };
    this.tableData.loading = true;
    this.queryApprovesList(sendData).then((res: any) => {
      const {
        data, current, total
      } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).finally(() => {
      this.tableData.loading = false;
    });
    this.queryScatteredCountApproves(sendData).then((res: any) => {
      this.countApprovesData = res || [];
    });
  }

  init() {
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    this.selectFunc('region', drivingSchoolId);
    this.queryList();
  }

  async mounted() {
    this.init();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
