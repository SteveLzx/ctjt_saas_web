import { Loading } from 'element-ui';
import axios from '@/assets/js/request';

export default function upload(path: string, fileForm: any, progress: { num: number } = { num: 0 }) {
  return new Promise((resolve, reject) => {
    const options = {
      lock: true,
      text: '正在努力上传中，请不要关闭当前页面...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    };
    const loadingInstance = Loading.service(options);
    try {
      axios.post(path, fileForm, {
        hasUseCode: true,
        contentType: 'multipart/form-data',
        timeout: 60000,
        onUploadProgress: (progressEvent: any) => {
          const _progress = parseInt(`${((progressEvent.loaded) / (progressEvent.total)) * 100}`, 0);
          /* eslint-disable */
          progress.num = _progress;
          /* eslint-enable */
        }
      } as any)
        .then((res: any) => {
          if (res.code === 200) {
            resolve(res);
          } else {
            reject(res);
          }
          /* eslint-disable */
          progress.num = 0;
          /* eslint-enable */
          loadingInstance.close();
        }).catch(() => {
          /* eslint-disable */
          progress.num = 0;
          /* eslint-enable */
          loadingInstance.close();
        });
    } catch (e) {
      loadingInstance.close();
      reject(e);
    }
  });
}
