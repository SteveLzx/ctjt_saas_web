<template>
  <el-radio-group v-model="tabvalue" @change="change">
    <el-radio-button
      v-for="tab in tabs"
      :key="tab.id"
      :label="tab.id">
      {{ tab.label }}
    </el-radio-button>
  </el-radio-group>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Watch
} from 'vue-property-decorator';

@Component({})
export default class CtjtTabBar extends Vue {
  @Prop({ default: {} }) tabs!: any;

  @Prop({ default: {} }) value!: number | string;

  private tabvalue: number | string = '';

  @Watch('value', { immediate: true })
  private watchValue(newVal: number | string) {
    this.tabvalue = newVal;
  }

  change(val: any) {
    this.$emit('update:value', val);
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-radio-button  {
  min-width: 180px;
  .el-radio-button__inner {
    width: 100%;
    padding: 10px 20px;
  }
}
</style>
