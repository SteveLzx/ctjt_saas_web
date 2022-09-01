// 教务管理
import BasicLayout from '@/layout/Index.vue';
// import AppMain from '@/layout/AppMain.vue';

export default {
  path: '/workbench',
  name: 'workbench',
  redirect: '/workbench/home',
  noControl: true,
  component: BasicLayout,
  meta: {
    title: '工作台'
  },
  children: [
    {
      path: 'home',
      name: 'Home',
      meta: {
        title: '首页',
        icon: '&#xe64f;'
      },
      noControl: true,
      component: () => import('../views/Home.vue'),
    },
    // {
    //   path: 'process',
    //   component: AppMain,
    //   meta: {
    //     title: '审批中心',
    //   },
    //   children: [
    //     {
    //       path: 'wait_queue',
    //       meta: {
    //         title: '待我审批',
    //       },
    //       component: () => import('../views/workbench/process/wait_queue/list.vue'),
    //     },
    //     {
    //       path: 'over_queue',
    //       meta: {
    //         title: '我审批的',
    //       },
    //       component: () => import('../views/workbench/process/over_queue/list.vue'),
    //     },
    //     {
    //       path: 'my_queue',
    //       meta: {
    //         title: '我发起的',
    //       },
    //       component: () => import('../views/workbench/process/my_queue/list.vue'),
    //     },
    //   ]
    // },
  ],
};
