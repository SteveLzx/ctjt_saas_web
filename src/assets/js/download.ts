import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Loading } from 'element-ui';
import { OSS_BASEURL } from '@/assets/js/common';
import axios from '@/assets/js/request';

/**
 * 获取文件的arraybuffer格式并传入进行打包准备
 * @param url
 */
function getFile(url: any) {
  return new Promise((resolve, reject) => {
    axios.get(url, { canRepeat: true, hasUseCode: true, responseType: 'arraybuffer' } as any).then(res => {
      if (res) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch(error => {
      reject(error);
    });
  });
}

/**
 * 对取到的URI数组进行遍历请求并一起压缩下载
 * @param fileList 目标文件数组
 */
async function handleBatchDownload(fileList: any, name: string) {
  const data = fileList;
  const zip = new JSZip();
  const promises: any[] = [];
  const options = {
    lock: true,
    text: '正在努力下载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  };
  const loadingInstance = Loading.service(options);
  await data.forEach((item: any) => {
    const promiseItem = getFile(`${OSS_BASEURL}${item.url}`).then((bufferFile: any) => {
      const { fileName } = item; // 压缩包文件名
      zip.file(fileName, bufferFile, { binary: true }); // 逐个添加文件
    });
    promises.push(promiseItem);
  });
  Promise.all(promises).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content: any) => { // 生成二进制流
      FileSaver.saveAs(content, `${name}包含${data.length}个文件.zip`); // 利用file-saver保存文件
    }).finally(() => {
      loadingInstance.close();
    });
  });
}

/**
 * 下载
 * @param files 目标文件数组
 */
function download(files: any) {
  if (Array.isArray(files)) {
    handleBatchDownload(files, '批次号管理模板'); // 存储待打包的URI数组和包的名称
  } else {
    FileSaver.saveAs(`${OSS_BASEURL}${files.url}`, files.fileName);
  }
}

export default download;
