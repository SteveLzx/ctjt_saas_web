/**
 * @author zhixiao
 * @description 此方法作用于列表字段设置
 */
import { ParamsType } from '@/type';
import { gotStorege } from '@/assets/js/common';

/**
 * @description 获取字段设置Label的key
 */
export const getLabelJsonSaveKeyFunc = (name: string, type: string) => {
  const jsonData: any = {
    accreditation: require('@/views/accreditation/_json/label_key.json'),
    educational: require('@/views/educational/_json/label_key.json'),
    finance: require('@/views/finance/_json/label_key.json'),
    market: require('@/views/market/_json/label_key.json'),
    statistics: require('@/views/statistics/_json/label_key.json'),
  };
  // 获取到当前服务的所有配置对象,然后再到单个列表名称
  return jsonData[name][type];
};

/**
 * @description 设置列表需要展示的字段
 * @param { any[] } list 流程节点label全部列表
 * @param { string } type 流程节点
 */
export const labelsOptionFunc = (list: any[], type: string, name: string) => {
  const BASE_KEY = getLabelJsonSaveKeyFunc(name, type); // 当前用户存储节点key名
  // 获取用户设置节点列表字段
  const _keyList = gotStorege(BASE_KEY);
  // 判断当前用户是否设置过(字段设置）
  if (_keyList === null) {
    // 没有设置过的用户，直接显示全部字段
    return list;
  }
  // 用户设置过当前列表（字段设置），先获取那些字段
  const _list: ParamsType = [];
  const _localList = JSON.parse(_keyList);
  list.forEach((item: any) => {
    if (_localList.includes(item.key)) {
      _list.push(item);
    }
  });
  return _list;
};
