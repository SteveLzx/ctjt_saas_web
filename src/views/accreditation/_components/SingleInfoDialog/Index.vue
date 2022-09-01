<template>
  <div class="user-baseinfo-container" style="padding: 0px 40px">
    <el-dialog
      :title="title"
      width="1200px"
      :visible.sync="isShow"
      :before-close="btnClickFun"
    >
      <el-form
        label-width="120px"
        label-position="left"
        ref="singleForm"
        :model="infoData"
        :rules="baseRules"
        :style="{ padding: '0px 40px' }"
      >
        <el-row>
          <el-col :span="12" v-if="title !== '学时更新'">
            <el-form-item
              label="批次号"
              class="ctjt_form_item_class"
              prop="batchNo"
            >
              <el-input
                v-if="batShow === 1"
                v-model="infoData.batchNo"
                placeholder="培训完成时，系统自动生成"
                style="width: 260px"
                disabled
              />
              <el-input
                v-else
                v-model="infoData.batchNo"
                placeholder="补录请填写；不填则生成新的批次号"
                style="width: 260px"
                :disabled="batShow === 2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓  名" class="ctjt_form_item_class">
              <span>{{ infoData.userName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证件号码" class="ctjt_form_item_class">
              <span>{{ infoData.idNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班  别" class="ctjt_form_item_class">
              <span>{{ infoData.classesName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车  型" class="ctjt_form_item_class">
              <span>{{ infoData.carModel }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="title !== '录入转账码'">
            <el-form-item label="学车类型" class="ctjt_form_item_class">
              <span>{{ infoData.learnType }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="title !== '录入转账码'">
          <el-col :span="12">
            <el-form-item label="欠费金额" class="ctjt_form_item_class">
              <span>{{ infoData.balance }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="type === 'accept'">
            <el-form-item label="受理状态" class="ctjt_form_item_class">
              <span>{{ infoData.acceptStatus | acceptStatusFilter }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item
              label="受理档案号"
              class="ctjt_form_item_class"
              v-if="isHuiZhouSchool()"
            >
              <span>{{ infoData.acceptNumber }}</span>
            </el-form-item>
            <el-form-item label="受理号" class="ctjt_form_item_class" v-else>
              <span>{{ infoData.acceptNumber }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <slot></slot>
        <el-row type="flex" justify="center">
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="btnClickFun('submit')"
            :loading="submitLoading"
            >确定</el-button
          >
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="btnClickFun('cancel')"
            >取消</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit, Watch
} from 'vue-property-decorator';
import { State } from 'vuex-class';
import { ParamsType, VueComponentParent } from '@/type';
import { drivingSchool } from '@/assets/js/common';

@Component({
  filters: {
    acceptStatusFilter(val: any) {
      if (!val) return '';
      return val === 1 ? '待受理' : '受理失败';
    },
  },
})
export default class CtjtSingleInfoDialog extends Vue {
  @State((state) => state.base.userInfo) userInfo: any;

  @Prop({ default: {} }) infoData!: ParamsType;

  @Prop({ default: '' }) title?: string;

  @Prop({ default: '' }) rules?: any;

  @Prop({ default: '' }) type?: string;

  @Prop({ default: false }) isShow!: boolean;

  submitLoading = false;

  private baseRules = {};

  private basicRules = {
    batchNo: [
      {
        max: 50,
        message: '长度在50个字以内',
        trigger: 'change',
      },
    ],
  };

  @Emit('button-call')
  btnClickFun(key: string) {
    let resultData: any = null;
    if (key === 'submit') {
      (this.$refs.singleForm as VueComponentParent).validate(
        (valid: boolean) => {
          if (valid) {
            this.submitLoading = true;
            resultData = this.infoData;
          } else if (resultData) {
            this.$message.warning('您的信息填写有误，请仔细检查并修改！');
          }
        }
      );
      return { key, data: resultData };
    }
    return { key, data: null };
  }

  // 清空singleForm
  resetFields() {
    (this.$refs.singleForm as VueComponentParent).resetFields();
    this.submitLoading = false;
  }

  // 批次号是否存在，可输入
  batShow = 0;

  @Watch('isShow')
  batShowFun(val: boolean) {
    if (val) {
      this.batShow = 0;
      if (this.infoData.step) {
        if (this.title === '学时更新' || this.title === '模拟成绩') {
          this.batShow = 1;
        }
      } else if (this.title === '学时更新') {
        this.batShow = 2;
      }
    }
  }

  /** 判断是否是惠州深港 */
  isHuiZhouSchool() {
    const { drivingSchoolId } = this.userInfo;
    return drivingSchool(drivingSchoolId) === 'huizhou';
  }

  mounted() {
    this.baseRules = { ...this.basicRules, ...this.rules };
  }
}
</script>
<style lang="scss" scoped>
.user-baseinfo-container {
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
  ::v-deep .el-form-item:not(.is-required) .el-form-item__label::before {
    content: '';
    margin-right: 11px;
  }
}
</style>
