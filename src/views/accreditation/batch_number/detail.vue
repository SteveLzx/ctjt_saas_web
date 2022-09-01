<template>
  <div class="page">
    <section class="header_container">
      <div class="ctjt_form_item_class mr-40">
        办证科目：{{ detailParams.subjects }}
      </div>
      <div class="ctjt_form_item_class mr-40">
        操作日期：{{ detailParams.operatorDate }}
      </div>
      <div class="ctjt_form_item_class mr-40">
        数量：{{ paginationData.total }}
      </div>
      <div class="ctjt_form_item_class">
        操作人：{{ detailParams.operatorName }}
      </div>
    </section>
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
    </CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCreateTable,
  CtjtOperationLog,
} from '@/components';
import {
  CtjtCertificateResultDialog,
  CtjtSupplementDrawer,
} from '@/views/accreditation/_components';
import Index from './detail';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCreateTable,
    CtjtSupplementDrawer,
    CtjtCertificateResultDialog,
    CtjtOperationLog,
  },
})
export default class AccreditationBatchNumberDetail extends Index {}
</script>
<style lang="scss" scoped>
.header_container {
  padding: 40px 0px;
}
.ctjt_form_item_class {
  font-size: 16px;
  font-weight: 500;
}

</style>
