<template>
  <div class="page" ref="">
    <SearchTable
      :prop-data.sync="searchForm"
    ></SearchTable>
    <section class="table_section" ref="table_section">
      <CtjtTable
        ref="ctjtTableReference"
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
      ></CtjtTable>
      <CtjtStatistics
        :statistics-data="statisticsData"
        remark=""
      ></CtjtStatistics>
    </section>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--新增-->
    <el-drawer
      :visible.sync="drawerShow"
      :wrapperClosable="false"
      size="85%"
      :before-close="closeDrawer"
    >
      <template slot="title">
        <span class="draw_title">新增</span>
      </template>
      <el-container style="height: 100%">
        <el-main>
          <el-form
            ref="addForm"
            :model="formData"
            :rules="formDataRules"
            class="add_form page"
            label-width="125px"
          >
            <el-row :gutter="6">
              <el-col :span="6">
                <el-form-item
                  class="ctjt_form_item_class"
                  label="证件号码："
                  prop="userName"
                >
                  <CtjtSelect
                    :value="formData.idNo"
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
              <el-col :span="6">
                <el-form-item
                  label="姓名："
                  class="ctjt_form_item_class"
                  prop="userInfo.userName"
                >
                  <el-input
                    v-model="formData.userName"
                    type="text"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="联系电话："
                  class="ctjt_form_item_class"
                  prop="mobile"
                >
                  <el-input
                    v-model="formData.mobile"
                    type="text"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-col>

            </el-row>
            <CtjtCard
              :prop-data="{
                title: '缴费明细（不含毕业、历史、退费中、已退费的数据）',
                tips: '请勾选需退费的订单',
              }"
              style="margin: 40px 0px"
            >
              <template #content>
                <el-row>
                  <CtjtTable
                    :tableData="formTableData"
                    @selection-change="formTableSelectionChange"
                  >
                  </CtjtTable>
                </el-row>
                <el-row :gutter="6" style="margin-top: 35px">
                  <el-col :span="6">
                    <el-form-item
                      label="总学时合计："
                      class="ctjt_form_item_class"
                      prop="totalHours"
                    >
                      <el-input
                        v-model="formData.totalHours"
                        type="text"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="总剩余学时："
                      class="ctjt_form_item_class"
                      prop="totalLeftHours"
                    >
                      <el-input
                        v-model="formData.totalLeftHours"
                        type="text"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="总订单金额："
                      class="ctjt_form_item_class"
                      prop="totalOrderMoney"
                    >
                      <el-input
                        v-model="formData.totalOrderMoney"
                        type="text"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="总实收金额"
                      class="ctjt_form_item_class"
                      prop="totalRealMoney"
                    >
                      <el-input
                        v-model="formData.totalRealMoney"
                        type="text"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </CtjtCard>
            <CtjtCard
              :prop-data="{ title: '扣费明细' }"
              style="margin: 40px 0px"
            >
              <template #content>
                <el-row :gutter="6">
                  <el-col :span="6">
                    <el-form-item
                      label="已学学时："
                      class="ctjt_form_item_class"
                      prop="learnedPeriod"
                    >
                      <el-input
                        v-model.trim="formData.learnedPeriod"
                        type="text"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="已学学时费："
                      class="ctjt_form_item_class"
                      prop="learnedPeriodFee"
                    >
                      <el-input
                        v-model.trim="formData.learnedPeriodFee"
                        type="text"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="应扣服务费："
                      class="ctjt_form_item_class"
                      prop="deductTrainFee"
                    >
                      <el-input
                        v-model.trim="formData.deductTrainFee"
                        type="text"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="6">
                  <el-col :span="6">
                    <el-form-item
                      label="应扣金额合计："
                      class="ctjt_form_item_class"
                      prop="deductTotalFee"
                    >
                      <el-input
                        v-model.trim="formData.deductTotalFee"
                        type="text"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="应退费用："
                      class="ctjt_form_item_class"
                      prop="refundableFee"
                    >
                      <el-input
                        v-model.trim="formData.refundableFee"
                        type="text"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="退费原因："
                      class="ctjt_form_item_class"
                      prop="reason"
                    >
                      <el-input
                        v-model.trim="formData.reason"
                        maxlength="200"
                        show-word-limit
                        placeholder="限200字以内"
                        class="w_300"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="备注："
                      class="ctjt_form_item_class"
                      prop="remark"
                    >
                      <el-input
                        v-model.trim="formData.remark"
                        maxlength="200"
                        show-word-limit
                        placeholder="限200字以内"
                        class="w_300"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </CtjtCard>
            <CtjtCard
              :prop-data="{ title: '退款账户' }"
              style="margin: 40px 0px"
            >
              <template #content>
                <el-row :gutter="6">
                  <el-col :span="6">
                    <el-form-item
                      label="账户名："
                      class="ctjt_form_item_class"
                      prop="accountName"
                    >
                      <el-input
                        v-model.trim="formData.accountName"
                        type="text"
                        show-word-limit
                        maxlength="18"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="银行卡号："
                      class="ctjt_form_item_class"
                      prop="cardNo"
                    >
                      <el-input
                        v-model.trim="formData.cardNo"
                        show-word-limit
                        maxlength="29"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="银行名称："
                      class="ctjt_form_item_class"
                      prop="bankMainName"
                    >
                      <el-input
                        v-model.trim="formData.bankMainName"
                        type="text"
                        show-word-limit
                        maxlength="20"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      label="支行名称："
                      class="ctjt_form_item_class"
                      prop="bankName"
                    >
                      <el-input
                        v-model.trim="formData.bankName"
                        type="text"
                        show-word-limit
                        maxlength="20"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider content-position="left">
                  <span style="color: red"
                    >提示：为避免转账不成功，非深圳银行卡必须写上哪个省哪个市</span
                  >
                </el-divider>
              </template>
            </CtjtCard>
          </el-form>
        </el-main>
        <el-footer>
          <el-row type="flex" justify="center">
            <el-button type="info" @click="closeDrawer">取消</el-button>
            <el-button
              type="primary"
              style="margin-left: 32px"
              :loading="submitLoading"
              @click="submitAddFun"
              >确定</el-button
            >
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
    <!--付款-->
    <el-dialog
      title="付款"
      :visible="dialogShow"
      width="25%"
      :before-close="handlePayClose"
    >
      <el-form
        ref="payForm"
        :model="formPayData"
        :rules="formPayRules"
        label-width="100px"
      >
        <el-form-item label="票据类型：" prop="invoiceType">
          <el-select
            v-model="formPayData.invoiceType"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in invoiceTypeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款时间：" prop="paymentDate">
          <el-date-picker
            style="width: 100%"
            v-model="formPayData.paymentDate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单号：" prop="num">
          <el-input
            placeholder="请输入"
            v-model.trim="formPayData.num"
            show-word-limit
            maxlength="30"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handlePayClose">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitPayFun"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--打印退费单-->
    <RefundPrint
      :visible.sync="refundPrintShow"
      :tableData="printTableData"
    ></RefundPrint>
  </div>
</template>
<script lang='ts'>
import Index from './list';

export default class MarketSanXueRefundMg extends Index {}
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
}
::v-deep .add_form .el-form-item__label {
  font-weight: bold;
}

</style>
