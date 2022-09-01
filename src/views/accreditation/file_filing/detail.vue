<template>
  <div class="page">
    <section class="header_container">
      <div class="ctjt_form_item_class mr-20">办证科目：档案归档</div>
      <div class="ctjt_form_item_class mr-20">
        办证类型：{{ changeDetailData.type | typeFilter }}
      </div>
      <div class="ctjt_form_item_class mr-20">
        操作日期：{{ changeDetailData.createdDate }}
      </div>
      <div class="ctjt_form_item_class">数量：{{ tableData.list.length }}</div>
    </section>
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
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
          :localstorage-service="'accreditation'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtStatistics
      :statistics-data="[{ label: '', value: statusText }]"
      :remark="''"
    ></CtjtStatistics>
    <!-- 补录弹窗 -->
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      :wrapperClosable="false"
      size="80%"
    >
      <template slot="title">
        <CtjtCard :prop-data="{ title: `补录${drawerTitle}` }">
          <template slot="header">
            <span
              style="float: right"
              class="iconfont close_icon"
              @click="closeDrawer()"
              >&#xe62b;</span
            >
          </template>
          <template slot="content">
            <el-form
              ref="drawerForm"
              :model="formData"
              :rules="formDataRules"
              label-position="left"
              label-width="100px"
            >
              <el-row :gutter="8">
                <el-col :span="6">
                  <el-form-item label="办证科目：">档案归档</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="办证类型：">{{
                    drawerTitle
                  }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="批次号：">{{
                    changeDetailData.batchNo
                  }}</el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-form-item
                  class="ctjt_form_item_class mr-20"
                  label="证件号码"
                  prop="idNo"
                >
                  <CtjtSelect
                    :value="formData.idNo"
                    :list="handleIdNoSelect"
                    :callback="formDataSelectCallback"
                    :placeholder="'请输入证件号码'"
                    :filterable="true"
                    :remote="true"
                    :options="{
                      value: 'idNo',
                      label: 'idNo',
                      title: 'userName',
                    }"
                    :loading="handleIdNoSelectLoading"
                    @remotemethod="queryIdNoSearch"
                  ></CtjtSelect>
                </el-form-item>
                <el-form-item
                  class="ctjt_form_item_class mr-20"
                  label="姓名"
                  prop="userName"
                >
                  <el-input
                    v-model="formData.userName"
                    class="w_200"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-button
                  class="ctjt_form_item_class"
                  type="primary"
                  @click="submitForm()"
                  >添加</el-button
                >
              </el-row>
            </el-form>
          </template>
        </CtjtCard>
      </template>
      <CtjtTable
        :tableData="formTableData"
        @option-call="formTableOptionCallback"
        @selection-change="formTableSelectionChange"
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
            <el-button type="primary" @click="searchTable()">查询</el-button>
          </el-row>
        </template>
      </CtjtTable>
    </el-drawer>
    <!-- 打印 -->
    <CtjtPrint
      :visible.sync="printShow"
      :tableData="printTableData"
    ></CtjtPrint>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class AccreditationFileFilingManageDetail extends Index {}
</script>
<style lang="scss" scoped>
.header_container {
  padding: 8px;
}
.ctjt_form_item_class {
  font-size: 16px;
  font-weight: 500;
}
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
.close_icon {
  cursor: pointer;
}
</style>
