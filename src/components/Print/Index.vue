<template>
  <el-drawer
    :visible="visible"
    :direction="'rtl'"
    :size="'60%'"
    :before-close="handleClose">
    <template slot="title">
      <span>打印预览： </span>
      <el-button style="margin-right: 20px;" type="primary" v-print="printObj">打印</el-button>
    </template>
    <div class="priveview_container" id="printContainerId">
      <!-- 抬头 -->
      <div class="header">深港驾培集团-深圳市广仁汽车陪驾服务有限公司</div>
      <!-- 标题 -->
      <div class="title">{{tableData.title}}</div>
      <!-- 副标题，日期 -->
      <div>
        <el-row>
          <el-col :span="18">
            <div>批次号：{{tableData.batchNo}}</div>
          </el-col>
        </el-row>
      </div>
      <!-- 表格 -->
      <CtjtTable :tableData="tableData"></CtjtTable>
      <!-- 落款 -->
      <div class="mt-20">
        <el-row>
          <el-col :span="12">
            <div>制表人：</div>
          </el-col>
          <el-col :span="12">
            <div>签收人：</div>
          </el-col>
        </el-row>
      </div>
      <!-- 时间 -->
      <div class="mt-20">
        <el-row>
          <el-col :span="12">
            <div>打印时间：{{ getNowTime() }}</div>
          </el-col>
          <el-col :span="12">
            <div>签收时间：<span class="mr-30 ml-30">年</span><span class="mr-30">月</span><span class="mr-30">日</span></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import {
  Component, Vue, Prop
} from 'vue-property-decorator';
import { CtjtTable } from '@/components';

@Component({
  components: {
    CtjtTable
  }
})
export default class CtjtPrint extends Vue {
  @Prop() visible!: boolean;

  @Prop({ default: {} }) tableData!: any

  handleClose() {
    this.$emit('update:visible', false);
  }

  /**
   * @description 获取当前时间
   */
  private getNowTime() {
    return this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
  }

  private printObj = {
    id: 'printContainerId',
  }
}
</script>
<style lang="scss" scoped>
.print_container {
  position: fixed;
  top: -1000px;
  left: -1000px;
}
.priveview_container {
    padding: 0 20px 20px;
    display: flex;
    flex-direction: column;
}

::v-deep .el-table th {
  padding: 0px;
  div.cell {
    font-size: 12px;
  }
}
::v-deep .el-table td {
  padding: 0px;
  div.cell {
    font-size: 12px;
  }
}
::v-deep .el-drawer__body{
  overflow: scroll;
}
.header {
  font-size: 14px;
  border-bottom: 1px solid #333;
}
.title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
}
.mr-30 {
  margin-right: 30px;
}
.ml-30 {
  margin-left: 30px;
}
.mt-20 {
  margin-top: 20px;
}
</style>
