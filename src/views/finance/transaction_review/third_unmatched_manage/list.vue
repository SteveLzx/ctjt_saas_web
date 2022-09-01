<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable :tableData="tableData"></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <el-drawer title="订单明细" size="80%" :visible.sync="drawer">
      <div class="page">
        <CtjtTable
          :tableData="drawerTableData"
          @option-call="tableOptionCallback"
        ></CtjtTable>
      </div>
    </el-drawer>
    <!--核对确认-->
    <CtjtDialog
      title="核对确认"
      width="500px"
      :is-show="dialogName === '核对确认'"
      @button-call="dialogClose"
    >
      <el-form
        ref="sureForm"
        label-width="110px"
        class="single_edit_form"
        :model="sureFormData"
        :rules="sureFormRules"
      >
        <el-form-item label="票据日期" prop="receiptDate">
          <el-date-picker
            v-model="sureFormData.receiptDate"
            align="right"
            type="date"
            placeholder="请选择票据日期"
            style="width: 280px;"
          ></el-date-picker>
        </el-form-item>
        <el-row type="flex" justify="center" style="padding-bottom: 30px">
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="sureFun"
            :loading="submitLoading"
            >保存</el-button
          >
          <el-button
            type="info"
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="dialogClose"
            >取消</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtDialog,
} from '@/components';
import { CtjtFinancePrint } from '@/views/finance/_components';
import FinanceThirdUnmatchedManageIndex from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtFinancePrint,
    CtjtDialog,
  },
})
export default class FinanceThirdUnmatchedManage extends FinanceThirdUnmatchedManageIndex {}
</script>
<style lang="scss" scoped>
::v-deep .invoice_edit_form .el-form-item {
  width: 450px;
  display: inline-block;
  margin-bottom: 30px;
  .el-date-editor,
  .el-select {
    width: 100%;
  }
}
</style>
