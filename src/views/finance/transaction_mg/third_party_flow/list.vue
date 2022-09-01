<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <CtjtAutoUpload
          ref="fileUpload"
          text="导入数据"
          button-type="success"
          :prop-config="uploadConfig"
          :upload-path="uploadPath"
          @on-upload="uploadCallback"
          style="margin-right: 10px"
          v-if="perm['btn_drsj'] && isHuizhou"
        >
        </CtjtAutoUpload>
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
          :localstorage-service="'finance'"
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
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
    <!--导入数据弹出框-->
    <CtjtDialog
      title="导入数据"
      width="400px"
      :is-show="dialogName === 'import'"
      @button-call="cancelDialog"
    >
      <el-form ref="select_form" label-width="110px">
        <el-form-item label="数据类型">
          <el-select v-model="chanelDataType" placeholder="请选择">
            <el-option
              v-for="item in chanelDataTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-row type="flex" justify="center" style="padding-bottom: 30px">
          <el-button
            type="info"
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="cancelDialog"
            >取消</el-button
          >
          <CtjtAutoUpload
            ref="fileUpload"
            text="确定"
            button-type="primary"
            :prop-config="uploadConfig"
            :upload-path="uploadPath"
            @on-upload="uploadCallback"
            style="margin-left: 32px"
          >
          </CtjtAutoUpload>
        </el-row>
      </el-form>
    </CtjtDialog>
    <CtjtFinanceResultDialog
      :visible="dialogName === 'importResult'"
      title="导入"
      :import-data="resultData"
      @button-call="dialogName = ''"
    ></CtjtFinanceResultDialog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtSetField,
  CtjtOperationLog,
  CtjtAutoUpload,
  CtjtDialog,
} from '@/components';
import { CtjtFinanceResultDialog } from '@/views/finance/_components';
import FinanceThirdPartyFlowIndex from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtOperationLog,
    CtjtAutoUpload,
    CtjtDialog,
    CtjtFinanceResultDialog,
  },
})
export default class FinanceThirdPartyFlow extends FinanceThirdPartyFlowIndex {}
</script>
