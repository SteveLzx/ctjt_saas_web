<template>
  <div style="margin-bottom: 16px;">
    <el-card :shadow="propData.shadow || 'naver'" :body-style="{ padding: '20px 24px' }">
      <el-row class="card-header">
        <span class="title">{{propData.title}}</span>
        <span class="tips">{{propData.tips}}</span>
        <slot name="header"></slot>
      </el-row>
      <slot name="content"></slot>
    </el-card>
  </div>
</template>
<script lang='ts'>
import { Prop, Vue, Component } from 'vue-property-decorator';

interface PropValue {
  title?: string; // 标题
  tips?: string; // 副标题
  shadow?: string; // 阴影显示
}

@Component
export default class CtjtCard extends Vue {
  @Prop({
    default: {}
  }) propData!: PropValue
}
</script>
<style lang="scss" scoped>
.card-header {
  width: 100%;
  line-height: 25px;
  margin-bottom: 18px;
  .title {
    height: 25px;
    padding-left: 12px;
    color: $--color-text;
    font-size: 18px;
    position: relative;
    &::before {
      position: absolute;
      top: 50%;
      transform: translate(-12px, -50%);
      content: '';
      width: 4px;
      height: 18px;
      background-color: $--color-primary;
    }
  }
  .tips {
    margin-left: 4px;
    color: $--color-danger;
    font-size: 12px;
  }
}
</style>
