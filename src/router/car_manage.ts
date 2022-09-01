// 车辆管理
import BasicLayout from '@/layout/Index.vue';
import AppMain from '@/layout/AppMain.vue';

export default {
  path: '/vehicle',
  name: 'vehicle',
  redirect: '/vehicle/information',
  component: BasicLayout,
  meta: {
    title: '车辆管理'
  },
  children: [
    {
      path: 'info_mg',
      name: 'info_mg',
      component: AppMain,
      meta: {
        title: '车辆信息管理',
        icon: '&#xe64d;'
      },
      children: [
        {
          path: 'basis_info',
          name: 'VehicleInfoMgBasisInfo',
          meta: {
            title: '车辆基础信息管理',
            icon: '&#xe64d;'
          },
          component: () => import('../views/vehicle/info_mg/basis_info/list.vue'),
        },
        {
          path: 'basis_info/detail',
          name: 'VehicleInfoMgBasisInfoDetail',
          meta: {
            title: '车辆详情',
            menuHide: true,
          },
          component: () => import('../views/vehicle/info_mg/basis_info/detail.vue'),
        },
        {
          path: 'annual_record',
          name: 'VehicleInfoMgAnnualRecord',
          meta: {
            title: '年审记录管理',
          },
          component: () => import('../views/vehicle/info_mg/annual_record/list.vue'),
        },
        {
          path: 'fuel_diary',
          name: 'VehicleInfoMgFuelDiary',
          meta: {
            title: '加油记录管理',
          },
          component: () => import('../views/vehicle/info_mg/fuel_diary/list.vue'),
        },
      ]
    },
    {
      path: 'traffic_change_mg',
      name: 'traffic_change_mg',
      component: AppMain,
      meta: {
        title: '车务变更管理',
        icon: '&#xe64d;'
      },
      children: [
        {
          path: 'car_dispatch_set',
          name: 'VehicleTrafficChangeMgCarDispatchSet',
          meta: {
            title: '车辆调动申请',
            icon: '&#xe64d;'
          },
          component: () => import('../views/vehicle/traffic_change_mg/car_dispatch_set/list.vue'),
        },
        {
          path: 'car_park_change',
          name: 'VehicleTrafficChangeMgCarParkChange',
          meta: {
            title: '车辆停车点变更',
            icon: '&#xe64d;'
          },
          component: () => import('../views/vehicle/traffic_change_mg/car_park_change/list.vue'),
        },
      ]
    },
    {
      path: 'basicset',
      name: 'basicset',
      component: AppMain,
      meta: {
        title: '车辆基础设置',
        icon: '&#xe679;'
      },
      children: [
        {
          path: 'ownership',
          name: 'VehicleBasicsetOwnership',
          meta: {
            title: '所属权/使用机构设置'
          },
          component: () => import('../views/vehicle/basicset/ownership/list.vue'),
        },
        {
          path: 'reggovern_mg',
          name: 'VehicleBasicsetReggovernMg',
          meta: {
            title: '登记机关设置'
          },
          component: () => import('../views/vehicle/basicset/reggovern_mg/list.vue'),
        },
        {
          path: 'usenature_mg',
          name: 'VehicleBasicsetUsenatureMg',
          meta: {
            title: '使用性质管理'
          },
          component: () => import('../views/vehicle/basicset/usenature_mg/list.vue'),
        },
        {
          path: 'brand',
          name: 'VehicleBasicsetBrand',
          meta: {
            title: '车辆品牌设置'
          },
          component: () => import('../views/vehicle/basicset/brand/list.vue'),
        },
        {
          path: 'color_mg',
          name: 'VehicleBasicsetVehicleColorMg',
          meta: {
            title: '车身颜色管理'
          },
          component: () => import('../views/vehicle/basicset/vehicle_color_mg/list.vue'),
        },
        {
          path: 'insuranceInfo_mg',
          name: 'VehicleBasicsetInsuranceInfoMg',
          meta: {
            title: '保险信息管理'
          },
          component: () => import('../views/vehicle/basicset/insuranceInfo_mg/list.vue'),
        },
        {
          path: 'parking_place_mg',
          name: 'VehicleBasicsetParkingPlaceMg',
          meta: {
            title: '停车点管理'
          },
          component: () => import('../views/vehicle/basicset/parking_place_mg/list.vue'),
        },
        {
          path: 'oi_card_mg',
          name: 'VehicleBasicsetOiCardMg',
          meta: {
            title: '油卡管理'
          },
          component: () => import('../views/vehicle/basicset/oi_card_mg/list.vue'),
        },
        {
          path: 'warning_set',
          name: 'VehicleBasicsetWarningSet',
          meta: {
            title: '标准和预警设置'
          },
          component: () => import('../views/vehicle/basicset/warning_set/list.vue'),
        },
      ]
    }
  ]
};
