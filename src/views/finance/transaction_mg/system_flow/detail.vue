<template>
  <div class="page">
    <el-form
      ref="orderForm"
      :model="formData"
      :rules="formRules"
      label-width="125px"
      class="bgc_fff"
    >
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
      <CtjtCard
        :prop-data="{
          title: '支付信息',
          tips: `【实收：￥${formData.orderAmount}】【待收：￥${
            formData.orderRecord.balance || 0
          }】`,
        }"
      >
        <template #content>
          <!-- 默认展示列表 -->
          <CtjtTable :tableData="orderPaytableData"></CtjtTable>
          <!-- 编辑时展示 -->
          <template v-if="!isDetail">
            <el-card
              class="mt-20"
              shadow="never"
              v-for="(item, index) in formData.orderPayDetailDtoList"
              :key="index"
            >
              <div slot="header">支付信息</div>
              <el-form-item
                label="支付方式"
                :prop="`orderPayDetailDtoList.${index}.payType`"
                :rules="formRules.orderPayVosPayType"
              >
                <el-radio-group
                  v-model="item.payType"
                  @change="payTypeChange(index)"
                >
                  <el-radio
                    v-for="(item, index) in payTypeList"
                    :key="index"
                    :label="item.id"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="收款金额"
                :prop="`orderPayDetailDtoList.${index}.amount`"
                :rules="formRules.orderPayVosAmount"
              >
                <el-input class="w_300" v-model="item.amount" :disabled="item.orderType === 2" placeholder="请输入" />
              </el-form-item>
              <el-form-item
                label="收款时间"
                :prop="`orderPayDetailDtoList.${index}.payTime`"
                :rules="formRules.orderPayVosPayTime"
              >
                <el-date-picker
                  class="w_300"
                  :picker-options="pickerOptions"
                  v-model="item.payTime"
                  type="datetime"
                  :clearable="false"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-form-item>
              <!-- 不同支付方式，对应不同表单 -->
              <template v-if="item.payType === 2">
                <el-form-item
                  label="pos终端号"
                  :prop="`orderPayDetailDtoList.${index}.payContent`"
                  :rules="formRules.orderPayVosPayContent"
                >
                  <el-select
                    class="w_400"
                    v-model="item.payContent"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in allPosTerminalNoOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="交易参考号"
                  :prop="`orderPayDetailDtoList.${index}.outTradeNo`"
                  :rules="formRules.orderPayVosOutTradeNo"
                >
                  <el-input
                    class="w_400"
                    v-model.trim="item.outTradeNo"
                    placeholder="请输入"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </template>
              <template v-if="item.payType === 4">
                <el-form-item
                  label="收款二维码编号"
                  :prop="`orderPayDetailDtoList.${index}.payContent`"
                  :rules="formRules.orderPayVosPayContent"
                >
                  <el-select
                    class="w_400"
                    v-model="item.payContent"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in allPosTerminalNoOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="交易参考号"
                  :prop="`orderPayDetailDtoList.${index}.outTradeNo`"
                  :rules="formRules.orderPayVosOutTradeNo"
                >
                  <el-input
                    class="w_400"
                    v-model.trim="item.outTradeNo"
                    placeholder="请输入"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </template>
              <template v-if="item.payType === 3">
                <el-form-item
                  label="付款账号"
                  :prop="`orderPayDetailDtoList.${index}.transactionId`"
                  :rules="formRules.orderPayVosTransactionId"
                >
                  <el-input
                    class="w_400"
                    v-model.trim="item.transactionId"
                    placeholder="请输入"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item
                  label="收款账号"
                  :prop="`orderPayDetailDtoList.${index}.payContent`"
                  :rules="formRules.orderPayVosPayContent"
                >
                  <el-select
                    class="w_400"
                    v-model="item.payContent"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in allBankAccountOpts"
                      :key="item.label"
                      :label="item.label"
                      :value="item.label"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
              <template v-if="item.payType === 1">
                <el-form-item
                  label="第三方渠道名称"
                  :prop="`orderPayDetailDtoList.${index}.payContent`"
                  :rules="formRules.orderPayVosPayContent"
                >
                  <el-select
                    class="w_400"
                    v-model="item.payContent"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in thirdChannelsOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="第三方订单号"
                  :prop="`orderPayDetailDtoList.${index}.transactionId`"
                  :rules="formRules.orderPayVosTransactionId"
                >
                  <el-input
                    class="w_400"
                    v-model.trim="item.transactionId"
                    placeholder="请输入"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item
                  label="核销码"
                  :prop="`orderPayDetailDtoList.${index}.outTradeNo`"
                  :rules="formRules.orderPayVosOutTradeNo"
                >
                  <el-input
                    class="w_400"
                    v-model.trim="item.outTradeNo"
                    placeholder="请输入"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </template>
              <template>
                <el-form-item label="备注">
                  <el-input class="w_400" type="textarea" v-model.trim="item.remark" placeholder="请输入" maxlength="200" show-word-limit/>
                  </el-form-item>
              </template>
            </el-card>
          </template>
        </template>
      </CtjtCard>
      <el-row type="flex" justify="center" style="padding: 50px 0px">
        <el-button @click="cancelFun">返回</el-button>
        <el-button
          :disabled="isDetail"
          type="primary"
          style="margin-right: 10px"
          @click="editOrderPayFun"
          :loading="submitLoading"
          v-if="perm['btn_modify']"
          >确定</el-button
        >
      </el-row>
    </el-form>
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
export default class FinanceSystemFlowDetail extends Detail {}
</script>
