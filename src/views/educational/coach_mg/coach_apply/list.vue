<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable :tableData="tableData">
      <template slot="header" v-if="perm['btn_field']">
        <el-row class="form" type="flex" justify="end">
          <el-button @click="dialogName = 'field'">字段设置</el-button>
          <CtjtSetField
            :show-field-visable="dialogName === 'field'"
            :field-list="originalLabelList"
            :check-field-list="currentLabelKeyList"
            :localstorage-key="tableLabelType"
            :localstorage-service="'educational'"
            @submit-field="submitField"
            @field-cancel="dialogName = ''"
          ></CtjtSetField>
        </el-row>
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

export default class EducationalCoachMgCoachApply extends Index {}
</script>
<style lang="scss" scoped>
  .form {
    border: 1px solid $--color-border-split;
    border-bottom: 0;
    padding: 5px 18px;
  }
</style>
