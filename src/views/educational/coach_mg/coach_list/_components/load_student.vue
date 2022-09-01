<template>
  <div class="page">
    <el-table :data="tableData.list" style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableData.labels"
        :key="`label-${index}`"
        :prop="item.key"
        :label="item.label"
        align="center"
      ></el-table-column>
    </el-table>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`负荷学员列表`" name="first">
        <LoadStudentList :unsolvedData.sync="tableData"></LoadStudentList>
      </el-tab-pane>
      <!-- <el-tab-pane :label="`学员考试详情`" name="second">
        <StudentExaminationDetail></StudentExaminationDetail>
      </el-tab-pane>
      <el-tab-pane :label="`学员报考详情`" name="third">
        <StudentRegistrationDetail></StudentRegistrationDetail>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script lang="ts">
import Index from './load_student';

export default class LoadStudent extends Index {}
</script>
<style lang="scss" scoped>
</style>
