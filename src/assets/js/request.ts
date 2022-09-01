import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from 'element-ui'; // 引入ele
import { signOut } from '@/assets/js/common';
import { getToken } from './token_cookie';

// 判断什么服务器：
const { protocol, hostname } = window.location;
let _mode = 'test';
if (hostname.startsWith('saas.aicar')) _mode = 'www';
if (hostname.startsWith('saas.dev.aicar')) _mode = 'dev';
if (hostname.startsWith('saas.test.aicar')) _mode = 'test';
if (hostname.startsWith('saas.uat.aicar')) _mode = 'uat';
const _hostname = hostname.includes('aicar24') ? 'aicar24' : 'aicar365';
let publicUrl = '';
if (hostname.includes('localhost') || hostname.includes('10.11.')) {
  publicUrl = `${protocol}//${_mode}.${_hostname}.com`;
  // publicUrl = 'http://localhost';
  if (hostname.includes('57.24')) {
    publicUrl = '/api'; // zhouyu
  }
  if (hostname.includes('57.25')) {
    publicUrl = '/api'; // 李志孝
  }
} else {
  publicUrl = `${protocol}//${_mode}.${_hostname}.com`;
}

// 请求参数定义类型
interface RequestConfig extends AxiosRequestConfig {
  contentType?: string; // 可能更改的post数据类型
  canRepeat?: boolean;
  hasUseCode?: boolean; // 需要后端返回的code特俗处理错误信息
}

interface ResonseConfig extends AxiosResponse {
  config: RequestConfig
}

// 请求链接列表
let pendingAjax: string[] = [];

// 请求拦截
axios.interceptors.request.use(
  (requestConfig: RequestConfig) => {
    const config = requestConfig;
    // 防止重复提交 需要重复提交则传入canRepeat: true
    if (!config.canRepeat) {
      config.cancelToken = new axios.CancelToken(cancel => {
        const requestMsg = `${publicUrl + config.url}-${config.method}`;
        if (pendingAjax.includes(requestMsg)) {
          cancel(requestMsg);
        }
        pendingAjax.push(requestMsg);
      });
    }

    // 添加TOKEN
    config.headers.Authorization = getToken();
    // 设置POST请求数据类型
    config.headers.post['Content-Type'] = config.contentType || 'application/json;charset=utf-8';
    // 设置超时请求时间
    config.timeout = config.timeout || 3000000;
    if (config.responseType) config.headers.get['Response-Type'] = config.responseType;
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('../')) {
      config.url = publicUrl + config.url;
    }
    return config;
  },
  err => Promise.reject(err)
);

// 响应拦截
axios.interceptors.response.use(
  (response: ResonseConfig) => {
    const {
      url, method, hasUseCode, responseType
    } = response.config;
    const requestMsg = `${url}-${method}`;
    pendingAjax.splice(pendingAjax.indexOf(requestMsg), 1);
    const { code, body, msg } = response.data;
    let massage = msg;
    if (code !== 200) { // 非200状态码直接报错
      if (code === 407 || code === 401) { // 用户无权限 || 登录过期 || token失效
        signOut();
        massage = '登录失效,请重新登录';
      }

      if (responseType !== 'arraybuffer') Message.error(massage);
      if (hasUseCode) { // 需要使用到code处理时传hsaUseCode: true；返回整个数据
        return response.data;
      }
      return Promise.reject(msg);
    }
    if (hasUseCode) { // 需要使用到code处理时传hsaUseCode: true；返回整个数据
      return response.data;
    }
    return body;
  },
  error => {
    const { message } = error;
    if (message.includes('code 503') || message.includes('code 500')) {
      Message.error('服务错误，请稍后重试!');
    }
    // 取消重复请求时在请求列表中拿掉
    if (message && pendingAjax.indexOf(message) > -1) {
      pendingAjax.splice(pendingAjax.indexOf(message), 1);
    } else {
      pendingAjax = [];
    }
    const { config } = error;
    // 判断是否配置了重试
    if (!config || !config.retry) {
      pendingAjax = [];
      return Promise.reject(error);
    }
    if (!config.shouldRetry(error)) {
      return Promise.reject(error);
    }

    // 设置重置次数，默认为0
    config.__retryCount = config.__retryCount || 0;
    // 判断是否超过了重试次数
    if (config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }
    // 重试次数自增
    config.__retryCount += 1;
    // 延时处理
    const backoff = new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, config.retryDelay || 1);
    });
    // 重新发起axios请求
    return backoff.then(() => axios(config));
  }
);

export default axios;
