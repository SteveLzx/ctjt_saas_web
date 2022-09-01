import { labelsOptionFunc } from '@/assets/js/field_set';
import {
  MARKET_ORDER_APPROVAL_REFUND_LIST_LABEL,
  MARKET_ORDER_APPROVAL_TURN_CARMODEL_LIST_LABEL,
  MARKET_ORDER_APPROVAL_TURN_CLASSTYPE_LIST_LABEL,
  MARKET_ORDER_APPROVAL_CHANGE_LIST_LABEL,
  MARKET_ORDER_APPROVAL_DELAYED_LEARNING_LIST_TABLE
} from './tablelabel';

/**
 * @description 设置列表需要展示的字段
 * @param { any[] } list 流程节点label全部列表
 * @param { string } type 流程节点
 */
export const setTableLabels = (list: any[], type: string) => labelsOptionFunc(list, type, 'market');

/**
 * @description 合并流程节点页面表格label数组
 * @param { string } type 流程节点名称
 */
export const marginTableLabels = (type: string) => {
  switch (type) {
    case 'MARKET_ORDER_APPROVAL_REFUND_LIST_LABEL':
      return MARKET_ORDER_APPROVAL_REFUND_LIST_LABEL;
    case 'MARKET_ORDER_APPROVAL_TURN_CARMODEL_LIST_LABEL':
      return MARKET_ORDER_APPROVAL_TURN_CARMODEL_LIST_LABEL;
    case 'MARKET_ORDER_APPROVAL_TURN_CLASSTYPE_LIST_LABEL':
      return MARKET_ORDER_APPROVAL_TURN_CLASSTYPE_LIST_LABEL;
    case 'MARKET_ORDER_APPROVAL_CHANGE_LIST_LABEL':
      return MARKET_ORDER_APPROVAL_CHANGE_LIST_LABEL;
    case 'MARKET_ORDER_APPROVAL_DELAYED_LEARNING_LIST_TABLE':
      return MARKET_ORDER_APPROVAL_DELAYED_LEARNING_LIST_TABLE;
    default:
      break;
  }
  return [];
};
