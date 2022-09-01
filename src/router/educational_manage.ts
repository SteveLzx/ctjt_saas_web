// 教务管理
import BasicLayout from '@/layout/Index.vue';
import AppMain from '@/layout/AppMain.vue';

export default {
  path: '/educational',
  name: 'educational',
  redirect: '/educational/coach_mg/coach_list',
  component: BasicLayout,
  meta: {
    title: '教务管理'
  },
  children: [
    {
      path: 'coach_mg',
      component: AppMain,
      meta: {
        title: '教练管理',
        icon: '&#xe678;'
      },
      children: [
        {
          path: 'coach_list',
          name: 'EducationalCoach',
          meta: {
            title: '教练列表'
          },
          component: () => import('../views/educational/coach_mg/coach_list/list.vue'),
        },
        {
          path: 'coach_list/detail',
          name: 'EducationalCoachDetail',
          meta: {
            title: '教练信息详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/coach_mg/coach_list/detail.vue'),
        },
        {
          path: 'coach_apply',
          name: 'EducationalCoachMgCoachApply',
          meta: {
            title: '教练新增审批',
          },
          component: () => import('../views/educational/coach_mg/coach_apply/list.vue'),
        },
        {
          path: 'coach_apply/detail',
          name: 'EducationalCoachMgCoachApplyDetail',
          meta: {
            title: '教练新增审批详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/coach_mg/coach_apply/detail.vue'),
        },
        {
          path: 'coach_modify',
          name: 'EducationalCoachMgCoachModify',
          meta: {
            title: '教练修改审批'
          },
          component: () => import('../views/educational/coach_mg/coach_modify/list.vue'),
        },
        {
          path: 'coach_modify/detail',
          name: 'EducationalCoachMgCoachModifyDetail',
          meta: {
            title: '教练修改审批详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/coach_mg/coach_modify/detail.vue'),
        },
        {
          path: 'coach_distribute',
          name: 'EducationalCoachMgCoachDistribute',
          meta: {
            title: '人工分配教练'
          },
          component: () => import('../views/educational/coach_mg/coach_distribute/list.vue'),
        },
        {
          path: 'coach_distribute/detail',
          name: 'EducationalCoachMgCoachDistributeDetail',
          meta: {
            title: '人工分配教练详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/coach_mg/coach_distribute/detail.vue'),
        },
        {
          path: 'teach_group_mg',
          name: 'EducationalCoachMgTeachGroupMg',
          meta: {
            title: '教学组管理'
          },
          component: () => import('../views/educational/coach_mg/teach_group_mg/list.vue'),
        },
        {
          path: 'teach_group_mg/detail',
          name: 'EducationalCoachMgTeachGroupMgDetail',
          meta: {
            title: '教学组管理详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/coach_mg/teach_group_mg/detail.vue'),
        },
      ]
    },
    {
      path: 'teach_mg',
      component: AppMain,
      meta: {
        title: '教学管理',
        icon: '&#xe660;'
      },
      children: [
        {
          path: 'student_distribution',
          name: 'EducationalTeachMgStudentDistribution',
          meta: {
            title: '学员分配记录',
          },
          component: () => import('../views/educational/teach_mg/student_distribution/list.vue'),
        },
        {
          path: 'student_learn_apply_stop',
          name: 'EducationalTeachMgStudentLearnStopApply',
          meta: {
            title: '学员暂停学车申请',
            menuHide: true
          },
          component: () => import('../views/educational/teach_mg/student_learn_apply/stop.vue'),
        },
        {
          path: 'student_learn_apply',
          name: 'EducationalTeachMgStudentLearnApply',
          meta: {
            title: '学员恢复学车申请',
            menuHide: true
          },
          component: () => import('../views/educational/teach_mg/student_learn_apply/list.vue'),
        },
        {
          path: 'coach_change_approve',
          name: 'EducationalTeachMgCoachChangeApprove',
          meta: {
            title: '变更教练审批(包含已批复）',
          },
          component: () => import('../views/educational/teach_mg/coach_change_approve/list.vue'),
        },
        {
          path: 'index_mg',
          name: 'EducationalTeachMgIndexMg',
          meta: {
            title: '指标管理',
            menuHide: true
          },
          component: () => import('../views/educational/teach_mg/index_mg/list.vue'),
        },
        {
          path: 'coach_level_set',
          name: 'EducationalTeachMgCoachLevelSet',
          meta: {
            title: '教练星级管理',
          },
          component: () => import('../views/educational/teach_mg/coach_level_set/list.vue'),
        },
      ]
    },
    {
      path: 'basic_set',
      component: AppMain,
      meta: {
        title: '教务基础设置',
        icon: '&#xe677;'
      },
      children: [
        {
          path: 'coach_teach_type_set',
          name: 'EducationalBasicSetCoachTeachtypeSet',
          meta: {
            title: '带教类型设置',
          },
          component: () => import('../views/educational/basic_set/coach_teach_type_set/list.vue'),
        },
        {
          path: 'coach_teach_cartype_set',
          name: 'EducationalBasicSetCoachTeachCartypeSet',
          meta: {
            title: '带教车型设置',
          },
          component: () => import('../views/educational/basic_set/coach_teach_cartype_set/list.vue'),
        },
        {
          path: 'stop_learn_car_set',
          name: 'EducationalBasicSetStopLearnCarSet',
          meta: {
            title: '暂停学车设置',
            menuHide: true
          },
          component: () => import('../views/educational/basic_set/stop_learn_car_set/list.vue'),
        },
        {
          path: 'coach_distribution_type_set',
          name: 'EducationalBasicSetCoachDistributionTypeSet',
          meta: {
            title: '分配教练模式设置',
          },
          component: () => import('../views/educational/basic_set/coach_distribution_type_set/list.vue'),
        },
        {
          path: 'coach_distribution_auto_set',
          name: 'EducationalBasicSetCoachDistributionAutoSet',
          meta: {
            title: '自动分配教练规则设置',
          },
          component: () => import('../views/educational/basic_set/coach_distribution_auto_set/list.vue'),
        },
        {
          path: 'coach_distribution_auto_set/detail',
          name: 'EducationalBasicSetCoachDistributionAutoSetDetail',
          meta: {
            title: '自动分配教练规则设置详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/basic_set/coach_distribution_auto_set/detail.vue'),
        },
        {
          path: 'examinroom_mg',
          name: 'EducationalBasicSetExaminroomMg',
          meta: {
            title: '考场管理',
          },
          component: () => import('../views/educational/basic_set/examinroom_mg/list.vue'),
        },
        {
          path: 'examinroom_mg/detail',
          name: 'EducationalBasicSetExaminroomMgDetail',
          meta: {
            title: '考场管理详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/basic_set/examinroom_mg/detail.vue'),
        },
        {
          path: 'field_mg',
          name: 'EducationalFieldList',
          meta: {
            title: '训练场列表',
          },
          component: () => import('../views/educational/basic_set/field_mg/list.vue'),
        },
        {
          path: 'field_mg/detail',
          name: 'EducationalFieldDetail',
          meta: {
            title: '训练场详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/educational/basic_set/field_mg/detail.vue'),
        },
      ]
    },
  ],
};
