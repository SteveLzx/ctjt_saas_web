<template>
  <div class="page">
    <el-tabs v-model="activeName">
      <el-tab-pane label="片区考试指标设置" name="first">
        <educationalTeachMgIndexMgDetail></educationalTeachMgIndexMgDetail>
      </el-tab-pane>
      <el-tab-pane label="门店考试指标设置" name="second">
        <educationalTeachMgIndexMgDetail></educationalTeachMgIndexMgDetail>
      </el-tab-pane>
      <el-tab-pane label="教练组长考试指标设置" name="third">
        <educationalTeachMgIndexMgDetail></educationalTeachMgIndexMgDetail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class EducationalTeachMgIndexMg extends Index {}
</script>
<style lang="scss" scoped>
</style>
