<template>
  <div class="pagination_container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="propData.current"
      :page-sizes="propData.pageCount"
      :page-size="propData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="propData.total"
    >
    </el-pagination>
  </div>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Emit
} from 'vue-property-decorator';

interface PropDataValue {
  current?: number;
  pageSize?: number;
  total?: number;
  pageCount?:[]
}

@Component
export default class CtjtPagination extends Vue {
  @Prop({
    default: {
      current: 1,
      pageSize: 5,
      total: 0,
      pageCount: [10, 20, 30, 40, 50]
    },
    required: true,

  })
  propData!: PropDataValue;

  @Emit('on-size-change')
  handleSizeChange(val: number) {
    return val;
  }

  @Emit('on-current-change')
  handleCurrentChange(val: number) {
    return val;
  }
}
</script>
<style lang="scss" scoped>
.pagination_container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
::v-deep .el-pager {
  .number {
    font-weight: 400;
    font-size: 14px;
    color: #303133;
  }
  .active {
    color: #1989fa;
  }
}
::v-deep .el-input {
  line-height: normal;
}
</style>
