import { labelsOptionFunc } from '@/assets/js/field_set';
import { deepClone, OSS_BASEURL } from '@/assets/js/common';
import { ParamsType } from '@/type';
import {
  POS_TERMINAL_NUMBER_MG_LIST_LABEL,
  POS_PAY_FLOW_LIST_LABEL,
  COLLECTION_FLOW_LIST_LABEL,
  BANK_TRANSFER_FLOW_LIST_LABEL,
  THIRD_PARTY_FLOW_LIST_LABEL,
  THIRD_PARTY_FLOW_LIST_LABEL_GUANGREN,
  COLLECTION_REVIEW_SET_LIST_LABEL,
  HUIZHOU_COLLECTION_REVIEW_SET_LIST_LABEL,
  EXAM_FEE_REVIEW_OTHER_LIST_LABEL,
  EXAM_FEE_REVIEW_SELF_LIST_LABEL,
  EXAM_MAKEUP_FEE_REVIEW_OTHER_LIST_LABEL,
  EXAM_MAKEUP_FEE_REVIEW_SELF_LIST_LABEL,
  COST_PRODUCTION_FEE_REVIEW_OTHER_LIST_LABEL,
  COST_PRODUCTION_FEE_REVIEW_SELF_LIST_LABEL,
  CAPITAL_SUPERVISION_REVIEW_SET_LIST_LABEL,
  RECEIPT_CHANGE_MG_LIST_LABEL,
  SYSTEM_FLOW_LIST_LABEL,
  STUDENT_REFUND_MG_LIST_LABEL,
  SANXUE_REVIEW_SET_LIST_LABEL,
  SANXUE_REFUND_MG_LIST_LABEL,
} from './tablelabel';
import templateDownloadProps from './template_download';
import schoolImageProps from './school_image';

/**
 * @description 设置列表需要展示的字段
 * @param { any[] } list 流程节点label全部列表
 * @param { string } type 流程节点
 */
export const setTableLabels = (list: any[], type: string) => labelsOptionFunc(list, type, 'finance');

/**
 * @description 合并流程节点页面表格label数组
 * @param { string } type 流程节点名称
 */
export const marginTableLabels = (type: string) => {
  switch (type) {
    case 'SYSTEM_FLOW_LIST_LABEL':
      return SYSTEM_FLOW_LIST_LABEL;
    case 'COLLECTION_FLOW_LIST_LABEL':
      return COLLECTION_FLOW_LIST_LABEL;
    case 'POS_PAY_FLOW_LIST_LABEL':
      return POS_PAY_FLOW_LIST_LABEL;
    case 'BANK_TRANSFER_FLOW_LIST_LABEL':
      return BANK_TRANSFER_FLOW_LIST_LABEL;
    case 'THIRD_PARTY_FLOW_LIST_LABEL':
      return THIRD_PARTY_FLOW_LIST_LABEL;
    case 'THIRD_PARTY_FLOW_LIST_LABEL_GUANGREN':
      return THIRD_PARTY_FLOW_LIST_LABEL_GUANGREN;
    case 'COLLECTION_REVIEW_SET_LIST_LABEL':
      return COLLECTION_REVIEW_SET_LIST_LABEL;
    case 'HUIZHOU_COLLECTION_REVIEW_SET_LIST_LABEL':
      return HUIZHOU_COLLECTION_REVIEW_SET_LIST_LABEL;
    case 'EXAM_FEE_REVIEW_OTHER_LIST_LABEL':
      return EXAM_FEE_REVIEW_OTHER_LIST_LABEL;
    case 'EXAM_FEE_REVIEW_SELF_LIST_LABEL':
      return EXAM_FEE_REVIEW_SELF_LIST_LABEL;
    case 'EXAM_MAKEUP_FEE_REVIEW_OTHER_LIST_LABEL':
      return EXAM_MAKEUP_FEE_REVIEW_OTHER_LIST_LABEL;
    case 'EXAM_MAKEUP_FEE_REVIEW_SELF_LIST_LABEL':
      return EXAM_MAKEUP_FEE_REVIEW_SELF_LIST_LABEL;
    case 'COST_PRODUCTION_FEE_REVIEW_OTHER_LIST_LABEL':
      return COST_PRODUCTION_FEE_REVIEW_OTHER_LIST_LABEL;
    case 'COST_PRODUCTION_FEE_REVIEW_SELF_LIST_LABEL':
      return COST_PRODUCTION_FEE_REVIEW_SELF_LIST_LABEL;
    case 'CAPITAL_SUPERVISION_REVIEW_SET_LIST_LABEL':
      return CAPITAL_SUPERVISION_REVIEW_SET_LIST_LABEL;
    case 'RECEIPT_CHANGE_MG_LIST_LABEL':
      return RECEIPT_CHANGE_MG_LIST_LABEL;
    case 'POS_TERMINAL_NUMBER_MG_LIST_LABEL':
      return POS_TERMINAL_NUMBER_MG_LIST_LABEL;
    case 'STUDENT_REFUND_MG_LIST_LABEL':
      return STUDENT_REFUND_MG_LIST_LABEL;
    case 'SANXUE_REVIEW_SET_LIST_LABEL':
      return SANXUE_REVIEW_SET_LIST_LABEL;
    case 'SANXUE_REFUND_MG_LIST_LABEL':
      return SANXUE_REFUND_MG_LIST_LABEL;
    default:
      break;
  }
  return [];
};

/**
* @description 获取模板下载地址
* @param val 模板名称|模板名code
*/
export function getTemplateDownloadProps(val: string) {
  const props = templateDownloadProps.find((a: any) => a.label === val || a.code === val);
  return props;
}

/**
* @description 获取驾校logo地址
* @param val 驾校名称|驾校code| 驾校type_id
*/
export function getSchoolImageProps(val: string) {
  const props: any = schoolImageProps.find((a: any) => a.label === val || a.code === val || a.id === val);
  const imgProps = deepClone(props);
  imgProps.url = `${OSS_BASEURL}${imgProps.url}`;
  return imgProps;
}
/**
 *
 * @param selectList 选中的列表数据
 * @param formData 表单初始数据
 * @description 处理单项更新表单数据
 * @returns 处理好的表单数据
 */
export function setFormDataFunc(selectList: ParamsType, formData: ParamsType) {
  const _data = JSON.parse(JSON.stringify(selectList));
  const _formData = JSON.parse(JSON.stringify(formData));
  Object.keys(formData).forEach((key) => {
    if (key === 'balance') {
      _formData[key] = _data[key] || 0;
    } else {
      _formData[key] = _data[key];
    }
  });
  return _formData;
}
