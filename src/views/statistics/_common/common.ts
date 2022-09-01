import { labelsOptionFunc } from '@/assets/js/field_set';
import { ParamsType } from '@/type';
import {
  STUDENT_INTEGRATION_FILE_LIST_LABEL,
  HUIZHOU_STUDENT_INTEGRATION_FILE_LIST_LABEL,
} from './tablelabel';

/**
 * @description 设置列表需要展示的字段
 * @param { any[] } list 流程节点label全部列表
 * @param { string } type 流程节点
 */
export const setTableLabels = (list: any[], type: string) => labelsOptionFunc(list, type, 'statistics');

/**
 * @description 合并流程节点页面表格label数组
 * @param { string } type 流程节点名称
 */
export const marginTableLabels = (type: string) => {
  switch (type) {
    case 'STUDENT_INTEGRATION_FILE_LIST_LABEL':
      return STUDENT_INTEGRATION_FILE_LIST_LABEL;
    case 'HUIZHOU_STUDENT_INTEGRATION_FILE_LIST_LABEL':
      return HUIZHOU_STUDENT_INTEGRATION_FILE_LIST_LABEL;
    default:
      break;
  }
  return [];
};

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
