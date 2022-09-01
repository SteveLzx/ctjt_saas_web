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
          >
            <template slot-scope="{ item }">
              <div class="idNo">{{ item.idNo }}</div>
              <span class="userName">{{ item.userName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </template>
    </SearchTable>
    <CtjtTabBar :tabs="tabList" :value.sync="activeTab"></CtjtTabBar>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
      <template slot="reference">
        <el-button @click="dialogName = 'field'" style="float: right"
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
    <CtjtStatistics :statistics-data="statisticsData"></CtjtStatistics>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!--singleForm 单选操作弹出框 分配教练-->
    <CtjtSingleInfoDialog
      ref="singleFormDialog"
      :info-data="userBaseInfoData"
      title="分配教练"
      :rules="singleFormRules"
      :is-show="dialogName === 'singleForm'"
      @button-call="singleInfoButtonCallback"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="科目" class="ctjt_form_item_class">
            <span>{{ userBaseInfoData.step | subjectFilter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教练" class="ctjt_form_item_class">
            <el-input type="text" v-model="userBaseInfoData.coachName" />
            <!-- <el-select
                v-model="userBaseInfoData.coachId"
                filterable
                remote
                :remote-method="queryCoach"
                placeholder="请选择教练，输入姓名查询"
                clearable="true"
                @change="coachChange"
                :loading="coachOption.loading"
                :multiple-limit="1"
              >
                <el-option
                  v-for="item in coachOption.options"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                  <span>{{ item.label }} </span>
                </el-option>
              </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
    </CtjtSingleInfoDialog>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
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
<script lang="ts">
import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtTabBar,
  CtjtCreateTable,
  CtjtOperationLog,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import { CtjtSingleInfoDialog } from '@/views/accreditation/_components';
import { SUBJECT, COACH_TAB } from '@/enums';
import {
  ParamsType,
  VueComponentParent,
  TableOptionsValue,
  StaticDataType,
} from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { deepClone, timestampSizeCompare } from '@/assets/js/common';
import {
  setFormDataFunc,
  marginTableLabels,
  setTableLabels,
} from '@/views/accreditation/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import accreditationOperationLogMixins from '../_mixins/operationLog';

const name = '分配教练';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtTabBar,
    CtjtSetField,
    CtjtStatistics,
    CtjtSingleInfoDialog,
    CtjtCreateTable,
    CtjtOperationLog,
  },
  filters: {
    subjectFilter: (val: any) => (val ? SUBJECT[val - 1].label : ''),
  },
})
export default class AssignmentCoachList extends mixins(
  accreditationSeachTableMixins,
  ctjtPaginationMixins,
  ctjttablefieldMixins,
  accreditationOperationLogMixins
) {
  @Action('workflow/queryAllotCoaches') private queryAllotCoaches!: (
    data: any
  ) => any;

  @Action('workflow/postAllotCoachesCoach') private postAllotCoachesCoach!: (
    data: any
  ) => any;

  @Action('workflow/getAllotCoachesCoaches') private getAllotCoachesCoaches!: (
    data: any
  ) => any;

  /** 列表搜索配置 */
  private localSearchForm: ParamsType = {
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
              id: 6,
              label: '考试合格日期',
            },
            {
              id: 2,
              label: '受理日期',
            },
            {
              id: 3,
              label: '操作日期',
            },
          ],
        }
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
      }
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
    this.searchForm.inputList[0].width = 370;
    this.searchForm.inputList[0].placeholder = '请输入学员姓名、手机号、证件号、订单号、受理号';
  }

  /** 表格配置  */
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
        id: 1,
        label: '分配教练',
        type: 'primary',
      },
      {
        id: 10,
        label: '导出',
      },
    ],
    labels: [],
    list: [],
    selectionList: [],
    setCellClassName: (val: any) => {
      const { balance } = val.row;
      return balance || balance !== 0 ? 'td_text_red' : '';
    }
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
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  private submitLoading = false;

  // 弹出框类型
  dialogName = '';

  /** singleForm 验证 */
  private singleFormRules = {
    coach: [
      {
        required: true,
        message: '请选择教练',
        trigger: 'blur',
      },
    ],
  };

  /** 教练搜索下拉配置项 */
  private coachOption = {
    options: [],
    loading: false,
  };

  // 学员详情数据
  userBaseInfoData: ParamsType = {
    flowId: 0, // 牌证id
    batchNo: '', // 批次号
    userName: '', // 姓名
    idNo: '', // 证件号码
    classesName: '', // 班别
    carModel: '', // 车型
    learnType: '', // 学车类型
    balance: 0, // 欠费金额
    acceptNumber: '', // 受理号
    step: null, // 科目
    // coachId: null, // 教练Id
    coachName: '', // 教练
  };

  private statisticsData: StaticDataType[] = [
    {
      label: '未分配人数',
      value: 0,
    },
  ];

  // tab list
  private tabList = COACH_TAB;

  // 当前tab
  private activeTab = 2;

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** tab 选中回调 */
  @Watch('activeTab')
  async checkTab() {
    const { activeTab } = this;
    this.queryList();
    const _typeDta: ParamsType = {
      2: 'ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTWO',
      3: 'ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTHREE',
    };
    this.tableLabelType = _typeDta[activeTab];
    this.initSetTableLabel();
  }

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
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
    // 导出
    if (id === 10) {
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
        this.recordExportCount(selectionList.length, name);
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
    // 分配教练
    if (id === 1) {
      if (_len === 1) {
        this.dialogName = 'singleForm';
        this.jumpDetail(selectionList[0]);
      } else if (_len < 1) {
        this.$message.warning('请先勾学员！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
  }

  /** @description singleForm弹出框按钮回调 */
  singleInfoButtonCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.submitSingleForm(data);
      }
    } else {
      this.dialogName = '';
      this._resetSingForm();
    }
  }

  // 清空singleForm
  _resetSingForm() {
    (this.$refs.singleFormDialog as VueComponentParent).resetFields();
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

  coachChange() {
    // 当change后输入的下拉框自动清空
    this.coachOption.options = [];
  }

  // 列表分页

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

  // 获取教练下拉搜索框数据
  async queryCoach(query: any) {
    let organid = 16;
    if (!organid) {
      organid = 0;
    }
    if (query !== '') {
      this.coachOption.loading = true;
      await this.getAllotCoachesCoaches({
        name: query,
        organId: organid,
      })
        .then((res: any) => {
          this.coachOption.options = res;
        })
        .catch((err: any) => {
          this.$message.warning(String(err));
        });
      this.coachOption.loading = false;
    } else {
      this.coachOption.options = [];
    }
  }

  /**
   * @description 列表单项点击绑定详情数据
   */
  private jumpDetail(val: ParamsType) {
    this.userBaseInfoData = setFormDataFunc(val, this.userBaseInfoData);
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    // 处理数据
    const sendData = {
      ..._data,
      step: this.activeTab,
    };
    try {
      const body = await this.queryAllotCoaches(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.statisticsData[0].value = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  /** @description 提交单项更新 分配教练 */
  submitSingleForm(updateData: ParamsType) {
    const { drivingSchoolId } = this.userInfo;
    const sendData = {
      ...updateData,
      drivingSchoolId,
      coachId: 1,
    };
    this.postAllotCoachesCoach(sendData)
      .then(() => {
        this.$message.success('分配成功');
        this.paginationData.current = 1;
        this.queryList();
      })
      .finally(() => {
        this.dialogName = '';
        this._resetSingForm();
      });
  }

  async mounted() {
    this.tableData._this = this;

    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryClassesList(drivingSchoolId);
    this.tableLabelType = 'ASSIGNMENT_COACH_LIST_LABEL_SUBJECTTWO';
    this.queryList();
    this.initSearch();
    this.initSetTableLabel();
  }
}
</script>
<style lang="scss" scoped>
.ctjt_form_item_class {
  width: 380px;
  .el-date-editor,
  .el-select {
    width: 100%;
  }
}
</style>
