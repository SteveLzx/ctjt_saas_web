<template>
  <el-drawer
    :visible="visible"
    :direction="'rtl'"
    :size="'1080px'"
    :before-close="handleClose">
    <template slot="title">
      <span>打印预览： </span>
      <el-button style="margin-right: 20px;" type="primary" v-print="printObj">打印</el-button>
    </template>
    <!-- 预览 -->
    <div class="page">
      <div class="header">学员退费付款明细表</div>
      <!-- 副标题，日期 -->
      <div class="mt-20">
        <el-row type="flex" justify="space-between">
          <div></div>
          <div>{{ getNowTime() }}</div>
        </el-row>
      </div>
      <!-- 表格 -->
      <CtjtTable :tableData="tableData"></CtjtTable>
      <!-- 落款 -->
      <div class="mt-20">
        <el-row>
          <el-col :span="8">
            <div>制表人：{{userName}}</div>
          </el-col>
          <el-col :span="8">
            <div>出纳：</div>
          </el-col>
          <el-col :span="8">
            <div>会计：</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 打印 -->
    <div class="print_container">
      <div class="priveview_container" id="printContainerId">
        <div class="flex_content">
          <div class="flex_1">
            <div class="header">学员退费付款明细表</div>
            <!-- 副标题，日期 -->
            <div class="mt-20">
              <el-row type="flex" justify="space-between">
                <div></div>
                <div>{{ getNowTime() }}</div>
              </el-row>
            </div>
            <!-- 表格 -->
            <CtjtTable :tableData="tableData"></CtjtTable>
            <!-- 落款 -->
            <div class="mt-20">
              <el-row>
                <el-col :span="8">
                  <div>制表人：{{userName}}</div>
                </el-col>
                <el-col :span="8">
                  <div>出纳：</div>
                </el-col>
                <el-col :span="8">
                  <div>会计：</div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="r_title">第一联··出纳转账</div>
        </div>
        <div class="divider_line"></div>
        <div class="flex_content">
          <div class="flex_1">
            <div class="header">学员退费付款明细表</div>
            <!-- 副标题，日期 -->
            <div class="mt-20">
              <el-row type="flex" justify="space-between">
                <div></div>
                <div>{{ getNowTime() }}</div>
              </el-row>
            </div>
            <!-- 表格 -->
            <CtjtTable :tableData="tableData"></CtjtTable>
            <!-- 落款 -->
            <div class="mt-20">
              <el-row>
                <el-col :span="8">
                  <div>制表人：{{userName}}</div>
                </el-col>
                <el-col :span="8">
                  <div>出纳：</div>
                </el-col>
                <el-col :span="8">
                  <div>会计：</div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="r_title">第二联··片区留存</div>
        </div>
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
export default class RefundPrint extends Vue {
  @Prop() visible!: boolean;

  @Prop({ default: {} }) tableData!: any

  userName = localStorage.getItem('user_name') || '管理员';

  handleClose() {
    this.$emit('update:visible', false);
  }

  /**
   * @description 获取当前时间
   */
  private getNowTime() {
    return this.$dayjs(new Date()).format('YYYY-MM-DD');
  }

  private printObj = {
    id: 'printContainerId',
  }
}
</script>
<style lang="scss" scoped>
.print_container {
  position: fixed;
  top: -10000px;
  left: -10000px;
}
.priveview_container {
    padding: 0 20px 20px;
    display: flex;
    flex-direction: column;
}

::v-deep .el-table th {
  padding: 10px 0px;
  div.cell {
    font-size: 14px;
  }
}
::v-deep .el-table td {
  padding: 10px 0px;
  div.cell {
    font-size: 14px;
  }
}
::v-deep .el-drawer__body{
  overflow: scroll;
}
.header {
  font-size: 16px;
  text-align: center;
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
.divider_line {
  width: 100%;
  border-bottom: 1px dashed #000;
  margin: 20px 0;
}
.flex_content {
  display: flex;
}
.flex_1 {
  flex-grow: 1;
}
.r_title {
  margin: 100px 8px 0;
  // height: 100%;
  letter-spacing: 14px;
  writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
  writing-mode: tb-lr;/*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
}
</style>
