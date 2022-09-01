<template>
  <div class="page">
    <el-row
      type="flex"
      justify="space-around"
      align="center"
      v-if="formData.id > 0"
    >
      <div style="display: flex; align-items: center">
        当前审批状态：<el-link :underline="false" type="primary">{{
          auditStatus | auditStatusFilter
        }}</el-link>
      </div>
      <div>
        <template v-if="auditStatus !== 1">
          <el-button
            v-if="perm['btn_cxbj']"
            type="primary"
            @click="btnSubmit(4)"
            >重新编辑</el-button
          >
        </template>
        <template v-if="auditStatus === 0">
          <el-button
            v-if="perm['btn_revoke']"
            type="warning"
            @click="btnSubmit(3)"
            >撤销</el-button
          >
          <el-button
            v-if="perm['btn_shbtg']"
            type="danger"
            @click="btnSubmit(2)"
            >驳回</el-button
          >
          <el-button
            v-if="perm['btn_shtg']"
            type="success"
            @click="btnSubmit(1)"
            >审核通过</el-button
          >
        </template>
        <template v-if="auditStatus === 3">
          <el-button
            v-if="perm['btn_detail_delete']"
            type="danger"
            @click="btnSubmit(5)"
            >删除</el-button
          >
        </template>
        <el-button @click="goback()">返回</el-button>
      </div>
    </el-row>
    <el-form
      class="page"
      :model="formData"
      :rules="formRules"
      ref="formDataRef"
      label-width="125px"
    >
      <CtjtCard :prop-data="{ title: '学员信息' }">
        <template #content>
          <el-row>
            <el-col :span="8">
              <el-form-item label="证件号码" prop="idNo">
                <el-autocomplete
                  popper-class="seach_table_autocomplete"
                  v-model="formData.idNo"
                  value-key="idNo"
                  :maxlength="20"
                  :clearable="true"
                  :disabled="type === 1 || type === 2"
                  :fetch-suggestions="queryIdNoSearch"
                  @select="hanldIdNoSelect"
                  placeholder="请输入姓名/证件号码"
                  style="width: 240px"
                >
                  <template slot-scope="{ item }">
                    <div class="idNo">{{ item.idNo }}</div>
                    <span class="userName">{{ item.userName }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名：">{{
                formData.userName
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码：">{{
                formData.mobile
              }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="报名日期：">{{
                formData.createdTime
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车型：">{{
                formData.carModel
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班别：">{{
                formData.classesName
              }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="当前学车进度：">{{
                formData.learnDrivingSchedule | learnDrivingScheduleFilter
              }}</el-form-item>
            </el-col>
            <el-col :span="8" v-if="userInfo.drivingSchoolId !== '3374'">
              <el-form-item label="是否第三方监管：">{{
                formData.superviseType === 1 ? '是' : '否'
              }}</el-form-item>
            </el-col>
            <el-col :span="8" class="td_text_red">
              <el-form-item label="是否欠费：">{{
                formData.balance > 0 ? '是' : '否'
              }}</el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '变更信息' }">
        <template #content>
          <el-row>
            <el-col :span="6">
              <el-form-item label="变更类型" prop="type">
                <el-select
                  class="w_200"
                  v-model="formData.type"
                  @change="handleTypeChange"
                  :disabled="type === 1"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in [
                      { label: '正常转班别', id: 1 },
                      { label: '非正常转班别', id: 2 },
                    ]"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <p class="td_text_red">无需收费的，请选择【非正常转班别】</p>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收款单据号" prop="receipt">
                <el-select
                  class="c_select"
                  :popper-append-to-body="false"
                  v-model="formData.receipt"
                  @change="handleReceiptChange"
                  :disabled="formData.type === 2 || type === 1"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in receiptOptes"
                    :key="item.receipt"
                    :label="item.receipt"
                    :value="item.receipt"
                  >
                    <div class="c_div">
                      <div class="c_label">{{ item.receipt }}</div>
                      <div class="c_value">{{ item.amount }}</div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="新班别" prop="newModel">
                <el-select
                  class="w_200"
                  v-model="formData.newModel"
                  :disabled="formData.type === 1 || type === 1"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in classessOpt"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应收金额" prop="amount">
                <el-input
                  class="w_200"
                  v-model="formData.amount"
                  :disabled="formData.type === 1 || type === 1"
                  placeholder="请输入应收金额"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="备注" prop="remark">
                <el-input
                  class="w_400"
                  type="textarea"
                  v-model="formData.remark"
                  :disabled="type === 1"
                  placeholder="请输入备注"
                  maxlength="200"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
    </el-form>
    <div class="page" style="padding-top: 0" v-if="formData.id > 0">
      <CtjtTable :tableData="examineTableData"></CtjtTable>
    </div>
    <el-row
      type="flex"
      justify="center"
      class="mb-20"
      v-if="type === 0 || type === 2"
    >
      <el-button @click="goback()">取消</el-button>
      <el-button type="primary" @click="submit()">保存</el-button>
    </el-row>
    <CtjtRejectDialog
      :dialogVisible.sync="rejectShow"
      :type="2"
      :id="formData.id"
      @on-submit="rejectCallBack"
    ></CtjtRejectDialog>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class MarketOrderApprovalTurnSchoolDetail extends Index {}
</script>
<style lang="scss" scoped>
.c_select {
  ::v-deep .el-select-dropdown__item {
    height: auto !important;
  }
}
.c_div {
  padding: 4px 0;
}
.c_label {
  font-size: 14px;
  line-height: 24px;
}
.c_value {
  font-size: 12px;
  color: #999;
  line-height: 16px;
}
</style>
