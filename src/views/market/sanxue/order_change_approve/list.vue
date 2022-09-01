<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <el-row class="mt-20"><b>
        <span class="mr-20" v-for="(item, index) in countApprovesData" :key="index">{{item.auditStatus | auditStatusFilter}} {{item.num}}</span>
    </b></el-row>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>
<script lang='ts'>
import Index from './list';

export default class MarketSanXueOrderChangeApprove extends Index {}
</script>
