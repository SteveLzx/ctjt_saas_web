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
    <CtjtStatistics
      :statistics-data="statisticsData"
      :remark="''"
    ></CtjtStatistics>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--singForm 弹出框 录入转账码-->
    <CtjtSingleInfoDialog
      :info-data="userBaseInfoData"
      title="录入转账码"
      :is-show="dialogName === 'singleForm'"
      @button-call="singleInfoButtonCallback"
      :rules="singleFormRules"
      ref="singleFormDialog"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="资金科目" class="ctjt_form_item_class">
            <span>{{ userBaseInfoData.step | captionSubjectFilter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监管金额" class="ctjt_form_item_class">
            <span>{{ userBaseInfoData.superviseAmount }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="付款方式" class="ctjt_form_item_class">
            <span>{{ userBaseInfoData.payType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="监管日期"
            class="ctjt_form_item_class"
            prop="superviseDate"
          >
            <el-date-picker
              v-model="userBaseInfoData.superviseDate"
              align="right"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="转账码"
            class="ctjt_form_item_class"
            prop="transferCode"
          >
            <el-input
              v-model.trim="userBaseInfoData.transferCode"
              type="text"
              placeholder="请输入转账码"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </CtjtSingleInfoDialog>
    <!--补录办证数据-->
    <CtjtSupplementDrawer
      :is-show="dialogName === 'supplement'"
      :supplement-props="importProps"
      @button-call="submitSupplementCallback"
    >
    </CtjtSupplementDrawer>
    <!--导入办证数据弹出框-->
    <CtjtImportDrawer
      :import-visible="dialogName === 'import'"
      :import-props="importProps"
      @button-call="dialogName = ''"
      @on-upload="importResultCallback"
    ></CtjtImportDrawer>
    <!--导入办证数据返回结果弹出框-->
    <CtjtCertificateResultDialog
      :certificate-result-visible="
        certificateResult === 'import' || certificateResult === 'supplement'
      "
      :title="certificateResult === 'import' ? '导入' : '补录'"
      :import-data="importData"
      @button-call="certificateResult = ''"
    ></CtjtCertificateResultDialog>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="showlog"
      :list="logtableData"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
    <el-dialog
      title="选择导出银行"
      :visible.sync="showBanck"
      width="300px"
      center
      :before-close="handleBanckClose">
      <el-select v-model="bankType" placeholder="请选择">
        <el-option
          v-for="item in bankOpts"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="handleBanckClose">取 消</el-button>
        <el-button type="primary" @click="handleBanckSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { CAPITAL_ACCOUNT } from '@/enums';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCreateTable,
  CtjtOperationLog,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import {
  CtjtSingleInfoDialog,
  CtjtCertificateResultDialog,
  CtjtImportDrawer,
  CtjtSupplementDrawer,
} from '@/views/accreditation/_components';
import Index from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtStatistics,
    CtjtSingleInfoDialog,
    CtjtImportDrawer,
    CtjtCertificateResultDialog,
    CtjtCreateTable,
    CtjtSupplementDrawer,
    CtjtOperationLog,
  },
  filters: {
    captionSubjectFilter: (val: any) => (val ? CAPITAL_ACCOUNT[val - 1].label : ''),
  },
})
export default class AccreditationCapitalSupervision extends Index {}
</script>
<style lang="scss" scoped>
.ctjt_form_item_class {
  width: 380px;
  .el-date-editor,
  .el-select {
    width: 100%;
  }
}
.el-form-item {
  margin-bottom: 8px;
}
</style>
