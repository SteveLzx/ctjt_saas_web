<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    :size="size"
    :before-close="handleClose">
    <div class="c_container">
      <CtjtTable :tableData="{...tableOptions, ...{ list: list }}"></CtjtTable>
      <CtjtPagination
        :prop-data="pagination"
        @on-size-change="tableSizeChange"
        @on-current-change="tableCurrentChange"
      ></CtjtPagination>
    </div>
  </el-drawer>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Watch, Emit
} from 'vue-property-decorator';
import { CtjtTable, CtjtPagination } from '@/components';

const labels = [
  {
    key: 'createdName',
    label: '操作人',
    minWidth: 100
  },
  {
    key: 'event',
    label: '操作',
    minWidth: 100
  },
  {
    key: 'description',
    label: '操作结果',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 100
  },
  {
    key: 'createdTime',
    label: '操作时间',
    minWidth: 120
  },
];

@Component({
  components: { CtjtTable, CtjtPagination }
})
export default class CtjtOperationLog extends Vue {
  @Prop({ default: '日志' }) title?: string;

  @Prop({ default: 'rtl' }) direction?: string;

  @Prop({ default: '80%' }) size?: string;

  @Prop({ default: false }) show?: boolean;

  @Prop({ default: [] }) list?: Array<any>;

  @Prop({
    default: () => ({ labels })
  }) tableOptions?: any;

  @Prop({ default: () => ({ current: 1, pageSize: 10, total: 0 }) }) pagination: any;

  @Watch('show', { immediate: true })
  private watchShowFunc(newVal: boolean) {
    this.drawer = newVal;
  }

  // 展示抽屉
  private drawer = false

  // 关闭前
  private handleClose() {
    this.$emit('update:show', false);
  }

  /**
   * @description 分页切换
   * @param { number } val
   */
  @Emit('currentChange')
  private tableCurrentChange(val: number) {
    return val;
  }

  /**
   * @description 列表分页页数切换回调
   * @param { number } val
   */
  @Emit('sizeChange')
  private tableSizeChange(val: number) {
    return val;
  }
}
</script>
<style lang="scss" scoped>
.c_container {
  padding: 20px;
}
.close_icon {
  float: right;
  cursor: pointer;
}
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
}
</style>
