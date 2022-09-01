<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
    </CtjtTable>
    <CtjtStatistics
      :statistics-data="statisticsData"
      remark=""
    ></CtjtStatistics>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
    <!--费用类型选择弹出框-->
    <CtjtSelectDialog
      :select-list="feeTypeList"
      :select-dialog-visible="
        selctDialogName === 'import' || selctDialogName === 'insert'
      "
      :title="selctDialogName === 'import' ? '导入' : '新增'"
      accre-label="费用类型"
      @button-call="selectTypeCallback"
    ></CtjtSelectDialog>
    <!--导入数据预览抽屉-->
    <CtjtFinanceImportReviewDrawer
      :visible="dialogName === 'import'"
      :import-props="operationProps"
      @button-call="dialogName = ''"
      @on-upload="resultCallback"
    ></CtjtFinanceImportReviewDrawer>
    <!--新增数据预览抽屉-->
    <CtjtFinanceInsertReviewDrawer
      :visible="dialogName === 'insert'"
      :insert-props="operationProps"
      @button-call="dialogName = ''"
      @on-insert="resultCallback"
    >
    </CtjtFinanceInsertReviewDrawer>
    <!--数据返回结果弹出框-->
    <CtjtFinanceResultDialog
      :visible="resultName === 'import' || resultName === 'insert'"
      :title="resultName === 'import' ? '导入' : '新增'"
      :import-data="resultData"
      @button-call="resultName = ''"
    ></CtjtFinanceResultDialog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtStatistics,
  CtjtPagination,
  CtjtCreateTable,
  CtjtOperationLog,
  CtjtSelectDialog,
} from '@/components';
import {
  CtjtFinanceImportReviewDrawer,
  CtjtFinanceInsertReviewDrawer,
  CtjtFinanceResultDialog,
} from '@/views/finance/_components';
import Index from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtStatistics,
    CtjtPagination,
    CtjtCreateTable,
    CtjtOperationLog,
    CtjtSelectDialog,
    CtjtFinanceImportReviewDrawer,
    CtjtFinanceInsertReviewDrawer,
    CtjtFinanceResultDialog,
  },
})
export default class FinanceOtherFeeMg extends Index {}
</script>
