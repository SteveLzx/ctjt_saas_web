<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
      :class="{ guanren_school: isGuangRenSchool() }"
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
          :localstorage-service="'finance'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <div style="color: red; margin-top: 30px">
      散学收款金额总计+招生收款金额总计： {{ formatPrice(totalAmount) }}元
    </div>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
    <el-dialog
      :title="`${dialogForm.id === 1 ? '数据' : '强制'}结转`"
      :visible.sync="dialogForm.dialogVisible"
      width="400px"
    >
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
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtSetField,
  CtjtCreateTable,
} from '@/components';
import Index from './collection_list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtCreateTable,
  },
})
export default class Collection extends Index {}
</script>
<style lang="scss" scoped>
.page {
  padding: 25px 20px;
  ::v-deep .el-table__footer-wrapper tbody td:nth-of-type(5),
  ::v-deep .el-table__footer-wrapper tbody td:nth-of-type(6) {
    color: #409eff;
    cursor: pointer;
  }
  .guanren_school {
    ::v-deep .el-table__footer-wrapper tbody td:nth-of-type(7),
    ::v-deep .el-table__footer-wrapper tbody td:nth-of-type(10),
    ::v-deep .el-table__footer-wrapper tbody td:nth-of-type(11) {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
