// 教练排班管理
<template>
  <div class="page" ref="pageRef">
    <SearchTable :prop-data.sync="searchFormData" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable
      ref="ctjtTableReference"
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
      @cell-click="cellClick"
    />
    <!-- <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination> -->
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
    <!-- 约车时间段列表详情 -->
    <el-dialog :visible.sync="showDetailList" width="60%" title="练车详情">
      <el-table :data="detailList"  border>
        <el-table-column align="center" prop="classesType" label="练车班次">
          <template slot-scope="scope">
            {{scope.row.classesType === 1 ? '自由班' : scope.row.classesType === 2 ? '2小时班' : '3小时班'}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="timeFrameName" label="班次选择"/>
        <el-table-column align="center" prop="studentName" label="学员姓名"/>
        <el-table-column align="center" label="操作" v-if="perm.btn_detail">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="openDetail(scope.row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button type="info" @click="showDetailList = false">关闭</el-button>
        </el-row>
      </span>
    </el-dialog>
    <!-- 约车详情 -->
    <el-drawer
      :visible="showDetail"
      size="1300px"
      :withHeader="false"
      :direction="'rtl'"
      :show-close="false"
    >
      <el-container style="height: 100%">
        <el-main>
          <CtjtCard :prop-data="{ title: `约车${buttonType === 0 ? '': '补录'}` }">
            <template #content>
              <el-form ref="detailForm" :model="detail" :rules="isEdit ? detailDataRules : {}" label-width="110px" :inline="true">
                <el-form-item label="查找学员: " v-if="isEdit">
                  <el-input class="w_300 mr-20" v-model="keyword" placeholder="请输入姓名/证件号码/联系电话"/>
                  <el-button type="primary" @click="searchStudent">查找</el-button>
                </el-form-item>
                <div style="color: red;font-size: 14px;" v-if="isEdit">请选择一个订单</div>
                <el-table border :data="orderList" @row-click="chooseOrder" v-if="isEdit" highlight-current-row>
                  <el-table-column align="center" label="序号" type="index" :index="index => index + 1" width="50"/>
                  <el-table-column align="center" prop="name" label="姓名"/>
                  <el-table-column align="center" prop="idNo" label="证件号码"/>
                  <el-table-column align="center" prop="mobile" label="联系方式" width="120"/>
                  <el-table-column align="center" prop="regionName" label="片区"/>
                  <el-table-column align="center" prop="storeName" label="门店"/>
                  <el-table-column align="center" prop="seq" label="订单号"/>
                  <el-table-column align="center" prop="applyDate" label="报名日期"/>
                  <el-table-column align="center" prop="carModel" label="车型" width="50"/>
                  <el-table-column align="center" prop="carBrand" label="车辆品牌" width="80"/>
                  <el-table-column align="center" prop="sumPeriod" label="总学时(含赠送)" width="80"/>
                  <el-table-column align="center" prop="usedPeriod" label="已学学时" width="80"/>
                  <el-table-column align="center" prop="surplusPeriod" label="剩余学时" width="80"/>
                </el-table>
                <el-row class="card-header" v-if="isEdit">
                  <span class="title">约车信息</span>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="学员姓名: " prop="studentName">
                      <el-input class="w_160" v-model="detail.studentName" disabled v-if="isEdit"/>
                      <div v-else>{{detail.studentName}}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="证件号码: " prop="studentIdNo">{{detail.studentIdNo}}</el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="教练姓名: " prop="coachId">
                      <el-select class="w_160" v-model="detail.coachId" placeholder="请选择" v-if="isEdit && !detail.disableCoach" filterable=""
                      @change="e => coachList.forEach(item => { if (item.id === e) detail.coachName = item.name })">
                        <el-option v-for="(item, index) in coachList" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                      <template v-else>{{detail.coachName}}</template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="约车日期: " prop="appointDate">
                      <el-date-picker class="w_160" type="date" placeholder="请选择约车日期" v-model="detail.appointDate" v-if="isEdit" :picker-options="pickerOptions"/>
                      <template v-else>{{detail.appointDate}}</template>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="练车班次: " prop="classesType">
                      <el-select class="w_160" v-model="detail.classesType" placeholder="请选择" v-if="isEdit" @change="() => detail.timeFrameName = ''">
                        <el-option v-for="(item, index) in classList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <template v-else>{{detail.classesType === 1 ? '自由班' : detail.classesType === 2 ? '2小时班' : '3小时班'}}</template>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="班次选择: " prop="timeFrameName" v-if="isEdit && detail.classesType !== 1">
                      <template>
                        <el-select class="w_160" v-model="detail.timeFrameName" placeholder="请选择">
                          <el-option v-for="(item, index) in timeList[detail.classesType]" :key="index" :label="item.label" :value="item.label"></el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                    <el-form-item label="班次选择: " prop="endTime" v-else-if="isEdit && detail.classesType === 1">
                      <el-time-select
                        class="w_120"
                        v-model="detail.startTime"
                        :picker-options="{
                          start: '07:00',
                          step: '00:15',
                          end: '22:00'
                        }"
                        placeholder="选择时间">
                      </el-time-select> -
                      <el-time-select
                      class="w_120"
                        v-model="detail.endTime"
                        :picker-options="{
                          start: '07:00',
                          step: '00:15',
                          end: '22:00',
                          minTime: detail.startTime
                        }"
                        placeholder="选择时间">
                      </el-time-select>
                    </el-form-item>
                    <el-form-item label="班次选择: " prop="timeFrameName" v-else>
                      <template>{{detail.timeFrameName}}</template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="跟踪人: " prop="followPerson">{{detail.followPerson}}</el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="车型: " prop="carModel">{{detail.carModel}}</el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="总学时(含赠送): " prop="sumPeriod">{{detail.sumPeriod}}</el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="7">
                    <el-form-item label="已学学时: " prop="usedPeriod">{{detail.usedPeriod}}</el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="剩余学时: ">{{detail.sumPeriod ? detail.sumPeriod - detail.usedPeriod : ''}}</el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="教学学时: " prop="currentPeriod">{{detail.period || currentPeriod}}</el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="接送地址: " prop="areaId" style="margin-bottom: 0">
                      <template v-if="isEdit">
                        <CtjtSelectAddress
                          :data-config="detail"
                          @success-call="addressSuccessFunc" :isEdit="true">
                        </CtjtSelectAddress>
                      </template>
                      <template v-else>{{detail.pickUpProvince + detail.pickUpCity + detail.pickUpArea + (detail.pickUpStreet || '') + detail.pickUpDetail}}</template>
                    </el-form-item>
                    <el-form-item label=" " prop="pickUpDetail">
                      <template v-if="isEdit">
                        <el-input  input class="w_600" v-model.trim="detail.pickUpDetail" placeholder="请输入" maxlength="30" show-word-limit></el-input>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="!isEdit">
                  <el-col :span="7">
                    <el-form-item label="操作日期: " prop="operatorDate">{{detail.operatorDate}}</el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="操作人: " prop="operatorBy">{{detail.operatorBy}}</el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注: " prop="remark">
                      <el-input type="textarea" v-model="detail.remark" maxlength="200" placeholder="请输入备注" :rows="2" class="w_600" v-if="isEdit"></el-input>
                      <template v-else>{{detail.remark}}</template>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </CtjtCard>
        </el-main>
        <el-footer>
          <el-row type="flex" justify="center">
            <el-button v-if="isEdit" type="info" @click="showDetail = false">取消</el-button>
            <el-button v-if="!isEdit" type="info" @click="showDetail = false">关闭</el-button>
            <el-button v-if="isEdit" type="primary" style="margin-left: 32px;" :loading='submitLoading' @click="submit">确定约车</el-button>
            <el-button v-if="!isEdit && perm.btn_cancel" type="warning" style="margin-left: 32px;" @click="openCancel">取消约车</el-button>
            <el-button v-if="!isEdit && perm.btn_cancel_unlimited" type="warning" style="margin-left: 32px;" @click="openCancelUnlimited">取消约车（无限制）</el-button>
            <el-button v-if="!isEdit && perm.btn_edit" type="primary" style="margin-left: 32px;" @click="openChangeAddress">修改接送地址</el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
    <!-- 取消约车 -->
    <el-dialog :visible.sync="showCancel" width="610px" title="取消约车">
      <el-form>
        <el-form-item label="" prop="type">
          <el-radio-group v-model="cancelData.reason">
            <el-radio :label="1">
              导师原因
              <el-select v-model="cancelData.coach" placeholder="请选择" class="ml-20">
                <el-option v-for="(item, index) in cancelReason.coach" :key="index" :label="item.label" :value="item.label"></el-option>
              </el-select>
            </el-radio>
            <el-radio :label="2" style="margin-top: 20px;">
              学员原因
              <el-select v-model="cancelData.student" placeholder="请选择" class="ml-20">
                <el-option v-for="(item, index) in cancelReason.student" :key="index" :label="item.label" :value="item.label"></el-option>
              </el-select>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="type" label-width="95px">
          <el-input type="textarea" v-model="cancelData.remark" placeholder="请输入备注" :rows="2" style="margin-left: 15px;width: 300px" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="cancelAccessory" ref="photoUrl" label-width="95px">
          <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="unfreezeUploadFunc">
            <template #content>
              <el-button style="margin-left: 15px;" size="small" type="primary">上传</el-button>
            </template>
          </CtjtUploadOSS>
          <div style="margin-top: 10px;">
            <el-tag
              class="mr-20"
              v-for="(item, index) in cancelData.cancelAccessory"
              :key="item"
              closable
              @close="deleteUnfreeze(index)"
            >
              <el-link
                :href="`${ossBaseUrl}${item}`"
                type="primary"
                :underline="false"
                target="_blank">附件{{index+1}}</el-link>
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button type="info" @click="showCancel = false">关闭</el-button>
          <el-button type="primary" style="margin-left: 32px;" @click="cancelAppoint">确定</el-button>
        </el-row>
      </span>
    </el-dialog>
    <!-- 修改接送地址 -->
    <el-dialog :visible.sync="showChangeAddress" width="660px" title="修改接送地址">
      <el-form>
        <el-form-item>
          <CtjtSelectAddress
            :data-config="cityData" :isEdit="true"
            @success-call="addressSuccessFunc1">
          </CtjtSelectAddress>
          <el-input input class="w_400" v-model.trim="cityData.pickUpDetail" placeholder="请输入详细地址" maxlength="30" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button type="info" @click="showChangeAddress = false">关闭</el-button>
          <el-button type="primary" style="margin-left: 32px;" @click="changeAddress">确定</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtCreateTable,
  CtjtSelectAddress,
  CtjtUploadOSS
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { deleteSingleAliyuncs } from '@/assets/js/upload_oss';
import { deepClone, OSS_BASEURL } from '@/assets/js/common';
import {
  tableData,
  searchForm as formData,
  classList,
  timeList,
  detailDataRules,
  cancelReason,
  detail
} from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtCreateTable,
    CtjtSelectAddress,
    CtjtUploadOSS
  }
})
export default class MarketSanXueSchedulingList extends mixins(
  ctjtPaginationMixins,
  ctjtAreaStoreSeachTableMixins
) {
  @Action('assignment/querySchedulingList') private querySchedulingList!: (data: ParamsType) => ParamsType;

  @Action('order/queryScatteredOrderByKeyword') private queryScatteredOrderByKeyword!: (data: ParamsType) => ParamsType;

  @Action('assignment/queryAppointDetailList') private queryAppointDetailList!: (data: ParamsType) => ParamsType;

  @Action('assignment/queryAppointDetail') private queryAppointDetail!: (data: ParamsType) => ParamsType;

  @Action('assignment/appointLearnDriving') private appointLearnDriving!: (data: ParamsType) => ParamsType;

  @Action('assignment/cancelAppoint') private cancelAppointFn!: (data: ParamsType) => ParamsType;

  @Action('assignment/updatePickUpAddress') private updatePickUpAddress!: (data: ParamsType) => ParamsType;

  @Action('assignment/queryScatteredCoach') private queryScatteredCoach!: () => ParamsType;

  @Action('order/queryChannelList') private queryChannelList!: () => any;

  ossBaseUrl = OSS_BASEURL;

  tableData: any = { ...tableData };

  searchFormData = { ...formData };

  classList = classList;

  timeList = timeList;

  cancelReason = cancelReason;

  detailList: any = []; // 当前时间段约车详情列表

  showDetailList = false; // 显示约车时间段列表详情

  showCancel = false; // 显示取消约车弹窗

  showChangeAddress = false; // 显示修改地址弹窗

  detail: any = { ...detail }; // 约车详情

  cityData: any = {
    provinceId: '',
    provinceName: '',
    cityId: '',
    cityName: '',
    areaId: '',
    areaName: '',
    pickUpDetail: '',
    pickUpStreet: ''
  }; // 接送地址默认

  detailDataRules = detailDataRules; // 新增约车表单校验

  classType = 2;

  // 限制日期选择时间
  pickerOptions = {}

  perm: any = {};

  coachList: any[] = []; // 教练列表

  orderList: any[] = []; // 学员订单信息

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    // console.log(permObj);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }

  mounted() {
    this.searchFormData = { ...formData };
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    const { selectList } = this.searchForm;
    this.searchFormData.selectList = selectList.concat(this.searchFormData.selectList);
    this.queryRegionList(drivingSchoolId);
    this.tableData.labels = tableData.labels1.concat(tableData.labels2 as any[]);
    this.queryScatteredCoach().then((res: any) => {
      this.searchFormData.selectList[2].options = res;
      this.coachList = [...res] || [];
    });
    this.queryChannelList().then((r: any) => {
      const list = r.filter((item: any) => item.name === '技能鉴定');
      const { scope } = list[0] || [];
      if (scope) {
        this.searchFormData.selectList[this.searchFormData.selectList.length - 1].options = JSON.parse(scope);
      }
    });
    this.init();
    this.queryList();
  }

  init() {
    const today = this.$dayjs(new Date()).format('YYYY-MM-DD');
    this.searchFormData.datePickerList[0].value = today;
    this.searchFormData.datePickerList[1].value = today;
    this.searchFormData.selectList[this.searchFormData.selectList.length - 2].value = 2;
  }

  @Watch('classType')
  change() {
    const labels: any[] = this.classType === 3 ? tableData.labels3 : tableData.labels2;
    this.tableData.labels = tableData.labels1.concat(labels);
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.init();
      this.searchSelectChange({ key: 'regionId', value: null });
      this.queryList();
    }
  }

  searchSelectChange(val: ParamsType) {
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

  async queryList() {
    this.tableData.loading = false;
    this.filterDate(this.searchFormData);
    const { searchFormData, paginationData } = this;
    const _data = drawSearchForm(searchFormData);
    this.classType = _data.classes;
    if (new Date(_data.endDate).getTime() - new Date(_data.startDate).getTime() > 31 * 24 * 60 * 60 * 1000) {
      this.$message.warning('最长可搜索31天');
      const resetDay = this.$dayjs(new Date(_data.startDate)).format('YYYY-MM-DD');
      this.searchFormData.datePickerList[1].value = resetDay;
      return;
    }
    const body = await this.querySchedulingList(_data);
    const {
      dataList, current, total, sumPeriod
    } = body;
    this.tableData.list = dataList ? [{ countPeriod: sumPeriod }, ...dataList] : [];
    // this.paginationData.current = current;
    // this.paginationData.total = total;
    this.tableData.loading = false;
  }

  filterDate(data: any) {
    // console.log(data);
    const _data = data;
    const startDate = _data.datePickerList[0].value;
    const endDate = _data.datePickerList[1].value;
    if (new Date(endDate) < new Date(startDate)) {
      [_data.datePickerList[0].value, _data.datePickerList[1].value] = [_data.datePickerList[1].value, _data.datePickerList[0].value];
    }
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 表格配置 */
  downTableData: ParamsType = {
    labels: [],
    list: [],
    name: '教练排班',
  };

  buttonType = 0; // 0约车新增，1补录约车

  tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 1 || id === 2) {
      if (id === 1) {
        this.pickerOptions = {
          disabledDate(time: Date) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
          }
        };
      } else {
        this.pickerOptions = {
          disabledDate(time: Date) { return false; }
        };
      }
      this.buttonType = id === 1 ? 0 : 1;
      this.openDetail();
      return;
    }
    const { selectionList, labels } = this.tableData;
    const idList: Array<number | string> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    // 导出
    if (id === 4) {
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
      } else {
        this.$message.warning('请先勾学员！');
      }
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

  showDetail = false; // 显示详情

  isEdit = true; // 是编辑/查看详情

  keyword = ''; // 关键字查询订单信息

  // 打开预约详情
  async openDetail(row?: any) {
    this.detail = { ...detail };
    this.keyword = '';
    this.isEdit = true;
    if (row) {
      const detailRes = await this.queryAppointDetail({ id: row.id });
      // console.log(detailRes);
      Object.keys(detail).forEach((key: string) => {
        this.detail[key] = detailRes[key];
      });
      this.isEdit = false;
      this.detail.disableCoach = true;
    }
    this.showDetail = true;
    this.orderList = [];
    const timer = setTimeout(() => {
      (this.$refs.detailForm as VueComponentParent).clearValidate();
      clearTimeout(timer);
    }, 1);
  }

  async cellClick(row: any, column: any, cell: any) {
    const { label } = cell;
    if (!label.includes('-') || !row.id) return;
    if (row[label] === '休息') return;
    if (row[label] === '') {
      if (!this.perm.btn_driving) return;
      this.isEdit = true;
      this.keyword = '';
      this.detail = { ...detail };
      this.detail.coachId = row.id;
      this.detail.coachName = row.name;
      this.detail.disableCoach = true;
      this.detail.timeFrameName = label;
      this.detail.appointDate = row.date;
      // 拆分时间来计算是2小时时段还是3小时时段
      const arr = label.split('-');
      this.detail.classesType = arr[1].split(':')[0] - arr[0].split(':')[0];
      this.showDetail = true;
      this.orderList = [];
      const timer = setTimeout(() => {
        (this.$refs.detailForm as VueComponentParent).clearValidate();
        clearTimeout(timer);
      }, 1);
      return;
    }
    if (!this.perm.btn_detailList) return; // 无查询权限
    const data = {
      appointDate: row.date,
      coachId: row.id,
      timeFrameName: cell.label
    };
    const detailList = await this.queryAppointDetailList(data);
    this.showDetailList = true;
    this.detailList = detailList || [];
  }

  // 计算当前学时
  get currentPeriod() {
    if (Number(this.detail.classesType) !== 1) {
      return this.detail.classesType;
    }
    const { startTime, endTime } = this.detail;
    if (startTime && endTime) {
      return endTime.split(':')[0] - startTime.split(':')[0];
    }
    return '';
  }

  @Watch('detail.endTime')
  endTimeChange() {
    const {
      startTime,
      endTime
    } = this.detail;
    if (!endTime || !startTime) return;
    const start = startTime.split(':');
    const end = endTime.split(':');
    if (start[1] !== end[1]) {
      this.$message.warning('必须以1小时为最小单位进行选择');
    }
  }

  // 搜索学员订单列表
  async searchStudent() {
    if (!this.keyword) return;
    const data = await this.queryScatteredOrderByKeyword({ keyword: this.keyword });
    this.orderList = (data as any[]) || [];
    if (this.orderList.length === 0) {
      this.$message.warning('学员订单不存在或学员订单已申请退费');
    }
  }

  // 搜索学员
  async chooseOrder(data: any) {
    Object.keys(data).forEach((key: string) => {
      if (key !== 'id') this.detail[key] = data[key];
    });
    this.detail.studentIdNo = data.idNo;
    this.detail.studentName = data.name;
    this.detail.studentMobile = data.mobile;
    this.detail.provinceId = this.detail.pickUpProvinceId;
    this.detail.provinceName = this.detail.pickUpProvince;
    this.detail.cityId = this.detail.pickUpCityId;
    this.detail.cityName = this.detail.pickUpCity;
    this.detail.areaId = this.detail.pickUpAreaId;
    this.detail.areaName = this.detail.pickUpArea;
    this.detail.pickUpDetail = (this.detail.pickUpStreet || '') + this.detail.pickUpDetail;
    this.detail.pickUpStreet = '';
    this.detail.orderId = data.id;
  }

  addressSuccessFunc(data: any) {
    const { type, id, value } = data;
    if (type === 'prov') {
      this.detail.provinceId = id;
      this.detail.provinceName = value;
      // 清空
      this.detail.cityId = 0;
      this.detail.cityName = '';
      this.detail.areaId = 0;
      this.detail.areaName = '';
    }
    if (type === 'city') {
      this.detail.cityId = id;
      this.detail.cityName = value;
      // 清空
      this.detail.areaId = 0;
      this.detail.areaName = '';
    }
    if (type === 'area') {
      this.detail.areaId = id;
      this.detail.areaName = value;
    }
  }

  addressSuccessFunc1(data: any) {
    const { type, id, value } = data;
    if (type === 'prov') {
      this.cityData.provinceId = id;
      this.cityData.provinceName = value;
      // 清空
      this.cityData.cityId = 0;
      this.cityData.cityName = '';
      this.cityData.areaId = 0;
      this.cityData.areaName = '';
    }
    if (type === 'city') {
      this.cityData.cityId = id;
      this.cityData.cityName = value;
      // 清空
      this.cityData.areaId = 0;
      this.cityData.areaName = '';
    }
    if (type === 'area') {
      this.cityData.areaId = id;
      this.cityData.areaName = value;
    }
  }

  submitLoading = false;

  submit() {
    (this.$refs.detailForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const {
          classesType,
          timeFrameName,
        } = this.detail;
        this.detail.appointDate = this.$dayjs(this.detail.appointDate).format('YYYY-MM-DD');
        if (Number(classesType) !== 1) {
          const arr = timeFrameName.split('-');
          [this.detail.startTime, this.detail.endTime] = arr;
        }
        const start = this.detail.startTime.split(':');
        const end = this.detail.endTime.split(':');
        if (start[1] !== end[1]) {
          this.$message.warning('必须以1小时为最小单位进行选择');
          return;
        }
        this.submitLoading = true;
        this.detail.pickUpProvinceId = this.detail.provinceId;
        this.detail.pickUpProvince = this.detail.provinceName;
        this.detail.pickUpCityId = this.detail.cityId;
        this.detail.pickUpCity = this.detail.cityName;
        this.detail.pickUpAreaId = this.detail.areaId;
        this.detail.pickUpArea = this.detail.areaName;
        this.detail.createStatus = this.buttonType;
        this.appointLearnDriving(this.detail).then(() => {
          this.submitLoading = false;
          this.$message.success('添加成功');
          this.detail = { ...detail };
          this.showDetail = false;
          this.queryList();
        }).catch(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  // 关闭约车
  openCancel() {
    const { appointDate, timeFrameName } = this.detail;
    const startTime = `${appointDate}  ${timeFrameName.split('-')[0]}`;
    if ((new Date(startTime).getTime() - new Date().getTime()) < (4 * 60 * 60 * 1000)) {
      this.$message.warning('需提前至少4小时进行取消');
      return;
    }
    this.showCancel = true;
    this.cancelData = {
      reason: 1,
      coach: '',
      student: '',
      remark: '',
      cancelAccessory: []
    };
  }

  // 关闭约车（无限制）
  openCancelUnlimited() {
    this.showCancel = true;
    this.cancelData = {
      reason: 1,
      coach: '',
      student: '',
      remark: '',
      cancelAccessory: []
    };
  }

  cancelData: ParamsType = {
    reason: 1,
    coach: '',
    student: '',
    remark: '',
    cancelAccessory: []
  }

  // 附件相关
  uploadConfig = {
    multiple: false,
    limit: 5,
    business: 'market/scattered',
    fileList: []
  }

  unfreezeUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).clearValidate();
    this.cancelData.cancelAccessory.push(val);
  }

  async deleteUnfreeze(index: number) {
    const link = this.cancelData.cancelAccessory[index];
    await deleteSingleAliyuncs(link);
    this.cancelData.cancelAccessory.splice(index, 1);
  }

  @Watch('cancelData.cancelAccessory', { deep: true })
  watchCancelAccessory(newVal: string[]) {
    const list: any = newVal.map(item => {
      const data = { url: item };
      return data;
    });
    this.uploadConfig.fileList = list;
  }

  async cancelAppoint() {
    const {
      reason,
      coach,
      student,
      remark,
      cancelAccessory
    } = this.cancelData;
    const data = {
      id: this.detail.id,
      remark,
      cancelCause: reason === 1 ? coach : student,
      cancelAccessory
    };
    if (!data.cancelCause) {
      this.$message.warning('请选择取消原因');
      return;
    }
    await this.cancelAppointFn(data);
    this.$message.success('取消成功');
    this.queryList();
    this.showCancel = false;
    this.showDetail = false;
    this.showDetailList = false;
  }

  openChangeAddress() {
    const { appointDate, timeFrameName } = this.detail;
    const startTime = `${appointDate}  ${timeFrameName.split('-')[0]}`;
    if ((new Date(startTime).getTime() - new Date().getTime()) < 0) {
      this.$message.warning('学车时段已开始');
      return;
    }
    this.showChangeAddress = true;
    const timer = setTimeout(() => {
      clearTimeout(timer);
      this.cityData.provinceId = this.detail.pickUpProvinceId;
      this.cityData.provinceName = this.detail.pickUpProvince;
      this.cityData.cityId = this.detail.pickUpCityId;
      this.cityData.cityName = this.detail.pickUpCity;
      this.cityData.areaId = this.detail.pickUpAreaId;
      this.cityData.areaName = this.detail.pickUpArea;
      this.cityData.pickUpDetail = (this.detail.pickUpStreet || '') + this.detail.pickUpDetail;
      this.cityData.pickUpStreet = '';
    }, 1);
  }

  // 修改接送地址
  async changeAddress() {
    const { id } = this.detail;
    const data = {
      pickUpProvinceId: this.cityData.provinceId,
      pickUpProvince: this.cityData.provinceName,
      pickUpCityId: this.cityData.cityId,
      pickUpCity: this.cityData.cityName,
      pickUpAreaId: this.cityData.areaId,
      pickUpArea: this.cityData.areaName,
      pickUpDetail: this.cityData.pickUpDetail,
      id
    };
    await this.updatePickUpAddress(data);
    this.$message.success('修改成功');
    this.showChangeAddress = false;
    const detailRes = await this.queryAppointDetail({ id });
    Object.keys(detail).forEach((key: string) => {
      this.detail[key] = detailRes[key];
    });
    this.queryList();
  }
}

</script>

<style lang="scss" scoped>
.detail_btn{
  color: red;
}
.card-header {
  width: 100%;
  line-height: 25px;
  margin-bottom: 18px;
  margin-top: 30px;
  .title {
    height: 25px;
    padding-left: 12px;
    color: $--color-text;
    font-size: 18px;
    position: relative;
    &::before {
      position: absolute;
      top: 50%;
      transform: translate(-12px, -50%);
      content: '';
      width: 4px;
      height: 18px;
      background-color: $--color-primary;
    }
  }
}
</style>
