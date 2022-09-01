<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        v-for="item in activeOpts"
        :key="item.name"
        :label="item.label" :name="item.name">
          <keep-alive>
            <component :is="item.name" :searchData="searchForm" :ref="`${item.name}Ref`"></component>
          </keep-alive>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang='ts'>
import Component from 'vue-class-component';
import { SearchTable } from '@/components';
import List from './list';
import poster from './components/poster.vue';
import certificate from './components/certificate.vue';

@Component({
  components: {
    SearchTable,
    poster,
    certificate
  }
})
export default class MarketMiniProgramsPoster extends List {}
</script>
