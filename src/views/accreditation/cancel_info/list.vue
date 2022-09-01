<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    >
      <template slot="autocomplete">
        <el-form-item
          v-for="(item, index) in searchForm.autocompleteList"
          :key="`autocomplete-${index}`"
          :label="item.label"
          :label-width="`${item.labelWidth + 'px' || 'auto'}`"
        >
          <el-autocomplete
            popper-class="seach_table_autocomplete"
            v-model="item.value"
            value-key="idNo"
            :maxlength="item.maxlength"
            :clearable="item.clearable"
            :fetch-suggestions="autocompleteQuerySearch"
            :placeholder="item.placeholder || '请输入内容'"
            style="width: 320px"
          >
            <template slot-scope="{ item }">
              <div class="idNo">{{ item.idNo }}</div>
              <span class="userName">{{ item.userName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template>
    </SearchTable>
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
          :localstorage-service="'accreditation'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtStatistics
      :statistics-data="statisticsData"
      remark=""
    ></CtjtStatistics>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
    <!--新增撤回弹出框-->
    <el-drawer
      :visible.sync="drawer"
      :wrapperClosable="false"
      size="1000px"
      :before-close="closeDrawer"
    >
      <template slot="title">
        <span class="draw_title">新增撤销办证</span>
      </template>
      <el-form
        ref="drawerForm"
        :model="formData"
        :rules="formDataRules"
        label-position="left"
        label-width="130px"
        class="drawer_form"
      >
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="证件号码"
              prop="idNo"
            >
              <CtjtSelect
                :value="formData.idNo"
                :list="idNoOption.options"
                :callback="formDataSelectCallback"
                :placeholder="'请输入证件号码'"
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
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="姓名"
              prop="userName"
            >
              <el-input
                v-model="formData.userName"
                class="w_200"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="班别"
              prop="classesName"
            >
              <el-input
                v-model="formData.classesName"
                class="w_200"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="车型"
              prop="carModel"
            >
              <el-input
                v-model="formData.carModel"
                class="w_200"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-form-item label="请选择撤销办证" prop="cancelInfo">
            <el-table
              ref="singleCheckTable"
              class="drawer_table"
              v-model="formData.cancelInfo"
              :data="formData.nodeDtoList"
              :border="true"
              tooltip-effect="light"
              :row-key="
                (row) => {
                  return row.id;
                }
              "
              @selection-change="formTableSelectionChange"
            >
              <el-table-column
                type="selection"
                :reserve-selection="true"
                width="55"
              >
              </el-table-column>
              <el-table-column
                v-for="(item, index) in formTableData.labels"
                :align="'center'"
                :prop="item.key"
                :label="item.label"
                :width="item.width"
                :minWidth="item.minWidth"
                :key="`column-${index}`"
              ></el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
        <el-row>
          <CtjtStatistics
            statistics-data=""
            remark="办证科目不允许跨科目撤销，必须逐级撤销"
          ></CtjtStatistics
        ></el-row>
        <el-row type="flex" justify="center">
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="closeDrawer"
            >取消</el-button
          >
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="submitCancel"
            :loading="submitLoading"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-drawer>
    <!--办证撤销详情弹出框-->
    <el-drawer
      :visible.sync="drawerDeatil"
      :wrapperClosable="false"
      size="1000px"
    >
      <template slot="title">
        <span class="draw_title">撤销办证详情</span>
      </template>
      <el-form
        ref="drawerDetailForm"
        :model="detailFormData"
        :rules="detailFormDataRules"
        label-position="left"
        label-width="130px"
        class="drawer_detail_form"
      >
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="撤销单编号：" class="ctjt_form_item_class">
              <span>{{ detailFormData.seq }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核状态：" class="ctjt_form_item_class">
              <span>{{ detailFormData.status | auditStatusFilter }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="证件号码：" class="ctjt_form_item_class">
              <span>{{ detailFormData.idNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名：" class="ctjt_form_item_class">
              <span>{{ detailFormData.userName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="班别：" class="ctjt_form_item_class">
              <span>{{ detailFormData.classesName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型：" class="ctjt_form_item_class">
              <span>{{ detailFormData.carModel }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item class="" label="撤销办证">
              <el-table
                :data="detailFormData.nodeDtoList"
                :highlight-current-row="true"
                border
                style="width: 100%"
              >
                <el-table-column
                  :align="'center'"
                  prop="currentNode"
                  label="工单当前待办科目"
                  minWidth="170"
                ></el-table-column>
                <el-table-column
                  :align="'center'"
                  prop="taggerNode"
                  label="可撤销至"
                  minWidth="170"
                ></el-table-column>
              </el-table>
              <!-- <CtjtTable :tableData="detailFormTableData"></CtjtTable> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="detailFormData.isApprove">
          <CtjtCard :prop-data="{ title: '审核信息' }">
            <template #content>
              <el-row :gutter="8">
                <el-col :span="24">
                  <el-form-item
                    label="审核"
                    class="ctjt_form_item_class"
                    prop="approveResult"
                  >
                    <el-radio-group v-model="detailFormData.approveResult">
                      <el-radio :label="1">通过</el-radio>
                      <el-radio :label="2">驳回</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="24">
                  <el-form-item label="驳回原因" prop="opinion">
                    <el-input
                      v-model.trim="detailFormData.opinion"
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
            </template>
          </CtjtCard>
        </el-row>
        <el-row>
          <el-table
            :data="detailFormData.approveList"
            :highlight-current-row="true"
            border
          >
            <CtjtTableColumn
              v-for="(item, index) in approveTablelabels"
              :render="item.render"
              :fixed="item.fixed"
              :align="'center'"
              :prop="item.key"
              :label="item.label"
              :width="item.width"
              :minWidth="item.minWidth"
              :key="`column-${index}`"
            >
            </CtjtTableColumn>
          </el-table>
        </el-row>
        <el-row type="flex" justify="center" style="padding: 50px 0px">
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="closeDetailDrawer"
            >取消</el-button
          >
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="submitStatus"
            :loading="submitLoading"
            v-if="perm['btn_audit']"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-drawer>
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtSelect,
  CtjtCreateTable,
  CtjtSetField,
  CtjtStatistics,
  CtjtOperationLog,
} from '@/components';
import CtjtTableColumn from '@/components/Table/Column';
import Index from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtStatistics,
    CtjtCard,
    CtjtSelect,
    CtjtCreateTable,
    CtjtOperationLog,
    CtjtTableColumn,
  },
})
export default class AccreditationCancelInfo extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  border-bottom: 1px solid $--color-border-split;
  padding: 30px;
  .draw_title {
    font-size: 17px;
    font-weight: 500;
  }
}

::v-deep .el-drawer__body {
  overflow: auto;
  padding: 30px;
}
::v-deep .ctjt_form_item_class .el-input__inner {
  width: 200px;
}
::v-deep .drawer_form .el-row {
  padding: 10px 0px;
}
::v-deep .drawer_table .el-table__header-wrapper .el-checkbox {
  display: none;
}
::v-deep .drawer_form .el-form-item__label,
::v-deep .drawer_detail_form .el-form-item__label {
  font-weight: bold;
}
</style>
