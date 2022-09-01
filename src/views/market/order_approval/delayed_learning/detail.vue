<template>
  <div class="page">
    <el-form
      :model="formData"
      :rules="formDataRules"
      ref="formDataRef"
      label-position="right"
      label-width="135px"
    >
      <el-row v-if="isDetail || isEdit" style="padding: 20px 24px">
        <el-col :span="6">
          <el-form-item label="审核状态：">{{
            auditStatus | auditStatusFilter
          }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请单号：">{{ applyNo }}</el-form-item>
        </el-col>
        <el-col :span="12" style="display: flex; justify-content: end">
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
              >撤回</el-button
            >
            <el-button
              v-if="perm['btn_reject']"
              type="danger"
              @click="btnSubmit(2)"
              >驳回</el-button
            >
            <el-button
              v-if="perm['btn_pass']"
              type="success"
              @click="btnSubmit(1)"
              >通过</el-button
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
        </el-col>
      </el-row>
      <CtjtCard :prop-data="{ title: '学员信息' }">
        <template #content>
          <el-row>
            <el-col :span="6">
              <el-form-item label="证件号码：" prop="idNo">
                <el-input
                  v-if="isDetail"
                  class="w_260"
                  type="text"
                  v-model="formData.idNo"
                  disabled
                ></el-input>
                <CtjtSelect
                  v-else
                  class="w_260"
                  :value="formData.idNo"
                  :list="idNoOption.options"
                  :callback="formDataSelectCallback"
                  :placeholder="'请输入证件号/姓名搜索学员'"
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
              <el-form-item label="姓名：" prop="userName">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.userName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="受理号：">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.acceptNumber"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="班别：" prop="classesName">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.classesName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="联系电话：" prop="mobile">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.mobile"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车型：" prop="carModel">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.carModel"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学车进度：" prop="learnDrivingSchedule">
                <el-select
                  class="c_select w_260 hide_sel"
                  v-model="formData.learnDrivingSchedule"
                  disabled
                  placeholder=""
                >
                  <el-option
                    v-for="item in learnDrivingScheduleList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="科目一合格日期：">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.examDate"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="报名日期：" prop="createdTime">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.createdTime"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单金额：" prop="salePrice">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.salePrice"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实收金额：" prop="amount">
                <el-input
                  class="w_260"
                  type="text"
                  v-model="formData.amount"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '延期信息' }">
        <template #content>
          <div>
            <el-row>
              <el-col :span="6">
                <el-form-item label="延期类型：" prop="postponeType">
                  <el-select
                    class="c_select"
                    v-model="formData.postponeType"
                    @change="postponeTypeChange"
                    :disabled="isDetail && !isEdit"
                  >
                    <el-option
                      v-for="item in postponeTypeList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="收据编号："
                  prop="receiptNumber"
                  v-if="formData.postponeType === postponeTypeList[0].id"
                >
                  <el-select
                    class="c_select ss"
                    :popper-append-to-body="false"
                    v-model="formData.receiptNumber"
                    @change="handleReceiptChange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, i) in receiptList"
                      :key="`${item.receiptNumber}${i}`"
                      :label="item.receiptNumber"
                      :value="item.receiptNumber"
                    >
                      <div class="c_div">
                        <div class="c_label">{{ item.receiptNumber }}</div>
                        <div class="c_value">{{ item.postponeFee }}</div>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="收据编号：" v-else>
                  <el-select
                    class="c_select"
                    v-model="formData.receiptNumber"
                    disabled
                    @change="handleReceiptChange"
                  >
                    <el-option
                      v-for="item in receiptList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="延期费用：" prop="postponeFee">
                  <el-input
                    class="w_260"
                    type="text"
                    v-model="formData.postponeFee"
                    :disabled="
                      (formData.postponeType === postponeTypeList[0].id &&
                        formData.receiptNumber !== null) ||
                      (isDetail && !isEdit)
                    "
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="延期日期：" prop="postponeDate">
                  <el-date-picker
                    v-model="formData.postponeDate"
                    type="date"
                    placeholder="选择日期"
                    :disabled="isDetail && !isEdit"
                  >
                  </el-date-picker>
                  <div style="color: red">
                    请根据学员延期学车后的具体有效期进行填写
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="延期原因：" prop="postponeReason">
                <el-input
                  class="w_400"
                  type="textarea"
                  v-model="formData.postponeReason"
                  placeholder="请输入延期原因"
                  rows="4"
                  maxlength="300"
                  show-word-limit
                  :disabled="isDetail && !isEdit"
                ></el-input>
              </el-form-item>
            </el-row>
          </div>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '审核信息' }" v-if="isDetail">
        <template #content>
          <CtjtTable :tableData="approvalTableData"></CtjtTable>
        </template>
      </CtjtCard>
      <el-row
        type="flex"
        justify="center"
        class="mb-20"
        style="margin: 40px 0"
        v-if="!isDetail || isEdit"
      >
        <el-button @click="goback()">取消</el-button>
        <el-button type="primary" @click="submit()" :loading="submitLoading"
          >保存</el-button
        >
      </el-row>
    </el-form>
    <CtjtRejectDialog
      :dialogVisible.sync="rejectShow"
      :type="5"
      :id="$route.query.id"
      @on-submit="rejectCallBack"
    ></CtjtRejectDialog>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class DelayedLearningApprovalDetail extends Index {}
</script>
<style scoped>
::v-deep .c_select .el-select-dropdown__item {
  height: auto !important;
}

::v-deep .hide_sel .el-input .el-input__suffix {
  display: none;
}
</style>
