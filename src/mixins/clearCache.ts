/**
 * @author zhixiao
 * @description 保存详情页，清除缓存。
 */
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Route } from 'vue-router';

@Component
export default class ctjtClearCache extends Vue {
  @Action('tagsView/delVisitedView') private delVisitedView!: (route: Route) => Route[];

  /**
   * @author zhixiao
   * @description 清除缓存，销毁页面
   */
  async clearCache() {
    try {
      const routeVnode: any = this.$vnode;
      const key = routeVnode.key == null
        ? routeVnode.componentOptions.Ctor.cid + (routeVnode.componentOptions.tag ? `::${routeVnode.componentOptions.tag}` : '')
        : routeVnode.key;
      const { cache, keys } = routeVnode.parent.componentInstance;
      if (cache[key]) {
        if (keys.length) {
          const index = keys.indexOf(key);
          if (index > -1) {
            keys.splice(index, 1);
          }
        }
        delete cache[key];
      }
      await this.delVisitedView(this.$route);
      this.$destroy();
      if (this.$parent && this.$parent.$children && this.$parent.$children.length === 0) {
        this.$parent.$destroy();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
