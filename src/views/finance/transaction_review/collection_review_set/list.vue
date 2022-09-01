<template>
  <div class="">
    <!-- <el-radio-group v-model="componentName" size="medium"> -->
    <!-- <el-radio-button label="Collection">收款复核</el-radio-button> -->
    <!-- <el-radio-button label="StoreCollection">门店收入统计</el-radio-button>
      <el-radio-button label="PayChanel">支付渠道收入统计</el-radio-button>
      <el-radio-button label="GoodsSale">商品销售统计</el-radio-button> -->
    <!-- </el-radio-group> -->
    <keep-alive include="Collection,StoreCollection,PayChanel,GoodsSale">
      <component :is="componentName"></component>
    </keep-alive>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class FinanceCollectionReviewSet extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .date-option-select .el-form-item__content .el-select {
  padding: 0 8px 0px 0px;
}
::v-deep .el-radio-button--medium .el-radio-button__inner {
  padding: 13px 70px;
}
</style>
