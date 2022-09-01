<template>
  <div class="page">
    <el-form
      ref="searchForm"
      :model="saerchFormData"
      :rules="saerchFormDataRules"
      label-position="left"
      label-width="130px"
      class="drawer_form"
    >
      <el-row :gutter="6">
        <el-col :span="10">
          <el-form-item
            label="考试科目："
            class="ctjt_form_item_class"
            prop="subject"
          >
            <el-select
              v-model="saerchFormData.subject"
              placeholder="请选择考试科目"
              @change="subjectChangeFun"
            >
              <el-option
                v-for="item in subjectList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            class="ctjt_form_item_class"
            label="姓名/证件号码："
            prop="userName"
          >
            <CtjtSelect
              :value="saerchFormData.userName"
              :list="idNoOption.options"
              :callback="formDataSelectCallback"
              :placeholder="'请输入姓名/证件号码搜索学员'"
              :filterable="true"
              :remote="true"
              :options="{
                value: 'idNo',
                label: 'idNo',
                title: 'userName',
              }"
              :loading="idNoOption.loading"
              @remotemethod="queryIdNoSearch"
            ></CtjtSelect>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <CtjtTable :tableData="tableData"></CtjtTable>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtSelect,
} from '@/components';
import Index from './index';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    CtjtSelect,
  },
})
export default class AccreditationSimulationResults extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  border-bottom: 1px solid $--color-border-split;
  padding: 30px;
  .draw_title {
    font-size: 17px;
    font-weight: 500;
  }
}

::v-deep .el-drawer__body {
  overflow: auto;
  padding: 30px;
}
::v-deep .ctjt_form_item_class .el-input__inner {
  width: 250px;
}
::v-deep .drawer_form .el-row {
  padding: 10px 0px;
}
::v-deep .drawer_table .el-table__header-wrapper .el-checkbox {
  display: none;
}
::v-deep .drawer_form .el-form-item__label,
::v-deep .drawer_detail_form .el-form-item__label {
  font-weight: bold;
}
</style>
