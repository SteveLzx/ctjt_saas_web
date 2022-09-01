<template>
  <div class="page">
    <el-form ref="page_form" label-width="130px" class="page_form">
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="姓名：" class="ctjt_form_item_class">
            <span>{{ detailParams.userName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="证件号码：" class="ctjt_form_item_class">
            <span>{{ detailParams.idNo }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话：" class="ctjt_form_item_class">
            <span>{{ detailParams.mobile }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="待收金额：" class="ctjt_form_item_class">
            <span>{{ detailParams.balance }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="报名时间：" class="ctjt_form_item_class">
            <span>{{ detailParams.registerTime | dateFilter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班别：" class="ctjt_form_item_class">
            <span>{{ detailParams.classesName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="车型：" class="ctjt_form_item_class">
            <span>{{ detailParams.carModel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="原准驾车型：" class="ctjt_form_item_class">
            <span v-if="detailParams.learnType === '增驾'">{{
              detailParams.driveType | oriCarModelFilter
            }}</span>
            <span v-else></span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="科一合格日期：" class="ctjt_form_item_class">
            <span>{{ detailParams.examDate }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="门店：" class="ctjt_form_item_class">
            <span>{{ detailParams.storeName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学员状态：" class="ctjt_form_item_class">
            <span>{{ detailParams.studyStatus | studentStatusFilter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="教练：" class="ctjt_form_item_class">
            <span>{{ detailParams.coachName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="学车进度：" class="ctjt_form_item_class">
            <span>{{
              detailParams.learnDrivingSchedule | learnDrivingScheduleFilter
            }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="受理档案号："
            class="ctjt_form_item_class"
            v-if="isHuiZhouSchool()"
          >
            <span>{{ detailParams.acceptNumber }}</span>
          </el-form-item>
          <el-form-item label="受理号：" class="ctjt_form_item_class" v-else>
            <span>{{ detailParams.acceptNumber }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="营销渠道：" class="ctjt_form_item_class">
            <span>{{ detailParams.marketingChannel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录入人：" class="ctjt_form_item_class">
            <span>{{ detailParams.operationName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="是否欠费：" class="ctjt_form_item_class red">
            <span>{{ detailParams.balance | isArrearsFilter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学车类型：" class="ctjt_form_item_class">
            <span>{{ detailParams.learnType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学习证有效期：" class="ctjt_form_item_class">
            <span>{{ detailParams.examDate | regDateFilter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="延期日期：" class="ctjt_form_item_class">
            <span>{{ detailParams.expireDate }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item label="报名费金额：" class="ctjt_form_item_class">
            <span>{{ detailParams.salePrice }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="减免金额：" class="ctjt_form_item_class">
            <span>{{ detailParams.discountAmount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="已结转金额：" class="ctjt_form_item_class">
            <span>{{ detailParams.tradingAmount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单备注：" class="ctjt_form_item_class">
            <span>{{ detailParams.remark }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-radio-group v-model="componentName" size="medium">
      <el-radio-button label="CertificateRecord" v-if="perm['btn_bzjl']"
        >办证记录</el-radio-button
      >
      <el-radio-button label="ExamRecord" v-if="perm['btn_ksjl']"
        >考试记录</el-radio-button
      >
      <el-radio-button label="OrderRecord" v-if="perm['btn_ddjl']"
        >订单记录</el-radio-button
      >
      <el-radio-button label="FinanceRecord" v-if="perm['btn_cwjl']"
        >财务记录</el-radio-button
      >
      <el-radio-button label="ServicesRecord" v-if="perm['btn_cwgzjl']"
        >服务跟踪记录</el-radio-button
      >
      <el-radio-button label="LogRecord" v-if="perm['btn_log']"
        >修改日志</el-radio-button
      >
      <el-radio-button label="OrderLogRecord" v-if="perm['btn_order_log']"
        >订单修改记录</el-radio-button
      >
      <el-radio-button label="TurnHistoryRecord" v-if="perm['btn_zrhflsjl']"
        >转入恢复历史记录</el-radio-button
      >
    </el-radio-group>
    <!-- <keep-alive
      include="CertificateRecord,ExamRecord,OrderRecord,FinanceRecord,ServicesRecord,LogRecord,OrderLogRecord,TurnHistoryRecord"
    > -->
    <component :is="componentName"></component>
    <!-- </keep-alive> -->
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import dayjs from 'dayjs';
import { CtjtCard } from '@/components';
import {
  SUBJECT,
  STUDENT_STATUS,
  OLD_DRIVER_LICENSE,
  STUDY_STAGE,
} from '@/enums';
import { DateAdd } from '@/assets/js/common';
import Detail from './detail';
import CertificateRecord from './_components/certificate_record.vue';
import ExamRecord from './_components/exam_record.vue';
import OrderRecord from './_components/order_record.vue';
import FinanceRecord from './_components/finance_record.vue';
import ServicesRecord from './_components/services_record.vue';
import LogRecord from './_components/log_record.vue';
import OrderLogRecord from './_components/order_log_record.vue';
import TurnHistoryRecord from './_components/turn_history_record.vue';

@Component({
  components: {
    CtjtCard,
    CertificateRecord,
    ExamRecord,
    OrderRecord,
    FinanceRecord,
    ServicesRecord,
    LogRecord,
    OrderLogRecord,
    TurnHistoryRecord,
  },
  filters: {
    dateFilter(val: any) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
    },
    isArrearsFilter(val: number) {
      return val > 0 ? '是' : '否';
    },
    subjectsFilter(val: number) {
      const list = SUBJECT.filter((a) => a.id === val);
      return list[0] ? list[0].label : '';
    },
    studentStatusFilter(val: number) {
      if (!val) return '';
      const status = Number(val);
      const list = STUDENT_STATUS.filter((a) => a.id === status);
      return list[0] ? list[0].label : '';
    },
    oriCarModelFilter(val: number) {
      console.log(val);
      const list = OLD_DRIVER_LICENSE.filter((a) => a.id === Number(val));
      return list[0] ? list[0].label : '';
    },
    regDateFilter(val: any) {
      if (!val) return '';
      const d1 = new Date(val);
      const newDate = DateAdd('y', 3, d1);
      const reDate = newDate ? dayjs(newDate).format('YYYY-MM-DD') : '';
      return reDate;
    },
    learnDrivingScheduleFilter(val: number) {
      if (val === undefined || val === null) return '';
      const list = STUDY_STAGE.filter((item) => item.id === val);
      return list[0] ? list[0].label : '';
    },
  },
})
export default class StatisticsStudentIntegrationFileDetail extends Detail {}
</script>
<style lang="scss" scoped>
.page_form {
  border: 1px solid #ebeef5;
  padding: 20px 24px;
  margin: 0px 0px 35px 0px;
}
.ctjt_form_item_class {
  font-size: 16px;
  font-weight: 500;
}
::v-deep .red .el-form-item__label,
::v-deep .red .el-form-item__content {
  color: red !important;
}
</style>
