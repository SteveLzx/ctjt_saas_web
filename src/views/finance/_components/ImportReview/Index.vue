<template>
  <el-drawer
    :visible="visible"
    :before-close="handleClose"
    :size="'1200px'"
    :direction="'rtl'"
  >
    <template slot="title">
      <span class="draw_title">导入</span>
    </template>
    <div class="import_container">
      <div class="file_container">
        <CtjtUpload
          ref="financeFileUpload"
          :prop-config="uploadConfig"
          :file-accept="fileAccept"
          @file-choose="fileChoose"
          @remove-list="_clearData"
        >
        </CtjtUpload>
        <div class="button_container">
          <el-button type="success" @click="fileUpload">上 传</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
        <el-progress
          v-if="progress.num"
          :percentage="progress.num"
          style="line-height: 2; width: 50%"
        ></el-progress>
      </div>
      <div class="preview_container" id="ctjt_import_drawer_preview_container">
        <el-table
          ref="refsPreviewTable"
          v-loading="previewData.loading"
          :data="previewData.list"
          :highlight-current-row="true"
          :height="previewData.height"
          border
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, index) in previewData.labels"
            :align="'center'"
            :prop="item.key"
            :label="item.label"
            :width="item.width"
            :minWidth="item.minWidth"
            :key="`column-${index}`"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit, Watch
} from 'vue-property-decorator';

import { FILTER_EXCEL_TYPE, debounce, matchNumberList } from '@/assets/js/common';
import { readExcel } from '@/assets/js/excel';
import { ParamsType, VueComponentParent } from '@/type';
import { CtjtUpload } from '@/components';
import upload from '@/assets/js/upload';

interface ElementDOMS extends Element {
  offsetHeight: number;
}

const OTHER_FEE_MG_REVIEW_LABEL = [
  {
    key: '序号',
    label: '序号',
    minWidth: 80,
  },
  {
    key: '姓名',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: '证件号码',
    label: '证件号码',
    minWidth: 200,
  },
  {
    key: '金额',
    label: '金额',
  },
];
@Component({
  components: { CtjtUpload },
})
export default class CtjtFinanceImportReviewDrawer extends Vue {
  @Prop({ default: false }) visible!: boolean;

  @Prop({ default: false }) uploadUrl!: string;

  @Prop({ default: {} }) importProps!: any;

  // 数据上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    autoUpload: false,
  };

  fileAccept = FILTER_EXCEL_TYPE; // 限制上传文件格式

  // 要上传的文件list
  fileList: any = [];

  excelJsonList: any = []; // elcel总列表数组

  // excel预览表格配置
  previewData: ParamsType = {}; // 预览表格配置对象

  progress: { num: number } = { num: 0 };

  currentPage = 0; // 当前页

  pageSize = 30; // 一次请求多少条

  tableRef: any;

  tableWarp: any;

  scrollTop = 0;

  start = 0;

  end = 90; // 3倍的pageSize

  starts = 0; // 备份[保持与上一样]

  ends = 90; // 备份[保持与上一样]

  itemHeight = 47; // 每一行高度

  timeOut = 400; // 延迟

  _clearData() {
    this.fileList = [];
    this.excelJsonList = [];
    this.currentPage = 0; // 当前页
    this.scrollTop = 0;
    this.start = 0;
    this.end = 90; // 3倍的pageSize
    this.starts = 0; // 备份[保持与上一样]
    this.ends = 90; // 备份[保持与上一样]
    this.progress.num = 0;
    this.previewData.list = [];
    this.previewData.loading = false;
  }

  @Watch('importProps', { immediate: true, deep: true })
  dealExcelSet(val: any) {
    const { code } = val;
    switch (code) {
      case 'other_fee_mg':
        this.previewData.labels = OTHER_FEE_MG_REVIEW_LABEL;
        break;
      default:
        break;
    }
    const _data = {
      loading: false,
      height: 300,
      list: [],
    };
    this.previewData = { ..._data, ...this.previewData };
  }

  /**
   * 设置表格高度
   */
  private _setTableHeightFunc() {
    this.$nextTick(() => {
      const _dom = document.querySelector(
        '#ctjt_import_drawer_preview_container'
      );
      if (_dom) {
        this.previewData.height = (_dom as ElementDOMS).offsetHeight;
        // 监听预览列表滚动
        this._setTableStyleFunc();
      }
    });
  }

  /**
   * @description 监听预览列表滚动
   */
  private _watchPreviewTableScroll() {
    const _dom = (this.$refs.refsPreviewTable as VueComponentParent)
      .bodyWrapper;
    const _debounce = debounce(() => {
      this.scrollTop = this.tableRef.scrollTop;
      this.currentPage = Math.floor(
        this.scrollTop / (this.itemHeight * this.pageSize)
      );
    }, 0);
    _dom.addEventListener('scroll', _debounce);
    // 卸载监听
    this.$on('hook:beforeDestroy', () => {
      if (!_dom) return;
      _dom.removeEventListener('scroll', _debounce);
    });
  }

  /**
   * @description 设置预览表单样式
   */
  private _setTableStyleFunc() {
    this.$nextTick(() => {
      this.tableRef = (
        this.$refs.refsPreviewTable as VueComponentParent
      ).bodyWrapper;
      // 主体改造
      const divWarpPar = document.createElement('div');
      divWarpPar.style.height = `${
        this.excelJsonList.length * this.itemHeight
      }px`;
      const divWarpChild = document.createElement('div');
      divWarpChild.className = 'fix-warp';
      divWarpChild.append(this.tableRef.children[0]);
      divWarpPar.append(divWarpChild);
      this.tableRef.append(divWarpPar);

      // 被设置的transform元素
      this.tableWarp = document.querySelector(
        '.el-table .el-table__body-wrapper .fix-warp'
      );
      this._watchPreviewTableScroll();
    });
  }

  @Watch('currentPage')
  function(newV: number) {
    if (newV > 1) {
      this.start = (newV - 1) * this.pageSize;
      this.end = (newV + 2) * this.pageSize;
      setTimeout(() => {
        this.tableWarp.style.transform = `translateY(${
          this.start * this.itemHeight
        }px)`;
        this.previewData.list = this.excelJsonList.slice(this.start, this.end);
      }, this.timeOut);
    } else {
      setTimeout(() => {
        this.previewData.list = this.excelJsonList.slice(
          this.starts,
          this.ends
        );
        this.tableWarp.style.transform = 'translateY(0px)';
      }, this.timeOut);
    }
  }

  @Watch('visible')
  private watchvisibleFunc(newVal: boolean) {
    if (newVal) {
      this._setTableHeightFunc();
    }
  }

  @Watch('progress', { immediate: true, deep: true })
  hadleProgressFunc(val: { num: number }) {
    return val;
  }

  @Emit('button-call')
  handleClose() {
    this.removeFun();
  }

  /**
   * @description 文件选择回调函数，判断文件类型，大小
   */
  fileChoose(val: any) {
    const { fileList }: any = val;
    if (fileList && fileList.length > 0) {
      this.previewData.loading = true;
      this.fileList = fileList;
      readExcel(fileList[0]).then((tabJson: any) => {
        if (tabJson && tabJson.length > 0) {
          if (tabJson.length <= 10001) {
            tabJson.forEach((item: any, index: number) => {
              const _item = item;
              _item['序号'] = index + 1;
            });
            this.excelJsonList = tabJson;
            this.previewData.list = this.excelJsonList.slice(
              this.start,
              this.end
            );
          } else {
            this.removeFun();
            this.$message.warning('请选择数据条数在10000条以下的Excel文件！');
          }
        } else {
          this.removeFun();
          this.$message.warning('请选择带有数据的Excel文件！');
        }
      });
    } else {
      this.previewData.list = [];
    }
    this.previewData.loading = false;
  }

  /**
   * @description 删除选中的文件
   */
  removeFun() {
    (this.$refs.financeFileUpload as VueComponentParent).uploadClearFiles(true);
    this._clearData();
  }

  /**
   * @description 上传文件到后台
   */
  async fileUpload() {
    const { fileList, excelJsonList } = this;
    if (fileList && fileList.length > 0 && excelJsonList.length > 0) {
      const file = fileList[0].raw;
      // 上传之前判断文件是否真实存在
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const form = new FormData();
        form.append('file', file);
        const { uploadPath } = this.importProps;
        const { body = {} }: any = await upload(
          uploadPath,
          form,
          this.progress
        );
        const { description = '', failLogDtoList } = body;
        const list: any = matchNumberList(description);
        this.removeFun();
        this.$emit('on-upload', {
          ...body,
          importSuccess: (list && list[0]) || 0,
          imporError: (failLogDtoList && failLogDtoList.length) || 0,
        });
      };
      reader.onerror = () => {
        this.$message.warning('请确认要上传的文件是否真实存在！');
        this.removeFun();
      };
      reader.readAsBinaryString(file);
    } else {
      this.$message.warning('请先选择带有数据的Excel文件！');
      this.removeFun();
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  border-bottom: 1px solid $--color-border-split;
  padding: 20px;
  .draw_title {
    font-size: 17px;
    font-weight: 500;
  }
}
.import_container {
  height: 100%;
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  .file_container {
    display: inherit;
    .button_container {
      padding: 0 10px;
    }
  }
  .preview_container {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
  .ctjt_tabel_container {
    padding-top: 0;
  }
}
</style>
