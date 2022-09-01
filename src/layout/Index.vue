<template>
  <el-container class="basic_layout">
    <el-aside :width="foldMenu ? '62px' : '224px'" class="basic_aside">
      <p class="saas_tit" @click="$router.push('/workbench/home')">
        <span v-if="!foldMenu">科技驾培业务管理平台</span>
        <i v-else class="iconfont">&#xe627;</i>
      </p>
      <SideMenu/>
    </el-aside>
    <el-container>
      <el-header height="50px">
        <Header/>
      </el-header>
      <div class="float_btn" v-if="fullScreenBtn" @click="fullScreen">
        <img src="../assets/images/icon_quanping.png" alt="">
        <span class="show">网页全屏</span>
        <span class="hover">Shift+Z</span>
        <div class="close_btn" @click.stop="fullScreenBtn = false"><i class="iconfont">&#xe62b;</i></div>
      </div>
      <TagsView @reload="reload"/>
      <el-main id="container_body" v-if="!$route.path.includes('coach_system')">
        <section class="app-container" id="app-container">
          <div v-if="reloadFlag">
            <!-- <transition name="homeapp" mode="out-in"> 去除动画-->
              <keep-alive>
                <router-view :key="$route.fullPath" v-if="!$route.meta.isIframe"/>
              </keep-alive>
            <!-- </transition> -->
            <div v-for="{ meta: { component }, path } in hasOpenComponentsArr" v-show="$route.meta.isIframe && currentPath === path" :key="path" class="aaa">
              <component :key="path" :is="component" />
            </div>
          </div>
        </section>
      </el-main>
      <div id="coach_body" v-else style="min-height: calc(100vh - 125px);"></div>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  runAfterFirstMounted,
  start,
} from 'qiankun';// 微应用注册信息
import actions from '@/assets/js/qiankun_actions';
import { getToken } from '@/assets/js/token_cookie';
import {
  CtjtPagination
} from '@/components';
import { signOut } from '@/assets/js/common';
import AppMain from './AppMain.vue';
import SideMenu from './SideMenu.vue';
import Header from './Header.vue';
import TagsView from './TagsView.vue';
import './fullScreen';

@Component({
  components: {
    AppMain,
    SideMenu,
    Header,
    TagsView
  }
})
export default class BasicLayout extends Vue {
  foldMenu = false;

  reloadFlag = true; // 刷新路由

  iframeComponents: any[] = [];

  currentPath = '';

  fullScreenBtn = true;

  fullScreen() {
    /* eslint-disable */
    const ele: any = document.documentElement;
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullScreen) {
      ele.webkitRequestFullScreen((Element as any).ALLOW_KEYBOARD_INPUT);
    } else if (ele.msRequestFullscreen) {
      ele.msRequestFullscreen();
    }
    /* eslint-enable */
  }

  created() {
    this.$emitter.on('foldMenu', (flag: boolean) => {
      this.foldMenu = flag;
      this.fullScreenBtn = !flag;
    });
  }

  reload() {
    this.reloadFlag = false;
    const timer = setTimeout(() => {
      this.reloadFlag = true;
      clearTimeout(timer);
    }, 1);
  }

  mounted() {
    // 加载后获取所有iframe的页面
    const iframeComponents = this.getComponentsArr();
    iframeComponents.forEach((item) => {
      Vue.component(item.meta.name, item.component);
    });
    this.iframeComponents = iframeComponents;
    this.isOpenIframePage();
    // 以供处理缓存

    (window as any).signOut = signOut;
    // 主应用挂载组件、方法、状态方式2,传递给子应用自行挂载使用
    const globalData = {
      token: getToken(),
      components: {
        CtjtPagination
      }
    };
    let entryUrl = 'https://coach-saas.aicar365.com';
    const { href } = window.location;
    if (href.includes('localhost')) entryUrl = 'http://localhost:8070';
    if (href.includes('dev')) entryUrl = 'https://coach-saas.dev.aicar365.com';
    if (href.includes('test')) entryUrl = 'https://coach-saas.test.aicar365.com';
    registerMicroApps(
      [
        {
          name: 'coach_system',
          entry: entryUrl,
          container: '#coach_body',
          activeRule: '/coach_system',
          props: globalData
        }
      ], // 微应用注册信息
      { // 全局微应用生命周期钩子
        beforeLoad: [
          async app => {
            // console.log('before load', app.name);
          }
        ], // 挂载前回调
        beforeMount: [async app => {
          // console.log('before mount', app.name);
        }
        ], // 挂载后回调
        afterUnmount: [
          async app => {
            // console.log('after unload', app);
          }
        ] // 卸载后回调
      }
    );

    // 全局未捕获的错误处理程序
    addGlobalUncaughtErrorHandler((event: any) => {
      // console.log('异常应用信息：', JSON.stringify(event));
      const { message: msg } = event;
      if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
        // console.error('微应用加载失败，请检查应用是否可运行');
      }
    });

    // 第一个子应用挂载后需要调用的方法，比如开启一些监控或者埋没的脚本。
    runAfterFirstMounted(() => {
      // console.log('第一个微应用启动了');
    });

    start();

    actions.onGlobalStateChange((state, prevState) => {
      console.log(`主应用观察者：token 改变前的值为, ${prevState.token}`);
      console.log(`主应用观察者：登录状态发生改变，改变后的 token 的值为, ${state.token}`);
    });
  }

  // 处理iframe页面
  hasOpenComponentsArr: any[] = [];

  @Watch('$route')
  routeChange() {
    this.isOpenIframePage();
  }

  isOpenIframePage() {
    const pathSplit = this.$route.path.split('/');
    this.currentPath = pathSplit[pathSplit.length - 1];
    const target = this.iframeComponents.find(item => item.path === this.currentPath);
    if (target && !target.hasOpen) {
      this.hasOpenComponentsArr.push(target);
      target.hasOpen = true;
    }
    // if (this.hasOpenComponentsArr.length > 3) this.hasOpenComponentsArr.shift();
    // this.hasOpenComponentsArr = this.iframeComponents.filter(item => item.hasOpen);
  }

  // 找出statistics下所有是iframe的页面
  getComponentsArr() {
    const { routes } = this.$store.state.routes;
    const [statistics] = routes.filter((item: any) => item.name === 'statistics');
    if (!statistics || statistics.length === 0) return [];
    const iframeArr = statistics.children.filter((item: any) => item.meta.isIframe);
    let arr: any[] = [];
    iframeArr.forEach((item: any) => {
      arr = [...arr, ...item.children];
    });
    return arr;
  }
}

</script>

<style lang="scss" scoped>
.basic_layout{
  height: 100%;
  background: #F0F2F5;
}
.saas_tit{
  position: sticky;
  top: 0;
  z-index: 99;
  color: #fff;
  font-size: 18px;
  line-height: 50px;
  background: $--color-primary;
  text-align: center;
  white-space: nowrap;
}
.basic_aside{
  position: relative;
  background: #263237;
  box-shadow: 0px 4px 8px -3px rgba(0, 0, 0, 0.3);
  transition: 0.3s width;
}
.el-header{
  padding: 0;
  height: 56px;
  line-height: 56px;
  border-bottom: solid 1px #DCDFE6;
}
.el-main{
  padding:0 10px;
  background: #F0F2F5;
}
.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  background: #fff;
}
.app-container {
  width: 100%;
  flex: 1;
  flex-basis: auto;
  position: relative;
  min-height: calc(100vh - 125px);
  background-color:#fff;
}
/* homeapp */
.homeapp-enter-active {
  animation: moveIn 0.15s;
}
.homeapp-leave-active {
  animation: moveOut 0.15s;
}

@keyframes moveIn {
  0% {
    opacity: 0;
    transform: translateX(200px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

@keyframes moveOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-200px);
  }
}
.float_btn{
  width: 88px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15);
  position: fixed;
  right: 30px;
  top: 70px;
  font-size: 14px;
  color: #fff;
  z-index: 5;
  cursor: pointer;
  &:hover{
    .show{
      display: none;
    }
    .hover{
      display: inline-block;
    }
  }
  .hover{
    display: none;
  }
  .close_btn{
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -10px;
    right: -6px;
    background-color: rgba(0, 0, 0, 0.2);
    .iconfont{
      font-size: 8px;
    }
  }
  img{
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
}
</style>
