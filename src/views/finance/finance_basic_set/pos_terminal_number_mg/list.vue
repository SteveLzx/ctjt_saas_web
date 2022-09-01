<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <el-button
          @click="dialogName = 'field'"
          style="float: right"
          v-if="perm['btn_field']"
          >字段设置</el-button
        >
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'finance'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--新增/编辑pos机终端-->
    <el-drawer
      :title="`${drawerTitle}pos机终端`"
      size="1200px"
      :wrapperClosable="false"
      :visible.sync="drawerShow"
      :before-close="drawerClose"
    >
      <el-form
        :model="formData"
        :rules="formDataRules"
        ref="formData"
        label-width="130px"
        class="add_form"
      >
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              label="pos机终端号"
              class="ctjt_form_item_class"
              prop="posTerminalNo"
            >
              <el-input
                v-model.trim="formData.posTerminalNo"
                maxlength="50"
                show-word-limit
                :disabled="isEdit"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="pos类型"
              class="ctjt_form_item_class"
              prop="posType"
            >
              <el-select
                v-model="formData.posType"
                placeholder="请选择"
                :disabled="isEdit"
              >
                <el-option
                  v-for="item in posTypeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="使用片区"
              class="ctjt_form_item_class"
              prop="regionId"
            >
              <el-select
                v-model="formData.regionId"
                placeholder="请选择"
                @change="queryStore"
              >
                <el-option
                  v-for="item in regionList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="使用门店"
              class="ctjt_form_item_class"
              prop="storeId"
            >
              <el-select v-model="formData.storeId" placeholder="请选择">
                <el-option
                  v-for="item in storeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="pos账号"
              class="ctjt_form_item_class"
              prop="posAccountId"
            >
              <el-input
                v-model="formData.posAccount"
                disabled
                v-if="isEdit"
              ></el-input>
              <el-select
                v-else
                v-model="formData.posAccountId"
                placeholder="请选择"
                @change="posNoChange"
              >
                <el-option
                  v-for="item in postNoList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="银行"
              class="ctjt_form_item_class"
              prop="posBank"
            >
              <el-input v-model.trim="formData.posBank" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="pos公司"
              class="ctjt_form_item_class"
              prop="posCompany"
            >
              <el-input v-model.trim="formData.posCompany" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="pos公司装机日期"
              class="ctjt_form_item_class"
              prop="installDate"
            >
              <el-date-picker
                v-model="formData.installDate"
                align="right"
                type="date"
                placeholder="年/月/日"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="服务店撤机日期"
              class="ctjt_form_item_class"
              prop="revokeDate"
            >
              <el-date-picker
                v-model="formData.revokeDate"
                align="right"
                type="date"
                placeholder="年/月/日"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="pos公司收机日期"
              class="ctjt_form_item_class"
              prop="recoveryDate"
            >
              <el-date-picker
                v-model="formData.recoveryDate"
                align="right"
                type="date"
                placeholder="年/月/日"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="交接人"
              class="ctjt_form_item_class"
              prop="handoverName"
            >
              <el-input
                v-model.trim="formData.handoverName"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="备注"
              class="ctjt_form_item_class"
              prop="remark"
            >
              <el-input
                type="textarea"
                v-model.trim="formData.remark"
                maxlength="200"
                show-word-limit
                :rows="4"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="padding: 50px 0px">
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="drawerClose"
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
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtSetField,
} from '@/components';
import Index from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
  },
})
export default class FinancePosTerminalNumberMg extends Index {}
</script>
<style lang="scss" scoped>
.add_form .ctjt_form_item_class {
  width: 420px;
  .el-date-editor,
  .el-select {
    width: 100%;
  }
}
</style>
