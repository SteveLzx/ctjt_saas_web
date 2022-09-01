<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>

    <el-drawer
      :visible.sync="drawer"
      size="80%">
      <CtjtCard :prop-data="{ title: '新增年审记录' }">
        <template #content>
          <el-form ref="formDataRef" :model="formData" :rules="formRules" label-width="100px">
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="车牌号" prop="carNumber">
                  <el-autocomplete
                    class="w_200"
                    v-model="formData.carNumber"
                    :fetch-suggestions="queryCarNumberSearch"
                    value-key="licenseplate"
                    placeholder="请输入车牌号"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="行驶证年检有效期" prop="drivingPermitValidity">
                  <el-date-picker
                    class="w_200"
                    v-model="formData.drivingPermitValidity"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年检费" prop="annualInspectionFee">
                  <el-input class="w_200" v-model="formData.annualInspectionFee" placeholder="请输入年检费"></el-input>元
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="年检报销日期" prop="annualInspectionDate">
                  <el-date-picker
                    class="w_200"
                    v-model="formData.annualInspectionDate"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="环保分类标志" prop="environmental">
                  <el-select class="w_200" v-model="formData.environmental" placeholder="请选择">
                    <el-option
                      v-for="item in environmentalOpt"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="黄绿标费用" prop="olivineFee">
                  <el-input class="w_200" v-model="formData.olivineFee" placeholder="请输入黄绿标费用"></el-input>元
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="综检地点" prop="synthesisSite">
                  <el-input class="w_200" v-model.trim="formData.synthesisSite" maxlength="20" show-word-limit placeholder="请输入综检地点"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="环保有效期" prop="environmentalValidity">
                  <el-date-picker
                    class="w_200"
                    v-model="formData.environmentalValidity"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="综检费" prop="synthesisFee">
                  <el-input class="w_200" v-model="formData.synthesisFee" placeholder="请输入综检费"></el-input>元
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="综检报销日期" prop="synthesisDate">
                  <el-date-picker
                    class="w_200"
                    v-model="formData.synthesisDate"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="二级维护日期" prop="secondLevelMaintain">
                  <el-date-picker
                    class="w_200"
                    v-model="formData.secondLevelMaintain"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="16">
                <el-form-item label="备注" prop="remake">
                  <el-input class="w_600" type="textarea" v-model.trim="formData.remake" placeholder="请输入" show-word-limit maxlength="300"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-button @click="cancel()">取消</el-button>
              <el-button type="primary" @click="submit()" :loading="submitLoading">保存</el-button>
            </el-row>
          </el-form>
        </template>
      </CtjtCard>
    </el-drawer>
  </div>
</template>
<script lang='ts'>
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import {
  CtjtTable, CtjtPagination, SearchTable, CtjtCard
} from '@/components';
import { ParamsType, VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import { drawSearchForm } from '@/assets/js/search_table';
import { deepClone, timestampSizeCompare, REG_PRICE_OR_ZONE } from '@/assets/js/common';

const environmentalOpt = [
  { id: 1, label: '黄标' }, { id: 2, label: '绿标' }
];

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    SearchTable,
    CtjtCard
  }
})
export default class VehicleInfoMgAnnualRecord extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo!: ParamsType;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('car/queryfindByPlateNumber') private queryfindByPlateNumber!: (data: any) => any;

  @Action('car/queryAnnualVerificationList') private queryAnnualVerificationList!: (data: any) => any;

  @Action('car/saveOrUpdateVerificationList') private saveOrUpdateVerificationList!: (data: any) => any;

  @Action('car/deleteByIdVerificationList') private deleteByIdVerificationList!: (data: any) => any;

  @Action('car/exportAnnualVerificationList') private exportAnnualVerificationList!: (data: any) => any;

  searchForm = {
    inputList: [
      {
        label: '车牌号',
        key: 'carNumber',
        type: 'text',
        value: '',
        width: 200,
        clearable: true,
        placeholder: '请输入',
      }
    ],
    selectList: [
      {
        label: '驾校',
        key: 'drivingSchoolId',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: []
      },
      {
        label: '片区',
        key: 'regionId',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: []
      },
    ],
    datePickerList: [
      {
        label: '年检日期',
        key: 'annualInspectionStartDate',
        value: '',
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'annualInspectionEndDate',
        value: '',
        placeholder: '结束时间',
        type: 'date',
        width: 140,
      },
      {
        label: '二级维护日期',
        key: 'maintainStartDate',
        value: '',
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'maintainEndDate',
        value: '',
        placeholder: '结束时间',
        type: 'date',
        width: 140,
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        path: 'btn_search'
      },
    ]
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.searchForm.selectList[0].value = '';
      this.searchForm.selectList[1].value = '';
      this.searchForm.selectList[1].options = [];
    }
  }

  /** 搜索筛选框选择回调 */
  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) this.selectFunc('region', value);
    }
  }

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'driverSchool') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'region') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  // 列表
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    index: true,
    selection: true,
    selectionList: [],
    list: [],
    labels: [
      {
        key: 'carNumber',
        label: '车牌号',
      },
      {
        key: 'drivingPermitValidity',
        label: '行驶证年检有效期',
        minWidth: 140,
        render(h: any, params: any) {
          const { drivingPermitValidity } = params.row;
          if (!drivingPermitValidity) return '';
          return h('span', dayjs(drivingPermitValidity).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'environmental',
        label: '环保分类标志',
        minWidth: 110,
        render(h: any, params: any) {
          const { environmental } = params.row;
          const list = environmentalOpt.filter((item: any) => item.id === environmental);
          const { label = '' } = list[0] || {};
          return h('span', label);
        }
      },
      {
        key: 'environmentalValidity',
        label: '环保有效期',
        minWidth: 110,
        render(h: any, params: any) {
          const { environmentalValidity } = params.row;
          if (!environmentalValidity) return '';
          return h('span', dayjs(environmentalValidity).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'createdName',
        label: '经办人',
      },
      {
        key: 'annualInspectionFee',
        label: '年检费用',
      },
      {
        key: 'annualInspectionDate',
        label: '年检报销日期',
        minWidth: 110,
        render(h: any, params: any) {
          const { annualInspectionDate } = params.row;
          if (!annualInspectionDate) return '';
          return h('span', dayjs(annualInspectionDate).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'olivineFee',
        label: '黄绿标费用',
        minWidth: 100,
      },
      {
        key: 'synthesisDate',
        label: '综合报销日期',
        minWidth: 110,
        render(h: any, params: any) {
          const { synthesisDate } = params.row;
          if (!synthesisDate) return '';
          return h('span', dayjs(synthesisDate).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'synthesisSite',
        label: '综合检测地点',
        minWidth: 110,
      },
      {
        key: 'synthesisFee',
        label: '综合费用',
      },
      {
        key: 'secondLevelMaintain',
        label: '二级维护日期',
        minWidth: 110,
        render(h: any, params: any) {
          const { secondLevelMaintain } = params.row;
          if (!secondLevelMaintain) return '';
          return h('span', dayjs(secondLevelMaintain).format('YYYY-MM-DD'));
        }
      }
    ],
    options: [
      {
        id: 1,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
      {
        id: 3,
        label: '删除',
        type: 'danger',
        path: 'btn_delete'
      },
      {
        id: 4,
        label: '导出',
        path: 'btn_export'
      },
    ],
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.drawer = true;
      this.$nextTick(() => {
        (this.$refs.formDataRef as VueComponentParent).clearValidate();
      });
      return;
    }
    if (id === 4) {
      this.exportList();
      return;
    }
    const { selectionList } = this.tableData;
    const len = selectionList.length;
    if (len === 0) {
      this.$message.warning('请勾选需要操作的数据');
      return;
    }
    if (id === 2) {
      if (len > 1) {
        this.$message.warning('只能单条操作');
        return;
      }
      this.jumpDetail(selectionList[0]);
    }
    if (id === 3) {
      this.deleteFunc(selectionList);
    }
  }

  jumpDetail(row: any) {
    Object.keys(this.formData).forEach(key => {
      if (row[key] !== undefined) {
        this.formData[key] = row[key];
      }
    });
    this.drawer = true;
  }

  deleteFunc(list: any[]) {
    this.$confirm('是否删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const ids: string[] = [];
      list.forEach((item: any) => {
        const { id } = item;
        ids.push(id);
      });
      this.deleteByIdVerificationList(ids).then(() => {
        this.queryList();
        this.$message.success('删除成功');
      });
    });
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

  async exportList() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const {
      annualInspectionEndDate, annualInspectionStartDate, maintainEndDate, maintainStartDate
    } = _data;
    const sendData = {
      ..._data,
      ...{
        annualInspectionStartDate: annualInspectionStartDate ? `${annualInspectionStartDate} 00:00:00` : '',
        annualInspectionEndDate: annualInspectionEndDate ? `${annualInspectionEndDate} 23:59:59` : '',
        maintainStartDate: maintainStartDate ? `${maintainStartDate} 00:00:00` : '',
        maintainEndDate: maintainEndDate ? `${maintainEndDate} 23:59:59` : '',
      }
    };
    const body = await this.exportAnnualVerificationList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `年审记录${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /**
   * 请求订单列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const {
      annualInspectionEndDate, annualInspectionStartDate, maintainEndDate, maintainStartDate
    } = _data;
    // 判断时间
    if (annualInspectionStartDate && annualInspectionEndDate && timestampSizeCompare(annualInspectionStartDate, annualInspectionEndDate)) {
      this.$message.warning('年检日期开始时间不能大于结束时间');
      return;
    }
    if (maintainStartDate && maintainEndDate && timestampSizeCompare(maintainStartDate, maintainEndDate)) {
      this.$message.warning('二级维护日期开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data,
      ...{
        annualInspectionStartDate: annualInspectionStartDate ? `${annualInspectionStartDate} 00:00:00` : '',
        annualInspectionEndDate: annualInspectionEndDate ? `${annualInspectionEndDate} 23:59:59` : '',
        maintainStartDate: maintainStartDate ? `${maintainStartDate} 00:00:00` : '',
        maintainEndDate: maintainEndDate ? `${maintainEndDate} 23:59:59` : '',
      }
    };
    try {
      const body = await this.queryAnnualVerificationList(sendData);
      const {
        data, current, total
      } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  private drawer = false;

  environmentalOpt = environmentalOpt;

  deepFormData: ParamsType = {
    annualInspectionDate: '',
    annualInspectionFee: '',
    carNumber: '',
    drivingPermitValidity: '',
    environmental: null,
    environmentalValidity: '',
    id: null,
    olivineFee: '',
    remake: '',
    secondLevelMaintain: '',
    synthesisDate: '',
    synthesisFee: '',
    synthesisSite: ''
  }

  private formData = deepClone(this.deepFormData);

  private formRules = {
    carNumber: [
      { required: true, message: '请输入车牌号', trigger: ['change', 'blur'] }
    ],
    drivingPermitValidity: [
      { required: true, message: '请选择行驶证年检有效期', trigger: ['change'] }
    ],
    environmental: [
      { required: true, message: '请选择环保分类标志', trigger: ['change'] }
    ],
    environmentalValidity: [
      { required: true, message: '请选择环保有效期', trigger: ['change'] }
    ],
    annualInspectionFee: [
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数', trigger: ['change', 'blur'] },
    ],
    olivineFee: [
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数', trigger: ['change', 'blur'] },
    ],
    synthesisFee: [
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数', trigger: ['change', 'blur'] },
    ]
  }

  // 车牌号
  async queryCarNumberSearch(value: string, cb: any) {
    const body = await this.queryfindByPlateNumber({ plateNumber: value });
    cb(body);
  }

  cancel() {
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = this.deepFormData[key];
    });
    this.drawer = false;
  }

  private submitLoading = false;

  submit() {
    (this.$refs.formDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const {
          annualInspectionDate, drivingPermitValidity, environmentalValidity, secondLevelMaintain, synthesisDate, id
        } = this.formData;
        const sendData = deepClone(this.formData);
        sendData.annualInspectionDate = annualInspectionDate ? this.$dayjs(annualInspectionDate).format('YYYY-MM-DD') : '';
        sendData.drivingPermitValidity = drivingPermitValidity ? this.$dayjs(drivingPermitValidity).format('YYYY-MM-DD HH:mm:ss') : '';
        sendData.environmentalValidity = environmentalValidity ? this.$dayjs(environmentalValidity).format('YYYY-MM-DD HH:mm:ss') : '';
        sendData.secondLevelMaintain = secondLevelMaintain ? this.$dayjs(secondLevelMaintain).format('YYYY-MM-DD HH:mm:ss') : '';
        sendData.synthesisDate = synthesisDate ? this.$dayjs(synthesisDate).format('YYYY-MM-DD') : '';
        if (!id) delete sendData.id;
        this.saveOrUpdateVerificationList(sendData).then(() => {
          this.queryList();
          this.cancel();
          this.$message.success(`${id > 0 ? '编辑' : '新增'}成功`);
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  // 生命周期函数
  async mounted() {
    this.tableData._this = this;
    this.queryList();
    this.selectFunc('driverSchool', '0');

    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
</style>
