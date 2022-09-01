<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm">
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
            style="width: 320px" size="mini"
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
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--新增考试结果变更弹出框-->
    <el-drawer
      :visible.sync="drawer"
      :wrapperClosable="false"
      size="70%"
      :before-close="closeDrawer"
    >
      <template slot="title">
        <span class="draw_title">新增考试结果变更</span>
      </template>
      <el-form
        ref="searchForm"
        :model="saerchFormData"
        :rules="saerchFormDataRules"
        label-position="right"
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
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="证件号码："
              prop="userName"
            >
              <CtjtSelect
                :value="saerchFormData.userName"
                :list="idNoOption.options"
                :callback="formDataSelectCallback"
                :placeholder="'请输入证件号码搜索学员'"
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
      <el-form
        ref="drawerForm"
        :model="formData"
        :rules="formDataRules"
        label-position="right"
        label-width="135px"
        class="drawer_form"
      >
        <el-row>
          <CtjtTable :tableData="formTableData"> </CtjtTable>
        </el-row>
        <CtjtCard
          :prop-data="{ title: '变更后考试结果' }"
          style="margin: 40px 0px"
        >
          <template #content>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item
                  label="考核类型："
                  class="ctjt_form_item_class"
                  prop="type"
                >
                  <el-select
                    v-model="formData.type"
                    placeholder="请选择考核类型"
                  >
                    <el-option
                      v-for="item in typeList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="变更后考试结果："
                  class="ctjt_form_item_class"
                  prop="newResult"
                >
                  <el-select
                    v-model="formData.newResult"
                    placeholder="请选择变更后考试结果"
                  >
                    <el-option
                      v-for="item in newResultList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  class="ctjt_form_item_class"
                  label="变更原因："
                  prop="reason"
                  style="width: 80%"
                >
                  <el-input
                    v-model.trim="formData.reason"
                    type="textarea"
                    maxlength="200"
                    show-word-limit
                    :rows="2"
                    placeholder="限200字以内"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </CtjtCard>
        <el-row type="flex" justify="center" style="margin: 50px">
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="closeDrawer"
            >取消</el-button
          >
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="submitChange"
            :loading="submitLoading"
            >提交变更</el-button
          >
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtSelect,
  CtjtSetField,
} from '@/components';
import CtjtTableColumn from '@/components/Table/Column';
import Index from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtCard,
    CtjtSelect,
    CtjtTableColumn,
  },
})
export default class AccreditationExamResultsChange extends Index {}
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
.el-form-item{
  margin-bottom: 8px;
}
</style>
