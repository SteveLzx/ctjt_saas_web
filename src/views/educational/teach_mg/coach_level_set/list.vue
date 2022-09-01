<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <el-row class="form" type="flex">
      <el-button v-if="perm['btn_drmbxz']" @click="downloadImport()">导入模板下载</el-button>
      <el-button v-if="perm['btn_import']" @click="drawer = true">导入</el-button>
    </el-row>
    <el-table :data="tableData" border  style="width: 100%">
      <el-table-column type="selection" :align="'center'" width="50"></el-table-column>
      <el-table-column type="index" label="序号"  align="center" width="50"></el-table-column>
      <el-table-column prop="regionName" label="片区" align="center"></el-table-column>
      <el-table-column prop="leaderName" label="教学组长" align="center"></el-table-column>
      <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="teachType" label="带教类型" align="center"></el-table-column>
      <el-table-column prop="teachCar" label="带教车型" align="center"></el-table-column>
      <!-- <el-table-column prop="" label="星级考核月份" align="center"> -->
      <el-table-column prop="examMonthOne" :label="`${tableDataLabels.examMonthOne}月`" align="center"></el-table-column>
      <el-table-column prop="examMonthTwo" :label="`${tableDataLabels.examMonthTwo}月`" align="center"></el-table-column>
      <el-table-column prop="examMonthThree" :label="`${tableDataLabels.examMonthThree}月`" align="center"></el-table-column>
      <!-- </el-table-column> -->
      <el-table-column prop="averageScore" label="平均得分" align="center"></el-table-column>
      <el-table-column prop="term" label="入职年限" align="center"></el-table-column>
      <el-table-column prop="level" label="星级" align="center" :formatter="levelFormatter"></el-table-column>
      <!-- <el-table-column prop="" label="绩效运用星级" align="center">
        <el-table-column prop="levelOne" :label="`${tableDataLabels.levelOne}月`" align="center"></el-table-column>
        <el-table-column prop="levelTwo" :label="`${tableDataLabels.levelTwo}月`" align="center"></el-table-column>
        <el-table-column prop="levelThree" :label="`${tableDataLabels.levelThree}月`" align="center"></el-table-column>
      </el-table-column> -->
      <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
    </el-table>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <el-drawer
      title="导入"
      :visible.sync="drawer"
      :size="'40%'"
      :direction="'rtl'"
      :before-close="handleClose">
      <el-form class="page" ref="drawerFormRef" :model="formData" :rules="formRules">
        <el-form-item label="年份" prop="year">
        <el-date-picker
          v-model="formData.year"
          type="year"
          placeholder="选择年">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="季度" prop="quarter">
          <el-select v-model="formData.quarter" placeholder="请选择季度">
            <el-option
              v-for="item in quarterOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件" prop="file">
          <CtjtUpload
            ref="fileUpload"
            :prop-config="uploadConfig"
            :file-accept="fileAccept"
            @file-choose="fileChoose"
            @remove-list="_clearData"
          >
          </CtjtUpload>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class EducationalTeachMgCoachLevelSet extends Index {}
</script>
<style lang="scss" scoped>
.form {
  padding: 5px 18px;
  border: 1px solid $--color-border-split;
  border-bottom: 0;
  background: #f9fafb;
}
</style>
