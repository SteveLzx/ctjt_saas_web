<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable :tableData="tableData">
      <template slot="header">
        <el-row v-if="perm['btn_field']" class="form" type="flex" justify="end">
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
    <!-- 学员分配记录明细 -->
    <el-drawer
      :visible.sync="drawerDetail"
      :direction="'rtl'"
      :show-close="false"
      :wrapperClosable="false"
      :size="'80%'">
      <template slot='title'>
        <CtjtCard :prop-data="{ title: '学员分配记录明细' }">
          <template slot='header'>
            <span style="float: right" class="iconfont close_icon" @click="closeDrawerDetail">&#xe62b;</span>
          </template>
        </CtjtCard>
      </template>
      <CtjtTable :tableData="drawerTableData"></CtjtTable>
      <CtjtPagination
        :prop-data="detailPaginationData"
        @on-size-change="detailTableSizeChange"
        @on-current-change='detailTableCurrentChange'
      ></CtjtPagination>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class EducationalTeachMgStudentDistribution extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
.form {
  border: 1px solid $--color-border-split;
  border-bottom: 0;
  padding: 5px 18px;
}
</style>
