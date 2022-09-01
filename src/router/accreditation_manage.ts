import BasicLayout from '@/layout/Index.vue';
import AppMain from '@/layout/AppMain.vue';

export default {
  path: '/accreditation',
  name: 'accreditation',
  redirect: '/accreditation/paperless_collect/list',
  component: BasicLayout,
  meta: {
    title: '牌证管理'
  },
  children: [
    {
      path: 'student',
      name: 'student',
      component: AppMain,
      meta: {
        title: '学员办证管理',
        icon: '&#xe653;',
      },
      children: [
        {
          path: 'paperless_collect',
          name: 'PaperlessCollectList',
          meta: {
            title: '无纸化采集'
          },
          component: () => import('../views/accreditation/paperless_collect/list.vue'),
        },
        {
          path: 'site_delivery_table',
          name: 'SiteDeliveryTableList',
          meta: {
            title: '场点交表',
          },
          component: () => import('../views/accreditation/site_delivery_table/list.vue'),
        },
        {
          path: 'license_receipt_form',
          name: 'LicenseReceiptFormList',
          meta: {
            title: '牌证收表',
          },
          component: () => import('../views/accreditation/license_receipt_form/list.vue'),
        },
        // {
        //   path: 'area_delivery_table',
        //   meta: {
        //     title: '片区交表',
        //     roles: ['']
        //   },
        //   component: () => import('../views/accreditation/area_delivery_table/list.vue'),
        // },
        {
          path: 'vehicle_approval',
          name: 'VehicleApprovalList',
          meta: {
            title: '车管所送审',
          },
          component: () => import('../views/accreditation/vehicle_approval/list.vue'),
        },
        {
          path: 'exam_acceptance',
          name: 'AccreditationExamAcceptanceList',
          meta: {
            title: '考场受理',
          },
          component: () => import('../views/accreditation/exam_acceptance/list.vue'),
        },
        {
          path: 'class_situation',
          name: 'ClassSituationList',
          meta: {
            title: '上课情况',
          },
          component: () => import('../views/accreditation/class_situation/list.vue'),
        },
        // {
        //   path: 'assignment_coach',
        //   meta: {
        //     title: '分配教练',
        //   },
        //   component: () => import('../views/accreditation/assignment_coach/list.vue'),
        // },
        {
          path: 'subject_training',
          name: 'AccreditationSubjectTrainingList',
          meta: {
            title: '学科培训',
          },
          component: () => import('../views/accreditation/subject_training/list.vue'),
        },
        // {
        //   path: 'apply_exam',
        //   meta: {
        //     title: '考试报考',
        //   },
        //   component: () => import('../views/accreditation/apply_exam/list.vue'),
        // },
        {
          path: 'exam_approval',
          name: 'AccreditationExamApprovalList',
          meta: {
            title: '考试批复',
          },
          component: () => import('../views/accreditation/exam_approval/list.vue'),
        },
        {
          path: 'exam_fee',
          name: 'AccreditationExamFeeList',
          meta: {
            title: '考试交费',
          },
          component: () => import('../views/accreditation/exam_fee/list.vue'),
        },
        {
          path: 'exam_results',
          name: 'AccreditationExamResultsList',
          meta: {
            title: '考试结果',
          },
          component: () => import('../views/accreditation/exam_results/list.vue'),
        },
        {
          path: 'transfer_out',
          name: 'AccreditationTransferOut',
          meta: {
            title: '学员转出',
          },
          component: () => import('../views/accreditation/transfer_out/list.vue'),
        },
        {
          path: 'batch_number',
          name: 'AccreditationBatchNumberList',
          meta: {
            title: '批次号管理',
          },
          component: () => import('../views/accreditation/batch_number/list.vue'),
        },
        {
          path: 'batch_number/detail',
          name: 'AccreditationBatchNumberDetail',
          meta: {
            title: '批次号详情',
            menuHide: true,
          },
          component: () => import('../views/accreditation/batch_number/detail.vue'),
        },
        {
          path: 'supplementary_info',
          name: 'AccreditationSupplementaryInformation',
          meta: {
            title: '补交资料',
          },
          component: () => import('../views/accreditation/supplementary_info/list.vue'),
        },
        {
          path: 'supplementary_info/detail',
          name: 'AccreditationSupplementaryInformationDetail',
          meta: {
            title: '补交资料详情',
            menuHide: true,
          },
          component: () => import('../views/accreditation/supplementary_info/detail.vue'),
        },
        {
          path: 'report_card',
          name: 'AccreditationReportCard',
          meta: {
            title: '成绩单',
          },
          component: () => import('../views/accreditation/report_card/list.vue'),
        },
        {
          path: 'simulation_results',
          name: 'AccreditationSimulationResults',
          meta: {
            title: '斑斑模拟成绩查询',
          },
          component: () => import('../views/accreditation/simulation_results/list.vue'),
        },
        {
          path: 'file_filing',
          name: 'AccreditationFileFilingManage',
          meta: {
            title: '档案归档/退档',
          },
          component: () => import('../views/accreditation/file_filing/list.vue'),
        },
        {
          path: 'file_filing/detail',
          name: 'AccreditationFileFilingManageDetail',
          meta: {
            title: '档案归档/退档详情',
            menuHide: true
          },
          component: () => import('../views/accreditation/file_filing/detail.vue'),
        },
        // {
        //   path: 'cancel_info',
        //   name: 'AccreditationCancelInfo',
        //   meta: {
        //     title: '办证信息撤销',
        //   },
        //   component: () => import('../views/accreditation/cancel_info/list.vue'),
        // },
        // {
        //   path: 'change_info',
        //   name: 'AccreditationChangeInfo',
        //   meta: {
        //     title: '办证信息变更',
        //   },
        //   component: () => import('../views/accreditation/change_info/list.vue'),
        // },
        // {
        //   path: 'change_info/detail',
        //   name: 'AccreditationChangeInfoDetail',
        //   meta: {
        //     title: '变更详情',
        //     menuHide: true,
        //   },
        //   component: () => import('../views/accreditation/change_info/detail.vue'),
        // },
      ]
    },
    {
      path: 'capital',
      name: 'capital',
      component: AppMain,
      meta: {
        title: '资金监管管理',
        icon: '&#xe680;',
      },
      children: [
        {
          path: 'capital_supervision',
          name: 'AccreditationCapitalSupervision',
          meta: {
            title: '资金监管存入',
          },
          component: () => import('../views/accreditation/capital_supervision/list.vue'),
        },
        {
          path: 'supervision_hours',
          name: 'AccreditationSupervisionHours',
          meta: {
            title: '划拨监管学时',
          },
          component: () => import('../views/accreditation/supervision_hours/list.vue'),
        },
      ]
    },
    {
      path: 'information',
      name: 'information',
      component: AppMain,
      meta: {
        title: '信息变更管理',
        icon: '&#xe60d;',
      },
      children: [
        {
          path: 'exam_results_change',
          name: 'AccreditationExamResultsChange',
          meta: {
            title: '考试结果变更',
          },
          component: () => import('../views/accreditation/exam_results_change/list.vue'),
        },
        {
          path: 'exam_results_change/detail',
          name: 'AccreditationExamResultsChangeDetail',
          meta: {
            title: '考试结果变更详情',
            menuHide: true,
          },
          component: () => import('../views/accreditation/exam_results_change/detail.vue'),
        },
        {
          path: 'change_store_approval',
          name: 'AccreditationChangeStoreApproval',
          meta: {
            title: '转门店审批',
          },
          component: () => import('../views/accreditation/change_store_approval/list.vue'),
        },
        {
          path: 'turn_history_approval',
          name: 'AccreditationChangeInfoDetail',
          // noControl: true,
          meta: {
            title: '转历史审批',
          },
          component: () => import('../views/accreditation/turn_history_approval/list.vue'),
        },
      ]
    }
  ]
};
