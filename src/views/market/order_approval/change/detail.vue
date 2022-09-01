<template>
  <div class="page">
    <el-row type="flex" justify="space-between" align="center" class="mb-20">
      <div style="display: flex; align-items: center;">当前审批状态：<el-link :underline="false" type="primary">{{auditStatus | auditStatusFilter}}</el-link></div>
      <div>
        <template v-if="auditStatus === 0">
          <el-button v-if="perm['btn_revoke']" type="warning" @click="btnSubmit(3)">撤销</el-button>
          <el-button v-if="perm['btn_shbtg']" type="danger" @click="btnSubmit(2)">驳回</el-button>
          <el-button v-if="perm['btn_shtg']" type="success" @click="btnSubmit(1)">审核通过</el-button>
        </template>
        <el-button @click="goback()">返回</el-button>
      </div>
    </el-row>
    <el-form>
      <el-form-item label="订单号：">{{formData.seq}}</el-form-item>
      <el-form-item label="变更原因：" v-if="changeTableData.list && changeTableData.list.length > 0">{{changeTableData.list[0].reason}}</el-form-item>
      <CtjtCard :prop-data="{ title: '学员信息'}">
        <template #content>
          <el-row>
            <el-col :span="6">
              <el-form-item label="学员姓名：">{{formData.userName}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="户籍：">{{studentVo.domicile}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号：">{{formData.mobile}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件类型：">{{studentVo.certificateType | certificateTypeFilter}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="证件号码：">{{studentVo.idNo}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别：">{{studentVo.sex | sexFilter}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期：">{{studentVo.birthdate}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件地址：">{{studentVo.certificateAddress}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="现居地址：">{{studentVoAddressFilter(studentVo)}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="紧急联系人：">{{studentVo.emergencyContact}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="紧急联系电话：">{{studentVo.emergencyContactPhone}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="报名日期：">{{formData.createdTime}}</el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '报考信息'}">
        <template #content>
          <el-row>
            <el-col :span="6">
              <el-form-item label="培训车型：">{{formData.carModel}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="班别：">{{formData.classesName}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学车类型：">{{formData.learnType | learnTypeFilter}}</el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '发票信息'}">
        <template #content>
          <el-row>
            <el-col :span="6">
              <el-form-item label="发票种类：">{{invoiceVo.type | invoiceVoTypeFilter}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开票方式：">{{invoiceVo.mode | invoiceVoModeFilter}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发票名称：">{{invoiceVo.name}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="纳税人识别号：">{{invoiceVo.identifyNumber}}</el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '订单信息'}">
        <template #content>
          <el-row>
            <el-col :span="6">
              <el-form-item label="获知途径：">{{formData.sourceChannel}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="营销渠道：">{{formData.marketingChannel}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="渠道优惠：">{{formData.channelAmount}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="营销活动：">{{formData.activityName}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="活动优惠：">{{formData.activityAmount}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="其他优惠：">{{formData.otherDiscounts}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="协议书编号："></el-form-item>
            </el-col>
            <el-col :span="6" v-if="formData.orderPayVos">
              <el-form-item label="支付方式：">{{formData.orderPayVos[0].payType | payTypeFilter}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">{{formData.remark}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="班别原价：">{{formData.originalPrice}}元</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优惠总金额：">{{formData.discountAmount}}元</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单金额：">{{formData.salePrice}}元</el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '变更内容'}">
        <template #content>
          <CtjtTable :tableData="changeTableData"></CtjtTable>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '流程审核记录'}">
        <template #content>
          <CtjtTable :tableData="examineTableData"></CtjtTable>
        </template>
      </CtjtCard>
    </el-form>
    <CtjtRejectDialog :dialogVisible.sync="rejectShow" :type="2" :id="$route.query.id" @on-submit="rejectCallBack"></CtjtRejectDialog>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class MarketOrderApprovalChangeDetail extends Index {}
</script>
