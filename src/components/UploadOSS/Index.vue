<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    action="#"
    :http-request="uploadImgOssFunc"
    :before-upload="beforeImgUploadFunc"
    :multiple="propConfig.multiple || false"
    :file-list="propConfig.fileList"
    :show-file-list="false"
    :limit="propConfig.limit"
    :accept="fileAccept"
    :on-exceed="handleExceed"
  >
    <slot name="content"></slot>
    <el-progress v-if="progress.num" :percentage="progress.num"></el-progress>
    <template #tip>
      <div>{{propConfig.tips}}</div>
    </template>
  </el-upload>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Watch
} from 'vue-property-decorator';
import { FILTER_IMG_TYPE, FILTER_VIDEO_TYPE } from '@/assets/js/common';
import { putUploadAliyuncs, multipartUploadAliyuncs } from '@/assets/js/upload_oss';

interface PropConfigValue {
  haveVideo?: boolean;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  limit: number;
  tips?: string;
  business?: string;
  fileList?: [];
  size?: number;
  proportion?: number;
}

@Component
export default class CtjtUpload extends Vue {
  @Prop({
    default: {
      limit: 1,
      haveVideo: false,
      fileList: []
    }
  }) propConfig!: PropConfigValue;

  type = ''; // 文件类型

  fileAccept = ''; // 限制上传文件格式

  @Watch('propConfig', { immediate: true, deep: true })
  hadleAcceptFunc(val: PropConfigValue) {
    const { haveVideo } = val;
    const _imgType = FILTER_IMG_TYPE;
    const _videoType = FILTER_VIDEO_TYPE;
    this.fileAccept = haveVideo ? `${_imgType},${_videoType}` : _imgType;
  }

  progress: { num: number } = { num: 0 };

  @Watch('progress', { immediate: true, deep: true })
  hadleProgressFunc(val: { num: number }) {
    return val;
  }

  // 超出最大上传文件个数
  handleExceed() {
    this.$message.warning(`当前限制选择${this.propConfig.limit}个文件`);
    return true;
  }

  /**
   * 上传之前调用方法
   */
  async beforeImgUploadFunc(file: any) {
    const {
      haveVideo, proportion, size: psize
    } = this.propConfig;
    // 允许上传图片的类型
    const { type, size } = file;
    let flag = true;
    if (type) {
      const isIMG = type.includes('image');
      const isVideo = type.includes('video');
      if (isIMG) {
        // 判断文件格式
        const _imgType = FILTER_IMG_TYPE;
        if (!_imgType.includes(type.split('/')[1])) {
          this.$message.warning('请上传jpg,jpeg,png,gif,bmp格式图片！');
          flag = false;
        }
        // 判断文件大小，图片限制2M以下
        if (psize && size > 1024 * psize * 1000) {
          this.$message.warning(`请上传${psize}M以下的图片！`);
          flag = false;
        } else if (size > 1024 * 2 * 1000) {
          this.$message.warning('请上传2M以下的图片！');
          flag = false;
        }
        // 限制文件尺寸
        if (proportion !== undefined) {
          const _flag = await this.imgchecked(file);
          if (!_flag) flag = false;
        }
        this.type = 'img';
      } else if (isVideo && haveVideo) {
        // 判断文件格式
        const _videoType = FILTER_VIDEO_TYPE;
        if (type !== 'video/quicktime' && !_videoType.includes(type.split('/')[1])) {
          this.$message.warning('请上传mp4,mov格式视频！');
          flag = false;
        }
        // 判断文件大小，视频限制50M以下
        if (size > 1024 * 50 * 1000) {
          this.$message.warning('请上传50M以下的视频！');
          flag = false;
        }
        this.type = 'video';
      } else {
        this.$message.warning('请上传正确的文件格式！');
        flag = false;
      }
    } else {
      this.$message.warning('请上传正确的文件格式！');
      flag = false;
    }
    return new Promise((res, rej) => {
      if (!flag) return rej();
      return res(true);
    });
  }

  /**
   * 上传图片到oss方法
   */
  async uploadImgOssFunc(file: any) {
    const { business } = this.$props.propConfig;
    // 封装上传图片参数
    const { type } = this;
    if (!type) return;
    if (type === 'img') {
      const body = await putUploadAliyuncs(file.file, business);
      this.$emit('on-upload', body);
    }
    if (type === 'video') {
      const body = await multipartUploadAliyuncs(file.file, business, this.progress);
      this.progress.num = 0;
      this.$emit('on-upload', body);
    }
  }

  // 判断尺寸
  imgchecked(file: any) {
    const { proportion } = this.propConfig;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img: any = new Image();
        img.src = reader.result;
        img.onload = () => {
          const { width, height } = img;
          if ((Math.round((width / height) * 100) / 100).toFixed(2) !== String(proportion)) {
            this.$message.warning(`上传图片尺寸错误，当前图片尺寸为${width}x${height}`);
            resolve(false);
          } else {
            resolve(true);
          }
        };
      };
    });
  }
}
</script>
