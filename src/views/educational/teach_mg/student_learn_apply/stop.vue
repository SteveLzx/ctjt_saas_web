<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable :tableData="tableData">
      <template slot="reference">
        <el-button @click="dialogName = 'field'" style="float: right;">字段设置</el-button>
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'educational'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
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
      :title="'暂停学车申请'"
      :direction="'rtl'"
      :size="'80%'">
      <CtjtCard :prop-data="{ title: '申请状态-已完成' }">
        <template slot='content'>
          <el-form label-width="100px">
            <el-form-item label="申请类型:">暂停学车</el-form-item>
            <el-form-item label="学员姓名">
              <el-input class="w_200 mr-20" disabled placeholder="点击右侧按钮选择学员"></el-input>
              <el-button type="primary">选择学员</el-button>
            </el-form-item>
            <el-form-item label="学车状态">
              <el-input class="w_200" disabled></el-input>
            </el-form-item>
            <el-form-item label="证件号码">
              <el-input class="w_200" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input class="w_200" disabled></el-input>
            </el-form-item>
            <el-form-item label="是否欠费">
              <el-input class="w_200" disabled></el-input>
            </el-form-item>
            <el-form-item label="暂停周期">
              <el-date-picker
                v-model="formData.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="暂停原因">
              <el-input class="w_400" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input class="w_400" disabled type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button>取消</el-button>
              <el-button type="primary">提交</el-button>
            </el-form-item>
          </el-form>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '流程审核记录' }">
        <template slot='content'>
          <CtjtTable :tableData="detailTableData"></CtjtTable>
        </template>
      </CtjtCard>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './stop';

export default class EducationalTeachMgStudentLearnStopApply extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
</style>
