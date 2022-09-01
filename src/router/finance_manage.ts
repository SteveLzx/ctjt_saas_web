import { RouteConfig } from 'vue-router';
import BasicLayout from '@/layout/Index.vue';
import AppMain from '@/layout/AppMain.vue';

export default {
  path: '/finance',
  name: 'finance',
  redirect: '/finance/transaction_mg/system_flow',
  component: BasicLayout,
  meta: {
    title: '财务管理'
  },
  children: [
    {
      path: 'transaction_mg',
      component: AppMain,
      meta: {
        title: '交易管理',
        icon: '&#xe629;'
      },
      children: [
        {
          path: 'system_flow',
          name: 'FinanceSystemFlow',
          meta: {
            title: '系统交易流水管理',
          },
          component: () => import('../views/finance/transaction_mg/system_flow/list.vue'),
        },
        {
          path: 'system_flow/detail',
          name: 'FinanceSystemFlowDetail',
          meta: {
            title: '系统交易流水详情',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_mg/system_flow/detail.vue'),
        },
        {
          path: 'collection_flow',
          name: 'FinanceCollectionFlow',
          meta: {
            title: '代收交易流水管理',
          },
          component: () => import('../views/finance/transaction_mg/collection_flow/list.vue'),
        },
        {
          path: 'collection_flow/detail',
          name: 'FinanceCollectionFlowDetail',
          meta: {
            title: '代收交易流水详情',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_mg/collection_flow/detail.vue'),
        },
        {
          path: 'pos_pay_flow',
          name: 'FinancePosPayFlow',
          meta: {
            title: 'pos刷卡流水管理',
          },
          component: () => import('../views/finance/transaction_mg/pos_pay_flow/list.vue'),
        },
        {
          path: 'pos_pay_flow/detail',
          name: 'FinancePosPayFlowDetail',
          meta: {
            title: 'pos刷卡流水详情',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_mg/pos_pay_flow/detail.vue'),
        },
        {
          path: 'bank_transfer_flow',
          name: 'FinanceCollectionFlow',
          meta: {
            title: '银行转账流水管理',
          },
          component: () => import('../views/finance/transaction_mg/bank_transfer_flow/list.vue'),
        },
        {
          path: 'third_party_flow',
          name: 'FinanceThirdPartyFlow',
          meta: {
            title: '第三方交易流水管理',
          },
          component: () => import('../views/finance/transaction_mg/third_party_flow/list.vue'),
        },
      ],
    },
    {
      path: 'transaction_review',
      component: AppMain,
      meta: {
        title: '交易复核',
        icon: '&#xe67b;'
      },
      children: [
        {
          path: 'third_unmatched_manage',
          name: 'FinanceThirdUnmatchedManage',
          meta: {
            title: '第三方未匹配管理',
          },
          component: () => import('../views/finance/transaction_review/third_unmatched_manage/list.vue'),
        },
        {
          path: 'collection_review_set',
          name: 'FinanceCollectionReviewSet',
          meta: {
            title: '收款复核',
          },
          component: () => import('../views/finance/transaction_review/collection_review_set/list.vue'),
        },
        {
          path: 'sanxue_review_set',
          name: 'FinanceSanXueReviewSet',
          meta: {
            title: '代收散学复核',
          },
          // noControl: true,
          component: () => import('../views/finance/transaction_review/sanxue_review_set/list.vue'),
        },
        {
          path: 'collection_review_set/collection_detail',
          name: 'FinanceCollectionReviewSetCollection',
          meta: {
            title: '招生收款明细',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_review/collection_review_set/collection_detail.vue'),
        },
        {
          path: 'collection_review_set/sanxue_detail',
          name: 'FinanceCollectionReviewSetSanXue',
          meta: {
            title: '散学收款明细',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_review/collection_review_set/sanxue_detail.vue'),
        },
        {
          path: 'collection_review_set/flow_detail',
          name: 'FinanceCollectionReviewSetFlow',
          meta: {
            title: '招生流水明细',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_review/collection_review_set/flow_detail.vue'),
        },
        {
          path: 'collection_review_set/all_order_detail',
          name: 'FinanceAllOrderDetail',
          meta: {
            title: '实际应收金额明细/招生结转金额明细/未结转金额明细',
            menuHide: true
          },
          // noControl: true, // true:不用权限控制路由
          component: () => import('../views/finance/transaction_review/collection_review_set/all_order_detail.vue'),
        },
        {
          path: 'pay_review_set',
          component: AppMain,
          meta: {
            title: '支出复核',
            icon: ''
          },
          children: [
            {
              path: 'exam_fee_review',
              name: 'FinancepayReviewSetExamFeeReview',
              meta: {
                title: '考试费复核',
              },
              component: () => import('../views/finance/transaction_review/pay_review_set/exam_fee_review/list.vue'),
            },
            {
              path: 'exam_makeup_fee_review',
              name: 'FinancepayReviewSetExamMakeupFeeReview',
              meta: {
                title: '补考费复核',
              },
              component: () => import('../views/finance/transaction_review/pay_review_set/exam_makeup_fee_review/list.vue'),
            },
            {
              path: 'cost_production_fee_review',
              name: 'FinancepayReviewSetCostProductionFeeReview',
              meta: {
                title: '工本费复核',
              },
              component: () => import('../views/finance/transaction_review/pay_review_set/cost_production_fee_review/list.vue'),
            }
          ]
        },
        {
          path: 'capital_supervision_review_set',
          name: 'FinanceCapitalSupervisionReviewSet',
          meta: {
            title: '资金监管复核',
          },
          component: () => import('../views/finance/transaction_review/capital_supervision_review_set/list.vue'),
        },
        {
          path: 'student_refund_mg',
          name: 'FinanceStudentRefundMg',
          meta: {
            title: '学员退费管理',
          },
          component: () => import('../views/finance/transaction_review/student_refund_mg/list.vue'),
        },
        {
          path: 'student_refund_mg/detail',
          name: 'FinanceStudentRefundMgDetail',
          meta: {
            title: '学员退费明细',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_review/student_refund_mg/detail.vue'),
        },
        {
          path: 'other_fee_mg',
          name: 'FinanceOtherFeeMg',
          meta: {
            title: '其他费用管理',
          },
          component: () => import('../views/finance/transaction_review/other_fee_mg/list.vue'),
        },
        {
          path: 'other_fee_mg/detail',
          name: 'FinanceOtherFeeMgDetail',
          meta: {
            title: '其他费用明细',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_review/other_fee_mg/detail.vue'),
        },
        {
          path: 'receipt_change_mg',
          name: 'FinanceReceiptChangeMg',
          meta: {
            title: '收据变更管理',
          },
          component: () => import('../views/finance/transaction_review/receipt_change_mg/list.vue'),
        },
        {
          path: 'receipt_change_mg/detail',
          name: 'FinanceReceiptChangeMgDetail',
          meta: {
            title: '收据变更明细',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_review/receipt_change_mg/detail.vue'),
        },
        {
          path: 'sanxue_refund_mg',
          name: 'FinanceSanXueRefundMg',
          meta: {
            title: '散学退费管理',
          },
          component: () => import('../views/finance/transaction_review/sanxue_refund_mg/list.vue'),
        },
        {
          path: 'sanxue_refund_mg/detail',
          name: 'FinanceSanXueRefundMgDetail',
          meta: {
            title: '散学退费明细',
            menuHide: true
          },
          component: () => import('../views/finance/transaction_review/sanxue_refund_mg/detail.vue'),
        },
      ]
    },
    {
      path: 'confirm_income_by_stage',
      component: AppMain,
      meta: {
        title: '分阶段确认收入',
        icon: '&#xe67a;'
      },
      children: [
        {
          path: 'current_enrollment',
          name: 'FinanceCurrentEnrollment',
          meta: {
            title: '本期招生',
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_enrollment/list.vue'),
        },
        {
          path: 'current_enrollment/detail',
          name: 'FinanceCurrentEnrollmentDetail',
          meta: {
            title: '招生明细',
            menuHide: true
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_enrollment/detail.vue'),
        },
        {
          path: 'current_graduation',
          name: 'FinanceCurrentGraduation',
          meta: {
            title: '本期毕业',
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_graduation/list.vue'),
        },
        {
          path: 'current_graduation/detail',
          name: 'FinanceCurrentGraduationDetail',
          meta: {
            title: '毕业明细',
            menuHide: true
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_graduation/detail.vue'),
        },
        {
          path: 'current_graduation_fixed',
          name: 'FinanceCurrentGraduationFixed',
          meta: {
            title: '本期毕业（固化）',
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_graduation_fixed/list.vue'),
        },
        {
          path: 'current_graduation_fixed/detail',
          name: 'FinanceCurrentGraduationFixedDetail',
          meta: {
            title: '毕业明细（固化）',
            menuHide: true
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_graduation_fixed/detail.vue'),
        },
        {
          path: 'graduation_correction',
          name: 'FinanceGraduationCorrection',
          meta: {
            title: '毕业修正',
          },
          component: () => import('../views/finance/confirm_income_by_stage/graduation_correction/list.vue'),
        },
        {
          path: 'graduation_correction/detail',
          name: 'FinanceGraduationCorrectionDetail',
          meta: {
            title: '修正明细',
            menuHide: true
          },
          component: () => import('../views/finance/confirm_income_by_stage/graduation_correction/detail.vue'),
        },
        {
          path: 'graduation_correction_fixed',
          name: 'FinanceGraduationCorrectionFixed',
          meta: {
            title: '毕业修正（固化）',
          },
          component: () => import('../views/finance/confirm_income_by_stage/graduation_correction_fixed/list.vue'),
        },
        {
          path: 'graduation_correction_fixed/detail',
          name: 'FinanceGraduationCorrectionFixedDetail',
          meta: {
            title: '修正明细（固化）',
            menuHide: true
          },
          component: () => import('../views/finance/confirm_income_by_stage/graduation_correction_fixed/detail.vue'),
        },
        {
          path: 'current_refund',
          name: 'FinanceCurrentRefund',
          meta: {
            title: '本期退费',
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_refund/list.vue'),
        },
        {
          path: 'huizhou_current_refund',
          name: 'FinanceHuiZhouCurrentRefund',
          meta: {
            title: '本期退费（惠州）',
          },
          component: () => import('../views/finance/confirm_income_by_stage/huizhou_current_refund/list.vue'),
        },
        {
          path: 'other_refund',
          name: 'FinanceConfirmIncomeByStageOtherRefund',
          meta: {
            title: '其他收入确认',
          },
          component: () => import('../views/finance/confirm_income_by_stage/other_refund/list.vue'),
        },
        {
          path: 'other_refund_fixed',
          name: 'FinanceConfirmIncomeByStageOtherRefundFixed',
          meta: {
            title: '其他收入确认（固化）',
          },
          component: () => import('../views/finance/confirm_income_by_stage/other_refund_fixed/list.vue'),
        },
        {
          path: 'current_stock_and_collect',
          name: 'FinanceCurrentStockAndCollect',
          meta: {
            title: '片区库存及预收',
          },
          component: () => import('../views/finance/confirm_income_by_stage/current_stock_and_collect/list.vue'),
        },
      ]
    },
    {
      path: 'finance_basic_set',
      component: AppMain,
      meta: {
        title: '财务基础设置',
        icon: '&#xe67d;'
      },
      children: [
        {
          path: 'collection_account_mg',
          name: 'FinanceCollectionAccountMg',
          meta: {
            title: '收款账号管理',
          },
          component: () => import('../views/finance/finance_basic_set/collection_account_mg/list.vue'),
        },
        {
          path: 'pos_account_mg',
          name: 'FinancePosAccountMg',
          meta: {
            title: 'pos账号管理',
          },
          component: () => import('../views/finance/finance_basic_set/pos_account_mg/list.vue'),
        },
        {
          path: 'pos_terminal_number_mg',
          name: 'FinancePosTerminalNumberMg',
          meta: {
            title: 'pos机终端号管理',
          },
          component: () => import('../views/finance/finance_basic_set/pos_terminal_number_mg/list.vue'),
        }
      ]
    },
  ]
};
