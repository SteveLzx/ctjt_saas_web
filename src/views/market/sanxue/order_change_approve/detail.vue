<template>
<div class="page">
  <el-row :gutter="10">
    <el-col :span="12">
      <el-row><b class="td_text_red">审批状态：{{auditStatus | auditStatusFilter}}</b></el-row>
      <el-row><b>订单编号：{{formData.seq}}</b></el-row>
      <el-row><b>变更原因：{{formData.reason}}</b></el-row>
    </el-col>
    <el-col :span="12">
      <el-row type="flex" justify="center">
        <template v-if="auditStatus === 0">
          <el-button v-if="perm['btn_revoke']" type="warning" @click="submit(1)">撤销</el-button>
          <el-button v-if="perm['btn_shbtg']" type="danger" @click="submit(2)">审核不通过</el-button>
          <el-button v-if="perm['btn_shtg']" type="success" @click="submit(3)">审核通过</el-button>
        </template>
        <el-button @click="cancel()">返回</el-button>
      </el-row>
    </el-col>
  </el-row>
  <el-form class="mt-20" :model="formData" label-width="100px">
    <CtjtCard :prop-data="{ title: '学员信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="姓名：">{{formData.name}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码：">{{formData.mobile}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型：">{{formData.papersType | certificateTypeFilter}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="证件号码：">{{formData.idNo}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别：">{{formData.sex | sexFilter}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="16">
            <el-form-item label="接送地址：">{{formData.pickUpProvince}}{{formData.pickUpCity}}{{formData.pickUpArea}}{{formData.pickUpDetail}}</el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '发票信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="发票类型：">{{formData.invoiceType | invoiceVoTypeFilter}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="开票方式：">{{formData.invoiceMode | invoiceVoModeFilter}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="发票名称：">{{formData.invoiceName}}</el-form-item></el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="纳税人识别号：">{{formData.identifyNumber}}</el-form-item></el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '订单信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="业务来源/跟踪人：">
            {{formData.channel}}/
            <template v-if="formData.channel === '深港转入'">
              {{formData.thirdRegionName}}/{{formData.thirdStoreName}}
            </template>
            <template>{{formData.channel2}}</template>
          </el-form-item></el-col>
          <el-col :span="8"><el-form-item label="片区/门店：">
          {{formData.regionName}}/{{formData.storeName}}
          </el-form-item></el-col>
          <el-col :span="8"><el-form-item label="散学班别：">{{formData.examClasses}}</el-form-item></el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="散学车型：">{{formData.carModel}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="车辆品牌：">{{formData.carBrand}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="报名日期：">{{formData.examDateTime}}</el-form-item></el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="散学学时：">{{formData.period}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="优惠方式：">{{formData.discountType | discountTypeFilter}}</el-form-item></el-col>
          <el-col :span="8">
            <el-row :gutter="8">
              <el-col :span="8" v-if="formData.discountType === 3">
                <el-form-item label="优惠券号码：">{{formData.couponNumber}}</el-form-item>
              </el-col>
              <el-col :span="8" v-if="formData.discountType === 1 || formData.discountType === 3">
                <el-form-item label="优惠金额：">{{formData.discountAmount}}</el-form-item>
              </el-col>
              <el-col :span="8" v-if="formData.discountType === 2">
                <el-form-item label="赠送学时：">{{formData.presentPeriod}}</el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="总学时：">{{formData.sumPeriod}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="剩余学时：">{{formData.sumPeriod - formData.usedPeriod}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="学车教练：">{{formData.coachName}}</el-form-item></el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="业务途径：">{{formData.learnChannel}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="录单人：">{{formData.createdName}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="备注：">{{formData.remarks}}</el-form-item></el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '支付信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="原价：">{{formData.originalPrice}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="优惠金额：">{{formData.discountAmount}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="订单金额：">{{formData.amount}}</el-form-item></el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8"><el-form-item label="支付方式：">{{formData.payType | payTypeFilter}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="收款金额：">{{formData.practicalAmount}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="收款时间：">{{formData.payTime}}</el-form-item></el-col>
        </el-row>
        <el-row :gutter="8">
          <template v-if="formData.payType === 2">
            <el-col :span="8"><el-form-item label="pos终端号：">{{formData.payContent}}</el-form-item></el-col>
          </template>
          <template v-if="formData.payType === 4">
            <el-col :span="8"><el-form-item label="收款二维码编号：">{{formData.payContent}}</el-form-item></el-col>
          </template>
          <template v-if="formData.payType === 3">
            <el-col :span="8"><el-form-item label="收款账号：">{{formData.payContent}}</el-form-item></el-col>
          </template>
          <template v-if="formData.payType === 1">
            <el-col :span="8"><el-form-item label="第三方渠道名称：">{{formData.payContent}}</el-form-item></el-col>
          </template>
          <template v-if="formData.payType === 4">
            <el-col :span="8"><el-form-item label="交易参考号：">{{formData.outTradeNo}}</el-form-item></el-col>
          </template>
          <template v-if="formData.payType === 1">
            <el-col :span="8"><el-form-item label="核销码：">{{formData.outTradeNo}}</el-form-item></el-col>
          </template>
          <template v-if="formData.payType === 3">
            <el-col :span="8"><el-form-item label="付款账号：">{{formData.transactionId}}</el-form-item></el-col>
          </template>
          <template v-if="formData.payType === 1">
            <el-col :span="8"><el-form-item label="第三方订单号：">{{formData.transactionId}}</el-form-item></el-col>
          </template>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '变更内容' }">
      <template #content>
        <CtjtTable :tableData="tableData1"></CtjtTable>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '流程审核记录' }">
      <template #content>
        <CtjtTable :tableData="tableData2"></CtjtTable>
      </template>
    </CtjtCard>
  </el-form>
  <CtjtRejectDialog :dialogVisible.sync="rejectShow" :type="2" :id="$route.query.id" @on-submit="rejectCallBack"></CtjtRejectDialog>
</div>
</template>
<script lang='ts'>
import Index from './detail';

export default class MarketSanXueOrderChangeApproveDetail extends Index {}
</script>
