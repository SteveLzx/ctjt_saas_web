<template>
  <div class="page">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-row type="flex" justify="space-between" align="center" class="mb-20" v-if="formData.auditStatus !== null">
        <div class="flex_div">当前审核状态：
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
          <el-button @click="goback()">返回</el-button>
        </div>
      </el-row>
      <CtjtCard :prop-data="{ title: `${formData.auditStatus ? '' : '新增'}退费申请`}">
        <template #content>
          <el-row v-if="$route.query.id">
            <el-col :span="8">
              <el-form-item label="申请日期:">{{formData.createdTime}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请单号:">{{formData.applyNo}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`退费类型${type === 0 || type === 1 ? '' : ':'}`" prop="refundType">
                <template v-if="type === 0 || type === 1">
                  <el-select class="w_300"
                    v-model="formData.refundType"
                    @change="refundTypeChange"
                    placeholder="请选择">
                    <el-option
                      v-for="item in refundTypeOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  {{formData.refundType | refundTypeFilter}}
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`证件号码${type === 0 ? '' : ':'}`" prop="idNo">
                <template v-if="type === 0">
                  <el-input class="w_300" v-model.trim="formData.idNo" placeholder="请输入" @blur="idNoBlurFunc"></el-input>
                </template>
                <template v-else>
                  {{formData.idNo}}
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学员姓名:">{{formData.userName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="服务门店:">{{formData.storeName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话:">{{formData.mobile}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报名日期:">{{formData.registerDate}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="班别车型:">{{formData.classesName}}-{{formData.carModel}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报名费用:">{{formData.registerCost}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营销渠道:">{{formData.marketingChannel}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="已缴费用:">{{formData.paidCost}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="欠缴费用:">{{formData.oweCost}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学车进度:">{{formData.subjects | subjectsFilter}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="`退款原因${type === 0 || type === 1 ? '' : ':'}`" prop="refundCause">
                <template v-if="type === 0 || type === 1">
                  <el-select class="w_300" v-model="formData.refundCause" placeholder="请选择">
                    <el-option
                      v-for="item in refundReasonOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  {{formData.refundCause | refundCauseFilter}}
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`备注${type === 0 || type === 1 ? '' : ':'}`" prop="remark">
                <template v-if="type === 0 || type === 1">
                  <el-input class="w_300" v-model.trim="formData.remark" type="textarea" placeholder="请输入" show-word-limit maxlength="30"></el-input>
                  <p class="td_text_red">【换人学车】时请填写换人相关信息。</p>
                </template>
                <template v-else>
                  {{formData.remark}}
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '缴费明细'}" v-if="formData.refundType !== 6">
        <template #content>
          <CtjtTable :tableData="payTableData"></CtjtTable>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '退费资料'}">
        <template #content>
          <el-form-item :label="`办理方式${type === 0 || type === 1 ? '' : ':'}`" prop="transactWay">
            <template v-if="type === 0 || type === 1">
              <el-select class="w_300"
                v-model="formData.transactWay"
                @change="transactWayChange"
                placeholder="请选择">
                <el-option label="他人办理" :value="0"></el-option>
                <el-option label="本人办理" :value="1"></el-option>
              </el-select>
            </template>
            <template v-else>
              {{formData.transactWay === 1 ? '本' : '他'}}人办理
            </template>
          </el-form-item>
          <el-form-item :label="`培训协议${type === 0 || type === 1 ? '' : ':'}`" prop="trainProtocol">
            <template v-if="type === 0 || type === 1">
              <el-row type="flex">
                <el-select class="w_300" v-model="formData.trainProtocol" placeholder="请选择">
                  <el-option
                    v-for="item in haveOrNoOpts"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-form-item class="ml-20" prop="trainProtocolFile" v-if="formData.trainProtocol === 0">
                  <CtjtAllTypeUpload
                    :prop-config="trainProtocolFileOpts"
                    @upload-success="trainProtocolFileUploadSuccess"
                    @upload-remove="trainProtocolFileUploadRemove"
                  >
                    <el-button slot="content">上传附件</el-button>
                  </CtjtAllTypeUpload>
                </el-form-item>
              </el-row>
            </template>
            <template v-else>
              {{formData.trainProtocol | haveOrNoFilter}}&nbsp;&nbsp;&nbsp;
              {{formData.trainProtocolFile && formData.trainProtocolFile.length > 0 ? '附件：' : ''}}
              <el-link class="mr-20" type="primary" @click="openFileFunc(item)" v-for="(item, index) in formData.trainProtocolFile" :key="index">{{item | fileNameFilter}}</el-link>
            </template>
          </el-form-item>
          <el-form-item :label="`培训发票${type === 0 || type === 1 ? '' : ':'}`" prop="trainInvoice">
            <template v-if="type === 0 || type === 1">
              <el-row type="flex">
                <el-select class="w_300" v-model="formData.trainInvoice" placeholder="请选择">
                  <el-option
                    v-for="item in haveOrNoOpts"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-form-item class="ml-20" prop="trainInvoiceFile" v-if="formData.trainInvoice === 0">
                  <CtjtAllTypeUpload
                    :prop-config="trainInvoiceFileOpts"
                    @upload-success="trainInvoiceFileUploadSuccess"
                    @upload-remove="trainInvoiceFileUploadRemove"
                  >
                    <el-button slot="content">上传附件</el-button>
                  </CtjtAllTypeUpload>
                </el-form-item>
              </el-row>
            </template>
            <template v-else>
              {{formData.trainInvoice | haveOrNoFilter}}&nbsp;&nbsp;&nbsp;
              {{formData.trainInvoiceFile && formData.trainInvoiceFile.length > 0 ? '附件：' : ''}}
              <el-link class="mr-20" type="primary" @click="openFileFunc(item)" v-for="(item, index) in formData.trainInvoiceFile" :key="index">{{item | fileNameFilter}}</el-link>
            </template>
          </el-form-item>
          <el-form-item :label="`银行卡复印件${type === 0 || type === 1 ? '' : ':'}`" prop="bankCardCopies">
            <template v-if="type === 0 || type === 1">
              <el-row type="flex">
                <el-select class="w_300" v-model="formData.bankCardCopies" placeholder="请选择">
                  <el-option
                    v-for="item in haveOrNoOpts"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-form-item class="ml-20" prop="bankCardCopiesFile" v-if="formData.bankCardCopies === 0">
                  <CtjtAllTypeUpload
                    :prop-config="bankCardCopiesFileOpts"
                    @upload-success="bankCardCopiesFileUploadSuccess"
                    @upload-remove="bankCardCopiesFileUploadRemove"
                  >
                    <el-button slot="content">上传附件</el-button>
                  </CtjtAllTypeUpload>
                </el-form-item>
              </el-row>
            </template>
            <template v-else>
              {{formData.bankCardCopies | haveOrNoFilter}}&nbsp;&nbsp;&nbsp;
              {{formData.bankCardCopiesFile && formData.bankCardCopiesFile.length > 0 ? '附件：' : ''}}
              <el-link class="mr-20" type="primary" @click="openFileFunc(item)" v-for="(item, index) in formData.bankCardCopiesFile" :key="index">{{item | fileNameFilter}}</el-link>
            </template>
          </el-form-item>
          <el-form-item :label="`单位证明${type === 0 || type === 1 ? '' : ':'}`" prop="firmProve">
            <template v-if="type === 0 || type === 1">
              <el-row type="flex">
                <el-select class="w_300" v-model="formData.firmProve" placeholder="请选择">
                  <el-option
                    v-for="item in haveOrNoOpts"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-form-item class="ml-20" prop="firmProveFile" v-if="formData.firmProve === 0">
                  <CtjtAllTypeUpload
                    :prop-config="firmProveFileOpts"
                    @upload-success="firmProveFileUploadSuccess"
                    @upload-remove="firmProveFileUploadRemove"
                  >
                    <el-button slot="content">上传附件</el-button>
                  </CtjtAllTypeUpload>
                </el-form-item>
              </el-row>
            </template>
            <template v-else>
              {{formData.firmProve | haveOrNoFilter}}&nbsp;&nbsp;&nbsp;
              {{formData.firmProveFile && formData.firmProveFile.length > 0 ? '附件：' : ''}}
              <el-link class="mr-20" type="primary" @click="openFileFunc(item)" v-for="(item, index) in formData.firmProveFile" :key="index">{{item | fileNameFilter}}</el-link>
            </template>
          </el-form-item>
          <template v-if="formData.transactWay === 0">
            <el-form-item :label="`委托书${type === 0 || type === 1 ? '' : ':'}`" prop="powerOfAttorney">
              <template v-if="type === 0 || type === 1">
                <CtjtAllTypeUpload
                  :prop-config="powerOfAttorneyFileOpts"
                  @upload-success="powerOfAttorneyFileUploadSuccess"
                  @upload-remove="powerOfAttorneyFileUploadRemove"
                >
                  <el-button slot="content">上传附件</el-button>
                </CtjtAllTypeUpload>
              </template>
              <template v-else>
                {{formData.powerOfAttorney && formData.powerOfAttorney.length > 0 ? '附件：' : ''}}
                <el-link
                  class="mr-20"
                  type="primary"
                  @click="openFileFunc(item)"
                  v-for="(item, index) in formData.powerOfAttorney"
                  :key="index">{{item | fileNameFilter}}</el-link>
              </template>
            </el-form-item>
            <el-form-item :label="`其他资料${type === 0 || type === 1 ? '' : ':'}`" prop="otherInformation">
              <template v-if="type === 0 || type === 1">
                <CtjtAllTypeUpload
                  :prop-config="otherInformationFileOpts"
                  @upload-success="otherInformationFileUploadSuccess"
                  @upload-remove="otherInformationFileUploadRemove"
                >
                  <el-button slot="content">上传附件</el-button>
                </CtjtAllTypeUpload>
              </template>
              <template v-else>
                {{formData.otherInformation && formData.otherInformation.length > 0 ? '附件：' : ''}}
                <el-link class="mr-20" type="primary" @click="openFileFunc(item)" v-for="(item, index) in formData.otherInformation" :key="index">{{item | fileNameFilter}}</el-link>
              </template>
            </el-form-item>
          </template>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '扣费明细'}">
        <template #content>
          <el-row>
            <el-col :span="12"><b>客服填写:</b></el-col>
            <el-col :span="12" v-if="isFinance && type !== 1"><b>财务填写：</b></el-col>
          </el-row>
          <el-form-item label="">
            <el-row>
              <el-col :span="12">
                <el-form-item label="应扣注册费" prop="registeringCost">
                  <el-input class="w_300" v-model="formData.registeringCost" :disabled="formData.refundType === 6 || type === 2"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="isFinance && type !== 1">
                <el-form-item label="应扣注册费" prop="financeRegisteringCost">
                  <el-input class="w_300" v-model="formData.financeRegisteringCost" :disabled="formData.refundType === 6 || formData.auditStatus === 4"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <el-row>
              <el-col :span="12">
                <el-form-item label="应扣培训费" prop="trainCost">
                  <el-input class="w_300" v-model="formData.trainCost" :disabled="formData.refundType === 6 || type === 2"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="isFinance && type !== 1">
                <el-form-item label="应扣培训费" prop="financeTrainCost">
                  <el-input class="w_300" v-model="formData.financeTrainCost" :disabled="formData.refundType === 6 || formData.auditStatus === 4"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <el-row>
              <el-col :span="12">
                <el-form-item label="应扣其他费用" prop="otherCost">
                  <el-input class="w_300" v-model="formData.otherCost" :disabled="formData.refundType === 6 || type === 2"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="isFinance && type !== 1">
                <el-form-item label="应扣其他费用" prop="financeOtherCost">
                  <el-input class="w_300" v-model="formData.financeOtherCost" :disabled="formData.refundType === 6 || formData.auditStatus === 4"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <el-row>
              <el-col :span="12">
                <el-form-item label="应退差价" prop="differCost">
                  <el-input class="w_300" v-model="formData.differCost" :disabled="formData.refundType !== 6 || type === 2" placeholder="退费类型为退差价才需填写"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="isFinance && type !== 1">
                <el-form-item label="应退差价" prop="financeDifferCost">
                  <el-input class="w_300" v-model="formData.financeDifferCost" :disabled="formData.refundType !== 6 || formData.auditStatus === 4" placeholder="退费类型为退差价才需填写"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <el-row>
              <el-col :span="12">
                <el-form-item label="应扣金额合计(元):" label-width="140px">
                  {{customerServiceDeductedTotalAmount}}
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="isFinance && type !== 1">
                <el-form-item label="应扣金额合计(元):" label-width="140px">
                  {{deductedTotalAmount}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <el-row>
              <el-col :span="12">
                <el-form-item label="应退费用(元):" label-width="140px">
                  {{customerServiceRefundableTotalAmount}}
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="isFinance && type !== 1">
                <el-form-item label="应退费用(元):" label-width="140px">
                  {{refundableTotalAmount}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-divider v-if="isFinance && type !== 1"></el-divider>
          <el-row v-if="isFinance && type !== 1">
            <el-col :span="6">
              <el-form-item label-width="140" label="退费单应扣金额合计(元):">
                {{deductedTotalAmount}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="140" label="退费单应退费用(元):">
                {{refundableTotalAmount}}
              </el-form-item>
            </el-col>
            <template v-if="isFinance && type !== 1">
              <el-col :span="6">
                <el-form-item label="财务审核金额" prop="financeAuditAmount">
                  <el-input class="w_200" v-model="formData.financeAuditAmount" placeholder="请输入" :disabled="formData.auditStatus === 4"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="票据类型" prop="invoiceType">
                  <el-select class="w_300" v-model="formData.invoiceType" placeholder="请选择" :disabled="formData.auditStatus === 4">
                    <el-option
                      v-for="item in invoiceTypeOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '退款账户'}">
        <template #content>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`账户名${type === 0 || type === 1 ? '' : ':'}`" prop="account">
                <template v-if="type === 0 || type === 1">
                  <el-input class="w_300" v-model.trim="formData.account" show-word-limit maxlength="18"></el-input>
                </template>
                <template v-else>
                  {{formData.account}}
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`银行名称${type === 0 || type === 1 ? '' : ':'}`" prop="bankMainName">
                <template v-if="type === 0 || type === 1">
                  <el-input class="w_300" v-model.trim="formData.bankMainName" show-word-limit maxlength="20"></el-input>
                </template>
                <template v-else>
                  {{formData.bankMainName}}
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`银行卡号${type === 0 || type === 1 ? '' : ':'}`" prop="bankNo">
                <template v-if="type === 0 || type === 1">
                  <el-input class="w_300" v-model.trim="formData.bankNo" show-word-limit maxlength="29"></el-input>
                </template>
                <template v-else>
                  {{formData.bankNo}}
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`支行名称${type === 0 || type === 1 ? '' : ':'}`" prop="bankName">
                <template v-if="type === 0 || type === 1">
                  <el-input class="w_300" v-model.trim="formData.bankName" show-word-limit maxlength="20"></el-input>
                </template>
                <template v-else>
                  {{formData.bankName}}
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <span style="color: red;">提示：为避免转账不成功，非深圳银行卡必须写上哪个省哪个市</span>
          </el-divider>
        </template>
      </CtjtCard>
    </el-form>
    <CtjtTable :tableData="tableData" v-if="formData.auditStatus !== null"></CtjtTable>
    <el-row class="mt-20" type="flex" justify="center">
      <el-button @click="goback()">取消</el-button>
      <template v-if="type === 0 || type === 1 && perm['btn_addsave']">
        <el-button type="primary" :loading="btnLoading" @click="submit">保存</el-button>
      </template>
      <template v-if="isFinance && type !== 1 && formData.auditStatus !== 4 && perm['btn_cwxgbc']">
        <el-button type="primary" :loading="btnLoading" @click="financeSubmit">财务保存</el-button>
      </template>
    </el-row>
    <PrintDetail :visible.sync="refundPrintShow" :data="printDetailData"></PrintDetail>
    <CtjtRejectDialog :dialogVisible.sync="rejectShow" :type="1" :id="$route.query.id"  @on-submit="rejectCallBack"></CtjtRejectDialog>
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
