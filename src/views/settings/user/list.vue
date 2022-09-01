<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
    ></CtjtTable>
    <!-- <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination> -->
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
export default class SettingsUserList extends mixins(ctjtPaginationMixins) {
  @Action('user/findUserGroupRoleInfo') private findUserGroupRoleInfo!: (data: any) => any;

  /** 列表配置 */

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [],
    labels: [
      {
        key: 'mobile',
        label: '手机号',
      },
      {
        key: 'roleName',
        label: '角色名称',
      },
      {
        key: 'companyName',
        label: '所属机构'
      }
    ],
    list: [],
    selectionList: [],
  };

  /** 列表搜索配置 */
  private searchForm: ParamsType= {
    inputList: [
      {
        label: '用户名称',
        key: 'userName',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入用户名称',
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

  /**
   * 请求角色列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    this.tableData.loading = true;
    const body = await this.findUserGroupRoleInfo(_data);
    this.tableData.list = body || [];
    this.tableData.loading = false;
  }

  mounted() {
    this.tableData._this = this;
    this.queryList();
  }

  perm = {
    btn_set: false
  };

  async created() {
    // const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    // this.tableData.options = permObj.tablePerm;
    // this.searchForm.buttonList = permObj.searchPerm;
    // this.perm = permObj.perm;
  }
}
</script>

<style lang="scss" scoped>
</style>
