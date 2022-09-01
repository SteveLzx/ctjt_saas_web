<template>
  <div class="editor_wrapper">
    <div :id="propData.domId"></div>
  </div>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component, Watch
} from 'vue-property-decorator';
import Editor from 'wangeditor';
import { ParamsType } from '@/type';
import { OSS_BASEURL } from '@/assets/js/common';
import { putUploadAliyuncs } from '@/assets/js/upload_oss';

interface PropDataValue {
  domId: string;
  placeholder?: string;
  height: number;
  zIndex?: number;
  content?: string;
  isFocus?: boolean;
  business: string;
  disable?: boolean;
}

@Component
export default class CtjtEditor extends Vue {
  @Prop() propData!: PropDataValue

  @Watch('propData', { immediate: true, deep: true })
  onChangeValue(newVal: PropDataValue) {
    // 赋值内容
    if (newVal.content) this.editor.txt.html(newVal.content);
    if (newVal.disable) this.editor.disable();
  }

  private editor: ParamsType = {};

  mounted() {
    const {
      domId, placeholder, height, zIndex, isFocus, content, business
    } = this.propData;

    const editor = new Editor(`#${domId}`);
    this.editor = editor;
    // 配置菜单栏，设置不需要的菜单
    editor.config.excludeMenus = [
      'emoticon',
      'todo',
      'list',
      'quote',
      'video',
      'table',
      'code',
      'splitLine',
    ];
    editor.config.placeholder = placeholder || '请输入正文';
    editor.config.height = height;
    editor.config.zIndex = zIndex || 1;
    editor.config.focus = isFocus || false;
    // 配置上传图片
    editor.config.uploadImgServer = '/base/v1/oss/upload';
    editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    editor.config.uploadImgMaxLength = 1; // 一次最多上传1个图片
    // 自定义上传图片参数
    editor.config.uploadImgParams = {
      business: '',
    };
    // 自定以上传图片
    editor.config.customUploadImg = async (resultFiles: any[], insertImgFn: (val: string) => void) => {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      // 封装上传图片参数
      const _file = resultFiles[0];
      const { size } = _file;
      if (size > 1024 * 2 * 1000) {
        this.$message.warning('请上传2M以下的图片！');
      } else {
        const body = await putUploadAliyuncs(_file, business);
        const _baseUrl = OSS_BASEURL;
        insertImgFn(`${_baseUrl}${body}`);
      }
    };
    editor.config.onchange = (html: string) => {
      const text = editor.txt.text();
      this.$emit('on-change', { html, text });
    };
    editor.create();
    // 赋值内容
    if (content) editor.txt.html(content);
  }
}
</script>
