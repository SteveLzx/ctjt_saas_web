<template>
  <div class="tags_view" style="display: flex;">
    <div class="history_btn back_btn" @click="$router.go(-1)">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="tags_ul">
      <!-- <router-link to="/workbench/home">
        <div class="router_cache" :class="{'active': '/workbench/home' === $route.path}">
          <span class="round_dot"></span>首页
        </div>
      </router-link> -->
      <span v-for="route in visitedViews" :key="route.path">
        <router-link :to="{ path: route.path, query: route.query, fullPath: route.fullPath }">
          <div class="router_cache router_cache_hover" :class="{'active': route.path === $route.path}" @contextmenu.prevent="e => mouseclick(e, route)">
            <span class="round_dot"></span>
            <span>{{route.meta.title}}</span>
            <i class="iconfont close_btn"
            v-if="route.path !== $route.path"
            @click.prevent.stop="closeTags(route)">&#xe62a;</i>
            <i class="el-icon-close" @click.prevent.stop="closeTags(route)"></i>
          </div>
        </router-link>
      </span>
    </div>
    <div class="history_btn next_btn" @click="$router.go(1)">
      <i class="el-icon-arrow-right"></i>
    </div>
    <transition name="menu">
      <ul class="context_menu" :style="{right: menuRight + 'px'}" v-if="menuRight > 0">
        <li @click="reload">刷新页面</li>
        <li @click="closeTarget">关闭当前</li>
        <li @click="closeOthers">关闭其它</li>
        <li @click="closeAll">关闭全部</li>
      </ul>
    </transition>
  </div>
</template>
<script lang='ts'>
import { State, Action, Mutation } from 'vuex-class';
import {
  Watch,
  Vue,
  Component,
  Emit
} from 'vue-property-decorator';
import { Route } from 'vue-router';

let currentRight: Route;

@Component
export default class TagsView extends Vue {
  @State(state => state.tagsView.visitedViews) visitedViews!: [];

  @Action('tagsView/delVisitedView') private delVisitedView!: (route: Route) => Route[];

  @Action('tagsView/addVisitedView') private addVisitedView!: (route: Route) => void;

  @Mutation('tagsView/RESET_VISITED_VIEW') private resetVisitedView!: () => void;

  @Watch('$route')
  routeChange(): void {
    if (this.$route.fullPath !== '/home') this.addVisitedView(this.$route);
  }

  mounted(): void {
    if (this.$route.fullPath !== '/home') this.addVisitedView(this.$route);
    const that = this;
    window.addEventListener('click', () => {
      that.menuRight = 0;
    });
  }

  async closeTags(route: Route): Promise<void> {
    this.delCache(route);
    const visitedViews: Route[] = await this.delVisitedView(route);
    if (route.path === this.$route.path) {
      this.toLastView(visitedViews);
    }
  }

  // 清除keep-alive缓存
  delCache(route: any) {
    try {
      const _list = this.findRouterList();
      this.destroyPage(_list, route);
    } catch (error) {
      console.log(error);
    }
  }

  toLastView(visitedViews: Route[]) {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView) {
      this.$router.push((latestView as Route).fullPath);
    } else {
      this.$router.push('/workbench/home');
    }
  }

  menuRight = 0;

  mouseclick(e: any, route: Route) {
    this.menuRight = document.body.clientWidth - e.clientX - 100;
    currentRight = route;
  }

  @Emit('reload')
  reload() {
    // console.log(1);
  }

  closeTarget() {
    this.closeTags(currentRight); // 关闭当前页签
  }

  closeOthers() {
    this.destroyOthers();
    this.resetVisitedView(); // 置空
    this.addVisitedView(currentRight); // 添加当前页签
    if (currentRight.fullPath !== this.$route.fullPath) { // 当前路由不是当前页签则跳转到当前页签
      this.$router.push(currentRight.fullPath);
    }
  }

  closeAll() {
    try {
      const _list = this.findRouterList();
      this.visitedViews.forEach((item: any) => {
        this.destroyPage(_list, item);
      });
    } catch (error) {
      console.log(error);
    }
    this.resetVisitedView(); // 重置
    this.$router.push('/workbench/home'); // 跳转首页
  }

  destroyOthers() {
    try {
      const _list = this.findRouterList();
      const _destroyList = this.visitedViews.filter((item: any) => item.name !== currentRight.name);
      _destroyList.forEach((item: any) => {
        this.destroyPage(_list, item);
      });
    } catch (error) {
      console.log(error);
    }
  }

  findRouterList() {
    const _list: any = [];
    try {
      if (this.$parent && this.$parent.$children) {
        let $main = null;
        for (let i = 0; i < this.$parent.$children.length; i += 1) {
          if ((this.$parent.$children[i].$el as any)._prevClass === 'el-main') {
            $main = this.$parent.$children[i];
          }
        }
        if ($main
          && $main.$children
          && $main.$children[0]
          && $main.$children[0].$vnode
          && $main.$children[0].$vnode.parent
          && $main.$children[0].$vnode.parent.componentInstance) {
          // 数组扁平化
          $main.$children.forEach((item: any) => {
          // 三级目录
            const { tag } = item.$vnode;
            if (tag.includes('-BasicView')) {
              item.$children.forEach((child: any) => {
                const { tag: childTag } = child.$vnode;
                if (childTag.includes('-BasicView')) {
                  child.$children.forEach((i: any) => {
                    _list.push(i);
                  });
                } else {
                  _list.push(child);
                }
              });
            } else {
              _list.push(item);
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    return _list;
  }

  destroyPage(list: any[], _route: any) {
    const { name } = _route;
    const { 0: routeCom } = list.filter((i: any) => i.$vnode.tag.includes(name));
    const routeVnode: any = routeCom.$vnode;
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
    routeCom.$destroy();
    const _parent = routeCom.$parent;
    if (_parent && (_parent.$el as any)._prevClass !== 'el-main' && _parent.$children && _parent.$children.length === 0) {
      routeCom.$parent.$destroy();
    }
  }
}
</script>
<style lang="scss" scoped>
.tags_view{
  box-shadow: 0px 2px 4px -3px rgba(0, 0, 0, 0.3);
  background: #fff;
  height: 36px;
  line-height: 36px;
  margin-bottom: 10px;
  position: relative;
}
.el-icon-arrow-left, .el-icon-arrow-right{
  font-size: 14px;
  color: #909399;
  font-weight: 600;
}
.history_btn{
  width: 31px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}
.back_btn{
  float: left;
  border-right: #DCDFE6 solid 1px;
}
.next_btn{
  float: right;
  border-left: #DCDFE6 solid 1px;
}
.router_cache{
  border-right: #DCDFE6 solid 1px;
  color: $--color-light_text;
  // float: left;
  display: inline-block;
  padding-right: 8px;
  cursor: pointer;
  position: relative;
  &.active {
    color: $--color-primary;
    background: #F2F7FF;
    .round_dot{
      background: #409EFF;
    }
  }
  .close_btn{
    font-size: 14px;
    position: absolute;
    right: 10px;
    display: none;
    color: $--color-danger;
  }
  .el-icon-close{
    font-size: 8px;
    padding: 10px;
    margin-right: -10px;
  }
  &.router_cache_hover:hover{
    background: $--bg-grey;
    .el-icon-close{
      opacity: 0;
    }
    &.active .el-icon-close{
      opacity: 1;
    }
    .close_btn{
      display: inline-block;
    }
  }
  &.active:hover{
    background: #F2F7FF;
  }
}
.context_menu{
  position: absolute;
  top: 20px;
  border: solid rgba(220, 223, 230, 1) 1px;
  box-shadow: 0px 2px 4px -3px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  z-index: 5;
  overflow: hidden;
  li{
    line-height: 32px;
    text-align: center;
    color: #909399;
    font-size: 14px;
    background: #fff;
    width: 88px;
    cursor: pointer;
    &.active, &:hover{
      background: #f2f7ff;
      color: #409eff;
    }
  }
}
.round_dot{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dcdfe6;
  margin: 0 8px;
}
.tags_ul {
  flex: 1;
  white-space: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar{
    width: 0px;
    height: 2px;
    opacity: 0;
    -webkit-overflow-scrolling: touch;
  }
}
.menu-enter-active{
 transition:all .2s ease-in;
 }
 .menu-leave-active {
 transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
 }
 .menu-enter, .menu-leave-to{
 transform: translateY(20px);
 opacity: 0;
 }
</style>
