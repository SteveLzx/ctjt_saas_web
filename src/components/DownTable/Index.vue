<template>
  <CtjtTable
    class="position_container"
    :tableData="tableData"
    ref="RefCtjtCreateTable"
  ></CtjtTable>
</template>
<script lang="ts">
import LAY_EXCEL from 'lay-excel';
import {
  Vue, Component, Prop, Watch
} from 'vue-property-decorator';
import { CtjtTable } from '@/components';
import { VueComponentParent } from '@/type';
import { exportExcel } from '@/assets/js/excel';

interface LabelsValue {
  key: string;
  label: string;
  minWidth?: number | string;
  width?: number | string;
  fixed?: string;
  showOverflowTooltip?: boolean;
}

interface TableDataValue {
  _this: any;
  height: number;
  loading?: boolean;
  selection?: boolean;
  labels?: LabelsValue[];
  list?: [];
  name: string;
}

@Component({
  components: {
    CtjtTable
  },
})
export default class CtjtCreateTable extends Vue {
  @Prop({
    default: {},
  })
  tableData!: TableDataValue;

  @Watch('tableData', { immediate: true, deep: true })
  watchFormdataFunc(newVal: any) {
    const { list } = newVal;
    // 数组有数据就导出表格
    if (list.length > 0) {
      this.$nextTick(() => {
        this._getTableData();
      });
    }
  }

  /**
   * @description 调用导出函数
   */
  private async _getTableData() {
    const _dom = (this.$refs.RefCtjtCreateTable as VueComponentParent).$children[0].$el;
    // 通过table 获取表头和内容
    const _datajson = LAY_EXCEL.tableToJson(_dom);
    const { head, body } = _datajson;
    // head 会有空字符串项，需要过滤掉
    const _newHead = head[0].filter((item: any) => item !== '');
    const exportData: any = [_newHead, ...body];
    await exportExcel(exportData, this.tableData.name);
    // 清空导出列表
    this._resetField();
  }

  /**
   * @description 上传后清空对象
   */
  private _resetField() {
    const _name = this.tableData.name;
    const reserData = {
      labels: [],
      list: [],
      name: _name
    };
    this.$emit('update:tableData', reserData);
  }
}
</script>
<style lang="scss" scoped>
  .position_container {
    position: fixed;
    top: 0;
    left: 0;
    transform: translate(-10000px, -10000px);
    z-index: -1;
  }
</style>
