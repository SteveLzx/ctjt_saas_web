<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    > <template slot="autocomplete">
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
    <p><b class="td_text_red">注：只有【牌证收档案】才会自动生成档案编号</b></p>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <CtjtAutoUpload
          v-if="perm['btn_import']"
          ref="fileUpload"
          text="导入"
          button-type="primary"
          :prop-config="uploadConfig"
          :upload-path="uploadPath"
          @on-upload="uploadCallback"
          style="margin-right: 10px"
        ></CtjtAutoUpload>
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
      :statistics-data="[{ label: '批次总数：', value: paginationData.total }]"
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
        <CtjtCard :prop-data="{ title: `新增${formData.status}` }">
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
              label-width="100px"
            >
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-form-item label="证件号码" prop="idNo">
                    <el-autocomplete class="w_240"
                      popper-class="seach_table_autocomplete"
                      v-model.trim="formData.idNo"
                      :fetch-suggestions="queryIdNoSearch"
                      placeholder="请输入"
                      :maxlength="20"
                      show-word-limit
                      @select="formDataSelectCallback"
                    >
                      <template slot-scope="{ item }">
                        <div>{{ item.userName }}</div>
                        <span>{{ item.idNo }}</span>
                      </template>
                    </el-autocomplete>
                    <p class="td_text_red">注：历史学员不可添加，不会进行查询</p>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="姓名：" prop="userName">{{formData.userName}}</el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-form-item label="片区：" prop="regionName">{{ formData.regionName }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="门店：" prop="storeName">{{ formData.storeName }}</el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="办证类型：" prop="status">{{ formData.status }}</el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="8">
                  <el-form-item label="补录批次号" prop="batchNo">
                    <el-input class="w_240" v-model.trim="formData.batchNo" placeholder="如需补录请填写"></el-input>
                    <p class="td_text_red">注：每批数据只可补录同一个批次号的数据</p>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="formData.remark" show-word-limit maxlength="300" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
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
        <!-- <template slot="reference">
          <el-row style="float: right">
            <label>关键字</label>
            <el-input
              v-model="keyword"
              class="w_300 mr-20 ml-20"
              placeholder="请输入学员姓名、证件号"
              clearable
            ></el-input>
            <el-button type="primary" @click="searchTableFunc">查询</el-button>
          </el-row>
        </template> -->
      </CtjtTable>
    </el-drawer>
    <!--导入办证数据返回结果弹出框-->
    <CtjtCertificateResultDialog
      :certificate-result-visible="dialogVisible"
      :title="'导入'"
      :import-data="importData"
      @button-call="dialogVisible = false"
    ></CtjtCertificateResultDialog>
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
import Index from './index';

export default class AccreditationFileFilingManage extends Index {}
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
