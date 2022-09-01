<template>
  <div class="page">
    <section class="header_container">
      <div class="ctjt_form_item_class mr-30">
        批次号：{{ detailParams.batchNo }}
      </div>
      <div class="ctjt_form_item_class mr-30">
        创建人：{{ detailObj.createdName }}
      </div>
      <div class="ctjt_form_item_class">
        创建日期：{{ detailObj.createdTime | dateFilter }}
      </div>
    </section>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <el-row style="float: right">
          <label>关键字</label>
          <el-input
            v-model.trim="keyword"
            class="w_300 mr-20 ml-20"
            placeholder="请输入学员姓名、证件号"
            clearable
          ></el-input>
          <el-button type="primary" @click="queryList" v-if="perm['btn_search']"
            >查询</el-button
          >
          <el-button @click="logShow" v-if="perm['btn_log']"
            >操作日志</el-button
          >
        </el-row>
      </template>
    </CtjtTable>
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
import dayjs from 'dayjs';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCreateTable,
  CtjtOperationLog,
} from '@/components';

import Detail from './detail';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCreateTable,
    CtjtOperationLog,
  },
  filters: {
    dateFilter(val: any) {
      return dayjs(val).format('YYYY-MM-DD');
    },
  },
})
export default class FinanceOtherFeeMgDetail extends Detail {}
</script>
<style lang="scss" scoped>
.header_container {
  padding: 8px;
}
.ctjt_form_item_class {
  font-size: 16px;
  font-weight: 500;
}
</style>
