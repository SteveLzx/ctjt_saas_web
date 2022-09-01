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

    <!-- 审核通过 -->
    <el-dialog
      title="审核通过"
      :visible.sync="dialogVisible"
      :before-close="dialogVisibleClose"
      width="30%">
      <el-form ref="dialogFormDataRef" :model="dialogFormData" :rules="dialogFormRules" label-width="100px">
        <el-form-item label="领用日期" prop="claimingDate">
          <el-date-picker
            v-model="dialogFormData.claimingDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交车情况" prop="transferSituation">
          <el-input type="textarea" v-model="dialogFormData.transferSituation" placeholder="请输入" show-word-limit maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleClose()">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="dialogVisibleSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      :visible.sync="drawer"
      size="80%">
      <CtjtCard :prop-data="{ title: '新增车辆动用申请' }">
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
                <el-form-item label="片区" prop="regionName">
                  <el-input class="w_200" v-model="formData.regionName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用人" prop="useUserName">
                  <el-input class="w_200" v-model="formData.useUserName" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="车型" prop="carModel">
                  <el-input class="w_200" v-model="formData.carModel" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="车辆品牌" prop="carBrand">
                  <el-input class="w_200" v-model="formData.carBrand" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="原带教科目" prop="oldTeachingSubject">
                  <el-input class="w_200" v-model="formData.oldTeachingSubject" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="调入片区" prop="newRegionId">
                  <el-select class="w_200" v-model="formData.newRegionId" placeholder="请选择" @change="hanldNewRegionChange">
                    <el-option
                      v-for="item in newRegionOpt"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领用人" prop="newUserName">
                  <el-autocomplete
                    class="w_200"
                    v-model="formData.newUserName"
                    :fetch-suggestions="queryNewUserIdSearch"
                    value-key="name"
                    placeholder="请输入领用人"
                    @select="hanldUseUserNameSelect"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="现带教科目" prop="newTeachingSubject">
                  <el-input class="w_200" v-model="formData.newTeachingSubject" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="8">
                <el-form-item label="调入停车点" prop="parkingSpotId">
                  <el-select class="w_200" v-model="formData.parkingSpotId" placeholder="请选择" @change="hanldParkingSpotChange">
                    <el-option-group
                      v-for="(group, index) in parkingSpotOpt"
                      :key="index"
                      :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.id"
                        :label="item.parkingName"
                        :value="item.id">
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="使用性质" prop="useKind">
                  <el-select class="w_200" v-model="formData.useKind" placeholder="请选择" @change="handldUseKindChange">
                    <el-option
                      v-for="item in useKindOpt"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="16">
                <el-form-item label="变更原因" prop="cause">
                  <el-input class="w_600" type="textarea" v-model.trim="formData.cause" placeholder="请输入" show-word-limit maxlength="300"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="16">
                <el-form-item label="备注" prop="remark">
                  <el-input class="w_600" type="textarea" v-model.trim="formData.remark" placeholder="请输入" show-word-limit maxlength="300"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="6">
              <el-col :span="24">
                <el-form-item label="附件" class="ctjt_form_item_class" prop="file" ref="photoUrl">
                <div style="display: flex;">
                  <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="goodsUploadFunc" v-if="formData.file.length < 5">
                    <template #content>
                      <el-button size="small" type="primary">请选择图片</el-button>
                    </template>
                  </CtjtUploadOSS>
                  <!-- 图片列表 -->
                  <ul class="img_list_container">
                    <li class="item_img" v-for="(item, index) in formData.file" :key="index">
                      <div class="img_box">
                        <el-image
                          class="w_h100"
                          :src="`${ossBaseUrl}${item}`"
                          :fit="'cover'">
                        </el-image>
                      </div>
                      <div class="img_options">
                        <span @click="imageViewerFunc(item)">预览</span>
                        <template>
                          <el-popconfirm
                            title="确定删除吗？"
                            @confirm="deteleImageFunc(index)"
                          >
                            <span slot="reference" style="color: #F56C6C;">删除</span>
                          </el-popconfirm>
                        </template>
                      </div>
                    </li>
                  </ul>
                </div>
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
      <CtjtCard :prop-data="{ title: '车辆调动详情', tips: `当前审核状态：${getStatus(detailFormData.verifyStatus)}`}">
        <template #content>
          <el-form label-width="100px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="车牌号:">{{detailFormData.carNumber}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="片区:">{{detailFormData.regionName}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="使用人:">{{detailFormData.useUserName}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="车型:">{{detailFormData.carModel}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="车辆品牌:">{{detailFormData.carBrand}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="原带教科目:">{{detailFormData.oldTeachingSubject}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="调入片区:">{{detailFormData.newRegionName}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="领用人:">{{detailFormData.newUserName}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="现带教科目:">{{detailFormData.newTeachingSubject}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="调入停车点:">{{detailFormData.parkingSpot}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="使用性质:">{{detailFormData.useKindName}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注:">{{detailFormData.remark}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="调用原因:">{{detailFormData.cause}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="领用日期:">{{detailFormData.claimingDate}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="交车情况:">{{detailFormData.condition}}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="车辆情况记录:">{{detailFormData.carCondition}}（记录人：{{detailFormData.carConditionUser}}）</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="附件:">
                <!-- 图片列表 -->
                <ul class="img_list_container">
                  <li class="item_img" v-for="(item, index) in detailFormData.file" :key="index">
                    <div class="img_box">
                      <el-image
                        class="w_h100"
                        :src="`${ossBaseUrl}${item}`"
                        :fit="'cover'">
                      </el-image>
                    </div>
                    <div class="img_options">
                      <span @click="imageViewerFunc(item)">预览</span>
                    </div>
                  </li>
                </ul>
              </el-form-item>
            </el-row>
          </el-form>
          <CtjtTable :tableData="detailTableData"></CtjtTable>
        </template>
      </CtjtCard>
    </el-drawer>
    <!-- 图片预览 -->
    <CtjtImageViewer v-if="showImageViewer" :z-index="imageZIndex" :propData="imageViewerList" @on-close="handleImageViewerClose"></CtjtImageViewer>
    <!-- 视频预览 -->

  </div>
</template>
<script lang='ts'>
import { State, Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import { ParamsType, VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import { drawSearchForm } from '@/assets/js/search_table';
import { deepClone, timestampSizeCompare, OSS_BASEURL } from '@/assets/js/common';
import { approveStatusOpts } from '@/views/educational/_enums';
import {
  CtjtTable, CtjtPagination, SearchTable, CtjtCard, CtjtUploadOSS, CtjtImageViewer
} from '@/components';

const changeTypeOpt = [
  { id: 1, label: '片区内调动' },
  { id: 2, label: '跨片区调动' },
];

const _endDate = dayjs(new Date()).format('YYYY-MM-DD');

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    SearchTable,
    CtjtCard,
    CtjtUploadOSS,
    CtjtImageViewer
  }
})
export default class VehicleTrafficChangeMgCarDispatchSet extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo!: ParamsType;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('car/queryAllUseProperties') private queryAllUseProperties!: () => any;

  @Action('car/queryfindByPlateNumber') private queryfindByPlateNumber!: (data: any) => any;

  @Action('car/queryFindRecipientByName') private queryFindRecipientByName!: (data: any) => any;

  @Action('car/queryParkingPullList') private queryParkingPullList!: () => any;

  @Action('car/queryTransferApplyList') private queryTransferApplyList!: (data: any) => any;

  @Action('car/queryTransferApplyById') private queryTransferApplyById!: (data: any) => any;

  @Action('car/backOutApproveTransferApply') private backOutApprove!: (data: any) => any;

  @Action('car/noPassApproveTransferApply') private noPassApprove!: (data: any) => any;

  @Action('car/passApproveTransferApply') private passApprove!: (data: any) => any;

  @Action('car/saveTransferApply') private saveTransferApply!: (data: any) => any;

  @Action('car/updateCarConditionById') private updateCarConditionById!: (data: any) => any;

  private ossBaseUrl = OSS_BASEURL;

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
      },
      {
        label: '原使用人',
        key: 'oldUseUser',
        type: 'text',
        value: '',
        width: 200,
        clearable: true,
        placeholder: '请输入',
      },
      {
        label: '现使用人',
        key: 'newUseUser',
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
        label: '变更类型',
        key: 'changeType',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: changeTypeOpt
      },
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
        label: '申请时间',
        key: 'beginDate',
        value: '',
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
      },
      {
        label: '调动日期',
        key: 'beginClaimingDate',
        value: '',
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'endClaimingDate',
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
        key: 'regionName',
        label: '片区',
        showOverflowTooltip: true
      },
      {
        key: 'useUserName',
        label: '使用人',
      },
      {
        key: 'newRegionName',
        label: '领用片区',
        showOverflowTooltip: true
      },
      {
        key: 'newUserName',
        label: '领用人',
      },
      {
        key: 'changeType',
        label: '变更类型',
        render(h: any, params: any) {
          const { changeType } = params.row;
          const list = changeTypeOpt.filter((item: any) => item.id === changeType);
          const { label = '' } = list[0] || {};
          return h('span', label);
        }
      },
      {
        key: 'claimingDate',
        label: '调动日期',
        render(h: any, params: any) {
          const { claimingDate } = params.row;
          return h('span', claimingDate ? dayjs(claimingDate).format('YYYY-MM-DD') : '');
        }
      },
      {
        key: 'parkingSpot',
        label: '车辆停放地点',
        width: 110,
        showOverflowTooltip: true
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
        label: '当前审批环节',
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
        label: '申请时间',
      },
      {
        key: 'carCondition',
        label: '车辆情况记录',
        minWidth: 110,
        render(h: any, params: any) {
          const { carCondition } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: carCondition,
            },
            scopedSlots: {
              reference: () => h('p', carCondition),
            },
          });
        }
      },
      {
        key: 'carConditionUser',
        label: '记录人',
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
      {
        id: 5,
        label: '车辆情况记录',
        path: 'btn_car_situation_record'
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
      if (id === 5) {
        // 车辆情况记录
        this.$prompt('请输入车辆情况记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,200}$/,
          inputErrorMessage: '输入内容长度为1-200'
        }).then((res: any) => {
          const { value } = res;
          if (value !== null && value.length <= 200) {
            this.updateCarConditionById({
              carCondition: value.trim(),
              id: iid,
            }).then(() => {
              this.queryList();
              this.$message.success('车辆情况记录成功');
            });
          } else {
            this.$message.warning('输入内容长度为1-200');
          }
        });
        return;
      }
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
      this.dialogFormData.id = id;
      this.dialogVisible = true;
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

  private dialogVisible = false;

  private dialogFormData = {
    id: '',
    claimingDate: '',
    transferSituation: ''
  }

  private dialogFormRules = {
    claimingDate: [
      { required: true, message: '请选择领用日期', trigger: ['blur'] }
    ],
    transferSituation: [
      { required: true, message: '请输入交车情况', trigger: ['blur'] }
    ]
  }

  dialogVisibleSubmit() {
    (this.$refs.dialogFormDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = {
          ...this.dialogFormData,
          ...{ verifyOpinion: '同意' }
        };
        const { claimingDate } = sendData;
        sendData.claimingDate = this.$dayjs(claimingDate).format('YYYY-MM-DD hh:mm:ss');
        this.submitLoading = true;
        this.passApprove(sendData).then(() => {
          this.queryList();
          this.dialogVisibleClose();
          this.$message.success('审核成功');
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  dialogVisibleClose() {
    (this.$refs.dialogFormDataRef as VueComponentParent).resetFields();
    this.dialogVisible = false;
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
      beginDate, endDate, beginClaimingDate, endClaimingDate
    } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('申请时间开始时间不能大于结束时间');
      return;
    }
    if (beginClaimingDate && endClaimingDate && timestampSizeCompare(beginClaimingDate, endClaimingDate)) {
      this.$message.warning('调动日期开始时间不能大于结束时间');
      return;
    }
    const sendData = { ..._data };
    try {
      this.tableData.loading = true;
      const body = await this.queryTransferApplyList(sendData);
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
    this.queryUseKindNameOpt();
    this.queryRegionOpt();
    this.queryParkingSpotOpt();
    this.drawer = true;
  }

  private drawer = false;

  // 车牌号
  async queryCarNumberSearch(value: string, cb: any) {
    const body = await this.queryfindByPlateNumber({ plateNumber: value });
    cb(body);
  }

  hanldCarNumberSelect(value: any) {
    const {
      organName, organid, carStyle, brandName, useperson, usePersonId = '', teachingSubject = '', cbiid = ''
    } = value;
    this.formData.regionName = organName;
    this.formData.useUserId = usePersonId;
    this.formData.useUserName = useperson;
    this.formData.regionId = organid;
    this.formData.carModel = carStyle;
    this.formData.carBrand = brandName;
    this.formData.oldTeachingSubject = teachingSubject;
    this.formData.carId = cbiid;
  }

  // 领用人
  async queryNewUserIdSearch(value: string, cb: any) {
    const body = await this.queryFindRecipientByName({ name: value });
    cb(body);
  }

  // 车辆使用性质
  private useKindOpt = []

  async queryUseKindNameOpt() {
    this.useKindOpt = await this.queryAllUseProperties();
  }

  handldUseKindChange(value: any) {
    this.useKindOpt.forEach((item: any) => {
      const { id, name } = item;
      if (id === value) this.formData.useKindName = name;
    });
  }

  // 片区
  private newRegionOpt = [];

  async queryRegionOpt() {
    const { drivingSchoolId } = this.userInfo;
    this.newRegionOpt = await this.queryGroupMechanismData({ pid: drivingSchoolId });
  }

  hanldNewRegionChange(id: string) {
    const _list = this.newRegionOpt.filter((item: any) => item.id === id);
    const { name = '' } = _list[0];
    this.formData.newRegionName = name;
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

  hanldParkingSpotChange(id: string) {
    this.parkingSpotOpt.forEach((item: any) => {
      const { options } = item;
      options.forEach((i: any) => {
        const { id: iid, parkingName } = i;
        if (id === iid) {
          this.formData.parkingSpot = parkingName;
        }
      });
    });
  }

  hanldUseUserNameSelect(value: any) {
    const { id, teachingType = '' } = value;
    this.formData.newUserId = id;
    this.formData.newTeachingSubject = teachingType;
  }

  // 图片相关
  uploadConfig = {
    haveVideo: false,
    multiple: false,
    accept: '',
    limit: 5,
    disabled: false,
    tips: '',
    business: 'vehicle',
    fileList: []
  }

  goodsUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).clearValidate();
    this.formData.file.push(val);
  }

  @Watch('formData.file', { deep: true })
  watchFormDataFile(newVal: string[]) {
    const list: any = newVal.map(item => {
      const data = { url: item };
      return data;
    });
    this.uploadConfig.fileList = list;
  }

  // 预览
  showImageViewer = false;

  imageViewerList: string[] = [];

  imageZIndex = 2000;

  // 点击预览
  imageViewerFunc(val: string) {
    this.imageViewerList = [`${this.ossBaseUrl}${val}`];
    // 获取当前弹出最高层级
    const nodesList = document.querySelectorAll('.el-drawer__wrapper');
    let zIndex = 2000;
    if (nodesList.length > 0) {
      nodesList.forEach(item => {
        const iZindex = (item as any).style.zIndex;
        if (zIndex < iZindex) zIndex = Number(iZindex) + 2;
      });
    }
    this.imageZIndex = zIndex;
    this.showImageViewer = true;
  }

  // 提供给子组件掉用，关闭图片预览弹窗
  handleImageViewerClose() {
    this.showImageViewer = false;
  }

  // 删除
  deteleImageFunc(index: number) {
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.formData.file.splice(index, 1);
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    });
  }

  private formData: ParamsType = {
    carBrand: '',
    carId: '',
    carModel: '',
    carNumber: '',
    cause: '',
    newRegionId: null,
    newRegionName: '',
    newTeachingSubject: '',
    newUserId: null,
    newUserName: '',
    oldTeachingSubject: '',
    parkingSpot: '',
    regionId: null,
    regionName: '',
    remark: '',
    useKind: '',
    useKindName: '',
    useUserId: '',
    useUserName: '',
    file: [],
    carCondition: '',
    carConditionUser: ''
  }

  private formRules = {
    carNumber: [
      { required: true, message: '请输入车牌号', trigger: ['change', 'blur'] }
    ],
    newRegionId: [
      { required: true, message: '请选择调入片区', trigger: ['blur'] }
    ],
    newUserName: [
      { required: true, message: '请输入领用人', trigger: ['change', 'blur'] }
    ],
    parkingSpotId: [
      { required: true, message: '请选择调入停车点', trigger: ['blur'] }
    ],
    useKind: [
      { required: true, message: '请选择使用性质', trigger: ['blur'] }
    ],
    cause: [
      { required: true, message: '请输入变更原因', trigger: ['blur'] }
    ],
  };

  cancel() {
    (this.$refs.formDataRef as VueComponentParent).resetFields();
    this.drawer = false;
  }

  private submitLoading = false;

  submit() {
    (this.$refs.formDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = deepClone(this.formData);
        this.submitLoading = true;
        this.saveTransferApply(sendData).then(() => {
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
    const body = await this.queryTransferApplyById({ id });
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
        label: '审核时间',
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
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
.img_list_container {
  margin-left: 30px;
  display: flex;
  .item_img {
    margin-right: 8px;
    .img_box {
      width: 150px;
      height: 150px;
      border-radius: 4px;
      background-color: #F2F6FC;
      border: 1px dashed #409EFF;
      cursor: pointer;
      .w_h100 {
        width: 100%;
        height: 100%;
      }
    }
    .img_options {
      margin-top: 8px;
      display: flex;
      justify-content: center;
      span {
        color: #409EFF;
        font-size: 14px;
        cursor: pointer;
        &:nth-child(2) {
          margin: 0 8px;
        }
      }
    }
  }
}
</style>
