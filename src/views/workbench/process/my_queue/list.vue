<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable :tableData="tableData"></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <el-drawer
      :visible.sync="drawerShow"
      :direction="'rtl'"
      :show-close="false"
      :wrapperClosable="false"
      :size="'80%'">
      <template slot='title'>
        <CtjtCard :prop-data="{ title: `${drawerTiltle}详情——当前审批状态` }">
          <template #header>
            <span style="float: right" class="iconfont close_icon" @click="drawerShow = false">&#xe62b;</span>
          </template>
          <template #content>
            <el-row class="mb-20">
              <el-button type="success">审核通过</el-button>
              <el-button type="danger">审核不通过</el-button>
              <el-button type="info" @click="drawerShow = false">返回</el-button>
            </el-row>
          </template>
        </CtjtCard>
      </template>
      <CtjtTable :tableData="drawerTableData"></CtjtTable>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class WorkbenchProcessMyQueue extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
</style>
