<template>
  <div class="page">
    <el-card>
      <div slot="header">
        <span>请选择带教车型备选项</span>
      </div>
      <el-checkbox-group v-model="checkList" @change="handleChange">
        <el-checkbox
          class="mt-20"
          v-for="(item, index) in carOpts" :key="index" :label="item"
        ></el-checkbox>
      </el-checkbox-group>
    </el-card>
    <div class="mt-20">温馨提示：请勾选本驾校当前招生的授课车型即可。勾选的车型，将会在设置教练信息的带教车型时可以选择，没有勾选则不能选择。</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { examCarTypeOpt } from '@/views/educational/_enums/index';

@Component({})
export default class EducationalBasicSetCoachTeachCartypeSet extends Vue {
  @Action('assignment/queryTeachCarsList') private queryTeachCarsList!: () => any;

  @Action('assignment/modifyTeachCars') private modifyTeachCars!: (data: string[]) => any;

  // 车型配置项
  private carOpts = examCarTypeOpt;

  private checkList = [];

  private handleChange(val: string[]) {
    if ((this.perm as any).btn_cxsz) {
      this.modifyTeachCars(val);
    } else {
      this.$message.warning('暂无权限');
    }
  }

  async queryList() {
    const body = await this.queryTeachCarsList();
    this.checkList = body;
  }

  async mounted() {
    this.queryList();
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
