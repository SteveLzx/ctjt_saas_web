<template>
  <div class="page" ref="">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <section class="table_section" ref="table_section">
      <CtjtTable
        ref="ctjtTableReference"
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
      >
        <template slot="reference">
          <el-button
            @click="dialogName = 'field'"
            style="float: right"
            >字段设置</el-button
          >
            <!-- v-if="perm['btn_field']" -->
          <CtjtSetField
            :show-field-visable="dialogName === 'field'"
            :field-list="originalLabelList"
            :check-field-list="currentLabelKeyList"
            :localstorage-key="tableLabelType"
            :localstorage-service="'finance'"
            @submit-field="submitField"
            @field-cancel="dialogName = ''"
          ></CtjtSetField>
        </template>
      </CtjtTable>
      <CtjtStatistics
        :statistics-data="statisticsData"
        remark=""
      ></CtjtStatistics>
    </section>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <el-dialog
      title="数据结转"
      :visible.sync="dialogForm.dialogVisible"
      width="400px">
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogFormRule">
        <el-form-item label="结转日期" prop="carryOverDate">
          <el-date-picker v-model="dialogForm.carryOverDate"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-button @click="dialogForm.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialog">确 定</el-button>
      </el-row>
    </el-dialog>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
  </div>
</template>
<script lang='ts'>
/* eslint-disable import/extensions */
/* eslint-disable import/no-self-import */
import Index from './list';

export default class FinanceSanXueReviewSet extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  border-bottom: 1px solid $--color-border-split;
  padding: 30px;
  .draw_title {
    font-size: 17px;
    font-weight: 500;
  }
}
::v-deep .approval_form .el-form-item__label {
  font-weight: bold;
}
::v-deep .ctjt_form_item_class .el-input__inner {
  width: 300px;
}
</style>
