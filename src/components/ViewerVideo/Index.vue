<template>
  <el-dialog
    title="视频预览"
    :visible="show"
    :show-close="false"
    width="650px"
    center>
    <div class="video_box">
      <video :src="url" controls class="video_style"></video>
      <el-button type="primary" @click="closeViewer">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Emit
} from 'vue-property-decorator';

type urlValue = string;

type showValue = boolean;

@Component({
  components: { }
})
export default class CtjtVideoViewer extends Vue {
  @Prop() url!: urlValue;

  @Prop() show!: showValue;

  // 关闭预览弹窗
  @Emit('on-close')
  closeViewer() {
    console.log('关闭');
  }
}
</script>
<style lang="scss" scoped>
.video_box {
  background-color: transparent;
}
.video_style {
  width: 600px;
  height: 900px;
  margin-bottom: 8px;
}
</style>
