<template>
  <div class="page">
    <el-form
      ref="changeDetailForm"
      :model="detailFormData"
      :rules="detailFormDataRules"
      label-position="right"
      label-width="130px"
      class="detail_form"
    >
      <CtjtCard :prop-data="{ title: '学员信息' }">
        <template #content>
          <el-row :gutter="8">
            <el-col :span="6">
              <el-form-item
                label="审核状态："
                class="ctjt_form_item_class right_align_class"
              >
                <span>{{ detailFormData.status | auditStatusFilter }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                label="变更单单编号："
                class="ctjt_form_item_class right_align_class"
              >
                <span>{{ detailParams.seq }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="padding: 30px 0px">
            <CtjtTable :tableData="changeInfoTableData"> </CtjtTable>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard
        :prop-data="{ title: '变更后考试结果' }"
        style="margin: 50px 0px"
      >
        <template #content>
          <el-row :gutter="6">
            <el-col :span="8">
              <el-form-item label="考核类型：" class="ctjt_form_item_class">
                <el-select
                  v-model="detailFormData.type"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="变更后考试结果："
                class="ctjt_form_item_class"
              >
                <el-select
                  v-model="detailFormData.examResultNew"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="item in examResultList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                class="ctjt_form_item_class"
                label="变更原因："
                style="width: 80%"
              >
                <span>{{ detailFormData.reason }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <el-row type="flex" justify="center" style="padding: 50px 0px">
        <el-button @click="cancelFun">取消</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts">
import Detail from './detail';

export default class AccreditationExamResultsChangeDetail extends Detail {}
</script>
<style lang="scss" scoped>
::v-deep .detail_form .el-form-item__label,
::v-deep .detail_form .el-form-item__label {
  font-weight: bold;
}
::v-deep .detail_form .right_align_class > .el-form-item__label {
  text-align: left;
}
</style>
