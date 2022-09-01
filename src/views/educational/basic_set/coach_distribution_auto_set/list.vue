<template>
  <div class="page">
    <el-row>
      <el-button v-if="perm['btn_tyxtfp']" type="danger" @click="modesStopSystemFunc()">停用系统分配</el-button>
      <el-button v-if="perm['btn_ljzxyc']" type="primary" @click="doSystemCoachTaskFunc()">立即执行分配一次</el-button>
    </el-row>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
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
  </div>
</template>

<script lang="ts">
import Index from './list';

export default class EducationalBasicSetCoachDistributionAutoSet extends Index {}
</script>
