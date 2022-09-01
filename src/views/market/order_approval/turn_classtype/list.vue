<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable :tableData="tableData" @option-call="tableOptionCallback" @selection-change="tableSelectionChange">
      <template slot="reference">
        <el-button style="float: right" @click="dialogName = 'field'">字段设置</el-button>
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'market'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class MarketOrderApprovalTurnClasstype extends Index {}
</script>
