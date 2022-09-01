<template>
  <div class="page">
    <CtjtTable :tableData="tableData"></CtjtTable>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { CtjtTable } from '@/components';
import Index from './certificate_record';

@Component({
  components: {
    CtjtTable,
  },
})
export default class CertificateRecord extends Index {}
</script>
<style lang="scss" scoped>
.page {
  padding: 25px 0px;
}
</style>
