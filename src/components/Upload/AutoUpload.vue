<template>
  <div class="auto_upload_container">
    <el-upload
      ref="upload"
      action="#"
      :http-request="uploadFileFunc"
      :before-upload="beforeFileUploadFunc"
      :multiple="propConfig.multiple || false"
      :show-file-list="false"
      :limit="propConfig.limit"
      :accept="propConfig.fileAccept"
    >
      <el-button slot="trigger" size="small" :type="buttonType">{{
        text
      }}</el-button>
    </el-upload>
  </div>
</template>
<script lang="ts">
import {
  Prop, Vue, Watch, Component, Emit
} from 'vue-property-decorator';
import { VueComponentParent } from '@/type';
import upload from '@/assets/js/upload';
import { readExcel } from '@/assets/js/excel';

interface PropConfigValue {
  haveVideo?: boolean;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  limit: number;
  tips?: string;
  business?: string;
  fileAccept?: any;
  path?: string;
}

@Component
export default class CtjtAutoUpload extends Vue {
  @Prop({ default: { limit: 1, multiple: false } })
  propConfig!: PropConfigValue;

  @Prop({ default: '选择文件' }) text?: string;

  @Prop({ default: 'primary' }) buttonType?: string;

  @Prop({ default: '' }) uploadPath!: string;

  // 要上传的文件list
  fileList: any = [];

  regResult = true;

  /**
   * 上传之前调用方法
   */
  async beforeFileUploadFunc(file: any) {
    // 允许上传类型
    const { type, name } = file;
    if (!type) {
      this.$message.warning('请上传正确的文件格式！');
      this.regResult = false;
      this.uploadClearFiles();
      return false;
    }
    // 判断文件格式
    const _excelType = this.propConfig.fileAccept;
    const suffix = name.substr(name.lastIndexOf('.'));
    if (!_excelType.includes(suffix)) {
      this.$message.warning('请上传正确的文件格式！');
      this.regResult = false;
      this.uploadClearFiles();
      return false;
    }
    return true;
  }

  /**
   * 上传文件到服务器
   */
  async uploadFileFunc(files: any) {
    const { file } = files;
    let sizeFlag = true;
    const { regResult } = this;
    readExcel(file).then(async (tabJson: any) => {
      if (!tabJson || tabJson.length <= 0) {
        this.$message.warning('请选择带有数据的Excel文件！');
        sizeFlag = false;
        this.uploadClearFiles();
      }
      if (tabJson.length > 10001) {
        this.$message.warning('请选择数据条数在10000条以下的Excel文件！');
        sizeFlag = false;
        this.uploadClearFiles();
      }
      if (regResult && sizeFlag) {
        const { uploadPath } = this;
        const form = new FormData();
        form.append('file', file);
        upload(uploadPath, form).then((res: any) => {
          this.$emit('on-upload', res);
        }).finally(() => {
          this.uploadClearFiles();
        });
      }
    });
  }

  /** 清空文件 */
  uploadClearFiles() {
    (this.$refs.upload as VueComponentParent).clearFiles();
  }
}
</script>
<style lang="scss" scoped>
.auto_upload_container {
  display: inline-flex;
}
::v-deep .el-upload-list {
  min-width: 300px;
  width: auto;
}
</style>
