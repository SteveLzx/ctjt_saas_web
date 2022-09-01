<template>
  <div class="ctjt_tabel_container">
    <div>
      <slot name="header"></slot>
    </div>
    <el-row
      class="options_container"
      v-if="tableData.options && tableData.options.length > 0"
    >
      <el-col :span="24">
        <slot name="reference"></slot>
        <el-button
          class="mb-18"
          v-for="(item, index) in tableData.options"
          :slot="item.slots"
          :key="index"
          :type="item.type"
          :disabled="item.disabled"
          size="mini"
          @click="optionCallback(item)"
        >
          <i v-if="item.icon" class="iconfont" v-html="item.icon"></i
          >{{ item.label }}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      ref="refsPreviewTable"
      v-loading="tableData.loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData.list"
      @selection-change="handleSelectionChange"
      @select="handleSelectClick"
      @select-all="handleSelectAllClick"
      @sort-change="handleSortChange"
      :highlight-current-row="true"
      :height="tableHeight"
      :span-method="tableData.spanMethod"
      border
      style="width: 100%"
      :show-summary="tableData.showSummary"
      :summary-method="tableData.summariesMethod"
      :cell-class-name="tableData.setCellClassName"
      @cell-click="cellClick"
    >
      <el-table-column
        v-if="tableData.selection"
        type="selection"
        :align="'center'"
        width="50"
      ></el-table-column>
      <el-table-column
        v-if="tableData.index"
        label="序号"
        type="index"
        :align="'center'"
        width="50"
        fixed="left"
        :class-name="'td_text_default'"
      ></el-table-column>
      <el-table-column
        v-if="tableData.sortIndex"
        label="序号"
        prop="nosort"
        :align="'center'"
        width="50"
        fixed="left"
        :class-name="'td_text_default'"
      ></el-table-column>
      <CtjtTableColumn
        v-for="(item, index) in tableData.labels"
        :render="item.render"
        :fixed="item.fixed"
        :align="item.align || 'center'"
        :prop="item.key"
        :label="item.label"
        :width="item.width"
        :minWidth="item.minWidth"
        :isPrice="item.isPrice"
        :show-overflow-tooltip="item.showOverflowTooltip"
        :key="`column-${index}`"
        :formatter="item.formatter"
        :sortable="item.sortable"
      >
      </CtjtTableColumn>
    </el-table>
  </div>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Emit, Watch
} from 'vue-property-decorator';
import { TableOptionsValue, VueComponentParent } from '@/type';
import CtjtTableColumn from './Column';

interface LabelsValue {
  key: string;
  label: string;
  minWidth?: number | string;
  width?: number | string;
  fixed?: string;
  showOverflowTooltip?: boolean;
  isPrice?: boolean; // 是否为价格，需要千分位符号
}

interface TableDataValue {
  _this: any;
  height: number;
  loading?: boolean;
  selection?: boolean;
  labels?: LabelsValue[];
  list?: [];
}

@Component({
  components: { CtjtTableColumn },
})
export default class CtjtTable extends Vue {
  @Prop({
    default: {},
  })
  tableData!: TableDataValue;

  @Emit('option-call')
  private optionCallback(val: TableOptionsValue) {
    return val;
  }

  @Emit('selection-change')
  private handleSelectionChange(val: []) {
    return val;
  }

  @Emit('cell-click')
  private cellClick(val: any) {
    return val;
  }

  @Emit('select-click')
  private handleSelectClick(selection: any, row: any) {
    return row;
  }

  @Emit('select-all-click')
  private handleSelectAllClick(selection: any) {
    return selection;
  }

  @Emit('sort-change')
  private handleSortChange(column: any) {
    return column;
  }

  /** 清除全选 */
  clearSelection() {
    (this.$refs.refsPreviewTable as VueComponentParent).clearSelection();
  }

  private tableHeight: number | null = null;

  @Watch('tableData.height', { immediate: true, deep: true })
  setHight() {
    this.tableHeight = this.tableData.height;
  }

  @Watch('tableData.labels', { immediate: true, deep: true })
  tableForceUpdate() {
    // 字段切换，table不重绘问题
    if (this.$refs.refsPreviewTable) {
      const _dom = (
        this.$refs.refsPreviewTable as VueComponentParent
      ).bodyWrapper.getElementsByTagName('tr')[0];
      if (_dom) {
        _dom.addEventListener(
          '',
          () => {
            // do
          },
          false
        );
        this.$nextTick(() => {
          _dom.click();
          (this.$refs.refsPreviewTable as VueComponentParent).setCurrentRow();
        });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mb-18 {
  margin-bottom: 5px !important;
}

.options_container {
  padding: 5px 14px 0;
  border: 1px solid $--color-border-split;
  border-bottom: 0;
  background: #f9fafb;
  .iconfont {
    margin-right: 8px;
  }
}
::v-deep .el-link {
  color: #409eff;
  cursor: pointer;
  width: 100%;
  span, p, div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
.text {
  color: #606266;
}
</style>
