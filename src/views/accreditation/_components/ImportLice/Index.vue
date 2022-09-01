<template>
  <el-drawer
    :visible="importVisible"
    :before-close="handleClose"
    size="80%"
    :direction="'rtl'"
  >
    <template slot="title">
      <span class="draw_title">导入办证数据</span>
    </template>
    <div class="import_container">
      <div class="file_container">
        <CtjtUpload
          ref="fileUpload"
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
        <p
          style="color: #ff0000; margin: 6px 10px"
          v-if="isHuizhouSchool && isExamAcceptance"
        >
          【失败原因】不填写即默认为【受理成功】，导入后系统会自动生成【受理档案号】
        </p>
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
import { State } from 'vuex-class';
import {
  FILTER_EXCEL_TYPE,
  debounce,
  matchNumberList,
  drivingSchool,
} from '@/assets/js/common';
import { readExcel } from '@/assets/js/excel';
import { ParamsType, VueComponentParent } from '@/type';
import {
  PAPERLESS_COLLECT_EXCEL,
  SITE_DELIVERY_TABLE_EXCEL,
  LICENSE_RECEIPT_FORM_EXCEL,
  CLASS_SITUATION_EXCEL,
  AREA_DELIVERY_TABLE_EXCEL,
  VEHICLE_APPROVAL_EXCEL,
  CAPITAL_SUPERVISION_EXCEL,
  REPORT_CARD_EXCEL,
  EXAM_ACCEPTANCE_EXCEL,
  HUIZHOU_EXAM_ACCEPTANCE_EXCEL,
  SUBJECT_TRAINING_EXCEL,
  APPLY_EXAM_EXCEL,
  EXAM_APPROVAL_EXCEL,
  HUIZHOU_EXAM_APPROVAL_EXCEL,
  EXAM_FEE_EXCEL,
  HUIZHOU_EXAM_FEE_EXCEL,
  HUIZHOU_EXAM_RESULTS_EXCEL,
  EXAM_RESULTS_EXCEL,
  SUPERVISION_HOURS_ACTIVE_EXCEL,
} from '@/enums';
import { CtjtUpload, CtjtTable } from '@/components';
import upload from '@/assets/js/upload';
import CtjtTableColumn from '@/components/Table/Column';

interface ElementDOMS extends Element {
  offsetHeight: number;
}

@Component({
  components: { CtjtUpload, CtjtTable, CtjtTableColumn },
})
export default class CtjtImportDrawer extends Vue {
  @State((state) => state.base.userInfo) userInfo: any;

  @Prop({ default: false }) importVisible!: boolean;

  @Prop({ default: false }) uploadUrl!: string;

  @Prop({ default: {} }) importProps!: any;

  private isHuizhouSchool = false;

  private isExamAcceptance = false;

  // excel相关配置
  uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    autoUpload: false,
    disabled: false,
    tips: '',
    business: 'accreditation',
  };

  fileAccept = FILTER_EXCEL_TYPE; // 限制上传文件格式

  // 要上传的文件list
  fileList: any = [];

  // excel预览表格配置
  previewData: ParamsType = {}; // 预览表格配置对象

  excelJsonList: any = []; // elcel总列表数组

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

  @Watch('importVisible')
  private watchImportVisibleFunc(newVal: boolean) {
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

  @Watch('importProps', { immediate: false, deep: true })
  dealExcelSet(val: any) {
    const { code, drivingSchoolId } = val;
    switch (code) {
      case 'paperless_collect':
        this.previewData = PAPERLESS_COLLECT_EXCEL;
        break;
      case 'site_delivery_table':
        this.previewData = SITE_DELIVERY_TABLE_EXCEL;
        break;
      case 'license_receipt_form':
        this.previewData = LICENSE_RECEIPT_FORM_EXCEL;
        break;
      case 'class_situation':
        this.previewData = CLASS_SITUATION_EXCEL;
        break;
      case 'area_delivery_table':
        this.previewData = AREA_DELIVERY_TABLE_EXCEL;
        break;
      case 'vehicle_approval':
        this.previewData = VEHICLE_APPROVAL_EXCEL;
        break;
      case 'capital_supervision':
        this.previewData = CAPITAL_SUPERVISION_EXCEL;
        break;
      case 'report_card':
        this.previewData = REPORT_CARD_EXCEL;
        break;
      case 'exam_acceptance':
        this.previewData = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_ACCEPTANCE_EXCEL
          : EXAM_ACCEPTANCE_EXCEL;
        break;
      case 'subject_training':
        this.previewData = SUBJECT_TRAINING_EXCEL;
        break;
      case 'apply_exam':
        this.previewData = APPLY_EXAM_EXCEL;
        break;
      case 'exam_approval':
        this.previewData = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_APPROVAL_EXCEL
          : EXAM_APPROVAL_EXCEL;
        break;
      case 'exam_fee':
        this.previewData = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_FEE_EXCEL
          : EXAM_FEE_EXCEL;
        break;
      case 'exam_results':
        this.previewData = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_RESULTS_EXCEL
          : EXAM_RESULTS_EXCEL;
        break;
      case 'supervision_hours':
        this.previewData = SUPERVISION_HOURS_ACTIVE_EXCEL;
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
            // 处理表格数据的操作
            // 添加序号
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
    (this.$refs.fileUpload as VueComponentParent).uploadClearFiles(true);
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

  async created() {
    const { drivingSchoolId } = this.userInfo;
    const { code } = this.importProps;
    this.isHuizhouSchool = drivingSchool(drivingSchoolId) === 'huizhou';
    this.isExamAcceptance = code === 'exam_acceptance';
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
