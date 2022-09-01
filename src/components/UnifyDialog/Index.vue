<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible.sync="isShow"
    :before-close="handleClose"
  >
    <slot></slot>
  </el-dialog>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit
} from 'vue-property-decorator';

@Component
export default class CtjtDialog extends Vue {
  @Prop({ default: false }) isShow!: boolean;

  @Prop({ default: '' }) title?: string;

  @Prop({ default: '400px' }) width?: string;

  /**
   * 关闭弹框
   */
  @Emit('button-call')
  handleClose() {
    //
  }
}
</script>
