<template>
  <div class="page">
    <el-row type="flex" justify="space-between" align="center" class="mb-20">
      <div class="flex_div">审核状态：
        <el-link type="primary" :underline="false">{{formData.auditStatus | auditStatusFilter}}</el-link>
      </div>
      <div>
        <template v-if="formData.auditStatus === 0 || formData.auditStatus === 2 || formData.auditStatus === 3">
          <el-button type="primary" v-if="perm['btn_re_edit']"  @click="applyFunc(4)">重新编辑</el-button>
        </template>
        <template v-if="formData.auditStatus === 0">
          <el-button v-if="perm['btn_revoke']" type="warning" @click="applyFunc(3)">撤销</el-button>
          <el-button v-if="perm['btn_shbtg']" type="danger" @click="applyFunc(2)">驳回</el-button>
          <el-button v-if="perm['btn_shtg']" type="success" @click="applyFunc(1)">审核通过</el-button>
        </template>
        <el-button v-if="perm['btn_print']" type="primary" @click="refundPrintShow = true">打印</el-button>
        <el-button type="info" @click="goback()">返回</el-button>
      </div>
    </el-row>
    <el-form
      ref="formDataRef"
      :model="formData"
      :rules="formDataRules"
      class="add_form"
      label-width="125px"
    >
      <el-row :gutter="6">
        <el-col :span="6">
          <el-form-item
            class="ctjt_form_item_class"
            label="退费类型："
            prop="userName"
          >
            <span>{{ formData.scatteredType | scatteredTypeFilter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="申请日期："
            class="ctjt_form_item_class"
          >
            <span>{{formData.createdTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="申请单号："
            class="ctjt_form_item_class"
          >
            <span>{{formData.applyNo}}</span>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="6">
        <el-col :span="6">
          <el-form-item
            class="ctjt_form_item_class"
            label="证件号码："
            prop="userName"
          >
            <el-input
              v-model="formData.idNo"
              type="text"
              disabled
            ></el-input>
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
        }"
        style="margin: 40px 0px"
      >
        <template #content>
          <el-row>
            <CtjtTable
              :tableData="formTableData"
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
                  :disabled="isNotEdit"
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
                  :disabled="isNotEdit"
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
                  :disabled="isNotEdit"
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
                style="width:100%"
                prop="reason"
              >
                <el-input
                  v-model.trim="formData.reason"
                  maxlength="200"
                  show-word-limit
                  placeholder="限200字以内"
                  :disabled="isNotEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="备注："
                class="ctjt_form_item_class"
                style="width:100%"
                prop="remark"
              >
                <el-input
                  v-model.trim="formData.remark"
                  maxlength="200"
                  show-word-limit
                  placeholder="限200字以内"
                  :disabled="isNotEdit"
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
                  :disabled="isNotEdit"
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
                  :disabled="isNotEdit"
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
                  :disabled="isNotEdit"
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
                  :disabled="isNotEdit"
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
      <CtjtCard
        v-if="formData.auditStatus === 4"
        :prop-data="{ title: '付款信息' }"
        style="margin: 40px 0px"
      >
        <template #content>
          <el-row :gutter="6">
            <el-col :span="6">
              <el-form-item
                label="单号："
                class="ctjt_form_item_class"
              >
                <span>{{formData.financeBatchNo}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="付款金额："
                class="ctjt_form_item_class"
              >
                <span>{{formData.payFee}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="票据类型："
                class="ctjt_form_item_class"
              >
                <span>{{formData.invoiceType | invoicingFilter}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="付款日期："
                class="ctjt_form_item_class"
              >
                <span>{{formData.paymentDate}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="6">
            <el-col :span="6">
              <el-form-item
                label="付款人："
                class="ctjt_form_item_class"
              >
                <span>{{formData.payName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
    </el-form>
    <CtjtTable :tableData="tableData"></CtjtTable>
    <PrintDetail :visible.sync="refundPrintShow" :data="printDetailData"></PrintDetail>
    <CtjtRejectDialog :dialogVisible.sync="rejectShow" :type="3" :id="$route.query.id"  @on-submit="rejectCallBack"></CtjtRejectDialog>
    <el-row type="flex" justify="center" class="mb-20 mt-20" v-if="!isNotEdit">
      <el-button @click="goback()">取消</el-button>
      <el-button type="primary" @click="submit()">保存</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import Index from './detail';

export default class MarketOrderApprovalRefundDetail extends Index {}
</script>
<style lang="scss" scoped>
.flex_div {
  display: flex;
  align-items: center;
}
</style>
