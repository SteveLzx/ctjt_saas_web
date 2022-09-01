<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
    >
     <template slot="autocomplete">
        <el-form-item
          v-for="(item, index) in searchForm.autocompleteList"
          :key="`autocomplete-${index}`"
          :label="item.label"
          :label-width="`${item.labelWidth + 'px' || 'auto'}`"
        >
          <el-autocomplete
            popper-class="seach_table_autocomplete"
            v-model="item.value"
            value-key="idNo"
            :maxlength="item.maxlength"
            :clearable="item.clearable"
            :fetch-suggestions="autocompleteQuerySearch"
            :placeholder="item.placeholder || '请输入内容'"
            style="width: 320px"
            size="mini"
          >
            <template slot-scope="{ item }">
              <div class="idNo">{{ item.idNo }}</div>
              <span class="userName">{{ item.userName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template>
    </SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
    </CtjtTable>
    <div class="static_container">批次总数：{{ paginationData.total }}</div>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCreateTable,
  CtjtSelectDialog,
  CtjtDialog,
} from '@/components';
import {
  CtjtImportDrawer,
  CtjtSupplementDrawer,
} from '@/views/accreditation/_components';
import Index from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCreateTable,
    CtjtSelectDialog,
    CtjtImportDrawer,
    CtjtSupplementDrawer,
    CtjtDialog,
  },
})
export default class AccreditationBatchNumberList extends Index {}
</script>
<style lang="scss" scoped>
.static_container {
  padding: 30px 0 10px 0;
  font-weight: bold;
}
.el-form-item{
  margin-bottom: 8px;
}
</style>
