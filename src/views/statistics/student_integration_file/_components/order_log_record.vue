<template>
  <div class="page">
    <section
      class="update_table_container"
      v-for="item in modifyTableList"
      :key="item.label"
    >
      <p style="padding: 16px 0">变更内容：</p>
      <el-table :data="item.options" border style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号"
          :align="'center'"
        ></el-table-column>
        <el-table-column prop="seq" label="订单号" :align="'center'">
        </el-table-column>
        <el-table-column
          prop="updateField"
          label="字段"
          :align="'center'"
          :formatter="formUpdateField"
        ></el-table-column>
        <el-table-column
          prop="afterField"
          label="变更前"
          :align="'center'"
          :formatter="formUpdateAfter"
        ></el-table-column>
        <el-table-column
          prop="beforeField"
          label="变更后"
          :align="'center'"
          :formatter="formUpdateBefore"
        ></el-table-column>
      </el-table>
      <p style="padding: 16px 0">{{ item.options[0] | updatedData }}</p>
    </section>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { CtjtCard } from '@/components';
import Index from './order_log_record';

@Component({
  components: {
    CtjtCard,
  },
})
export default class OrderLogRecord extends Index {}
</script>
<style lang="scss" scoped>
.page {
  padding: 25px 0px;
}
</style>
