<template>
  <div class="">
    <el-radio-group v-if="$route.query.id" v-model="componentName" size="medium">
      <el-radio-button label="CoachDetail">教练信息</el-radio-button>
      <el-radio-button label="LoadStudent">负荷学员</el-radio-button>
      <el-radio-button label="ModifyLogs">修改日志</el-radio-button>
    </el-radio-group>
    <keep-alive include="CoachDetail,LoadStudent,ModifyLogs">
      <component :is="componentName"></component>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import Index from './detail';

export default class EducationalCoachDetail extends Index {}
</script>

<style lang="scss" scoped>
</style>
