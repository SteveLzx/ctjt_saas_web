// 营销管理路由
import BasicLayout from '@/layout/Index.vue';
import AppMain from '@/layout/AppMain.vue';

export default {
  path: '/market',
  name: 'market',
  redirect: '/market/goods/list',
  component: BasicLayout,
  meta: {
    title: '营销管理'
  },
  children: [
    {
      path: 'class',
      name: 'class',
      component: AppMain,
      meta: {
        title: '班别管理',
        icon: '&#xe679;'
      },
      children: [
        {
          path: 'name/list',
          name: 'MarketClassNameList',
          meta: {
            title: '班别管理'
          },
          component: () => import('../views/market/class/name/list.vue'),
        },
        {
          path: 'fee/list',
          name: 'MarketClassFeeList',
          meta: {
            title: '班别考试费/补考费管理'
          },
          component: () => import('../views/market/class/fee/list.vue'),
        },
        // {
        //   path: 'basics/fee/list',
        //   name: 'MarketBasicsFeeList',
        //   meta: {
        //     title: '基础费用配置'
        //   },
        //   component: () => import('../views/market/basics/fee/list.vue'),
        // },
      ]
    },
    {
      path: 'goods/list',
      name: 'MarketGoodsList',
      meta: {
        title: '商品管理',
        icon: '&#xe657;'
      },
      component: () => import('../views/market/goods/list.vue'),
    },
    {
      path: 'goods/detail',
      name: 'MarketGoodsDetail',
      meta: {
        title: '商品详情',
        menuHide: true,
        notKeepAlive: true
      },
      component: () => import('../views/market/goods/detail.vue'),
    },
    {
      path: 'goods_other/list',
      name: 'MarketOtherGoodsList',
      meta: {
        title: '其他商品管理',
        icon: '&#xe65d;'
      },
      component: () => import('../views/market/goods_other/list.vue'),
    },
    {
      path: 'order',
      name: 'order',
      component: AppMain,
      meta: {
        title: '订单管理',
        icon: '&#xe65c;'
      },
      children: [
        {
          path: 'enrollment/list',
          name: 'OrderEnrollmentList',
          meta: {
            title: '招生订单'
          },
          component: () => import('../views/order/enrollment/list.vue')
        },
        {
          path: 'enrollment/detail',
          name: 'OrderEnrollmentDetail',
          meta: {
            title: '招生订单详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/order/enrollment/detail.vue'),
        },
        {
          path: 'other/list',
          name: 'OrderOtherList',
          meta: {
            title: '其他订单管理'
          },
          component: () => import('../views/order/other/list.vue'),
        },
        {
          path: 'other/detail',
          name: 'OrderOtherDetail',
          meta: {
            title: '其他订单详情',
            menuHide: true,
            notKeepAlive: true
          },
          component: () => import('../views/order/other/detail.vue'),
        }
      ]
    },
    {
      path: 'order_approval',
      name: 'order_approval',
      component: AppMain,
      meta: {
        title: '订单审批管理',
        icon: '&#xe67f;'
      },
      children: [
        {
          path: 'change',
          name: 'MarketOrderApprovalChange',
          meta: {
            title: '订单变更申请'
          },
          component: () => import('../views/market/order_approval/change/list.vue'),
        },
        {
          path: 'change/detail',
          name: 'MarketOrderApprovalChangeDetail',
          meta: {
            title: '订单变更申请详情',
            menuHide: true,
          },
          component: () => import('../views/market/order_approval/change/detail.vue'),
        },
        {
          path: 'turn_carmodel',
          name: 'MarketOrderApprovalTurnCarmodel',
          meta: {
            title: '转车型申请'
          },
          component: () => import('../views/market/order_approval/turn_carmodel/list.vue'),
        },
        {
          path: 'turn_carmodel/detail',
          name: 'MarketOrderApprovalTurnCarmodelDetail',
          meta: {
            title: '转车型申请详情',
            menuHide: true,
          },
          component: () => import('../views/market/order_approval/turn_carmodel/detail.vue'),
        },
        {
          path: 'turn_classtype',
          name: 'MarketOrderApprovalTurnClasstype',
          meta: {
            title: '转班别申请'
          },
          component: () => import('../views/market/order_approval/turn_classtype/list.vue'),
        },
        {
          path: 'turn_classtype/detail',
          name: 'MarketOrderApprovalTurnClasstypeDetail',
          meta: {
            title: '转班别申请详情',
            menuHide: true,
          },
          component: () => import('../views/market/order_approval/turn_classtype/detail.vue'),
        },
        {
          path: 'turn_school',
          name: 'MarketOrderApprovalTurnSchool',
          meta: {
            title: '转校申请'
          },
          component: () => import('../views/market/order_approval/turn_school/list.vue'),
        },
        {
          path: 'turn_school/detail',
          name: 'MarketOrderApprovalTurnSchoolDetail',
          meta: {
            title: '转校申请详情',
            menuHide: true,
          },
          component: () => import('../views/market/order_approval/turn_school/detail.vue'),
        },
        {
          path: 'refund',
          name: 'MarketOrderApprovalRefund',
          meta: {
            title: '退费申请'
          },
          component: () => import('../views/market/order_approval/refund/list.vue'),
        },
        {
          path: 'refund/detail',
          name: 'MarketOrderApprovalRefundDetail',
          meta: {
            title: '退费申请详情',
            menuHide: true,
          },
          component: () => import('../views/market/order_approval/refund/detail.vue'),
        },
        {
          path: 'delayed_learning',
          name: 'DelayedLearningApproval',
          meta: {
            title: '延期学车申请'
          },
          component: () => import('../views/market/order_approval/delayed_learning/list.vue'),
        },
        {
          path: 'delayed_learning/detail',
          name: 'DelayedLearningApprovalDetail',
          meta: {
            title: '延期学车申请详情',
            menuHide: true,
          },
          component: () => import('../views/market/order_approval/delayed_learning/detail.vue'),
        },
      ]
    },
    {
      path: 'sxpj',
      name: 'sxpj',
      component: AppMain,
      meta: {
        title: '散学陪驾管理',
        icon: '&#xe68b;'
      },
      children: [
        {
          path: 'order',
          name: 'MarketSanXueOrderMgList',
          meta: {
            title: '散学订单管理'
          },
          component: () => import('../views/market/sanxue/order_mg/list.vue'),
        },
        {
          path: 'order/detail',
          name: 'MarketSanXueOrderMgDetail',
          meta: {
            title: '散学订单详情',
            menuHide: true,
          },
          component: () => import('../views/market/sanxue/order_mg/detail.vue'),
        },
        {
          path: 'order/change/approve',
          name: 'MarketSanXueOrderChangeApprove',
          meta: {
            title: '散学订单变更审批'
          },
          component: () => import('../views/market/sanxue/order_change_approve/list.vue'),
        },
        {
          path: 'order/change/approve/detail',
          name: 'MarketSanXueOrderChangeApproveDetail',
          meta: {
            title: '散学订单变更审批详情',
            menuHide: true,
          },
          component: () => import('../views/market/sanxue/order_change_approve/detail.vue'),
        },
        {
          path: 'cx_pj',
          name: 'MarketSanXueCxToPjMg',
          meta: {
            title: '初学转陪驾管理'
          },
          component: () => import('../views/market/sanxue/cx_pj/list.vue'),
        },
        {
          path: 'cx_pj/add',
          name: 'MarketSanXueCxToPjMgAdd',
          meta: {
            title: '转陪驾申请',
            menuHide: true,
          },
          component: () => import('../views/market/sanxue/cx_pj/add.vue'),
        },
        {
          path: 'cx_pj/edit',
          name: 'MarketSanXueCxToPjMgEdit',
          meta: {
            title: '转陪驾申请审核',
            menuHide: true,
          },
          component: () => import('../views/market/sanxue/cx_pj/edit.vue'),
        },
        {
          path: 'refund',
          name: 'MarketSanXueRefundMg',
          meta: {
            title: '散学退费管理'
          },
          component: () => import('../views/market/sanxue/refund/list.vue'),
        },
        {
          path: 'detail',
          name: 'MarketSanXueRefundMgDetail',
          meta: {
            title: '散学退费详情',
            menuHide: true,
          },
          component: () => import('../views/market/sanxue/refund/detail.vue'),
        },
        {
          path: 'scheduling/list',
          name: 'MarketSanXueSchedulingList',
          meta: {
            title: '教练排班管理'
          },
          component: () => import('../views/market/sanxue/scheduling/list.vue'),
        },
        {
          path: 'coach_rest/list',
          name: 'MarketSanXueCoachRestList',
          meta: {
            title: '教练休息时段管理'
          },
          component: () => import('../views/market/sanxue/coach_rest/list.vue'),
        },
        {
          path: 'appointment/list',
          name: 'MarketSanXueAppointmentList',
          meta: {
            title: '散学约车记录'
          },
          component: () => import('../views/market/sanxue/appointment/list.vue'),
        },
        // {
        //   path: 'student_history/list',
        //   name: 'StudentHistoryList',
        //   meta: {
        //     title: '散学学员历史库'
        //   },
        //   component: () => import('../views/market/sanxue/student_history/list.vue'),
        // },
        {
          path: 'cancel/list',
          name: 'MarketSanXueSCancelList',
          meta: {
            title: '取消学车统计'
          },
          component: () => import('../views/market/sanxue/cancel/list.vue'),
        },
        {
          path: 'teach_mg',
          name: 'MarketSanXueTeachMg',
          meta: {
            title: '散学带教管理'
          },
          component: () => import('../views/market/sanxue/teach_mg/list.vue'),
        },
        {
          path: 'car_brand_set',
          name: 'MarketSanXueCarBrandSet',
          meta: {
            title: '散学车辆品牌设置'
          },
          component: () => import('../views/market/sanxue/car_brand_set/list.vue'),
        },
      ]
    },
    {
      path: 'channel',
      name: 'channel',
      component: AppMain,
      meta: {
        title: '渠道管理',
        icon: '&#xe659;'
      },
      children: [
        {
          path: 'obtained/list',
          name: 'MarketChannelObtainedList',
          meta: {
            title: '获知途径管理'
          },
          component: () => import('../views/market/channel/obtained/list.vue'),
        },
        {
          path: 'market/list',
          name: 'MarketChannelMarketList',
          meta: {
            title: '营销渠道管理'
          },
          component: () => import('../views/market/channel/market/list.vue'),
        }
      ]
    },
    {
      path: 'market_manage',
      name: 'market_manage',
      component: AppMain,
      meta: {
        title: '营销活动管理',
        icon: '&#xe65e;'
      },
      children: [
        {
          path: 'mini_programs_poster',
          name: 'MarketMiniProgramsPoster',
          meta: {
            title: '小程序海报管理',
            icon: '&#xe65e;'
          },
          component: () => import('../views/market/activities/mini_programs_poster/list.vue'),
        },
        {
          path: 'mini_programs_tweet',
          name: 'MarketMiniProgramsTweet',
          meta: {
            title: '小程序推文管理',
            icon: '&#xe65e;'
          },
          component: () => import('../views/market/activities/mini_programs_tweet/list.vue'),
        },
        {
          path: 'activities_set',
          name: 'MarketActivitiesList',
          meta: {
            title: '活动设置',
            icon: '&#xe65e;'
          },
          component: () => import('../views/market/activities/activities_set/list.vue'),
        },
        {
          path: 'activities_set/detail',
          name: 'MarketActivitiesDetail',
          meta: {
            title: '活动详情',
            menuHide: true,
          },
          component: () => import('../views/market/activities/activities_set/detail.vue'),
        },
        {
          path: 'gift_set',
          name: 'MarketGiftSetList',
          meta: {
            title: '礼品设置',
            icon: '&#xe65e;'
          },
          component: () => import('../views/market/activities/gift_set/list.vue'),
        },
        {
          path: 'cx_pj_hours',
          name: 'MarketCxPjHoursList',
          meta: {
            title: '初学赠送陪驾学时设置',
            icon: '&#xe65e;'
          },
          component: () => import('../views/market/activities/cx_pj_hours/list.vue'),
        },
      ]
    },
    {
      path: 'store/list',
      name: 'MarketStoreList',
      meta: {
        title: '门店管理',
        icon: '&#xe661;'
      },
      component: () => import('../views/market/store/list.vue'),
    },
    {
      path: 'store/detail',
      name: 'MarketStoreDetail',
      meta: {
        title: '门店详情',
        menuHide: true,
      },
      component: () => import('../views/market/store/detail.vue'),
    },
    {
      path: 'customerService/list',
      name: 'MarketCustomerServiveList',
      meta: {
        title: '客服管理',
        icon: '&#xe65f;'
      },
      component: () => import('../views/market/customer_service/list.vue'),
    },
    {
      path: 'customerService/detail',
      name: 'MarketCustomerServiveDetail',
      meta: {
        title: '客服详情',
        menuHide: true,
      },
      component: () => import('../views/market/customer_service/detail.vue'),
    },
    {
      path: 'service_station',
      name: 'MarketServiceStationMg',
      meta: {
        title: '服务站管理',
        icon: '&#xe661;'
      },
      component: () => import('../views/market/service_station/list.vue'),
    },
    {
      path: 'service_station/detail',
      name: 'MarketServiceStationMgDetail',
      meta: {
        title: '新增服务站管理',
        menuHide: true,
      },
      component: () => import('../views/market/service_station/detail.vue'),
    },
  ]
};
