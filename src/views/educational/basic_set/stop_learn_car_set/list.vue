<template>
  <div class="page">
    <el-card>
      <div slot="header">
        <span>当前暂停学车设置</span>
      </div>
      <el-form>
        <el-form-item label="暂停学车恢复方式:"></el-form-item>
        <el-form-item label="暂停学车周期范围："></el-form-item>
        <el-form-item label="">
          <el-button type='primary' @click="drawerDetail = true">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-drawer
      title="暂停学车设置"
      :visible.sync="drawerDetail"
      :size="'60%'"
      :direction="'rtl'"
      :before-close="handleClose">
      <el-form :mode="formData" class="page" label-width="140px">
        <el-form-item label="暂停学车恢复方式:">
          <el-radio-group v-model="formData.radio">
            <el-radio :label="1">暂停周期到期自动恢复</el-radio>
            <el-radio :label="2">恢复学车流程审批通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="暂停学车周期范围:">
          <el-input-number v-model="formData.num" :min="0" :max="1200"></el-input-number>
          —
          <el-input-number v-model="formData.num" :min="0" :max="1200"></el-input-number>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="handleClose()">取消</el-button>
          <el-button type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ParamsType } from '@/type';

@Component({})
export default class EducationalBasicSetStopLearnCarSet extends Vue {
  // 表单配置
  private formData: ParamsType = {

  };

  private drawerDetail = false;

  private handleClose() {
    this.drawerDetail = false;
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-input-number__decrease,
::v-deep .el-input-number__increase {
  line-height: 32px !important;
  font-size: 14px !important;
}
</style>
