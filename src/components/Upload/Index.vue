<template>
  <div class="upload_container">
    <el-upload
      class="upload-demo"
      ref="upload"
      action="#"
      :on-remove.sync="handleRemove"
      :on-change="handleChange"
      :multiple="propConfig.limit > 1"
      :auto-upload="propConfig.autoUpload"
      :file-list="fileList"
      :accept="fileAccept"
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

interface PropConfigValue {
  haveVideo?: boolean;
  multiple?: boolean;
  accept?: string;
  autoUpload: boolean;
  disabled?: boolean;
  limit: number;
  tips?: string;
  business?: string;
}

@Component
export default class CtjtUpload extends Vue {
  @Prop({ default: { limit: 1, multiple: false } })
  propConfig!: PropConfigValue;

  @Prop({ default: [] }) fileAccept!: any;

  @Prop({ default: '选择文件' }) text?: string;

  @Prop({ default: 'primary' }) buttonType?: string;

  // 要上传的文件list
  fileList: any = [];

  // 选择文件的时候
  handleChange(file: any, fileList: any) {
    // 允许上传excel的类型
    const { raw } = file;
    const { type, name } = raw;
    if (type) {
      // 判断文件格式
      const _excelType = this.fileAccept;
      const suffix = name.substr(name.lastIndexOf('.'));
      if (!_excelType.includes(suffix)) {
        this.$message.warning('请上传正确的文件格式！');
        fileList.pop();
        return null;
      }
      this.fileList.push(raw);
      this.fileList = fileList.slice(-1);
      return this.fileList;
    }
    this.$message.warning('请上传正确的文件格式！');
    fileList.pop();
    return null;
  }

  handleExceed(files: any, fileList: any) {
    this.$message.warning(
      `当前限制选择${this.propConfig.limit}个文件，本次选择了 ${
        files.length
      } 个文件，共选择了 ${
        files.length + fileList.length
      } 个文件,请先删除已选择的文件！`
    );
    return true;
  }

  @Emit('remove-list')
  public handleRemove() {
    this.uploadClearFiles(false);
  }

  // 删除选中的文件
  public uploadClearFiles(isUpload: boolean) {
    if (isUpload) {
      // 上传后清空fileList
      (this.$refs.upload as VueComponentParent).clearFiles();
      this.fileList = []; // 清空fileList
    } else {
      // 清空此file
      this.fileList.pop(); // 删除此file
    }
  }

  @Watch('fileList', { immediate: true, deep: true })
  fileListChange(val: any) {
    const body = {
      fileList: val,
      filePath: '',
      type: 'preview',
    };
    this.$emit('file-choose', body);
    return val;
  }
}
</script>
<style lang="scss" scoped>
.upload_container {
  display: inline-flex;
  height: 80px;
  width: 160px;
}
::v-deep .el-upload-list {
  min-width: 300px;
  width: auto;
}
</style>
