import Vue from 'vue';
import * as Sentry from '@sentry/vue'; // 错误监控
import { MessageBox, Message } from 'element-ui'; // 引入ele
import { Integrations } from '@sentry/tracing'; // 错误监控
import Print from 'vue-print-nb';
import dayjs from 'dayjs'; // 时间日期处理库
import axios from '@/assets/js/request'; // axios封装
import EleComoponent from '@/components/EleComponents'; // ele组件
import EventEmitter from '@/assets/js/emitter'; // 事件监听
import '@/assets/js/permission'; // 权限控制
import getNodePermission from '@/assets/js/get_node_permission'; // 获取页面元素权限

import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/iconfont.scss'; // 字体图标
import '@/assets/css/base.scss'; // 基础样式
import '@/assets/css/element_variables.scss'; // 覆盖elementUI样式

Vue.config.productionTip = false;

Vue.use(EleComoponent);
Vue.use(Print);

Vue.prototype.$emitter = new EventEmitter();
Vue.prototype.$http = axios;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$getPerm = getNodePermission;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// const isDev = process.env.NODE_ENV !== 'production';
// if (isDev && !window.location.href.includes('localhost')) {
//   // 错误上报sentry
//   Sentry.init({
//     Vue,
//     dsn: 'https://95adceff276b46d2b24befc33b2294e8@o975245.ingest.sentry.io/6055375',
//     integrations: [
//       new Integrations.BrowserTracing({
//         routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//         tracingOrigins: ['localhost', /^\//]
//       }),
//     ],
//     tracesSampleRate: 1.0,
//   });
// }
