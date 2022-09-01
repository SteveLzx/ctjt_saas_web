<template>
  <div class="page">
    <CtjtTable :tableData="tableData" @option-call="tableOptionCallback" @selection-change="tableSelectionChange">
      <template slot="reference">
        <el-button v-if="perm['btn_field']" @click="dialogName = 'field'" style="float: right;">字段设置</el-button>
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'educational'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <el-drawer
      :visible.sync="drawerDetail"
      :direction="'rtl'"
      :show-close="false"
      :wrapperClosable="false"
      :size="'80%'">
      <template slot='title'>
        <CtjtCard :prop-data="{ title: '新增带教类型' }">
          <template slot='header'>
            <span style="float: right" class="iconfont close_icon" @click="handleCloseClick()">&#xe62b;</span>
          </template>
          <template slot='content'>
            <el-form ref="detailFormRef" :model="formData" :rules="formDataRules" label-width="125px">
              <el-form-item label="带教类型名称" prop="name">
                <el-input class="w_300" :disabled="isEdit" v-model.trim="formData.name" maxlength="30" show-word-limit placeholder="请输入带教类型名称"></el-input>
              </el-form-item>
              <el-form-item label="是否有带教属性" prop="property">
                <el-radio-group v-model="formData.property" :disabled="isEdit">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="formData.property !== 0">
                <el-form-item label="可带教科目" prop="subject">
                  <el-checkbox-group v-model="formData.subject" :disabled="isEdit">
                    <el-checkbox
                      v-for="(item, index) in subjectOpts"
                      :key="index"
                      :label="item.label"
                    >{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="带教模式" prop="model">
                  <el-radio-group v-model="formData.model" :disabled="isEdit">
                    <el-radio
                      v-for="item in typeOpts" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
              <el-form-item label="备注" prop="remarks">
                <el-input class="w_400" :disabled="isEdit" v-model.trim="formData.remarks" maxlength="30" show-word-limit type="textarea" placeholder="请输入备注"></el-input>
              </el-form-item>
              <el-form-item v-if="!isEdit">
                <el-button @click="handleCloseClick()">取消</el-button>
                <el-button v-if="perm['btn_submit']" type="primary" :loading="submitLoading" @click="submit()">保存</el-button>
              </el-form-item>
            </el-form>
          </template>
        </CtjtCard>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class EducationalBasicSetCoachTeachtypeSet extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
</style>
