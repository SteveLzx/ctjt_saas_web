<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <el-drawer
      title="编辑"
      :visible.sync="drawer"
      :direction="'rtl'"
      :before-close="cancel">
      <el-form class="page" ref="formRef" :model="formData" :rules="formRules" :label-width="'100px'">
        <el-row>
          <el-form-item label="服务站编号" prop="code">
            <el-input placeholder="请输入" v-model.trim="formData.code" maxlength="50" show-word-limit clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地址" prop="address">
            <el-input placeholder="请输入" v-model.trim="formData.address" maxlength="100" show-word-limit clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="联系人" prop="contactName">
            <el-input placeholder="请输入" v-model.trim="formData.contactName" maxlength="10" show-word-limit clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="联系方式" prop="mobile">
            <el-input placeholder="请输入" v-model.trim="formData.mobile" maxlength="20" show-word-limit clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input placeholder="请输入" v-model.trim="formData.remark" maxlength="200" show-word-limit clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="mt-20" type="flex" justify="center">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit" :loading="submitLoading">保存</el-button>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class MarketServiceStationMg extends Index {}
</script>
