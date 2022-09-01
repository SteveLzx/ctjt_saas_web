import { Loading } from 'element-ui';
import axios from '@/assets/js/request';
import { getUUid } from '@/assets/js/common';

const OSS = require('ali-oss'); // 引入ali-oss

// 环境
const { hostname } = window.location;
let _bucket = 'ctjt-dev';
if (hostname.startsWith('saas.aicar')) _bucket = 'ctjt-release';
if (hostname.startsWith('saas.test.aicar')) _bucket = 'ctjt-test';
if (hostname.startsWith('saas.uat.aicar')) _bucket = 'ctjt-uat';

/** 请求阿里签名 */
function getAliyuncs() {
  return new Promise((resolve, reject) => {
    axios.get('/base/v1/oss/sts', {
      params: {
        RoleArn: `acs:ram::1625610608962527:role/oss-${_bucket}`,
        RoleSessionName: `oss-${_bucket}`,
      }
    }).then((res: any) => {
      resolve(res.Credentials);
    }).catch((err) => {
      reject(err);
    });
  });
}

/** 上传文件 大文件切片上传 */
export function multipartUploadAliyuncs(file: any, business: string, progress: { num: number }) {
  return new Promise((resolve, reject) => {
    const options = {
      lock: true,
      text: '正在努力上传中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    };
    const loadingInstance = Loading.service(options);
    getAliyuncs().then((res: any) => {
      const {
        SecurityToken, AccessKeyId, AccessKeySecret
      } = res;
      const client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        bucket: _bucket
      });
      // 生成uuid
      try {
        const _type = file.name.split('.')[1];
        const _fileName = `${business}/${getUUid()}.${_type}`;
        client.multipartUpload(`${_fileName}`, file, {
          async progress(p: number) {
            const _progress = parseInt(`${p * 100}`, 0);
            /* eslint-disable */
            progress.num = _progress;
            /* eslint-enable */
            if (p === 1) {
              loadingInstance.close();
              resolve(_fileName);
            }
          }
        });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    }).catch(() => {
      loadingInstance.close();
    });
  });
}

/** 上传文件 小文件直接上传 */
export function putUploadAliyuncs(file: any, business: string) {
  return new Promise((resolve, reject) => {
    const options = {
      lock: true,
      text: '正在努力上传中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    };
    const loadingInstance = Loading.service(options);
    getAliyuncs().then(async (res: any) => {
      const {
        SecurityToken, AccessKeyId, AccessKeySecret
      } = res;
      const client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        bucket: _bucket
      });
      // 生成uuid
      try {
        const _type = file.name.split('.')[1];
        const _fileName = `${getUUid()}.${_type}`;
        const result = await client.put(`${business}/${_fileName}`, file);
        resolve(result.name);
        loadingInstance.close();
      } catch (e) {
        console.log(e);
        loadingInstance.close();
        reject(e);
      }
    }).catch(() => {
      loadingInstance.close();
    });
  });
}

/** 上传文件 不区分文件类型直接上传 */
export function putAllTypeUploadAliyuncs(file: any, business: string) {
  return new Promise((resolve, reject) => {
    const options = {
      lock: true,
      text: '正在努力上传中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    };
    const loadingInstance = Loading.service(options);
    getAliyuncs().then(async (res: any) => {
      const {
        SecurityToken, AccessKeyId, AccessKeySecret
      } = res;
      const client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        bucket: _bucket
      });
      // 生成uuid
      try {
        const _type = file.name.split('.')[1];
        const _fileName = `${getUUid()}.${_type}`;
        // 区分文件类型，分别存储不同文件夹。
        const result = await client.put(`${business}/${_type}/${_fileName}`, file);
        resolve(result.name);
        loadingInstance.close();
      } catch (e) {
        console.log(e);
        loadingInstance.close();
        reject(e);
      }
    }).catch(() => {
      loadingInstance.close();
    });
  });
}

/** 删除单个文件 */
export function deleteSingleAliyuncs(link: string) {
  return new Promise((resolve, reject) => {
    getAliyuncs().then(async (res: any) => {
      const {
        SecurityToken, AccessKeyId, AccessKeySecret
      } = res;
      const client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        stsToken: SecurityToken,
        bucket: _bucket
      });
      // 指定待删除的Object的名称。Object名称需填写不包含Bucket名称在内的Object的完整路径
      const _link = link;
      await client.delete(_link);
      resolve(true);
    });
  });
}
