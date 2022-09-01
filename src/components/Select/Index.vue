<template>
  <el-select
    :class="filterable ? 'c_select' : ''"
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    :filterable="filterable"
    :remote="remote"
    :loading="loading"
    :remote-method="remotemethod"
    :popper-append-to-body="!filterable"
    @change="change"
  >
    <el-option
      v-for="(item, i) in list"
      :key="i"
      :label="item[options.label]"
      :value="item[options.value]"
    >
      <template v-if="filterable">
        <div class="c_div">
          <div class="c_label">{{ item[options.title] }}</div>
          <div class="c_value">{{ item[options.value] }}</div>
        </div>
      </template>
    </el-option>
  </el-select>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Emit
} from 'vue-property-decorator';

@Component
export default class CtjtSelect extends Vue {
  @Prop({ default: [] }) list!: [];

  @Prop({ default: null }) value!: string | number;

  @Prop({ default: false }) disabled!: boolean;

  @Prop({ default: '请选择' }) placeholder!: string;

  @Prop({ default: false }) filterable!: boolean;

  @Prop({ default: false }) remote!: boolean;

  @Prop({ default: false }) loading!: boolean;

  @Prop({ default: () => ({ value: 'id', label: 'label', title: 'label' }) })
  options!: any;

  @Prop({ default: {} }) callback!: (value: string | number) => void;

  /**
   * @description 选择切换
   */
  private change(val: any) {
    this.callback(val);
  }

  /**
   * @description 远程搜索
   */
  @Emit('remotemethod')
  private remotemethod(val: any) {
    return val;
  }
}
</script>
<style lang="scss" scoped>
.c_select {
  ::v-deep .el-select-dropdown__item {
    height: 64px !important;
  }
}
.c_label {
  font-size: 12px;
}
.c_value {
  font-size: 12px;
  color: #999;
}
</style>
