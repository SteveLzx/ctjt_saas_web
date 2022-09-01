<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm"></SearchTable>
    <CtjtTable :tableData="tableData"></CtjtTable>
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
export default class FinanceCurrentEnrollment extends Index {}
</script>
<style lang="scss" scoped>
</style>
