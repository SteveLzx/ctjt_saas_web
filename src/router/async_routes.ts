// 一级路由的name字段必填
// 二级路由的name,path,icon必填
import { RouteConfig } from 'vue-router';
import marketRoutes from './market_manage'; // 营销管理
import accRoutes from './accreditation_manage'; // 牌证管理
import eduRoutes from './educational_manage'; // 教务管理
import carRoutes from './car_manage'; // 车务管理
import financeRoutes from './finance_manage'; // 财务管理
import workbenchRoutes from './workbench_manage'; // 工作台
import settings from './settings'; // 设置
import statisticsRoutes from './statistics_manage'; // 统计分析

const asyncRoutes: Array<RouteConfig> = [workbenchRoutes, marketRoutes, accRoutes, eduRoutes, carRoutes, financeRoutes, statisticsRoutes, settings];
export default asyncRoutes;
