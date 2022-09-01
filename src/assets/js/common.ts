import store from '@/store/index';
import router from '@/router/index';
import { DRIVINGSCHOOL } from '@/enums';
import { removeToken } from './token_cookie';
/* eslint-enable */

type DictType = {
  name: string,
  dictList: {
    id: number,
    label: string
  }[]
}

/** 备案号 */
export const COPY_RIGHT = 'Copyright ©2021深圳市车态链网络科技有限公司&nbsp;|&nbsp;';

export const ICP = '粤ICP备 19016858号';

/** oss公共文件路径 */
const { hostname } = window.location;
const _hostname = hostname.includes('aicar24') ? 'aicar24' : 'aicar365';
let _mode = '.dev';
if (hostname.startsWith('saas.aicar')) _mode = '';
if (hostname.startsWith('saas.test.aicar')) _mode = '.test';
if (hostname.startsWith('saas.uat.aicar')) _mode = '.uat';
export const OSS_BASEURL = `https://file${_mode}.${_hostname}.com/`;
/** 价格正则表达式 */
export const REG_PRICE = /^[1-9]\d{0,5}(\.\d{1,2})?$/;

export const REG_PRICE_OR_ZONE = /^[0-9]\d{0,5}(\.\d{1,2})?$/;

/** 验证数字 */
export const REG_NUMBER = /^[0-9]*$/;

/** 验证非零的正整数正则表达式 */
export const REG_INTEGER = /^\+?[1-9][0-9]*$/;

/** 验证零和非零开头的数字正则表达式 */
export const REG_ZERO_INTEGER = /^(0|[1-9][0-9]*)$/;

/** 浮点数 */
export const REG_FLOAT_POINT_NUMBER = /^(-?\d+)(\.\d+)?$/;

/** 验证最多四位数的非零开头的正整数正则表达式 */
export const REG_FOUR_INTEGER = /^\+?[1-9][0-9]{0,3}$/;

/**  验证最多二位数的非零开头的正整数正则表达式 */
export const REG_TWO_INTEGER = /^\+?[1-9][0-9]{0,1}$/;

/** 验证最多十个字符的中文 */
export const REG_TEN_CHINESE = /^(?!_)(?!.*?_$)[\u4e00-\u9fa5]{0,10}$/;

/** 验证车牌号不能以特殊字符开头，最多输入10位 */
export const REG_LICENSEPLATE = /^(?!_)(?!.*?_$)[a-zA-Z0-9_一-龥]{0,10}$/;

/** 身份证正则表达式 */
export const REG_USERCARD = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$)/;

/** 手机号正则 */
export const REG_PHONE = /^1\d{10}$/;

/** 验证座机号正则 */
export const REG_TEL = /^\d{3,4}-\d{7,8}$/;

/** 手机或者座机都可以正则 */
export const REG_MOBILE_AND_TEL = /(^1\d{10}$)|(^\d{3,4}-\d{7,8}$)/;

/** 文件类型 图片 */
export const FILTER_IMG_TYPE = '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP';

/** 文件类型 视频 */
export const FILTER_VIDEO_TYPE = '.mp4,.mov,.MP4,.MOV';

/** 文件类型 表格 */
export const FILTER_EXCEL_TYPE = '.xlsx,.xls,.XLSX,.XLS';

/** 经纬度正则表达式 */
/* eslint-disable */
export const REG_LONGITUDE = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
/* eslint-enable */

/** 维度 */
export const REG_LATITUDE = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$/;

/** 一位小数正实数 */
export const REG_ONE_FLOAT_NUMBER = /^[0-9]+(\.[0-9]{1})?$/;

/** 一位小数大于0的保留一位小数的正实数 */
export const REG_MAX_ZERO_ONE_FLOAT_NUMBER = /^^[0-9]?\d+(\.[1-9]{1})$|^[1-9]\d*$/;

/** 最多两位小数正数 */
export const REG_TWO_FLOAT_NUMBER = /^[0-9]+(\.[0-9]{1,2})?$/;

/* eslint-disable */
/** 数字 + 英文 + — */
export const NUMBER_AND_EN_REG = /^[a-zA-Z0-9\-+_()]*$/g;
/* eslint-enable */

/**
 * 退出登录：
 * 清除token、路由、用户
 * 跳转/login
 * @export
 */
export function signOut() {
  // 清除帆软登录状态
  const frUrl = 'https://bi.aicar365.com:8443/webroot/decision/logout/cross/domain';
  const ifr = document.createElement('iframe');
  ifr.src = frUrl;
  document.getElementsByTagName('head')[0].appendChild(ifr);
  removeToken();
  localStorage.clear();
  store.commit('tagsView/RESET_VISITED_VIEW'); // 清除缓存路由
  store.commit('user/CLEAE_USERINFO'); // 清除用户数据
  store.commit('routes/CLEAE_ROUTES'); // 清除路由
  store.commit('routes/UPDATE_ADD_ROUTES', false);
  store.commit('routes/UPDATE_CURRENT_ROUTE', {}); // 清除当前路由
  store.commit('base/ADD_NODE_PERMISSION', {}); // 清除缓存的页面权限
  store.commit('base/ADD_USER_INFO', {}); // 清除用户信息
  router.push('/login');
}
/**
 * 处理下拉框选项值
 * @param data 传过来的数组对象
 * @returns map类型数据
 */
export function setDictMapData(data: DictType[]) {
  const newData: Map<string, { id: number, label: string }[]> = new Map();
  data.forEach(item => {
    const { name, dictList } = item;
    newData.set(name, dictList);
  });
  return newData;
}

/**
 * 处理或运算
 * @param val
 */
export function setOrOperation(valList: number[]): number {
  let newVal = 0;
  valList.forEach(item => {
    /* eslint-disable */
    newVal = newVal | 2 ** item;
    /* eslint-enable */
  });
  return newVal;
}

/**
 *
 * @param val 与位数
 * @param i 传入数组长度
 * @returns 返回安位与出来的数组 下标数组
 */
export function getSumOperation(val: number, i: number): number[] {
  const arr: number[] = [];
  for (let index = 0; index < i; index += 1) {
    /* eslint-disable */
    if (val & 2 ** index) {
      arr.push(index);
    }
    /* eslint-enable */
  }
  return arr;
}

/** 根据二级制流判断文件类型 */
export function getFileMimeType(file: any) {
  const typeList = ['FFD8FFE0', '89504E47', '47494638', '52494646'];
  const mimeTypeList = ['jpg', 'png', 'gif', 'webp'];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  return new Promise((resolve, reject) => {
    reader.onload = (event: any) => {
      try {
        const _arr = new Uint8Array(event.target.result);
        const _fileArr = _arr.slice(0, 4);
        const __fileArr = [..._fileArr];
        const _newTypeArr: string[] = [];
        __fileArr.forEach(item => {
          _newTypeArr.push(item.toString(16).toUpperCase().padStart(2, '0'));
        });
        const _index = typeList.indexOf(_newTypeArr.join(''));
        resolve(mimeTypeList[_index]);
      } catch (e) {
        reject(e);
      }
    };
  });
}

/** 根据身份证号码 识别性别 */
export function getUUserCardSex(UUserCard: string): number {
  if (UUserCard.length === 18) {
    const _num = parseInt(UUserCard.substr(16, 1), 0);
    const _text = _num % 2 === 1 ? 1 : 2;
    return _text;
  }
  return 0;
}

/** 根据身份证号码 识别出生日期 */
export function getUUserCardBirth(UUserCard: string): string {
  if (UUserCard.length >= 18) {
    const _data = `${UUserCard.substring(6, 10)}-${UUserCard.substring(10, 12)}-${UUserCard.substring(12, 14)}`;
    return _data;
  }
  return '未知';
}

/**
 *
 * @param data
 * @param idKey
 * @param labelKey 把数组里面指定的key 转换成统一的id label格式的key
 * @returns id label格式数组
 */
export function dataExchange(data: [], idKey: string, labelKey: string) {
  const list = JSON.parse(JSON.stringify(data));
  list.forEach((item: any) => {
    const _item = item;
    _item.id = typeof item[idKey] === 'number' ? item[idKey] : null;
    _item.label = item[labelKey];
    delete _item[labelKey];
    if (_item.children) {
      _item.children = dataExchange(_item.children, idKey, labelKey);
    }
    return _item;
  });
  return list;
}

/**
 *
 * @param data
 * @param labelData
 * @param toCH false 中文转英文，null|true 英文转中文
 * @description 表头中英文转换,
 * @returns
 */
export function labelExchange(data: [], labelData: any, toCH?: boolean) {
  const list = JSON.parse(JSON.stringify(data));
  const labelList = JSON.parse(JSON.stringify(labelData));
  const newList: any = [];
  const labelObjList: any = []; // key label 对应值obj
  labelList.forEach((item: any) => {
    const { label, key } = item;
    const _obj: any = {};
    _obj[label] = key;
    labelObjList.push(_obj);
  });
  list.forEach((item: any) => {
    const _item = item;
    const _newdata: any = {};
    labelObjList.forEach((i: any) => {
      const _key: any = Object.values(i)[0];
      const _label: any = Object.keys(i)[0];
      if (!toCH) {
        _newdata[_key] = _item[_label] === undefined ? '' : String(_item[_label]); // 中文转换成英文
      } else {
        _newdata[_label] = _item[_key] === undefined ? '' : String(_item[_key]); // 英文转中文
      }
    });
    newList.push(_newdata);
  });
  return newList;
}

/**
 * @param data
 * @description 把map格式数组转换成Array
 */
export function mapDataExChange(data: any) {
  const list = JSON.parse(JSON.stringify(data));
  const result: any = [];
  Object.keys(list).forEach(item => {
    const tempObj = {
      label: item,
      options: list[item]
    };
    result.push(tempObj);
  });
  return result;
}

/**
 * @param oriData
 * @param newData
 * @param compareKey
 * @description 获取两个数组指定key相同的交集数据
 * @returns 新的集合
 */
export function querySameData(oriData: [], newData: [], compareKey: string) {
  const result: any = [];
  oriData.forEach((item: any) => {
    const _item = item;
    newData.forEach((checkitem) => {
      if (_item[compareKey] === checkitem) {
        result.push(_item);
      }
    });
  });
  return result;
}

/**
 * @param oriData
 * @param newData
 * @param compareKey
 * @param newCompareKey
 * @description 获取两个数组指定key相同的交集数据,第二个数据是对象数组
 * @returns 新的集合
 */
export function querySameList(oriData: [], newData: [], compareKey: string, newCompareKey: string) {
  const result: any = [];
  oriData.forEach((item: any) => {
    const _item = item;
    newData.forEach((checkitem: any) => {
      if (_item[compareKey] === checkitem[newCompareKey]) {
        result.push(_item);
      }
    });
  });
  return result;
}

/**
 * @param oriData
 * @param newData
 * @param compareKey
 * @param newCompareKey
 * @description 获取数组key不相同的差异数组
 * @returns 新的集合
 */
export function queryUnionData(oriData: Array<any>, newData: Array<any>, compareKey: string) {
  const obj: any = {};
  const _data = [...oriData, ...newData];
  const list = _data.reduce((cur: any, next: any) => {
    if (obj[next[compareKey]]) {
      return cur;
    }
    obj[next[compareKey]] = true;
    cur.push(next);
    return cur;
  }, []); // 设置cur默认类型为数组，并且初始值为空的数组
  return list;
}

/** 生成uuid */
/* eslint-disable */
export function getUUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 定义一个深拷贝函数  接收目标target参数
export function deepClone(target: any) {
  // 定义一个变量
  let result: any;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target;
    } else if (target instanceof Date) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
}
/* eslint-enable */

/** 保存到 localStorage */
export function gotStorege(key: string) {
  const value = localStorage.getItem(key);
  return value;
}

/** 从localStorage拿数据 */
export function saveStorege(key: string, value: string) {
  localStorage.setItem(key, value);
}

/** js小数减法 */
export function jsReduceFunc(num1: number, num2: number): number {
  return (Math.round(num1 * 100) - Math.round(num2 * 100)) / 100;
}

/** js小数加法 */
export function jsAddFunc(num1: number, num2: number): number {
  return (Math.round(num1 * 100) + Math.round(num2 * 100)) / 100;
}

/** 防抖动函数 */
export function debounce(func: any, wait: number) {
  let timeout: any;
  return function fn(this: any, ...args: any) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/** 搜索列表是否包含某个值 */
export function searchTableKeyword(key: string, list: any) {
  if (Array.isArray(list)) {
    if (key === '' || key === null) return list;
    const _valList: any = [];
    list.forEach(item => {
      const _hasVal = Object.values(item).find(i => i === key);
      if (_hasVal !== undefined) {
        _valList.push(item);
      }
    });
    return _valList;
  }
  return [];
}

/** 判断是否是数字类型 */
export function isCustomNumber(value: any) {
  const isNumber = typeof value === 'number' && Number.isFinite(value);
  const isNumberObject = (Object.prototype.toString.apply(value) === '[object Number]');
  return isNumber || isNumberObject;
}

/** 格式化json字符串 */
export function modifyFormatJsonToObject(data: any) {
  if (data) {
    return JSON.parse(data);
  }
  return data;
}

/** 获取一个月第一天 */
export function getFirstDay(year: number, month: number) {
  const _data = new Date(year, month, 0).getDate();
  return _data;
}

/** 获取一个月最后一天 */
export function getLastDay(year: number, month: number) {
  const _data = new Date(year, month, 0).getDate();
  return _data;
}

/** 获取当前月份第一天|最后一天
 * type:1 第一天
 * type:0 最后一天
*/
export function getCurrentMonthDate(type: number) {
  const now = new Date();
  const nowYear = now.getFullYear(); // 当前年
  const nowMonth = now.getMonth(); // 当前月
  // 本月的开始时间
  const monthStartDate = new Date(nowYear, nowMonth, 1);
  // 本月的结束时间
  const monthEndDate = new Date(nowYear, nowMonth + 1, 0);
  return type === 1 ? monthStartDate : monthEndDate;
}
/*
  * 功能:实现DateAdd功能.
  * 参数:interval,字符串表达式，表示要添加的时间间隔.
  * 参数:number,数值表达式，表示要添加的时间间隔的个数.
  * 参数:date,时间对象.
  * 返回:新的时间对象.
  * let now = new Date();
  * let newDate = DateAdd( "d ",5,now);
  */
export function DateAdd(interval: string, number: number, date: any) {
  switch (interval) {
    case 'y':
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    case 'q':
      date.setMonth(date.getMonth() + number * 3);
      return date;
      break;
    case 'm':
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    case 'w':
      date.setDate(date.getDate() + number * 7);
      return date;
      break;
    case 'd':
      date.setDate(date.getDate() + number);
      return date;
      break;
    case 'h':
      date.setHours(date.getHours() + number);
      return date;
      break;
    default:
      return date;
      break;
  }
}
/**
  * 针对后台的导入成功的描述，特殊处理
  * 将string去除成功/失败的数字
  */
export function matchNumberList(str = '') {
  return str.match(/\d+/g);
}

/** 数据累加 */
export function Sum(arr: any) {
  return arr.reduce((prev: any, curr: any) => {
    const preCount = prev || 0;
    const currCount = curr || 0;
    return preCount + currCount;
  });
}

/** 判断驾校 */
export function drivingSchool(drivingSchoolId: string) {
  const list = DRIVINGSCHOOL.filter(a => a.id === drivingSchoolId);
  const school = list[0] ? list[0].label : '';
  return school;
}

export function compare(property: string) {
  return (a: any, b: any) => {
    const value1 = a[property];
    const value2 = b[property];
    return value1 - value2;
  };
}

/** 时间拼接时分秒 */
export function spliceHoursAndMinutesAndSeconds(type: number, val: string) {
  if (type === 1) return `${val} 00:00:00`;
  if (type === 2) return `${val} 23:59:59`;
  return '';
}

/** 判断后面时间是否大于前面时间 */
export function timestampSizeCompare(val1: string, val2: string) {
  return (new Date(val1).getTime() > new Date(val2).getTime());
}

/** 千分位 */
export function formatPrice(val: number | string): string {
  if (Number(val) < 0) { // 负数
    return `-${formatPrice(-Number(val))}`;
  }
  if (val === 0 || val === '0') return '0';
  if (!val) return '';
  const reg = /(?!^)(?=(\d{3})+(?:$|\.))/g;
  const str = String(val).replace(reg, ',');
  return str;
}

// 阿拉伯数字转换为简写汉字
/* eslint-disable */
export function changeNumMoneyToChinese(money: any) {
  let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
  let cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
  let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
  let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
  let cnInteger = "整"; //整数金额时后面跟的字符
  let cnIntLast = "元"; //整型完以后的单位
  let maxNum = 999999999999999.9999; //最大处理的数字
  let IntegerNum; //金额整数部分
  let DecimalNum; //金额小数部分
  let ChineseStr = ""; //输出的中文金额字符串
  let parts; //分离金额后用的数组，预定义
  let Symbol = "";//正负值标记
  if (money == "") return "";
  money = parseFloat(money);
  if (money >= maxNum) {
    alert('超出最大处理数字');
    return "";
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    return ChineseStr;
  }
  if (money < 0) {
    money = -money;
    Symbol = "负 ";
  }
  money = money.toString(); //转换为字符串
  if (money.indexOf(".") == -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split(".");
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
    let zeroCount = 0;
    let IntLen = IntegerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = IntegerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      }
      else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕
  }
  if (DecimalNum != '') { //小数部分
    let decLen = DecimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = DecimalNum.substr(i, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger;
  }
  ChineseStr = Symbol + ChineseStr;
  return ChineseStr;
}

/** 排序复合对象数据 */
export function sortCompoundObj(protoTypeName: string) {
  return function (object1: any, object2: any) { // 柯里化
    var val1 = object1[protoTypeName];
    var val2 = object2[protoTypeName];
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }
}

export function baseImg(dataurl: string) {
  const str = `data:image/jpg;base64,${dataurl}`;
  return str.replace(/[\r\n]/g, '');
}
