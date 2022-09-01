import { labelsOptionFunc } from '@/assets/js/field_set';
import {
  COACH_MG_COACH_LIST_LABEL,
  COACH_MG_TEACH_GROUP_MG_LABEL,
  COACH_MG_COACH_DISTRIBUTE_LABEL,
  COACH_MG_COACH_MODIFY_LABEL,
  TEACH_MG_STUDENT_DISTRIBUTION_LABEL,
  TEACH_MG_STUDENT_LEARN_APPLY_LABEL,
  TEACH_MG_STUDENT_LEARN_APPLY_STOP_LABEL,
  TEACH_MG_COACH_CHANGE_APPROVE_LABEL,
  BASIC_SET_COACH_TEACH_TYPE_SET_LABEL,
  BASIC_SET_COACH_DISTRIBUTION_AUTO_SET_LABEL,
  COACH_MG_COACH_APPLY_LABEL
} from './tablelabel';
/**
 * @description 设置列表需要展示的字段
 * @param { any[] } list 流程节点label全部列表
 * @param { string } type 流程节点
 */
export const setTableLabels = (list: any[], type: string) => labelsOptionFunc(list, type, 'educational');

/**
 * @description 合并流程节点页面表格label数组
 * @param { string } type 流程节点名称
 */
export const marginTableLabels = (type: string) => {
  switch (type) {
    case 'COACH_MG_COACH_LIST_LABEL':
      return COACH_MG_COACH_LIST_LABEL;
    case 'COACH_MG_TEACH_GROUP_MG_LABEL':
      return COACH_MG_TEACH_GROUP_MG_LABEL;
    case 'COACH_MG_COACH_DISTRIBUTE_LABEL':
      return COACH_MG_COACH_DISTRIBUTE_LABEL;
    case 'COACH_MG_COACH_MODIFY_LABEL':
      return COACH_MG_COACH_MODIFY_LABEL;
    case 'TEACH_MG_STUDENT_DISTRIBUTION_LABEL':
      return TEACH_MG_STUDENT_DISTRIBUTION_LABEL;
    case 'TEACH_MG_STUDENT_LEARN_APPLY_LABEL':
      return TEACH_MG_STUDENT_LEARN_APPLY_LABEL;
    case 'TEACH_MG_STUDENT_LEARN_APPLY_STOP_LABEL':
      return TEACH_MG_STUDENT_LEARN_APPLY_STOP_LABEL;
    case 'TEACH_MG_COACH_CHANGE_APPROVE_LABEL':
      return TEACH_MG_COACH_CHANGE_APPROVE_LABEL;
    case 'BASIC_SET_COACH_TEACH_TYPE_SET_LABEL':
      return BASIC_SET_COACH_TEACH_TYPE_SET_LABEL;
    case 'BASIC_SET_COACH_DISTRIBUTION_AUTO_SET_LABEL':
      return BASIC_SET_COACH_DISTRIBUTION_AUTO_SET_LABEL;
    case 'COACH_MG_COACH_APPLY_LABEL':
      return COACH_MG_COACH_APPLY_LABEL;
    default:
      break;
  }
  return [];
};

// 模板下载地址配置
const templateDownloadProps = [
  {
    url: 'templates/sass/educational/teach_group_mg/teach_group_mg.xls',
    fileName: '教学组导入模板.xls',
    label: '教学组模板',
    code: 'teach_group_mg',
  },
  {
    url: 'templates/sass/educational/coach_level_set/coach_level_set.xls',
    fileName: '教练星级管理模板导入.xls',
    label: '教练星级管理模板',
    code: 'coach_level_set',
  },
  {
    url: 'templates/sass/educational/coach_distribute/coach_distribute.xls',
    fileName: '人工分配教练模板导入.xls',
    label: '人工分配教练模板',
    code: 'coach_distribute',
  },
];

/**
 * @description 获取模板下载地址
 * @param val 模板名称|模板名code
 */
export const getTemplateDownloadProps = (val: string) => {
  const props = templateDownloadProps.find((a: any) => a.label === val || a.code === val);
  return props;
};
