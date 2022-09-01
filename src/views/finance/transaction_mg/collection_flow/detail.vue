<template>
  <div class="page">
    <CtjtCard :prop-data="{ title: '订单记录' }">
      <template #content>
        <div class="ctjt_table_container">
          <el-row style="display: flex">
            <el-col class="table_border" :span="1">
              <div class="table_tr">序号</div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_tr">姓名</div>
            </el-col>
            <el-col class="table_border" :span="4">
              <div class="table_tr">证件号码</div>
            </el-col>
            <el-col class="table_border" :span="4">
              <div class="table_tr">订单号</div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_tr">订单金额</div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_tr">应收金额</div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_tr">实收金额</div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_tr">待收金额</div>
            </el-col>
          </el-row>
          <el-row style="display: flex">
            <el-col class="table_border" :span="1">
              <div class="table_td">1</div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_td">
                {{ formData.orderRecordList.userName }}
              </div>
            </el-col>
            <el-col class="table_border" :span="4">
              <div class="table_td">
                {{ formData.orderRecordList.idNo }}
              </div>
            </el-col>
            <el-col class="table_border" :span="4">
              <div class="table_td">
                {{ formData.orderRecordList.seq }}
              </div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_td">
                {{ formData.orderRecordList.salePrice }}
              </div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_td">
                {{ formData.orderRecordList.amount }}
              </div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_td">
                {{ formData.orderRecordList.realityAmount }}
              </div>
            </el-col>
            <el-col class="table_border" :span="3">
              <div class="table_td">
                {{ formData.orderRecordList.balance }}
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
    </CtjtCard>
    <CtjtCard
      :prop-data="{
        title: '支付信息',
        tips: `【实收：￥${formData.orderAmount}】【待收：￥${
          formData.orderRecordList.balance || 0
        }】`,
      }"
    >
      <template #content>
        <!-- 默认展示列表 -->
        <template>
          <CtjtTable :tableData="orderPaytableData"></CtjtTable>
        </template>
      </template>
    </CtjtCard>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { CtjtCard, CtjtTable } from '@/components';
import Detail from './detail';

@Component({
  components: {
    CtjtCard,
    CtjtTable,
  },
})
export default class FinanceCollectionFlowDetail extends Detail {}
</script>
