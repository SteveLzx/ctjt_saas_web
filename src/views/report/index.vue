<template>
  <div ref="page" v-loading="loading">
    <iframe
      :src="url"
      frameborder="0"
      :style="{ height: iframHeight + 'px' }"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { RouteMeta } from 'vue-router';

@Component
export default class RoleList extends Vue {
  loading = true;

  url = '';

  iframHeight = 0;

  async mounted() {
    this.iframHeight = (document.querySelector('#app-container') as Element).clientHeight;
    const { meta } = this.$route;
    this.url = (meta as RouteMeta).remark as string;
    if (!this.url) this.$message.error('报表未配置，请联系管理员');
    this.init();
  }

  init() {
    this.loading = true;
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.loading = false;
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
}
</style>
