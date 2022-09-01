<template>
  <div class="statistics-container" id="statistics_container">
    <div
      v-for="(item, index) in statisticsData"
      :key="index"
      class="statistics"
    >
      <span>{{ item.label }}</span
      ><span>{{ item.value }}</span>
    </div>
    <div class="remark">
      <div v-html="remark"></div>
      <div class="p_20" v-if="remark === undefined">
        <!-- 注：【操作日期】指上一办证科目的数据录入日期；【操作人】指录入上一办证科目数据的用户。 -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';

@Component
export default class CtjtStatistics extends Vue {
  @Prop({ default: null }) statisticsData?: [];

  @Prop({ default: undefined }) remark?: string;
}
</script>
<style lang="scss" scoped>
.statistics-container {
  padding: 30px 0 10px 0;
  .statistics {
    margin-right: 20px;
    display: inline;
    font-weight: 600;
    span {
      margin-right: 2px;
    }
  }
  .remark {
    color: $--color-warning-text;
    .p_20 {
      text-align: right;
      padding: 30px 0 10px 0;
    }
  }
}
</style>
