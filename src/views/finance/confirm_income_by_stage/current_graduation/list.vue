<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <div style="color: red;">统计周期为上月26号至本月25号，每个周期只允许进行一次【确认收入】操作</div>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
    ></CtjtTable>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { SearchTable, CtjtTable } from '@/components';
import Index from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
  },
})
export default class FinanceCurrentGraduation extends Index {}
</script>
<style lang="scss" scoped>
.add_form .ctjt_form_item_class {
  width: 420px;
}
</style>
