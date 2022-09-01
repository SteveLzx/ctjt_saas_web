<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    >
      <template slot="autocomplete">
        <el-form-item
          v-for="(item, index) in searchForm.autocompleteList"
          :key="`autocomplete-${index}`"
          :label="item.label"
          :label-width="`${item.labelWidth + 'px' || 'auto'}`"
        >
          <el-autocomplete
            v-if="item.key === 'keyword'"
            popper-class="seach_table_autocomplete"
            v-model="item.value"
            value-key="idNo"
            :maxlength="item.maxlength"
            :clearable="item.clearable"
            :fetch-suggestions="autocompleteQuerySearch"
            :placeholder="item.placeholder || '请输入内容'"
            style="width: 320px" size="mini"
          ></el-autocomplete>
          <el-autocomplete
            v-else size="mini"
            v-model="item.value"
            :maxlength="item.maxlength"
            :clearable="item.clearable"
            :fetch-suggestions="autocompleteMaterialNameQuerySearch"
            :placeholder="item.placeholder || '请输入内容'"
          ></el-autocomplete>
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
    <CtjtStatistics
      :statistics-data="statisticsData"
      :remark="''"
    ></CtjtStatistics>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      :wrapperClosable="false"
      size="80%"
    >
      <template slot="title">
        <CtjtCard :prop-data="{ title: drawerTitle }">
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
              style="display: inline-block"
              label-position="left"
              label-width="80px"
            >
              <el-row :gutter="40" style="display: inline-block">
                <el-col :span="6" class="w_400 mr-20">
                  <el-form-item label="证件号码" prop="idNo">
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
                </el-col>
                <el-col class="w_300 mr-20">
                  <el-form-item label="姓名" prop="userName">
                    <el-input disabled v-model="formData.userName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="w_300 mr-20">
                  <el-form-item label="片区" prop="regionName">
                    <el-input disabled v-model="formData.regionName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="w_300 mr-20">
                  <el-form-item label="门店" prop="storeName">
                    <el-input disabled v-model="formData.storeName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="w_300 mr-20">
                  <el-form-item label="办证日期" prop="certificateDate">
                    <el-date-picker
                      :disabled="drawerType > 1"
                      v-model="formData.certificateDate"
                      type="date"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="w_300 mr-20">
                  <el-form-item label="资料名称" prop="materialName">
                    <el-autocomplete
                      :disabled="drawerType > 1"
                      v-model="formData.materialName"
                      :fetch-suggestions="drawerAutocompleteQuerySearch"
                      placeholder="请输入内容"
                      :maxlength="30"
                    ></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col class="w_600 mr-20">
                  <el-form-item label="备注" prop="remarks">
                    <el-input
                      :disabled="drawerType > 1"
                      v-model="formData.remarks"
                      type="textarea"
                      placeholder="请在备注中填写资料名称，以及相关备注内容"
                      maxlength="300"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col class="w_200">
                  <el-button type="primary" @click="submitForm">添加</el-button>
                </el-col>
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
          <div style="float: right">
            <span>关键字</span>
            <el-input
              v-model="keyword"
              class="w_300 mr-20 ml-20"
              placeholder="请输入学员姓名、证件号"
              clearable
            ></el-input>
            <el-button type="primary" @click="searchTableFunc">查询</el-button>
          </div>
        </template>
      </CtjtTable>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './index';

export default class AccreditationSupplementaryInformation extends Index {}
</script>
<style lang="scss" scoped>
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
.el-form-item{
  margin-bottom: 8px;
}
</style>
