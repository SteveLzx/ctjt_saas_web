<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <el-button
          @click="dialogName = 'field'"
          style="float: right"
          v-if="perm['btn_field']"
          >字段设置</el-button
        >
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'accreditation'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <!-- 打印 -->
    <CtjtPrint
      :visible.sync="printShow"
      :tableData="printTableData"
    ></CtjtPrint>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class AccreditationSupplementaryInformationDetail extends Index {}
</script>
