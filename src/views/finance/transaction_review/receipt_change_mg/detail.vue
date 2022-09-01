<template>
  <div class="page">
    <el-form
      ref="formData"
      :model="formData"
      :rules="formRules"
      label-width="125px"
      class="bgc_fff"
    >
      <el-row>
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
                    {{ formData.orderRecord.userName }}
                  </div>
                </el-col>
                <el-col class="table_border" :span="4">
                  <div class="table_td">
                    {{ formData.orderRecord.idNo }}
                  </div>
                </el-col>
                <el-col class="table_border" :span="4">
                  <div class="table_td">
                    {{ formData.orderRecord.seq }}
                  </div>
                </el-col>
                <el-col class="table_border" :span="3">
                  <div class="table_td">
                    {{ formData.orderRecord.salePrice }}
                  </div>
                </el-col>
                <el-col class="table_border" :span="3">
                  <div class="table_td">
                    {{ formData.orderRecord.amount }}
                  </div>
                </el-col>
                <el-col class="table_border" :span="3">
                  <div class="table_td">
                    {{ formData.orderRecord.realityAmount }}
                  </div>
                </el-col>
                <el-col class="table_border" :span="3">
                  <div class="table_td">
                    {{ formData.orderRecord.balance }}
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </CtjtCard>
      </el-row>
      <el-row>
        <CtjtCard :prop-data="{ title: '支付信息' }">
          <template #content>
            <!-- 默认展示列表 -->
            <template>
              <CtjtTable :tableData="orderPaytableData"></CtjtTable>
            </template>
          </template>
        </CtjtCard>
      </el-row>
      <el-row>
        <CtjtCard :prop-data="{ title: '变更内容' }">
          <template #content>
            <CtjtTable :tableData="changeTableData"></CtjtTable>
          </template>
        </CtjtCard>
      </el-row>
      <el-row>
        <CtjtCard :prop-data="{ title: '审核记录' }">
          <template #content>
            <el-row :gutter="8" v-if="formData.isApprove">
              <el-col :span="24">
                <el-form-item
                  label="审核"
                  class="ctjt_form_item_class"
                  prop="approveResult"
                >
                  <el-radio-group v-model="formData.approveResult">
                    <el-radio :label="1">通过</el-radio>
                    <el-radio :label="2">驳回</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8" v-if="formData.isApprove">
              <el-col :span="24">
                <el-form-item label="驳回原因" prop="opinion">
                  <el-input
                    v-model.trim="formData.opinion"
                    type="textarea"
                    maxlength="300"
                    show-word-limit
                    :rows="4"
                    :disabled="opinionDisabled"
                    style="width: 50%"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <CtjtTable :tableData="approveTableData"></CtjtTable>
            </el-row>
          </template>
        </CtjtCard>
      </el-row>

      <el-row type="flex" justify="center" style="padding: 50px 0px">
        <el-button
          style="
            color: #909399;
            background-color: transparent;
            border: 1px solid #dcdfe6;
          "
          @click="cancelFun"
          >返回</el-button
        >
        <el-button
          v-if="formData.isApprove && perm['btn_audit']"
          type="primary"
          style="margin-right: 10px"
          @click="submitFun"
          :loading="submitLoading"
          >确定</el-button
        >
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { CtjtCard, CtjtTable, CtjtPagination } from '@/components';
import CtjtTableColumn from '@/components/Table/Column';
import Detail from './detail';

@Component({
  components: {
    CtjtCard,
    CtjtTable,
    CtjtPagination,
    CtjtTableColumn,
  },
})
export default class FinanceReceiptChangeMgDetail extends Detail {}
</script>
