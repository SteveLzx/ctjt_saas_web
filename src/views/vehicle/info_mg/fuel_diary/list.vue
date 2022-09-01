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
      <CtjtCard :prop-data="{ title: `${formData.id > 0 ? '编辑' : '新增'}加油小票` }">
        <template #content>
          <el-form ref="formDataRef" :model="formData" :rules="formRules" label-width="100px">
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="车牌号" prop="carNumber">
                  <el-autocomplete
                    class="w_200"
                    v-model="formData.carNumber"
                    @select="hanldCarNumberSelect"
                    :fetch-suggestions="queryCarNumberSearch"
                    value-key="licenseplate"
                    placeholder="请输入车牌号"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="加油量(L)" prop="oilQuantity">
                  <el-input class="w_200" v-model="formData.oilQuantity" @input="onChangeOilQuantityValue" placeholder="请输入加油量"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单价(元)" prop="price">
                  <el-input class="w_200" v-model="formData.price" @input="onChangePriceValue" placeholder="请输入单价"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合计(元)" prop="sum">
                  <el-input class="w_200" v-model="formData.sum" placeholder="加油量*单价" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="加油时间" prop="refuelDate">
                  <el-date-picker
                    class="w_200"
                    v-model="formData.refuelDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择加油时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="油品" prop="oilType">
                  <el-select class="w_200" v-model="formData.oilType" placeholder="请选择">
                    <el-option
                      v-for="item in oilTypeOpt"
                      :key="item.id"
                      :label="item.label"
                      :value="item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="付款方式" prop="payType">
                  <el-select class="w_200" v-model="formData.payType" placeholder="请选择">
                    <el-option
                      v-for="item in payTypeOpt"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="16">
                <el-form-item label="备注" prop="remark">
                  <el-input class="w_600" type="textarea" v-model.trim="formData.remark" placeholder="请输入" show-word-limit maxlength="200"></el-input>
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
import { ParamsType, VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  deepClone, timestampSizeCompare, spliceHoursAndMinutesAndSeconds, REG_PRICE_OR_ZONE
} from '@/assets/js/common';
import {
  CtjtTable, CtjtPagination, SearchTable, CtjtCard
} from '@/components';

const oilTypeOpt = [
  { id: 1, label: '未填' },
  { id: 2, label: '0#' },
  { id: 3, label: '90#' },
  { id: 4, label: '93#' },
  { id: 5, label: '97#' },
  { id: 6, label: '电' },
  { id: 7, label: '92#' },
  { id: 8, label: '95#' },
  { id: 9, label: '98#' },
  { id: 10, label: '天然气' },
  { id: 11, label: '油及电' },
];

const statisticTypeOpt = [
  { id: 1, label: '加油小票数据' },
  { id: 2, label: '导入数据' }
];

const payTypeOpt = [
  { id: 1, label: '油卡' },
  { id: 2, label: '现金' }
];

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    SearchTable,
    CtjtCard
  }
})
export default class VehicleInfoMgFuelDiary extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo!: ParamsType;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('car/queryfindByPlateNumber') private queryfindByPlateNumber!: (data: any) => any;

  @Action('car/queryRefuelRecordList') private queryRefuelRecordList!: (data: any) => any;

  @Action('car/saveOrUpdateRefuelRecord') private saveOrUpdateRefuelRecord!: (data: any) => any;

  @Action('car/deleteRefuelRecordByIds') private deleteRefuelRecordByIds!: (data: any) => any;

  @Action('car/exportRefuelRecordList') private exportRefuelRecordList!: (data: any) => any;

  private oilTypeOpt = oilTypeOpt;

  private payTypeOpt = payTypeOpt;

  searchForm = {
    inputList: [
      {
        label: '关键词',
        key: 'keyword',
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
      {
        label: '燃油种类',
        key: 'oilType',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: oilTypeOpt,
      },
      {
        label: '统计方式',
        key: 'statisticType',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: statisticTypeOpt
      },
    ],
    datePickerList: [
      {
        label: '加油时间',
        key: 'refuelStartDate',
        value: '',
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'refuelEndDate',
        value: '',
        placeholder: '结束时间',
        type: 'date',
        width: 140,
      }
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        plain: false,
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
        key: 'useUser',
        label: '使用人',
      },
      {
        key: 'refuelDate',
        label: '加油时间',
      },
      {
        key: 'oilType',
        label: '油品',
      },
      {
        key: 'oilQuantity',
        label: '加油量(L)',
        minWidth: 90
      },
      {
        key: 'sum',
        label: '合计(元)',
        minWidth: 80,
        isPrice: true
      },
      {
        key: 'payType',
        label: '付款方式',
        render(h: any, params: any) {
          const { payType } = params.row;
          const list = payTypeOpt.filter((item: any) => item.id === payType);
          const { label = '' } = list[0] || {};
          return h('span', label);
        }
      },
      {
        key: 'oilCardNum',
        label: '油卡号',
      },
      {
        key: 'petrolStationName',
        label: '油站',
        showOverflowTooltip: true
      },
      {
        key: 'petrolStationCode',
        label: '油站代码',
      },
      {
        key: 'oilTypeCode',
        label: '油品代码',
      },
      {
        key: 'oldCarNumber',
        label: '原车牌号',
      },
      {
        key: 'discount',
        label: '折让'
      },
      {
        key: 'discountRate',
        label: '折让率'
      },
      {
        key: 'realDiscountRate',
        label: '实际折让率',
        width: 100
      },
      {
        key: 'listPrice',
        label: '挂牌价'
      },
      {
        key: 'residueDeduction',
        label: '剩余抵扣'
      },
      {
        key: 'priorPeriodDeduction',
        label: '上期抵扣'
      }
    ],
    options: [
      {
        id: 1,
        label: '录入加油小票',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
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
      }
    ]
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.newAddApply();
      return;
    }
    if (id === 4) {
      this.exportList();
      return;
    }
    const { selectionList } = this.tableData;
    const len = selectionList.length;
    if (len === 0) this.$message.warning('请勾选需要操作的数据');
    if (id === 2) {
      if (len > 1) this.$message.warning('只能单条操作');
      if (len === 1) {
        this.jumpDetail(selectionList[0]);
      }
    }
    if (id === 3) {
      this.deleteFunc(selectionList);
    }
  }

  deleteFunc(val: any) {
    this.$confirm('是否删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const ids: string[] = [];
      val.forEach((item: any) => {
        const { id } = item;
        ids.push(id);
      });
      this.deleteRefuelRecordByIds({ ids }).then(() => {
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
    const { refuelStartDate, refuelEndDate } = _data;
    const sendData = {
      ..._data,
      refuelStartDate: refuelStartDate ? spliceHoursAndMinutesAndSeconds(1, refuelStartDate) : '',
      refuelEndDate: refuelEndDate ? spliceHoursAndMinutesAndSeconds(2, refuelEndDate) : '',
    };
    const body = await this.exportRefuelRecordList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `加油记录${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /**
   * 请求订单列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { refuelStartDate, refuelEndDate } = _data;
    // 判断时间
    if (refuelStartDate && refuelEndDate && timestampSizeCompare(refuelStartDate, refuelEndDate)) {
      this.$message.warning('加油时间开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data,
      refuelStartDate: refuelStartDate ? spliceHoursAndMinutesAndSeconds(1, refuelStartDate) : '',
      refuelEndDate: refuelEndDate ? spliceHoursAndMinutesAndSeconds(2, refuelEndDate) : '',
    };
    try {
      this.tableData.loading = true;
      const body = await this.queryRefuelRecordList(sendData);
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

  async newAddApply() {
    this.drawer = true;
  }

  private drawer = false;

  // 车牌号
  async queryCarNumberSearch(value: string, cb: any) {
    const body = await this.queryfindByPlateNumber({ plateNumber: value });
    cb(body);
  }

  hanldCarNumberSelect(value: any) {
    const { cbiid = '' } = value;
    this.formData.cbiId = String(cbiid);
  }

  private formData: ParamsType = {
    carNumber: '',
    cbiId: '',
    id: '',
    oilQuantity: '',
    oilType: '',
    payType: null,
    refuelDate: '',
    remark: '',
    sum: 0,
    price: ''
  }

  private formRules = {
    carNumber: [
      { required: true, message: '请输入车牌号', trigger: ['change', 'blur'] }
    ],
    oilQuantity: [
      { required: true, message: '请输入加油量', trigger: ['blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围1-999999,可保留两位小数' }
    ],
    price: [
      { required: true, message: '请输入单价', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围1-999999,可保留两位小数' }
    ],
    sum: [
      { required: true, message: '请输入合计', trigger: ['change', 'blur'] }
    ],
    refuelDate: [
      { required: true, message: '请选择加油时间', trigger: ['blur'] }
    ],
    oilType: [
      { required: true, message: '请选择油品', trigger: ['blur'] }
    ],
    payType: [
      { required: true, message: '请选择付款方式', trigger: ['blur'] }
    ],
  };

  onChangeOilQuantityValue(val: any) {
    const { price = 0 } = this.formData;
    if (REG_PRICE_OR_ZONE.test(val)) {
      const sum = price * val;
      this.formData.sum = sum.toFixed(2);
    }
  }

  onChangePriceValue(val: any) {
    const { oilQuantity = 0 } = this.formData;
    if (REG_PRICE_OR_ZONE.test(val)) {
      const sum = oilQuantity * val;
      this.formData.sum = sum.toFixed(2);
    }
  }

  cancel() {
    (this.$refs.formDataRef as VueComponentParent).resetFields();
    this.drawer = false;
  }

  private submitLoading = false;

  submit() {
    (this.$refs.formDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { refuelDate, id } = this.formData;
        this.formData.refuelDate = this.$dayjs(refuelDate).format('YYYY-MM-DD hh:mm:ss');
        const sendData = deepClone(this.formData);
        if (!id) delete sendData.id;
        delete sendData.price;
        this.submitLoading = true;
        this.saveOrUpdateRefuelRecord(sendData).then(() => {
          this.queryList();
          this.cancel();
          this.$message.success(`${id > 0 ? '修改' : '新增'}成功`);
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  async jumpDetail(val: any) {
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = val[key];
    });
    // 手动计算单价
    const { oilQuantity, sum } = this.formData;
    this.formData.price = (sum / oilQuantity).toFixed(2);
    this.drawer = true;
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
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
</style>
