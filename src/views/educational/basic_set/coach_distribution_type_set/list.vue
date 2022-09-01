<template>
  <div class="page">
    <el-card>
      <div slot="header">
        <span>设置学员分配教练方式，修改后当晚24时立即生效</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules">
        <el-form-item prop="optionalTimeLimit">
          <el-checkbox v-model="formData.optional">
            优先斑斑APP自选，学员自选时限<el-input validate-event class="w_200 ml-20 mr-20" v-model.number="formData.optionalTimeLimit"></el-input>小时</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formData.systemAuto">系统自动分配，需提前设置分配规则</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formData.manual">仅人工分配</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button v-if="perm['btn_submit']" type="primary" @click="submit()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ParamsType, VueComponentParent } from '@/type';

@Component({})
export default class EducationalBasicSetCoachDistributionTypeSet extends Vue {
  @Action('assignment/queryModesData') private queryModesData!: () => ParamsType;

  @Action('assignment/saveModesData') private saveModesData!: (data: any) => ParamsType;

  private formData: ParamsType = {
    id: null,
    manual: false,
    optional: false,
    optionalTimeLimit: null, // 自选时限
    systemAuto: false
  }

  private formRules = {
    optionalTimeLimit: [
      {
        type: 'number', message: '请输入数字', trigger: ['change']
      }
    ]
  }

  private async queryDetail() {
    const body = await this.queryModesData();
    if (body) {
      Object.keys(this.formData).forEach((key: string) => {
        this.formData[key] = body[key];
      });
    }
  }

  private submit() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.$confirm('确认修改配置信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveModesData(this.formData).then(() => {
            this.queryDetail();
            this.$message.success('修改成功！');
          });
        });
      }
    });
  }

  mounted() {
    this.queryDetail();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
</script>
<style lang="scss" scoped>
</style>
