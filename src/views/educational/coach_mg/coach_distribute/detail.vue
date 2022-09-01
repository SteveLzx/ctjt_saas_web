<template>
  <div class="page">
    <!-- 新增 -->
    <template v-if="!$route.query.id">
      <el-form ref="formDataRef" inline :model="formData" :rules="formDataRules">
        <el-form-item label="证件号码/受理号/姓名" prop="idNo">
          <CtjtSelect
            :value="formData.idNo"
            :list="handleIdNoSelect"
            :callback="formDataSelectCallback"
            :placeholder="'请输入内容'"
            :filterable="true"
            :remote="true"
            :options="{ value: 'idNo', label: 'idNo', title: 'userName' }"
            :loading="handleIdNoSelectLoading"
            @remotemethod="queryIdNoSearch"
          ></CtjtSelect>
        </el-form-item>
        <el-form-item label="学员姓名" prop="userName">
          <el-input class="w_200" v-model="formData.userName" placeholder="请输入学员姓名" disabled></el-input>
        </el-form-item>
        <el-button v-if="perm['btn_add']" type="primary" @click="addStudentToTables">添加</el-button>
      </el-form>
    </template>
    <!-- 查看详情 -->
    <template v-if="$route.query.id">
      <el-row justify="center" style="margin-bottom: 15px;">
        <el-col :span="8">数量：{{detailTableData.list.length || ''}}</el-col>
      </el-row>
    </template>
    <CtjtTable
      :tableData="$route.query.id ? detailTableData : tableData"
      @selection-change="tableSelectionChange"
    >
      <template slot="header">
        <el-row class="form">
          <el-form inline>
            <el-form-item label="关键词">
              <el-input class="w_300" v-model="keyword" placeholder="请输入学员姓名，证件号码" clearable></el-input>
            </el-form-item>
            <el-button v-if="perm['btn_search']" type="primary" @click="searchTable()">查询</el-button>
            <el-button v-if="perm['btn_cancel']" type="info" @click="handleColse()">取消</el-button>
            <template v-if="!$route.query.id">
              <el-button v-if="perm['btn_del']" type="danger" @click="handleDelete()">删除</el-button>
              <el-button v-if="perm['btn_submit']" type="success" @click="submit()">提交</el-button>
            </template>
          </el-form>
        </el-row>
      </template>
    </CtjtTable>
  </div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import { deepClone, searchTableKeyword } from '@/assets/js/common';
import { STUDY_STAGE } from '@/enums';
import { ParamsType, VueComponentParent } from '@/type';
import { CtjtTable, CtjtSelect } from '@/components';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtTable, CtjtSelect
  }
})
export default class EducationalCoachMgCoachDistributeDetail extends mixins(clearCacheMixins) {
  @Action('license/queryAllotCoachesFuzzyUsers') private queryAllotCoachesFuzzyUsers!: (data: any) => ParamsType;

  @Action('assignment/queryChangeCoachList') private queryChangeCoachList!: (data: any) => ParamsType;

  @Action('assignment/submitAllotCoachesManual') private submitAllotCoachesManual!: (data: any) => ParamsType;

  @Action('assignment/queryAllotCoachesDetails') private queryAllotCoachesDetails!: (data: any) => ParamsType;

  // 搜索表单配置
  private formData: ParamsType = {
    idNo: '',
    userName: ''
  }

  // 表单规则校验
  private formDataRules = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    userName: [
      { required: true, message: '找不到学员', trigger: ['change', 'blur'] }
    ]
  }

  // 通过身份证搜索出来的数组
  private handleIdNoSelect: any = [];

  // 搜索时的loading
  private handleIdNoSelectLoading = false;

  // 暂存学员对象
  private searchStudentData: ParamsType = {};

  /**
   * @description 抽屉弹窗表单搜索下拉框回调函数
   */
  private formDataSelectCallback(val: any) {
    const _list = this.handleIdNoSelect.filter((item: any) => item.idNo === val);
    if (_list.length > 0) {
      // 欠费的学员不能添加
      const { 0: item } = _list;
      const { idNo, userName, balance } = item;
      if (balance > 0) {
        this.$message.warning('欠费学员无法分配教练！');
        return;
      }
      this.searchStudentData = item;
      this.formData.idNo = idNo;
      this.formData.userName = userName;
    }
  }

  /**
   * @description 搜索身份证联想函数
   */
  private async queryIdNoSearch(val: string, cb: any) {
    this.handleIdNoSelectLoading = true;
    const body = await this.queryAllotCoachesFuzzyUsers({ keyword: val });
    this.handleIdNoSelect = body;
    this.handleIdNoSelectLoading = false;
  }

  /**
   * @description 添加搜索学员到列表
   */
  private addStudentToTables() {
    const { searchStudentData } = this;
    // 判断
    if (searchStudentData.idNo) {
      const _flag = this.formList.filter((item: any) => item.idNo === searchStudentData.idNo);
      if (_flag.length > 0) {
        this.$message.warning('请勿重复添加学员！');
        this.searchStudentData = {};
        this.handleIdNoSelect = [];
        (this.$refs.formDataRef as VueComponentParent).resetFields();
        return;
      }
      this.formList.push(searchStudentData);
      this.tableData.list = this.formList;
      this.searchStudentData = {};
      this.handleIdNoSelect = [];
      (this.$refs.formDataRef as VueComponentParent).resetFields();
    } else {
      this.$message.warning('请先选择学员！');
    }
  }

  // 列表搜索
  private keyword = '';

  // 存储列表数据，以便搜索使用
  private formList: ParamsType = [];

  /**
   * @description 搜索本地列表
   */
  private searchTable() {
    const { formList, keyword } = this;
    const { id } = this.$route.query;
    if (id) {
      this.detailTableData.list = searchTableKeyword(keyword, formList);
    } else {
      this.tableData.list = searchTableKeyword(keyword, formList);
    }
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [],
    labels: [
      {
        key: 'userName',
        label: '姓名'
      },
      {
        key: 'idNo',
        label: '证件号码',
        minWidth: 170
      },
      {
        key: 'regionName',
        label: '片区'
      },
      {
        key: 'storeName',
        label: '门店'
      },
      {
        key: 'carModel',
        label: '车型'
      },
      {
        key: 'classesName',
        label: '班别'
      },
      {
        key: 'acceptNumber',
        label: '受理号'
      },
      {
        key: 'learnDrivingSchedule',
        label: '学车进度',
        render(h: any, params: any) {
          const { learnDrivingSchedule } = params.row;
          const _list = STUDY_STAGE;
          const _item = _list.filter(item => item.id === learnDrivingSchedule);
          if (_item.length === 0) return h('div', '');
          return h('div', `${_item[0].label}`);
        }
      },
      {
        key: 'remarks',
        label: '备注',
        render(h: any, params: any) {
          const { remarks } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remarks,
            },
            scopedSlots: {
              reference: () => h('p', remarks),
            },
          });
        }
      },
      {
        key: 'secondCoachName',
        label: '科目二教练',
        minWidth: 100,
        render(h: any, params: any) {
          const {
            secondCoachName, regionId, carModel, subjectTwoUnbind
          } = params.row;
          const index = params.$index;
          const that = params._self.tableData._this;
          return h('el-select', {
            props: {
              filterable: true,
              clearable: true,
              value: secondCoachName,
              disabled: subjectTwoUnbind,
            },
            on: {
              focus: () => that.getCoachList(regionId, carModel, 2),
              change: (val: string) => that.setItemValFunc(index, val, 2),
            }
          }, [
            that.componentSelectOpts.map((item: any) => h('el-option', {
              props: {
                value: item.userName,
                label: item.userName,
              },
            }))
          ]);
        },
      },
      {
        key: 'thirdCoachName',
        label: '科目三教练',
        minWidth: 100,
        render(h: any, params: any) {
          const {
            thirdCoachName, regionId, carModel, subjectThreeUnbind
          } = params.row;
          const index = params.$index;
          const that = params._self.tableData._this;
          return h('el-select', {
            props: {
              filterable: true,
              clearable: true,
              value: thirdCoachName,
              disabled: subjectThreeUnbind,
            },
            on: {
              focus: () => that.getCoachList(regionId, carModel, 3),
              change: (val: string) => that.setItemValFunc(index, val, 3),
            }
          }, [
            that.componentSelectOpts.map((item: any) => h('el-option', {
              props: {
                value: item.userName,
                label: item.userName,
              },
            }))
          ]);
        },
      },
      {
        key: 'secondTotalLoad',
        label: '科二带教负荷'
      },
      {
        key: 'thirdTotalLoad',
        label: '科三带教负荷'
      }
    ],
    list: [],
    selectionList: []
  }

  private componentSelectOpts: Array<any> = [];

  private getCoachList(regionId: string, carModel: string, subject: number) {
    const sendData = {
      regionId, carModel, subject
    };
    this.queryChangeCoachList(sendData).then((res: any) => {
      const deepList = deepClone(res);
      deepList.forEach((item: any) => {
        const _item = item;
        _item.value = item.userName;
        _item.label = item.id;
      });
      this.componentSelectOpts = deepList;
    });
  }

  private setItemValFunc(index: number, val: string, type: number) {
    const { componentSelectOpts } = this;
    try {
      const _list = componentSelectOpts.filter(item => item.value.includes(val));
      if (_list.length > 0) {
        const {
          totalLoad, id, userName, teachId
        } = _list[0];
        if (type === 2) {
          this.$set(this.tableData.list[index], 'secondCoachName', val ? userName : '');
          this.$set(this.tableData.list[index], 'secondTotalLoad', val ? totalLoad : '');
          this.$set(this.tableData.list[index], 'secondCoachId', val ? id : '');
          this.$set(this.tableData.list[index], 'secondTeachId', val ? teachId : '');
          // 给备份表单赋值
          const { idNo } = this.tableData.list[index];
          this.formList.forEach(((item: any) => {
            if (item.idNo === idNo) {
              const _item = item;
              _item.secondCoachName = val ? userName : '';
              _item.secondTotalLoad = val ? totalLoad : '';
              _item.secondCoachId = val ? id : '';
            }
          }));
        }
        if (type === 3) {
          this.$set(this.tableData.list[index], 'thirdCoachName', val ? userName : '');
          this.$set(this.tableData.list[index], 'thirdTotalLoad', val ? totalLoad : '');
          this.$set(this.tableData.list[index], 'thirdCoachId', val ? id : '');
          this.$set(this.tableData.list[index], 'thirdTeachId', val ? teachId : '');
          // 给备份表单赋值
          const { idNo } = this.tableData.list[index];
          this.formList.forEach(((item: any) => {
            if (item.idNo === idNo) {
              const _item = item;
              _item.thirdCoachName = val ? userName : '';
              _item.thirdTotalLoad = val ? totalLoad : '';
              _item.thirdCoachId = val ? id : '';
            }
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /**
   * @description 取消
   */
  private handleColse() {
    this.clearCache();
    this.$router.push({ path: '/educational/coach_mg/coach_distribute' });
  }

  /**
   * @description 删除列表勾选项
   */
  private handleDelete() {
    const { selectionList, list } = this.tableData;
    if (selectionList.length > 0) {
      this.$confirm('确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const _idNos: Array<string> = [];
        selectionList.forEach((item: any) => _idNos.push(item.idNo));
        const _newList: Array<any> = [];
        list.forEach((item: any) => {
          if (!_idNos.includes(item.idNo)) {
            _newList.push(item);
          }
        });
        this.tableData.list = _newList;
        const _newFormList: Array<any> = [];
        this.formList.forEach((item: any) => {
          if (!_idNos.includes(item.idNo)) {
            _newFormList.push(item);
          }
        });
        this.formList = _newFormList;
      });
    } else {
      this.$message.warning('请先勾要删除的学员！');
    }
  }

  /**
   * @description 提交
   */
  private submit() {
    const { list } = this.tableData;
    if (list.length > 0) {
      // 判断非空
      // 判断列表里面是否含有已批复教练的学员
      const flagList = list.filter((item: any) => item.replyStatus === 1);
      const haveNocoachList = list.filter((item: any) => item.secondCoachName || item.thirdCoachName);
      const sendData = list;
      if (haveNocoachList.length !== sendData.length) {
        this.$message.warning('分配列表有学员未分配教练！');
      } else if (flagList.length > 0) {
        const _textArr: Array<string> = [];
        flagList.forEach((item: any) => _textArr.push(item.userName));
        this.$confirm(`学员【${_textArr.join(',')}】已存在批复，更改教练将会同步更改批复的教练，是否继续分配教练？`, '保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.submitManual(sendData);
        });
      } else {
        this.$confirm('确定保存?', '保存', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          this.submitManual(sendData);
        });
      }
    } else {
      this.$message.warning('请先添加学员！');
    }
  }

  private submitManual(sendData: any) {
    this.submitAllotCoachesManual(sendData).then(() => {
      this.$message.success('新增成功！');
      this.handleColse();
    });
  }

  private async queryDetail(batchNo: string) {
    const body = await this.queryAllotCoachesDetails({ batchNo });
    this.detailTableData.list = body;
    this.formList = body;
  }

  // 列表配置
  private detailTableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [],
    labels: [
      {
        key: 'userName',
        label: '姓名'
      },
      {
        key: 'idNo',
        label: '证件号码',
        minWidth: 170
      },
      {
        key: 'regionName',
        label: '片区'
      },
      {
        key: 'storeName',
        label: '门店'
      },
      {
        key: 'carModel',
        label: '车型'
      },
      {
        key: 'classesName',
        label: '班别'
      },
      {
        key: 'acceptNumber',
        label: '受理号'
      },
      {
        key: 'subject',
        label: '学车进度',
        render(h: any, params: any) {
          const { subject } = params.row;
          const _list = STUDY_STAGE;
          const _item = _list.filter(item => item.id === subject);
          if (_item.length === 0) return h('div', '');
          return h('div', `${_item[0].label}`);
        }
      },
      {
        key: 'remarks',
        label: '备注',
        render(h: any, params: any) {
          const { remarks } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remarks,
            },
            scopedSlots: {
              reference: () => h('p', remarks),
            },
          });
        }
      },
      {
        key: 'coachName',
        label: '教练',
      },
      {
        key: 'totalLoad',
        label: '带教负荷'
      }
    ],
    list: [],
    selectionList: []
  }

  perm = {};

  historyParams: any = '';

  async activated() {
    this.tableData._this = this;
    const { id } = this.$route.query;
    const { historyParams } = this;
    if (id !== historyParams) {
      this.keyword = '';
    }
    this.historyParams = id;
    if (typeof id === 'string' && id) {
      this.queryDetail(id);
    }
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
</script>
<style lang="scss" scoped>
  .form {
    border: 1px solid $--color-border-split;
    border-bottom: 0;
    padding: 5px 18px 0 14px;
  }
</style>
