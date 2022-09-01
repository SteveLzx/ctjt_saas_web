import { ParamsType } from '@/type';
import { drivingSchool } from '@/assets/js/common';
import { labelsOptionFunc } from '@/assets/js/field_set';
import {
  PAPERLESS_COLLECT_LIST_LABEL,
  SITE_DELIVERY_TABLE_LIST_LABEL,
  LICENSE_RECEIPT_FORM_LIST_LABEL,
  AREA_DELIVERY_TABLE_LIST_LABEL,
  VEHICLE_APPROVAL_LIST_LABEL,
  CLASS_SITUATION_LIST_LABEL,
  REPORT_CARD_LIST_LABEL,
  APPLY_EXAM_LIST_LABEL,
  EXAM_RESULT_LIST_LABEL,
  HUIZHOU_EXAM_RESULT_LIST_LABEL,
  SUPERVISION_HOURS_LIST_LABEL,
  ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTWO,
  ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTHREE,
  EXAM_FEE_LIST_OTHER,
  EXAM_FEE_LIST_SELF,
  HUIZHOU_EXAM_FEE_LIST_OTHER,
  HUIZHOU_EXAM_FEE_LIST_SELF,
  EXAM_APPROVAL_LIST_REPLY_ERROR,
  EXAM_APPROVAL_LIST_HAS_REPLY,
  HUIZHOU_EXAM_APPROVAL_LIST_REPLY,
  CAPITAL_SUPERVERION_LIST_LABEL,
  EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE,
  EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE,
  HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE,
  HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE,
  SUBJECT_TRAINING_LIST_LABEL,
  CHANGE_INFO_LIST,
  SUPPLEMENTARY_INFO_LIST,
  SUPPLEMENTARY_INFO_DETAIL,
  FILE_FILING_LIST,
  FILE_FILING_DETAIL_LIST,
  CANCEL_INFO_LIST,
  CHANGE_STORE_APPROVAL_LIST,
  TURN_HISTORY_APPROVAL_LIST,
  EXAM_RESULTS_CHANGE_LIST,
  TRANSFER_OUT_LIST
} from './tablelabel';

import importProps from './accreditation_subject_props';
import { templateDownloadProps, huizhouTemplateDownloadProps } from './template_download';

/**
 *
 * @param selectList 选中的列表数据
 * @param formData 表单初始数据
 * @description 处理单项更新表单数据
 * @returns 处理好的表单数据
 */
function setFormDataFunc(selectList: ParamsType, formData: ParamsType) {
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

/**
 * @description 合并流程节点页面表格label数组
 * @param { string } type 流程节点名称
 */
function marginTableLabels(type: string) {
  switch (type) {
    case 'PAPERLESS_COLLECT_LIST_LABEL':
      return PAPERLESS_COLLECT_LIST_LABEL;
    case 'SITE_DELIVERY_TABLE_LIST_LABEL':
      return SITE_DELIVERY_TABLE_LIST_LABEL;
    case 'LICENSE_RECEIPT_FORM_LIST_LABEL':
      return LICENSE_RECEIPT_FORM_LIST_LABEL;
    case 'AREA_DELIVERY_TABLE_LIST_LABEL':
      return AREA_DELIVERY_TABLE_LIST_LABEL;
    case 'VEHICLE_APPROVAL_LIST_LABEL':
      return VEHICLE_APPROVAL_LIST_LABEL;
    case 'CLASS_SITUATION_LIST_LABEL':
      return CLASS_SITUATION_LIST_LABEL;
    case 'REPORT_CARD_LIST_LABEL':
      return REPORT_CARD_LIST_LABEL;
    case 'APPLY_EXAM_LIST_LABEL':
      return APPLY_EXAM_LIST_LABEL;
    case 'EXAM_RESULT_LIST_LABEL':
      return EXAM_RESULT_LIST_LABEL;
    case 'HUIZHOU_EXAM_RESULT_LIST_LABEL':
      return HUIZHOU_EXAM_RESULT_LIST_LABEL;
    case 'SUPERVISION_HOURS_LIST_LABEL':
      return SUPERVISION_HOURS_LIST_LABEL;
    case 'ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTWO':
      return ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTWO;
    case 'ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTHREE':
      return ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTHREE;
    case 'EXAM_FEE_LIST_OTHER':
      return EXAM_FEE_LIST_OTHER;
    case 'EXAM_FEE_LIST_SELF':
      return EXAM_FEE_LIST_SELF;
    case 'HUIZHOU_EXAM_FEE_LIST_OTHER':
      return HUIZHOU_EXAM_FEE_LIST_OTHER;
    case 'HUIZHOU_EXAM_FEE_LIST_SELF':
      return HUIZHOU_EXAM_FEE_LIST_SELF;
    case 'EXAM_APPROVAL_LIST_REPLY_ERROR':
      return EXAM_APPROVAL_LIST_REPLY_ERROR;
    case 'EXAM_APPROVAL_LIST_HAS_REPLY':
      return EXAM_APPROVAL_LIST_HAS_REPLY;
    case 'HUIZHOU_EXAM_APPROVAL_LIST_REPLY':
      return HUIZHOU_EXAM_APPROVAL_LIST_REPLY;
    case 'CAPITAL_SUPERVERION_LIST_LABEL':
      return CAPITAL_SUPERVERION_LIST_LABEL;
    case 'EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE':
      return EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE;
    case 'EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE':
      return EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE;
    case 'HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE':
      return HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_WAIT_ACCEPTANCE;
    case 'HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE':
      return HUIZHOU_EXAN_ACCEPTANCE_LIST_LABEL_STATUS_FAIL_ACCEPTANCE;
    case 'SUBJECT_TRAINING_LIST_LABEL':
      return SUBJECT_TRAINING_LIST_LABEL;
    case 'CHANGE_INFO_LIST':
      return CHANGE_INFO_LIST;
    case 'SUPPLEMENTARY_INFO_LIST':
      return SUPPLEMENTARY_INFO_LIST;
    case 'SUPPLEMENTARY_INFO_DETAIL':
      return SUPPLEMENTARY_INFO_DETAIL;
    case 'FILE_FILING_LIST':
      return FILE_FILING_LIST;
    case 'FILE_FILING_DETAIL_LIST':
      return FILE_FILING_DETAIL_LIST;
    case 'CANCEL_INFO_LIST':
      return CANCEL_INFO_LIST;
    case 'CHANGE_STORE_APPROVAL_LIST':
      return CHANGE_STORE_APPROVAL_LIST;
    case 'TURN_HISTORY_APPROVAL_LIST':
      return TURN_HISTORY_APPROVAL_LIST;
    case 'EXAM_RESULTS_CHANGE_LIST':
      return EXAM_RESULTS_CHANGE_LIST;
    case 'TRANSFER_OUT_LIST':
      return TRANSFER_OUT_LIST;
    default:
      break;
  }
  return [];
}

/**
 * @description 设置列表需要展示的字段
 * @param { any[] } list 流程节点label全部列表
 * @param { string } type 流程节点
 */
function setTableLabels(list: any[], type: string) {
  return labelsOptionFunc(list, type, 'accreditation');
}

/**
 * @description 获取办证数据相关配置
 * @param val 办证科目名称|办证科目code
 */
function getAccreditationProps(val: string, drivingSchoolId?: string) {
  const props: any = importProps.find((a: any) => a.label === val || a.code === val || a.label === val);
  props.drivingSchoolId = drivingSchoolId || '';
  return props;
}

/**
 * @description 获取模板下载地址
 * @param val 模板名称|模板名code
 */
function getTemplateDownloadProps(val: string, drivingSchoolId?: string) {
  // 根据驾校id判断使用哪个数据模板,不传则默认深圳广仁驾校
  let dic = 'accreditation';
  let temp = templateDownloadProps;
  if (drivingSchoolId) {
    dic = drivingSchool(drivingSchoolId) === 'huizhou' ? 'huizhou_accreditation' : 'accreditation';
    temp = drivingSchool(drivingSchoolId) === 'huizhou' ? huizhouTemplateDownloadProps : templateDownloadProps;
  }
  const props: any = temp.find((a: any) => a.label === val || a.code === val);
  props.url = props.url ? props.url.replace('{dictory}', dic) : props.url;
  return props;
}
export {
  setFormDataFunc,
  marginTableLabels,
  setTableLabels,
  getAccreditationProps,
  getTemplateDownloadProps
};
