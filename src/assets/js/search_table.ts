// 列表搜索条件组件封装函数
import dayjs from 'dayjs';
import { ParamsType } from '@/type';
/**
 * @author zhixiao
 * @param { any } params 搜索查询对象
 * @returns 返回重置的对象
 * @description 重置列表搜索
 */
export function resetSearchForm(params: any) {
  const {
    inputList, selectList, selectTimeList, checkedList, autocompleteList, datePickerList
  } = params;
  if (Array.isArray(inputList)) {
    inputList.forEach((item: any) => {
      const _item = item;
      const { hasZero, type } = _item;
      if (hasZero && type === 'number') {
        _item.value = undefined;
      } else {
        _item.value = '';
      }
    });
  }

  if (Array.isArray(selectList)) {
    selectList.forEach((item: any) => {
      const _item = item;
      _item.value = '';
    });
  }

  if (Array.isArray(selectTimeList)) {
    selectTimeList.forEach((item: any) => {
      const _item = item;
      const value = _item.select.options[0].id;
      _item.select.value = value;
    });
  }

  if (Array.isArray(checkedList)) {
    checkedList.forEach((item: any) => {
      const _item = item;
      _item.value = null;
    });
  }

  if (Array.isArray(autocompleteList)) {
    autocompleteList.forEach((item: any) => {
      const _item = item;
      _item.value = null;
    });
  }

  if (Array.isArray(datePickerList)) {
    datePickerList.forEach((item: any) => {
      const _item = item;
      _item.value = '';
    });
  }

  return params;
}

/**
 * @author zhixiao
 * @param { any } params 搜索查询对象
 * @param { any } pagination 列表分页对象
 * @description 提取列表搜索条件和值
 */
export function drawSearchForm(params: any, pagination?: any) {
  const {
    inputList, selectList, selectTimeList, checkedList, datePickerList, autocompleteList, selectInputList
  } = params;

  let sendData: ParamsType = {}; // 请求参数列表
  let _formatType = 'YYYY-MM-DD HH:mm:ss'; // datetimerange

  if (pagination) {
    const { current, pageSize } = pagination;
    sendData = { ...sendData, ...{ current, pageSize } };
  }

  if (Array.isArray(inputList)) {
    inputList.forEach((item: any) => {
      const { key, value, hasZero } = item;
      if (!hasZero) {
        sendData = { ...sendData, ...{ [key]: value || null } };
      } else if (value !== undefined) {
        sendData = { ...sendData, ...{ [key]: value } };
      } else {
        sendData = { ...sendData, ...{ [key]: value || null } };
      }
    });
  }

  if (Array.isArray(selectList)) {
    selectList.forEach((item: any) => {
      const { key, value } = item;
      sendData = {
        ...sendData,
        ...{ [key]: (value === null || value === undefined || value === '') ? null : value }
      };
    });
  }

  if (Array.isArray(selectTimeList)) {
    selectTimeList.forEach((item: any) => {
      const { key, value: sValue } = item.select;
      if (key) {
        const _item = {
          [key]: sValue,
        };
        sendData = { ...sendData, ..._item };
      }
    });
  }

  if (Array.isArray(datePickerList)) {
    datePickerList.forEach((item: any) => {
      const {
        keyArr, key, value, type
      } = item;
      // 处理日期
      if (type === 'daterange' || type === 'date') _formatType = 'YYYY-MM-DD';
      if (type === 'month') _formatType = 'YYYY-MM';
      if (Array.isArray(keyArr)) {
        let _startDate = '';
        let _endDate = '';
        if (Array.isArray(value) && value.length > 0) {
          _startDate = dayjs(value[0]).format(_formatType);
          _endDate = dayjs(value[1]).format(_formatType);
        }
        const _item = {
          [keyArr[0]]: _startDate,
          [keyArr[1]]: _endDate,
        };
        sendData = { ...sendData, ..._item };
      } else {
        let _dateTime = null;
        if (value) {
          if (type === 'time') {
            _dateTime = value;
          } else {
            _dateTime = value ? dayjs(value).format(_formatType) : null;
          }
        }
        const _item = {
          [key]: _dateTime,
        };
        sendData = { ...sendData, ..._item };
      }
    });
  }

  if (Array.isArray(checkedList)) {
    checkedList.forEach((item: any) => {
      const { key, value } = item;
      sendData = { ...sendData, ...{ [key]: value ? 1 : null } };
    });
  }

  if (Array.isArray(autocompleteList)) {
    autocompleteList.forEach((item: any) => {
      const { key, value } = item;
      sendData = { ...sendData, ...{ [key]: value } };
    });
  }

  if (Array.isArray(selectInputList)) {
    selectInputList.forEach((item: any) => {
      const { select, input } = item;
      sendData = { ...sendData, ...{ [select.key]: select.value, [input.key]: input.value && input.type === 'number' ? Number(input.value) : input.value } };
    });
  }

  Object.keys(sendData).forEach((key: string) => {
    if (sendData[key] === null || sendData[key] === '') {
      delete sendData[key];
    }
  });
  return sendData;
}
