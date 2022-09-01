<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
  </div>
</template>

<script lang="ts">
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination
} from '@/components';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
  },
})
export default class SettingsRole extends mixins(ctjtPaginationMixins) {
  @Action('auth/findRoleList') private findRoleList!: (data: any) => any;

  @Action('auth/companyList') private companyList!: () => any;
  /** 列表配置 */

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [],
    labels: [
      {
        key: 'roleName',
        label: '角色名称',
      },
      {
        key: 'companyName',
        label: '所属机构'
      },
      {
        key: 'licensePlate',
        label: '权限配置',
        width: 120,
        render(h: any, params: any) {
          const { roleName, companyId, companyName } = params.row;
          return h(
            'el-link',
            {
              props: {
                type: 'primary',
                underline: false,
              },
              on: {
                click: () => {
                  params._self.tableData._this.jumpDetail(roleName, companyId, companyName);
                },
              },
            },
            '配置'
          );
        },
      },
    ],
    list: [],
    selectionList: [],
  };

  /** 列表搜索配置 */
  private searchForm: ParamsType= {
    inputList: [
      {
        label: '角色名称',
        key: 'roleName',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入角色名称',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '所属机构',
        key: 'companyId',
        value: '',
        placeholder: '请选择所属机构',
        multiple: false,
        clearable: true,
        filterable: true,
        width: 250,
        options: []
      }
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      }
    ],
  };

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
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

  private jumpDetail(roleName: string, companyId: string, companyName: string): void {
    if (!this.perm.btn_set) return;
    this.$router.push({
      path: '/settings/role/detail',
      query: { roleName, companyId, companyName },
    });
  }

  /**
   * 查询数据字典
   * 表单搜索下拉数据
   */

  // 获取所属机构下拉框数据
  async queryOragnList() {
    const body = await this.companyList();
    body.forEach((item: any) => {
      const itemCopy = item;
      itemCopy.id = itemCopy.companyId;
      itemCopy.label = itemCopy.companyName;
    });
    this.searchForm.selectList[0].options = body;
  }

  /**
   * 请求角色列表
   */
  async queryList() {
    this.tableData.loading = true;
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const body = await this.findRoleList(_data);
    const { data, current, total } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  mounted() {
    this.tableData._this = this;
    this.queryList();
    this.queryOragnList();
  }

  perm = {
    btn_set: false
  };

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
</script>

<style lang="scss" scoped>
</style>
