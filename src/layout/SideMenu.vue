<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    style="width: 100%"
    background-color="#263237"
    text-color="#98A3AB"
    active-text-color="#fff"
    :collapse="foldMenu"
  >
    <template v-for="father in menuList">
      <el-submenu
        :index="father.path"
        :key="father.path"
        v-if="father.children && father.children.length > 0"
      >
        <template slot="title">
          <i class="iconfont" v-html="father.meta.icon"></i>
          <span>{{ father.meta && father.meta.title }}</span>
        </template>

        <div v-for="child in father.children" :key="child.path">
          <template v-if="child.children && child.children.length > 0">
            <!--three-->
            <el-submenu
              :index="child.path"
              :key="child.path"
              class="three_menu"
            >
              <template slot="title">
                <i class="iconfont" v-html="child.meta.icon"></i>
                <span>{{ child.meta && child.meta.title }}</span>
              </template>
              <router-link
                :to="{ path: `${currentParentRoute.path}/${father.path}/${child.path}/${three.path}` }"
                v-for="three in child.children"
                :key="three.path"
              >
                <el-menu-item
                  class="three_item"
                  :index="`${currentParentRoute.path}/${father.path}/${child.path}/${three.path}`"
                >
                  {{ three.meta && three.meta.title }}
                </el-menu-item>
              </router-link>
            </el-submenu>
            <!--three-->
          </template>
          <router-link
            :to="{ path: `${currentParentRoute.path}/${father.path}/${child.path}` }"
            :key="child.path"
            v-else
          >
            <el-menu-item
              :index="`${currentParentRoute.path}/${father.path}/${child.path}`"
            >
              {{ child.meta && child.meta.title }}
            </el-menu-item>
          </router-link>
        </div>
      </el-submenu>

      <router-link
        :to="{ path: `${currentParentRoute.path}/${father.path}` }"
        :key="father.path"
        v-else
      >
        <el-menu-item :index="`${currentParentRoute.path}/${father.path}`">
          <i class="iconfont" v-html="father.meta.icon"></i>
          <span slot="title">{{ father.meta && father.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
  </el-menu>
</template>
<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RouteConfig, RouteMeta } from 'vue-router';
import { deepClone } from '@/assets/js/common';

@Component
export default class SideMenu extends Vue {
  foldMenu = false;

  @State((state) => state.routes.currentParentRoute) currentParentRoute: any;

  @State((state) => state.routes.routes) routes!: Array<RouteConfig>;

  async created() {
    this.$emitter.on('foldMenu', (flag: boolean) => {
      this.foldMenu = flag;
    });
  }

  get menuList() {
    const menuChildren = this.currentParentRoute.menuChildren
      || this.filterRoutes(this.currentParentRoute.children || []);
    // 获取过一次二级菜单后保存起来，下次直接取
    this.routes.forEach((route: any) => {
      const routeCopy: any = route;
      if (route.name === this.currentParentRoute.name) {
        routeCopy.menuChildren = menuChildren;
      }
    });
    this.$store.commit('routes/UPDATE_ROUTES', this.routes);
    return menuChildren;
  }

  filterRoutes(routes: Array<RouteConfig>) {
    const menuList: Array<RouteConfig> = [];
    deepClone(routes).forEach((route: RouteConfig) => {
      const routeCopy = route;

      if (routeCopy.meta && !(routeCopy.meta as RouteMeta).menuHide) {
        if (routeCopy.children) {
          routeCopy.children = this.filterRoutes(routeCopy.children);
        }
        menuList.push(routeCopy);
      }
    });
    return menuList;
  }

  routerPush(route: RouteConfig) {
    if (route.children && route.children.length > 0) return;
    this.$router
      .push({ path: `${this.currentParentRoute.path}/${route.path}` })
      .catch((err) => console.log(err));
  }
}
</script>
<style lang="scss" scoped>
.el-scrollbar {
  height: calc(100vh - 100px);
}
.el-menu-vertical {
  width: 100%;
  overflow: scroll;
  border: 0px;
}
.el-menu {
  border: none;
}
::v-deep .el-menu-item {
  background: #1f292d;
}
.el-submenu .el-menu-item {
  background: #1f292d;
  height: 40px;
  line-height: 40px;
  // padding-left: 48px !important;
}
::v-deep .el-menu-item,
::v-deep .el-submenu__title {
  height: 40px;
  line-height: 40px;
  &:hover {
    color: #fff !important;
    .iconfont {
      color: #fff !important;
    }
  }
}
.iconfont {
  margin-right: 11px;
  font-size: 14px;
  width: 14px;
  margin-right: 10px;
}
::v-deep .el-menu-item.is-active {
  background: #67b1ff !important;
}
::v-deep .el-submenu.is-active .el-submenu__title {
  color: #fff !important;
  .iconfont {
    color: #fff !important;
  }
}
::v-deep .three_menu > .el-submenu__title {
  padding-left: 30px !important;
}
::v-deep .three_menu > .three_item {
  padding-left: 50px !important;
}
</style>
