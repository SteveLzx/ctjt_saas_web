<template>
  <div class="page">
    <section>
      <el-row style="display: inline-block">
        <el-col class="w_300 mb-20">审核状态：{{changeDetailData.isVerify | isVerifyFilter}}</el-col>
        <el-col class="w_300 mb-20">办证科目：{{changeDetailData.subjects}}</el-col>
        <el-col class="w_300 mb-20">变更数量：{{changeDetailData.changeNum}}</el-col>
        <el-col class="w_300 mb-20">变更单编号：{{changeDetailData.changeNo}}</el-col>
        <el-col class="w_300 mb-20">考核类型：{{changeDetailData.assessType | assessTypeFilter}}</el-col>
        <el-col class="w_600 mb-20">变更原因：{{changeDetailData.changeCause}}</el-col>
      </el-row>
      <CtjtTabBar :tabs="tabList" :value.sync="tabIndex"></CtjtTabBar>
    </section>
    <section v-if="tabIndex !== 3">
      <CtjtTable :tableData="tableData"></CtjtTable>
    </section>
    <section v-if="tabIndex === 3">
      <!-- <el-form label-position="left" label-width="100px" :model="formData" :rules="formRules">
        <el-form-item label="审 核">
          <el-radio-group>
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">驳回</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因">
          <el-input
            class="w_600"
            type="textarea"
            :rows="2"
            maxlength="100"
            show-word-limit
            placeholder="请输入内容">
          </el-input>
          <span class="ml-20">
            <el-button type="primary">确定</el-button>
            <el-button>取消</el-button>
          </span>
        </el-form-item>
      </el-form> -->
      <CtjtTable :tableData="examineTable"></CtjtTable>
    </section>
  </div>
</template>
<script lang="ts">
import Detail from './detail';

export default class AccreditationChangeInfoDetail extends Detail {}
</script>
<style lang="scss" scoped>
</style>
