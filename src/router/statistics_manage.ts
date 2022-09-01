// 统计分析
import BasicLayout from '@/layout/Index.vue';
import AppMain from '@/layout/AppMain.vue';
import Report from '../views/report/index.vue';

export default {
  path: '/statistics',
  name: 'statistics',
  redirect: '/statistics/student_integration_file',
  component: BasicLayout,
  meta: {
    title: '统计分析'
  },
  children: [
    {
      path: 'student_integration_file',
      name: 'StatisticsStudentIntegrationFile',
      meta: {
        title: '学员综合档案',
        icon: '&#xe676;'
      },
      component: () => import('../views/statistics/student_integration_file/list.vue'),
    },
    {
      path: 'student_integration_file/detail',
      name: 'StatisticsStudentIntegrationFileDetail',
      meta: {
        title: '学员综合档案详情',
        menuHide: true,
        notKeepAlive: true
      },
      component: () => import('../views/statistics/student_integration_file/detail.vue'),
    },
    // {
    //   path: 'marketing',
    //   meta: {
    //     title: '营销报表',
    //     icon: '&#xe64d;'
    //   },
    //   component: AppMain,
    //   children: [
    //     {
    //       path: 'exam_detail',
    //       meta: {
    //         title: '招生明细报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'trend',
    //       meta: {
    //         title: '招生趋势分析',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     }
    //   ]
    // },
    // {
    //   path: 'educational',
    //   meta: {
    //     title: '教务报表',
    //     icon: '&#xe64d;'
    //   },
    //   component: AppMain,
    //   children: [
    //     {
    //       path: 'approval_statistics',
    //       meta: {
    //         title: '批复统计报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'approval_detail',
    //       meta: {
    //         title: '批复明细报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'examination_quality',
    //       meta: {
    //         title: '考试质量分析报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'examination_detail',
    //       meta: {
    //         title: '考试明细报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'unqualified_statistics',
    //       meta: {
    //         title: '不合格次数统计报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'unqualified_detail',
    //       meta: {
    //         title: '不合格次数明细',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     }
    //   ]
    // },
    // {
    //   path: 'certificate',
    //   meta: {
    //     title: '牌证报表',
    //     icon: '&#xe64d;'
    //   },
    //   component: AppMain,
    //   children: [
    //     {
    //       path: 'expiration_alert',
    //       meta: {
    //         title: '学习证过期预警',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'handling_status',
    //       meta: {
    //         title: '办证状态统计报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'waiting_value',
    //       meta: {
    //         title: '等待值分析报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     },
    //     {
    //       path: 'stock',
    //       meta: {
    //         title: '库存分析报表',
    //         icon: '&#xe64d;'
    //       },
    //       component: Report
    //     }
    //   ]
    // }
  ]
};
