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
            style="width: 320px" size="mini"
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
    <!--新增转历史抽屉-->
    <el-drawer
      :visible.sync="drawer"
      :wrapperClosable="false"
      size="80%"
      :before-close="closeDrawer"
    >
      <template slot="title">
        <span class="draw_title">{{`${formData.approveId ? '编辑' : '新增'}转历史审批`}}</span>
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
              label="证件号码："
              prop="idNo"
            >
              <CtjtSelect
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
                :disabled="formData.approveId ? true : false"
                :loading="idNoOption.loading"
                @remotemethod="queryIdNoSearch"
              ></CtjtSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="姓名："
              prop="userName"
            >
              <el-input v-model="formData.userName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="报名日期："
              prop="registerTime"
            >
              <el-input v-model="formData.registerTime" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="学车进度："
              prop="learnDrivingSchedule"
            >
              <el-input v-model="formData.learnDrivingSchedule" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="联系电话："
              prop="mobile"
            >
              <el-input v-model="formData.mobile" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="受理号："
              prop="acceptNumber"
            >
              <el-input v-model="formData.acceptNumber" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="班别："
              prop="classesName"
            >
              <el-input v-model="formData.classesName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="订单金额："
              prop="salePrice"
            >
              <el-input v-model="formData.salePrice" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="代收金额："
              prop="balance"
            >
              <el-input v-model="formData.balance" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class red"
              label="是否欠费："
              prop="isAppears"
            >
              <el-input v-model="formData.isAppears" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="原因："
              prop="reason"
            >
              <el-select
                v-model="formData.reason"
                placeholder="请选择学员类别"
                clearable
              >
                <el-option
                  v-for="item in turnHistoryReasonList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item
              class="ctjt_form_item_class"
              label="备注："
              prop="remark"
              style="width: 80%"
            >
              <el-input
                v-model.trim="formData.remark"
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="2"
                placeholder="请输入，限200字以内"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="padding: 40px 0px">
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
            @click="addTurnHistory"
            :loading="submitLoading"
            >确定</el-button
          >
        </el-row>
      </el-form>
    </el-drawer>
    <!--转历史详情抽屉-->
    <el-drawer
      :visible.sync="drawerDeatil"
      :wrapperClosable="false"
      size="80%"
    >
      <template slot="title">
        <span class="draw_title">申请单详情</span>
      </template>
      <el-form
        ref="drawerDetailForm"
        :model="detailFormData"
        label-position="left"
        label-width="130px"
        class="drawer_detail_form"
      >
        <el-row :gutter="8" class="special_row">
          <el-col :span="12">
            <el-form-item label="审核状态：" class="ctjt_form_item_class">
              <span>{{ detailFormData.auditStatus | auditStatusFilter }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请单号：" class="ctjt_form_item_class">
              <span>{{ detailFormData.seq }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" class="special_row">
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
        <el-row :gutter="8" class="special_row">
          <el-col :span="12">
            <el-form-item label="报名日期：" class="ctjt_form_item_class">
              <span>{{ detailFormData.registerTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学车进度：" class="ctjt_form_item_class">
              <span>{{ detailFormData.learnDrivingSchedule | learnDrivingScheduleFilter }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" class="special_row">
          <el-col :span="12">
            <el-form-item label="联系电话：" class="ctjt_form_item_class">
              <span>{{ detailFormData.mobile }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="受理号："
              prop="acceptNumber"
            >
              <span>{{ detailFormData.acceptNumber }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" class="special_row">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="班别："
              prop="classesName"
            >
              <span>{{ detailFormData.classesName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="订单金额："
              prop="salePrice"
            >
              <span>{{ detailFormData.salePrice }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" class="special_row">
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class"
              label="代收金额："
              prop="balance"
            >
              <span>{{ detailFormData.balance }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="ctjt_form_item_class red"
              label="是否欠费："
              prop="isAppears"
            >
              <span>{{ detailFormData.balance > 0 ? '是' : '否' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" class="special_row">
          <el-col :span="12">
            <el-form-item label="变更原因：" class="ctjt_form_item_class">
              <span>{{ detailFormData.reason }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：" class="ctjt_form_item_class">
              <span>{{ detailFormData.remark }}</span>
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
                      disabled
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
            :data="detailFormData.recordDoList"
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
    <CtjtRejectDialog :dialogVisible.sync="rejectShow" :type="4" :id="rejectId"  @on-submit="rejectCallBack"></CtjtRejectDialog>
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
  CtjtSetField,
  CtjtStatistics,
  CtjtRejectDialog
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
    CtjtTableColumn,
    CtjtRejectDialog
  },
})
export default class AccreditationTurnHistoryApproval extends Index {}
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
  width: 240px;
}
::v-deep .red .el-form-item__label,
::v-deep .red .el-form-item__content {
  color: red !important;
}
::v-deep .drawer_form .el-row,
::v-deep .drawer_detail_form .special_row {
  padding: 10px 0px 10px 70px;
}
::v-deep .drawer_table .el-table__header-wrapper .el-checkbox {
  display: none;
}
::v-deep .drawer_form .el-form-item__label,
::v-deep .drawer_detail_form .el-form-item__label {
  font-weight: bold;
}
.el-form-item{
  margin-bottom: 8px;
}
</style>
