<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <p v-if="userInfo.drivingSchoolId === '370'">
      <b class="td_text_red"
        >注意：深港转入的散学订单如果是现金收款，无需进行【现金复核】，在【代收散学复核】中完成数据结转即可。</b
      >
    </p>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <CtjtAutoUpload
          ref="fileUpload"
          text="导入发票信息"
          button-type="success"
          :prop-config="uploadConfig"
          :upload-path="uploadPath"
          @on-upload="uploadCallback"
          style="margin-right: 10px"
          v-if="perm['btn_drfpxx'] && !isHasZuofei"
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
    <div style="color: red; margin-top: 30px">
      总计：实收金额 {{ formatPrice(staticData.totalAmount) }}元，
      发票金额（已扣除代缴注册费）{{
        formatPrice(staticData.totalInvoiceAmount)
      }}元， 已开票金额 {{ formatPrice(staticData.totalInvoiceUsedAmount) }}元
    </div>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--修改已开票信息弹出框-->
    <CtjtDialog
      :title="dialogName"
      width="450px"
      :is-show="dialogName === '修改已开发票'"
      @button-call="cancelDialog"
    >
      <el-form
        ref="invoicingForm"
        :model="invoicingFormData"
        :rules="invoicingFormRules"
        label-width="110px"
        class="invoicing_edit_form"
      >
        <el-form-item label="已开发票金额" prop="invoiceUsedAmount">
          <el-input
            v-model="invoicingFormData.invoiceUsedAmount"
            type="text"
            placeholder="请输入已开发票金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="发票号" prop="invoiceNo">
          <el-input
            v-model="invoicingFormData.invoiceNo"
            type="text"
            placeholder="多张发票请用【,】分割"
            maxlength="100"
            show-word-limit
          ></el-input>
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
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="submitInvoicingForm"
            :loading="submitLoading"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog>
    <!--修改发票信息弹出框-->
    <CtjtDialog
      :title="dialogName"
      width="1000px"
      :is-show="dialogName === '修改发票信息'"
      @button-call="cancelDialog"
    >
      <el-form
        ref="invoiceForm"
        :model="invoiceFormData"
        :rules="invoiceFormRules"
        label-width="110px"
        class="invoice_edit_form"
      >
        <el-form-item label="发票种类" prop="type">
          <el-select v-model="invoiceFormData.type" placeholder="请选择">
            <el-option
              v-for="item in invoiceTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票名称" prop="invoiceName">
          <el-input
            v-model="invoiceFormData.invoiceName"
            type="text"
            placeholder="请输入发票名称"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="开票方式" prop="mode">
          <el-select v-model="invoiceFormData.mode" placeholder="请选择">
            <el-option
              v-for="item in openTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="identifyNumber">
          <el-input
            v-model="invoiceFormData.identifyNumber"
            type="text"
            placeholder="请输入纳税人识别号"
            maxlength="30"
            show-word-limit
            :disabled="identifyNumberDisabled"
          ></el-input>
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
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="submitInvoiceForm"
            :loading="submitLoading"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog>

    <!--现金复核弹出框-->
    <CtjtDialog
      :title="dialogName"
      width="500px"
      :is-show="dialogName === '现金复核'"
      @button-call="cancelDialog"
    >
      <el-form
        ref="cashForm"
        :model="cashFormData"
        label-position="top"
        label-width="110px"
        class="invoice_edit_form"
      >
        <el-row>
          <el-form-item>
            <sapn
              >待复核现金金额：{{
                cashFormData.selectionList.length > 0
                  ? cashFormData.selectionList[0].amount
                  : 0
              }}</sapn
            >
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="cashFormData.remark"
              type="textarea"
              placeholder="限100字"
              maxlength="100"
              :rows="4"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-row>
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
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="moneyFuHe"
            :loading="submitLoading"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog>
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
    <!-- 打印 -->
    <CtjtFinancePrint
      :visible.sync="printShow"
      :table-data="printTableData"
    ></CtjtFinancePrint>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtSetField,
  CtjtAutoUpload,
  CtjtOperationLog,
  CtjtDialog,
} from '@/components';
import { CtjtFinancePrint } from '@/views/finance/_components';
import Index from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtAutoUpload,
    CtjtOperationLog,
    CtjtDialog,
    CtjtFinancePrint,
  },
})
export default class FinanceSystemFlow extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .invoice_edit_form .el-form-item {
  width: 450px;
  display: inline-block;
  margin-bottom: 30px;
  .el-date-editor,
  .el-select {
    width: 100%;
  }
}
</style>
