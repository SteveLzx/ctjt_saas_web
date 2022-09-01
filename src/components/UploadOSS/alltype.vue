<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    action="#"
    :http-request="uploadImgOssFunc"
    :before-upload="beforeImgUploadFunc"
    :multiple="false"
    :show-file-list="propConfig.showFileList"
    :limit="propConfig.limit"
    :file-list="propConfig.fileList"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-exceed="handleExceed"
  >
    <slot name="content"></slot>
    <el-progress v-if="progress.num" :percentage="progress.num"></el-progress>
  </el-upload>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Watch
} from 'vue-property-decorator';
import { putAllTypeUploadAliyuncs } from '@/assets/js/upload_oss';

interface PropConfigValue {
  disabled?: boolean;
  business: string;
  fileList: Array<any>,
  limit?: number,
  showFileList?: boolean;
}

@Component
export default class CtjtAllTypeUpload extends Vue {
  @Prop({
    default: {
      disabled: false,
      limit: 1,
      showFileList: false,
    }
  }) propConfig!: PropConfigValue;

  public progress: { num: number } = { num: 0 };

  @Watch('progress', { immediate: true, deep: true })
  hadleProgressFunc(val: { num: number }) {
    return val;
  }

  beforeImgUploadFunc() {
    return true;
  }

  /**
   * 上传到oss方法
   */
  async uploadImgOssFunc(file: any) {
    const { business } = this.$props.propConfig;
    const body = await putAllTypeUploadAliyuncs(file.file, business);
    this.$emit('upload-success', body);
  }

  // 删除
  handleRemove(file: any) {
    this.$emit('upload-remove', file);
  }

  // 删除前
  beforeRemove() {
    return new Promise((resolve, reject) => {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => resolve(true)).catch(() => reject());
    });
  }

  // 超出最大上传文件个数
  handleExceed() {
    this.$message.warning(`当前限制选择${this.propConfig.limit}个文件`);
  }
}
</script>
