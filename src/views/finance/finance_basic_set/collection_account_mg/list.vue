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
        label-width="120px"
        class="add_form"
      >
        <el-form-item
          label="存款账号"
          prop="cardNo"
          class="ctjt_form_item_class"
        >
          <el-input
            v-model.trim="formData.cardNo"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="银行" prop="name" class="ctjt_form_item_class">
          <el-input
            v-model.trim="formData.name"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="持有人" prop="holder" class="ctjt_form_item_class">
          <el-input
            v-model.trim="formData.holder"
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
export default class FinanceCollectionAccountMg extends Index {}
</script>
<style lang="scss" scoped>
.add_form .ctjt_form_item_class {
  width: 420px;
}
</style>
