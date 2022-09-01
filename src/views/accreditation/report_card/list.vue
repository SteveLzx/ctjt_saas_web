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
            style="width: 320px" size="mini"
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
    <!-- 日志 -->
    <CtjtOperationLog
      :show.sync="logshow"
      :list="loglist"
      :tableOptions="logTableOptions"
      :pagination="logPaginationData"
      @currentChange="logTableCurrentChange"
      @sizeChange="logTableSizeChange"
    ></CtjtOperationLog>
    <!--接收成绩单-->
    <!-- <CtjtDialog
      title="接收成绩单"
      width="500px"
      :is-show="dialogName === 'singleForm'"
      @button-call="dialogCallback"
    >
      <el-form
        ref="singleForm"
        label-width="110px"
        class="single_edit_form"
        :model="editFormData"
      >
        <el-form-item label="接收日期" prop="receiveDate">
          <el-input
            v-model="editFormData.receiveDate"
            type="text"
            placeholder="请选择接收日期"
            style="width: 300px"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-row type="flex" justify="center" style="padding-bottom: 30px">
          <el-button
            type="primary"
            style="margin-left: 32px"
            @click="_receiveFun"
            :loading="submitLoading"
            >保存</el-button
          >
          <el-button
            type="info"
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="dialogName = ''"
            >取消</el-button
          >
        </el-row>
      </el-form>
    </CtjtDialog> -->
  </div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
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
  CtjtAccreditationQuickEntry,
} from '@/views/accreditation/_components';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { SUBJECT, REPORT_CARD_STATUS } from '@/enums';
import download from '@/assets/js/download';
import { timestampSizeCompare } from '@/assets/js/common';
import {
  marginTableLabels,
  setTableLabels,
  getAccreditationProps,
  getTemplateDownloadProps,
} from '@/views/accreditation/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '成绩单';
@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtImportDrawer,
    CtjtCertificateResultDialog,
    CtjtOperationLog,
    CtjtAccreditationQuickEntry,
  },
})
export default class AccreditationReportCard extends mixins(
  ctjtPaginationMixins,
  ctjttablefieldMixins,
  accreditationOperationLogMixins
) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (
    data: any
  ) => any;

  @Action('license/queryReportCardList') private queryReportCardList!: (
    data: any
  ) => any;

  @Action('license/reportCardOperate') private reportCardOperate!: (
    data: any
  ) => any;

  @Action('license/queryStudentByKeyword') private queryStudentByKeyword!: (
    data: any
  ) => ParamsType;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (
    data: any
  ) => ParamsType;

  @Action('license/exportReportCard') private exportReportCard!: (
    data: any
  ) => any;

  @State((state) => state.base.userInfo) userInfo: any;

  private beginDate = new Date();

  private endDate = new Date();

  /** 列表搜索配置 */
  public searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 1,
          width: 110,
          options: [
            {
              id: 1,
              label: '报名日期',
            },
            {
              id: 7,
              label: '考试日期',
            },
            {
              id: 16,
              label: '接收日期',
            },
          ],
        },
      },
    ],
    datePickerList: [
      {
        label: '',
        key: 'beginDate',
        value: this.beginDate,
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: this.endDate,
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      },
    ],
    selectList: [
      {
        label: '片区门店',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '',
        key: 'storeId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '考试科目',
        key: 'step',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: SUBJECT,
        customOptions: {
          value: 'label',
          label: 'label',
        },
      },
      {
        label: '成绩单状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: REPORT_CARD_STATUS,
      },
    ],
    cascaderList: [
      {
        label: '班别',
        key: 'classesNames',
        value: [],
        placeholder: '请选择',
        clearable: true,
        width: 150,
        options: [],
        optionProps: {
          emitPath: false, // 只展示最后一级
          multiple: true, // 可多选
          collapseTags: true,
          value: 'id',
          label: 'label',
          children: 'children',
        },
      },
    ],
    inputList: [
      {
        label: '批次号',
        key: 'batchNos',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '多个批次号之间请英文用分号[;]分隔',
        clearable: true,
      },
    ],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、证件号',
        width: 320,
        maxlength: 60,
        clearable: true,
        options: [],
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search',
      },
      {
        label: '重置',
        key: 'reset',
        type: '',
        plain: false,
        path: 'btn_search',
      },
      {
        label: '操作日志',
        key: 'log',
        type: '',
        plain: false,
        path: 'btn_log',
      },
    ],
  };

  /**
   * @param {string} val 需要传入驾校id
   * @description 请求驾校下的班别
   */
  async queryClassesList(val: string) {
    const sendData = { type: 1 }; // 1:学车班别;2:散学班别
    const body = await this.queryClassesInfoList(sendData);
    // 深拷贝，处理数据
    const _data = JSON.parse(JSON.stringify(body));
    _data.forEach((item: any) => {
      const _item = item;
      _item.id = _item.name;
      _item.label = _item.name;
    });
    const wriper: any = [
      {
        id: '',
        label: '全部',
        children: [],
      },
    ];
    wriper[0].children = _data;
    this.searchForm.cascaderList[0].options = _data ? wriper : [];
  }

  /**
   * @description 表单搜索回调函数
   */
  private async autocompleteQuerySearch(
    val: string,
    cb: (result: any) => void
  ) {
    // 调用 callback 返回建议列表的数据
    if (val) {
      const sendData = { keyword: val };
      await this.queryStudentByKeyword(sendData).then((res: any) => {
        cb(res);
      });
    } else {
      cb([]);
    }
  }

  /**
   * @param {string} type 判断是门店还是片区类型
   * @param {any} data 接口返回的数据
   * @description 片区，门店列表数据设置函数
   */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'region') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'store') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  /**
   * @param {string} val 需要传入驾校id
   * @description 请求驾校下的片区
   */
  async queryRegion(val: string) {
    const data = await this.queryGroupMechanismData({ pid: val });
    this._setFormSelectFunc('region', data);
  }

  /**
   * @param {string} val 需要传入片区id
   * @description 请求片区下的门店
   */
  async queryStore(val: string) {
    const data = await this.queryGroupMechanismData({ pid: val });
    this._setFormSelectFunc('store', data);
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
        this.queryStore(value);
      }
    }
  }

  /** 表格配置 */
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name,
  };

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
        label: '批量导入接收',
        path: 'btn_pldrjs',
      },
      {
        id: 3,
        label: '接收成绩单',
        type: 'primary',
        path: 'btn_jscjd',
      },
      {
        id: 4,
        label: '删除',
        type: 'danger',
        path: 'btn_del',
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
    labels: [],
    list: [],
    selectionList: [],
  };

  /**
   * @description 表格初始化设置
   */
  private initSetTableLabel() {
    const { tableLabelType } = this;
    const _originalLabelList = marginTableLabels(tableLabelType);
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(
      _originalLabelList,
      tableLabelType
    );
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
    this.tableData.labels = _currentLabelList;
  }

  // 弹出框类型
  dialogName = '';

  // 导入办证数据结果弹出框是否可见
  certificateResult = '';

  // 导入办证数据配置
  private importProps = {};

  // 返回的导入办证结果
  importData: any = {};

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
    }
    if (key === 'reset') {
      const { datePickerList } = this.searchForm;
      datePickerList[0].value = this.beginDate;
      datePickerList[1].value = this.endDate;
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
    this.searchForm.cascaderList[0].value = [];
    this.queryList();
  }

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
    if ([1, 11].includes(id)) {
      this.importProps = getAccreditationProps(name);
    }
    if (id === 1) {
      // 导入办证数据
      this.dialogName = 'import';
      return;
    }
    if (id === 11) {
      // 快速录入办证数据
      this.dialogName = 'quickEntry';
      return;
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
    if (id === 3) {
      // 接收成绩单
      if (_len >= 1) {
        const isHasReceiveData = selectionList.filter(
          (a: any) => Number(a.status) === REPORT_CARD_STATUS[1].id
        ).length > 0; // 存在已接收的数据
        if (isHasReceiveData) {
          this.$message.warning('存在成绩单已接收数据，请重新选择！');
        } else {
          // todo
          // this.dialogName = 'singleForm';
          // this._setEditFormData(selectionList);
          this._receiveFun(selectionList);
        }
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
    if (id === 4) {
      // 删除
      if (_len >= 1) {
        const isHasNoReceiveData = selectionList.filter(
          (a: any) => Number(a.status) === REPORT_CARD_STATUS[0].id
        ).length > 0; // 存在未接收数据
        if (isHasNoReceiveData) {
          this.$message.warning('存在成绩单未接收数据，不允许删除！');
        } else this._deleteFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
  }

  /** 导出 */
  private async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const classes = searchForm.cascaderList[0].value;
    const classesNames = classes && classes.length > 0 ? classes : null;
    const sendData = { ..._data, classesNames };
    const body = await this.exportReportCard(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel',
    });
    FileSaver.saveAs(blob, name);
  }

  // 上传excel 后返回回调
  async importResultCallback(val: any) {
    this.dialogName = '';
    this.certificateResult = 'import';
    this.importData = val;
    this.paginationData.current = 1;
    this.queryList();
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

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { batchNos, beginDate, endDate } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const classes = searchForm.cascaderList[0].value;
    const classesNames = classes && classes.length > 0 ? classes : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      classesNames,
    };
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryReportCardList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  private editFormData: ParamsType = {
    schoolReportDetailReq: [
      {
        id: '',
        idNo: '',
        subject: '',
        userName: '',
      },
    ],
    receiveDate: null, // 成绩单接收日期
  };

  /** 接收成绩单选中以后绑定选中的字段值 */
  _setEditFormData(selectionList: any) {
    const schoolReportDetailReq: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const _list = SUBJECT.filter((a) => a.id === _item.step);
      const _text = _list[0] ? _list[0].label : '';
      schoolReportDetailReq.push({
        id: _item.id,
        idNo: _item.idNo,
        subject: _text,
        userName: _item.userName,
      });
    });
    this.editFormData.schoolReportDetailReq = schoolReportDetailReq;
  }

  /** @description 接收成绩单 */
  _receiveFun(selectionList: any) {
    const schoolReportDetailReq: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      schoolReportDetailReq.push({
        id: _item.id,
        idNo: _item.idNo,
        subject: _item.step,
        userName: _item.userName,
      });
    });
    // const { schoolReportDetailReq } = this.editFormData;
    const sendData = { schoolReportDetailReq, type: 1 };
    this.$confirm('确定接收成绩单？', '接收', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        this.reportCardOperate(sendData).then(() => {
          this.paginationData.current = 1;
          this.queryList();
          this.$message.success('接收成绩单成功');
        });
      })
      .catch(() => {
        this.$message.info('已取消接收');
      });
  }

  /** @description 删除 */
  private _deleteFun(selectionList: any) {
    const schoolReportDetailReq: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      schoolReportDetailReq.push({
        id: _item.id,
        idNo: _item.idNo,
        subject: _item.step,
        userName: _item.userName,
      });
    });
    const sendData = { schoolReportDetailReq, type: 0 };
    this.$confirm('确定删除？', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        this.reportCardOperate(sendData).then(() => {
          this.paginationData.current = 1;
          this.queryList();
          this.$message.success('删除成功');
        });
      })
      .catch(() => {
        this.$message.info('已取消删除');
      });
  }

  async mounted() {
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    this.queryRegion(drivingSchoolId);
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = 'REPORT_CARD_LIST_LABEL';
    this.queryList();
    this.initSetTableLabel();
  }

  perm = {};

  async created() {
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
<style lang="scss" scoped>
.single_edit_form {
  .el-input,
  .el-date-picker {
    width: 260px;
  }
}
div .el-form-item__content {
  margin: 0px;
}
.el-form-item{
  margin-bottom: 8px;
}
</style>
