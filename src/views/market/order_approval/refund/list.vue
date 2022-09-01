<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable :tableData="tableData" @option-call="tableOptionCallback" @selection-change="tableSelectionChange">
      <template slot="reference">
        <el-button @click="dialogName = 'field'" style="float: right">字段设置</el-button>
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'market'"
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
    <!-- 弹窗 -->
    <el-dialog
      title="付款"
      :visible="dialogName === 'fukuan'"
      width="30%"
      :before-close="handleCloseFukuan">
      <el-form ref="formFukuanRef" :model="formFukuanData" :rules="formFukuanRules" label-width="80px">
        <el-form-item label="付款时间" prop="paymentDate">
          <el-date-picker
            style="width: 100%;"
            v-model="formFukuanData.paymentDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单号">
          <el-input placeholder="请输入" v-model.trim="formFukuanData.num" show-word-limit maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCloseFukuan">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="handleSubmitFukuan">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改票据类型"
      :visible="dialogName === 'billtype'"
      width="30%"
      :before-close="handleCloseBilltype">
      <el-form ref="formBilltypeRef" label-width="80px">
        <el-form-item label="学员姓名">
          <el-input placeholder="请输入" v-model.trim="formBilltypeRef.name"></el-input>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input placeholder="请输入" v-model.trim="formBilltypeRef.order"></el-input>
        </el-form-item>
        <el-form-item label="票据类型">
          <el-select style="width: 100%;" v-model="formBilltypeRef.value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单号">
          <el-input placeholder="请输入" v-model.trim="formBilltypeRef.order"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleCloseBilltype">取 消</el-button>
        <el-button type="primary" @click="handleCloseBilltype">确 定</el-button>
      </span>
    </el-dialog>
    <RefundPrint :visible.sync="refundPrintShow" :tableData="printTableData"></RefundPrint>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class MarketOrderApprovalRefund extends Index {}
</script>
