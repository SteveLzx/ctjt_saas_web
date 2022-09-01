<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <CtjtAutoUpload
          v-if="perm['btn_drjxz']"
          ref="fileUpload"
          text="导入教学组"
          button-type="warning"
          :prop-config="uploadConfig"
          :upload-path="uploadPath"
          @on-upload="uploadCallback"
          style="margin-right: 10px"
        >
        </CtjtAutoUpload>
        <el-button v-if="perm['btn_field']" @click="dialogName = 'field'" style="float: right">字段设置</el-button
        >
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'educational'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <!-- 教学组详情 -->
    <el-drawer
      :visible.sync="drawerDetail"
      :direction="'rtl'"
      :show-close="false"
      :wrapperClosable="false"
      :size="'80%'">
      <template slot='title'>
        <CtjtCard :prop-data="{ title: '教练组详情（管辖教练列表）' }">
          <template slot='header'>
            <span style="float: right" class="iconfont close_icon" @click="drawerDetail = false">&#xe62b;</span>
          </template>
          <template slot="content">
            <el-row>
              <el-col :span="8">所属片区：{{drawerTableData.data.regionName}}</el-col>
              <el-col :span="8">教学组名：{{drawerTableData.data.name}}</el-col>
              <el-col :span="8">教学组长：{{drawerTableData.data.leaderName}}</el-col>
            </el-row>
          </template>
        </CtjtCard>
      </template>
      <CtjtTable :tableData="drawerTableData"></CtjtTable>
    </el-drawer>
    <!-- 片区未分组教练列表 -->
    <el-drawer
      :visible.sync="drawerNoGrouping"
      :direction="'rtl'"
      :show-close="false"
      :wrapperClosable="false"
      :size="'80%'">
      <template slot='title'>
        <CtjtCard :prop-data="{ title: '片区未分组教练列表' }">
          <template slot='header'>
            <span style="float: right" class="iconfont close_icon" @click="drawerNoGrouping = false">&#xe62b;</span>
          </template>
        </CtjtCard>
      </template>
      <CtjtTable :tableData="drawerNoGroupingTableData"></CtjtTable>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class EducationalCoachMgTeachGroupMg extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
</style>
