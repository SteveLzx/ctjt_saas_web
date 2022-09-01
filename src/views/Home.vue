<template>
  <div class="home">
    <el-calendar v-model="value">
    </el-calendar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Home extends Vue {
  private value = new Date();
}
</script>
<style lang="scss" scoped>

</style>
