<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <el-drawer
      title="新增"
      :visible.sync="drawerAdd"
      :direction="'rtl'"
      size="50%"
      :before-close="handleCloseAdd">
      <section class="page">
        <el-form :model="addFormData" :rules="addFormRule" ref="addFormRef" label-width="100px">
          <el-form-item label="车辆品牌" prop="name">
            <el-row type="flex">
              <el-input v-model.trim="addFormData.name" class="w_300" placeholder="请输入" show-word-limit maxlength="20" clearable></el-input>
              <el-button class="ml-20" type="primary" @click="addTableList()">添加</el-button>
            </el-row>
          </el-form-item>
        </el-form>
        <CtjtTable
          :tableData="addTableData"
          @option-call="tableOptionCallbackAdd"
          @selection-change="tableSelectionChangeAdd"
        ></CtjtTable>
        <el-row class="mt-20" type="flex" justify="center">
          <el-button @click="handleCloseAdd()">取消</el-button>
          <el-button type="primary" @click="handleSubmitAdd()">确定</el-button>
        </el-row>
      </section>
    </el-drawer>
  </div>
</template>
<script lang='ts'>
import Index from './list';

export default class MarketSanXueCarBrandSet extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  overflow: auto;
}
</style>
