<template>
  <el-image-viewer
    :z-index="zIndex"
    :urlList="propData"
    :on-close="closeViewer"
  ></el-image-viewer>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Emit
} from 'vue-property-decorator';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue';

type PropDataValue = string[];

@Component({
  components: { ElImageViewer }
})
export default class CtjtImageViewer extends Vue {
  @Prop() propData!: PropDataValue;

  @Prop({ default: 2000 }) zIndex?: number;

  // 关闭预览弹窗
  @Emit('on-close')
  closeViewer() {
    // console.log('关闭');
  }
}
</script>
<style lang="scss" scoped>

</style>
