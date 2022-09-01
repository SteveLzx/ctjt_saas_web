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
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--新增账户弹出框-->
    <el-dialog
      title="新增账户"
      width="500px"
      :visible.sync="dialogShow"
      :before-close="dialogClose"
    >
      <el-form
        :model="formData"
        :rules="formDataRules"
        ref="add_form"
        label-width="100px"
        class="add_form"
      >
        <el-form-item
          label="pos账号"
          prop="account"
          class="ctjt_form_item_class"
        >
          <el-input
            v-model.trim="formData.account"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="银行" prop="bank" class="ctjt_form_item_class">
          <el-input
            v-model.trim="formData.bank"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="pos公司"
          prop="company"
          class="ctjt_form_item_class"
        >
          <el-input
            v-model.trim="formData.company"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="ctjt_form_item_class">
          <el-input
            type="textarea"
            v-model.trim="formData.remark"
            maxlength="200"
            show-word-limit
            :rows="4"
          ></el-input>
        </el-form-item>

        <el-row type="flex" justify="center" style="padding: 50px 0px">
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="dialogClose"
            >取消</el-button
          >
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="submitForm"
            :loading="submitLoading"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import Index from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
  },
})
export default class FinancePosAccountMg extends Index {}
</script>
<style lang="scss" scoped>
.add_form .ctjt_form_item_class {
  width: 420px;
}
</style>
