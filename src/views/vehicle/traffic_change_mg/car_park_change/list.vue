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
      <CtjtCard :prop-data="{ title: '新增停车点变更' }">
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
              <el-col :span="8">
                <el-form-item label="原停车点" prop="oldParkingSpot">
                  <el-input class="w_200" v-model="formData.oldParkingSpot" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="原停车费(元)" prop="oldParkingMoney">
                  <el-input class="w_200" v-model="formData.oldParkingMoney" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="变更后停车点" prop="newParkingSpot">
                  <el-select class="w_200" v-model="formData.newParkingSpot" placeholder="请选择" @change="hanldParkingSpotChange">
                    <el-option-group
                      v-for="group in parkingSpotOpt"
                      :key="group.label"
                      :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.id"
                        :label="item.parkingName"
                        :value="item.parkingName">
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="变更后停车费(元)" prop="newParkingMoney">
                  <el-input class="w_200" v-model="formData.newParkingMoney" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="16">
                <el-form-item label="变更原因" prop="changeCause">
                  <el-input class="w_600" type="textarea" v-model.trim="formData.changeCause" placeholder="请输入" show-word-limit maxlength="300"></el-input>
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

    <el-drawer
      :visible.sync="drawerDetail"
      size="80%">
      <CtjtCard :prop-data="{ title: '车辆变更停车点详情', tips: `当前审核状态：${getStatus(detailFormData.verifyStatus)}`}">
        <template #content>
          <el-form label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="车牌号:">{{detailFormData.carNumber}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="原停车点:">{{detailFormData.oldParkingSpot}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="原停车费(元):">{{detailFormData.oldParkingMoney}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="变更后停车点:">{{detailFormData.newParkingSpot}}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="变更后停车费(元):">{{detailFormData.newParkingMoney}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="变更原因:">{{detailFormData.changeCause}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <CtjtTable :tableData="detailTableData"></CtjtTable>
        </template>
      </CtjtCard>
    </el-drawer>
  </div>
</template>
<script lang='ts'>
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import { ParamsType, VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import { drawSearchForm } from '@/assets/js/search_table';
import { deepClone, timestampSizeCompare } from '@/assets/js/common';
import { approveStatusOpts } from '@/views/educational/_enums';
import {
  CtjtTable, CtjtPagination, SearchTable, CtjtCard
} from '@/components';

const _endDate = dayjs(new Date()).format('YYYY-MM-DD');

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    SearchTable,
    CtjtCard
  }
})
export default class VehicleTrafficChangeMgCarParkChange extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo!: ParamsType;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('car/queryfindByPlateNumber') private queryfindByPlateNumber!: (data: any) => any;

  @Action('car/queryParkingPullList') private queryParkingPullList!: () => any;

  @Action('car/saveParkingApply') private saveParkingApply!: (data: any) => any;

  @Action('car/queryParkingApplyList') private queryParkingApplyList!: (data: any) => any;

  @Action('car/backOutApproveParkingApply') private backOutApprove!: (data: any) => any;

  @Action('car/noPassApproveParkingApply') private noPassApprove!: (data: any) => any;

  @Action('car/passApproveParkingApply') private passApprove!: (data: any) => any;

  @Action('car/queryParkingApplyById') private queryParkingApplyById!: (data: any) => any;

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
      // {
      //   label: '驾校',
      //   key: 'drivingSchoolId',
      //   value: '',
      //   width: 200,
      //   placeholder: '请选择',
      //   clearable: true,
      //   options: []
      // },
      // {
      //   label: '片区',
      //   key: 'regionId',
      //   value: '',
      //   width: 200,
      //   placeholder: '请选择',
      //   clearable: true,
      //   options: []
      // },
      {
        label: '状态',
        key: 'verifyStatus',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: approveStatusOpts
      },
    ],
    datePickerList: [
      {
        label: '申请日期',
        key: 'beginDate',
        value: deepClone(_endDate),
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: deepClone(_endDate),
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
      // this.searchForm.selectList[0].value = '';
      // this.searchForm.selectList[1].value = '';
      // this.searchForm.selectList[1].options = [];
      this.searchForm.datePickerList[0].value = deepClone(_endDate);
      this.searchForm.datePickerList[1].value = deepClone(_endDate);
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
        render(h: any, params: any) {
          const { carNumber, id } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(id);
              }
            }
          },
          carNumber);
        }
      },
      {
        key: 'useUserName',
        label: '使用人',
      },
      {
        key: 'oldParkingSpot',
        label: '停车点',
        showOverflowTooltip: true
      },
      {
        key: 'oldParkingMoney',
        label: '停车费',
        isPrice: true
      },
      {
        key: 'newParkingSpot',
        label: '变更后停车点',
        minWidth: 110,
        showOverflowTooltip: true
      },
      {
        key: 'newParkingMoney',
        label: '变更后停车费',
        minWidth: 110,
        isPrice: true
      },
      {
        key: 'verifyStatus',
        label: '审核状态',
        render(h: any, params: any) {
          const { verifyStatus } = params.row;
          const list = approveStatusOpts.filter((item: any) => item.id === verifyStatus);
          const { label = '' } = list[0] || {};
          return h('span', label);
        }
      },
      {
        key: 'verifyNode',
        label: '当前审核环节',
        minWidth: 110,
        showOverflowTooltip: true
      },
      {
        key: 'verifyUser',
        label: '审核人',
      },
      {
        key: 'createdName',
        label: '申请人',
      },
      {
        key: 'createdTime',
        label: '申请日期',
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
        label: '撤销',
        type: 'warning',
        path: 'btn_revoke'
      },
      {
        id: 3,
        label: '审核通过',
        type: 'success',
        path: 'btn_pass'
      },
      {
        id: 4,
        label: '驳回',
        type: 'danger',
        path: 'btn_reject'
      },
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
    const { selectionList } = this.tableData;
    const len = selectionList.length;
    if (len === 0) this.$message.warning('请勾选需要操作的数据');
    if (len > 1) this.$message.warning('只能单条操作');
    if (len === 1) {
      const { id: iid, verifyStatus } = selectionList[0];
      if (verifyStatus === 0) {
        this.verifyStatusOption(id, iid);
      } else {
        this.$message.warning('请勾选审核中的数据');
      }
    }
  }

  // 操作审核状态
  verifyStatusOption(optId: number, id: string) {
    if (optId === 2) {
      this.$confirm('是否撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.backOutApprove({ id }).then(() => {
          this.queryList();
          this.$message.success('撤销成功');
        });
      });
    }
    if (optId === 3) {
      this.$confirm('是否通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.passApprove({ id, verifyOpinion: '通过' }).then(() => {
          this.queryList();
          this.$message.success('审核成功');
        });
      });
    }
    if (optId === 4) {
      this.$prompt('请输入驳回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '输入内容长度为1-30'
      }).then((res: any) => {
        const { value } = res;
        if (value && value.length <= 30) {
          this.noPassApprove({ id, verifyOpinion: res.value }).then(() => {
            this.queryList();
            this.$message.success('驳回成功');
          });
        }
      });
    }
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

  /**
   * 请求订单列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const {
      beginDate, endDate
    } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('申请日期开始时间不能大于结束时间');
      return;
    }
    const sendData = { ..._data };
    try {
      const body = await this.queryParkingApplyList(sendData);
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

  async newAddApply() {
    this.queryParkingSpotOpt();
    this.drawer = true;
  }

  // 车牌号
  async queryCarNumberSearch(value: string, cb: any) {
    const body = await this.queryfindByPlateNumber({ plateNumber: value });
    cb(body);
  }

  hanldCarNumberSelect(value: any) {
    const {
      parkingMoney = '', useperson, usePersonId = '', parkingPoint = ''
    } = value;
    this.formData.oldParkingMoney = parkingMoney;
    this.formData.oldParkingSpot = parkingPoint;
    this.formData.useUserName = useperson;
    this.formData.useUserId = usePersonId;
  }

  // 停车点
  private parkingSpotOpt = [];

  async queryParkingSpotOpt() {
    const body = await this.queryParkingPullList();
    const data = deepClone(body);
    const list: any = [];
    Object.keys(data).forEach(key => {
      const obj = {
        label: key,
        options: data[key]
      };
      list.push(obj);
    });
    this.parkingSpotOpt = list;
  }

  hanldParkingSpotChange(val: string) {
    this.parkingSpotOpt.forEach((item: any) => {
      const { options } = item;
      options.forEach((i: any) => {
        const { parkingName: iparkingName, parkingCost = 0 } = i;
        if (val === iparkingName) {
          this.formData.newParkingMoney = parkingCost;
        }
      });
    });
  }

  private formData: ParamsType = {
    carNumber: '',
    changeCause: '',
    newParkingMoney: '',
    newParkingSpot: '',
    oldParkingMoney: '',
    oldParkingSpot: '',
    useUserId: 0,
    useUserName: ''
  }

  private formRules = {
    carNumber: [
      { required: true, message: '请输入车牌号', trigger: ['change', 'blur'] }
    ],
    newParkingSpot: [
      { required: true, message: '请选择变更后停车点', trigger: ['blur'] }
    ],
  }

  cancel() {
    (this.$refs.formDataRef as VueComponentParent).resetFields();
    this.drawer = false;
  }

  private submitLoading = false;

  submit() {
    (this.$refs.formDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = deepClone(this.formData);
        this.saveParkingApply(sendData).then(() => {
          this.queryList();
          this.cancel();
          this.$message.success('新增成功');
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  async jumpDetail(id: string) {
    const body = await this.queryParkingApplyById({ id });
    const { recordList } = body;
    this.detailTableData.list = recordList;
    this.detailFormData = body;
    this.drawerDetail = true;
  }

  // 详情弹窗
  private drawerDetail = false;

  private detailFormData = {};

  private detailTableData: ParamsType = {
    list: [],
    labels: [
      {
        key: 'verifyNode',
        label: '审批环节',
        showOverflowTooltip: true
      },
      {
        key: 'createdName',
        label: '审核人',
      },
      {
        key: 'verifyOperation',
        label: '审核操作',
      },
      {
        key: 'verifyOpinion',
        label: '审核意见',
        showOverflowTooltip: true
      },
      {
        key: 'verifyDate',
        label: '审核时间'
      },
    ]
  }

  getStatus(value: number) {
    const list = approveStatusOpts.filter((item: any) => item.id === value);
    const { label = '' } = list[0] || {};
    return label;
  }

  // 生命周期函数
  async mounted() {
    this.tableData._this = this;
    this.queryList();
    // this.selectFunc('driverSchool', '0');

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
