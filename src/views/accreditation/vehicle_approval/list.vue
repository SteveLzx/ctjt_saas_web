<template>
  <div class="page">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    >
      <template slot="autocomplete">
        <el-form-item
          v-for="(item, index) in searchForm.autocompleteList"
          :key="`autocomplete-${index}`"
          :label="item.label"
          :label-width="`${item.labelWidth + 'px' || 'auto'}`"
        >
          <el-autocomplete
            popper-class="seach_table_autocomplete"
            v-model="item.value"
            value-key="idNo"
            :maxlength="item.maxlength"
            :clearable="item.clearable"
            :fetch-suggestions="autocompleteQuerySearch"
            :placeholder="item.placeholder || '请输入内容'"
            style="width: 320px"
            size="mini"
          >
            <template slot-scope="{ item }">
              <div class="idNo">{{ item.idNo }}</div>
              <span class="userName">{{ item.userName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template></SearchTable
    >
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <el-button
          @click="dialogName = 'field'"
          style="float: right"
          v-if="perm['btn_field']"
          >字段设置</el-button
        >
        <CtjtSetField
          :show-field-visable="dialogName === 'field'"
          :field-list="originalLabelList"
          :check-field-list="currentLabelKeyList"
          :localstorage-key="tableLabelType"
          :localstorage-service="'accreditation'"
          @submit-field="submitField"
          @field-cancel="dialogName = ''"
        ></CtjtSetField>
      </template>
    </CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--快速录入办证数据-->
    <CtjtAccreditationQuickEntry
      :is-show="dialogName === 'quickEntry'"
      :supplement-props="importProps"
      @button-call="submitQuickEntryCallback"
    >
    </CtjtAccreditationQuickEntry>
    <!--补录办证数据-->
    <CtjtSupplementDrawer
      :is-show="dialogName === 'supplement'"
      :supplement-props="importProps"
      @button-call="submitSupplementCallback"
    >
    </CtjtSupplementDrawer>
    <!--导入办证数据弹出框-->
    <CtjtImportDrawer
      :import-visible="dialogName === 'import'"
      :import-props="importProps"
      @button-call="dialogName = ''"
      @on-upload="importResultCallback"
    ></CtjtImportDrawer>
    <!--导入办证数据返回结果弹出框-->
    <CtjtCertificateResultDialog
      :certificate-result-visible="
        certificateResult === 'import' ||
        certificateResult === 'supplement' ||
        certificateResult === 'quickEntry'
      "
      :title="
        certificateResult === 'import'
          ? '导入'
          : certificateResult === 'supplement'
          ? '补录'
          : '快速录入'
      "
      :import-data="importData"
      @button-call="certificateResult = ''"
    ></CtjtCertificateResultDialog>
    <!-- 编辑办证数据-->
    <CtjtEditLiceDrawer
      :is-show="dialogName === 'edit'"
      :edit-props="importProps"
      :data="editData"
      @button-call="editCallback"
    ></CtjtEditLiceDrawer>
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
  </div>
</template>
<script lang='ts'>
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtOperationLog,
  CtjtSetField,
} from '@/components';
import {
  CtjtCertificateResultDialog,
  CtjtImportDrawer,
  CtjtSupplementDrawer,
  CtjtAccreditationQuickEntry,
  CtjtEditLiceDrawer,
} from '@/views/accreditation/_components';
import { ParamsType, TableOptionsValue } from '@/type';
import {
  marginTableLabels,
  setTableLabels,
  getAccreditationProps,
  getTemplateDownloadProps,
} from '@/views/accreditation/_common/common';
import { drawSearchForm } from '@/assets/js/search_table';
import download from '@/assets/js/download';
import { timestampSizeCompare } from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '车管所送审';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtImportDrawer,
    CtjtCertificateResultDialog,
    CtjtSupplementDrawer,
    CtjtOperationLog,
    CtjtAccreditationQuickEntry,
    CtjtEditLiceDrawer,
  },
})
export default class VehicleApprovalList extends mixins(
  accreditationSeachTableMixins,
  ctjtPaginationMixins,
  ctjttablefieldMixins,
  accreditationOperationLogMixins
) {
  @Action('license/queryDmvList') private queryDmvList!: (data: any) => any;

  @Action('license/dmvExport') private dmvExport!: (data: any) => any;

  /** 列表搜索配置 */
  private localSearchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 3,
          width: 110,
          options: [
            {
              id: 3,
              label: '操作日期',
            },
            {
              id: 14,
              label: '送审日期',
            },
          ],
        },
      },
    ],
    datePickerList: [
      {
        label: '',
        key: 'beginDate',
        value: '',
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      },
    ],
    inputList: [
      {
        label: '批次号',
        key: 'batchNos',
        type: 'text',
        value: '',
        width: 315,
        placeholder: '多个批次号之间请用英文分号[;]分隔',
        clearable: true,
      },
    ],
    checkedList: [
      {
        key: 'deletedFlag',
        value: 0, // 0：正常，1已删除
        label: '看已删除数据',
      },
    ],
  };

  /**
   * @description 初始化列表搜索项
   */
  private initSearch() {
    // 合并混入的公共搜索项，和本地的搜索项
    const { searchForm, localSearchForm } = this;
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 11,
        label: '快速录入',
        type: 'primary',
        path: 'btn_quick_entry',
      },
      {
        id: 1,
        label: '导入办证数据',
        path: 'btn_drbzsj',
      },
      {
        id: 2,
        label: '补录办证数据',
        type: 'primary',
        path: 'btn_blbzsj',
      },
      {
        id: 13,
        label: '编辑',
        path: 'btn_edit',
      },
      {
        id: 12,
        label: '删除',
        path: 'btn_delete',
        type: 'danger',
      },
      {
        id: 9,
        label: '数据模板下载',
        path: 'btn_sjmbxz',
      },
      {
        id: 10,
        label: '导出',
        path: 'btn_export',
      },
    ],
    labels: [
      {
        key: 'c1',
        label: '片区交表日期',
        width: 130,
      },
      {
        key: 'c3',
        label: '操作日期',
      },
      {
        key: 'c2',
        label: '操作人',
      },
    ],
    list: [],
    selectionList: [],
    setCellClassName: (val: any) => {
      const { balance } = val.row;
      return balance || balance !== 0 ? 'td_text_red' : '';
    },
  };

  /**
   * @description 表格初始化设置
   */
  private initSetTableLabel() {
    const { tableLabelType, deletedLabels } = this;
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { deletedFlag } = _data;
    let _originalLabelList: any = marginTableLabels(tableLabelType);
    if (deletedFlag === 1) {
      _originalLabelList = [..._originalLabelList, ...deletedLabels];
    }
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(
      _originalLabelList,
      tableLabelType
    );
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  // 弹出框类型
  dialogName = '';

  // 导入办证数据结果弹出框是否可见
  certificateResult = '';

  // 办证数据配置
  private importProps = {};

  // 返回的导入办证结果
  importData: any = {};

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this._resetSearchFunc();
    }
    if (key === 'log') {
      this.queryOperationLogPage(name);
      this.logshow = true;
    }
  }

  /** 重置列表搜索回调 */
  private _resetSearchFunc() {
    this.searchSelectChange({ key: 'regionId', value: null });
    this.queryList();
  }

  editData: any = {};

  /** 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const { id } = val;
    if ([1, 2, 11, 13].includes(id)) {
      this.importProps = getAccreditationProps(name);
    }
    if (id === 1) {
      // 导入办证数据
      this.dialogName = 'import';
      return;
    }
    if (id === 2) {
      // 补录办证数据
      this.dialogName = 'supplement';
      return;
    }
    if (id === 11) {
      // 快速录入办证数据
      this.dialogName = 'quickEntry';
      return;
    }
    if (id === 12) {
      // 删除
      if (_len >= 1) {
        this.deleteFlowHandle(selectionList);
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
    if (id === 13) {
      // 编辑
      if (_len === 1) {
        this.dialogName = 'edit';
        const {
          userName, idNo, recordId, inspectionDate
        } = selectionList[0];
        this.editData = {
          userName,
          idNo,
          id: recordId,
          applyDate: inspectionDate,
          code: 9,
        };
        return;
      }
      if (_len < 1) {
        this.$message.warning('请先勾学员！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 9) {
      // 数据模板下载
      const { drivingSchoolId } = this.userInfo;
      download(getTemplateDownloadProps(name, drivingSchoolId));
      return;
    }
    // 导出
    if (id === 10) {
      this._exportData();
    }
  }

  /** 导出 */
  private async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const { batchNos } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
    };
    const body = await this.dmvExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel',
    });
    FileSaver.saveAs(
      blob,
      `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`
    );
  }

  // 上传excel 后返回回调
  importResultCallback(val: any) {
    this.dialogName = '';
    this.certificateResult = 'import';
    this.importData = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  // 补录按钮点击回调
  submitSupplementCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.certificateResult = 'supplement';
        this.dialogName = '';
        this.importData = data;
        this.paginationData.current = 1;
        this.queryList();
      }
    } else {
      this.dialogName = '';
    }
  }

  // 编辑确定回调
  async editCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.dialogName = '';
        this.querFirstPageList();
      }
    } else {
      this.dialogName = '';
    }
  }

  /**
   * @param { ParamsType } val 搜索项 下拉选中返回当前对象
   * @description 搜索组件 下拉项选中回调函数
   */
  private searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        // 请求该片区下的门店列表
        this.queryStoreList(value);
      }
    }
  }

  // 快速录入确定回调
  async submitQuickEntryCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.certificateResult = 'quickEntry';
        this.dialogName = '';
        this.importData = data;
        this.paginationData.current = 1;
        this.queryList();
      }
    } else {
      this.dialogName = '';
    }
  }

  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { batchNos, beginDate, endDate } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
    };
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryDmvList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
    this.initSetTableLabel();
  }

  /** @description 删除 */
  deleteFlowHandle(selectList: any) {
    this.$prompt('请输入删除原因', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[^ \x22]+/,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(val.length < 1 || val.length > 200);
      },
      inputErrorMessage: '输入内容长度为1-200,不能全输入空格',
      inputPlaceholder: '输入内容长度为1-200',
      inputType: 'textarea',
    })
      .then(async (val: any) => {
        const _data: any = [];
        selectList.forEach((item: any) => {
          const _item = item;
          _data.push({
            recordId: _item.recordId,
            idNo: _item.idNo,
          });
        });
        const sendData = {
          code: 9,
          flowData: _data,
          deleteReason: val.value.trim(),
        };
        await this.deleteFlowData(sendData)
          .then(() => {
            this.$message.success('删除成功！');
            this.querFirstPageList();
          })
          .catch(() => {
            //
          });
      })
      .catch((error: any) => {
        this.$message.info('已取消删除');
      });
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = 'VEHICLE_APPROVAL_LIST_LABEL';
    this.queryList();
    this.initSearch();
    this.initSetTableLabel();
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
</script>
<style scoped>
.el-form-item{
  margin-bottom: 8px;
}
</style>
