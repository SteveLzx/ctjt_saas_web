<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <CtjtAutoUpload
          v-if="perm['btn_export']"
          ref="fileUpload"
          text="导入"
          button-type="success"
          :prop-config="uploadConfig"
          :upload-path="uploadPath"
          @on-upload="uploadCallback"
          style="margin-right: 10px"
        ></CtjtAutoUpload>
        <el-button v-if="perm['btn_field']" @click="dialogName = 'field'" style="float: right">字段设置</el-button>
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
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>

    <!-- 导入结果弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      center>
      <ul>
        <li v-for="(item, index) in errorList" :key="index">{{item}}</li>
      </ul>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Index from './list';

export default class EducationalCoachMgCoachDistribute extends Index {}
</script>
