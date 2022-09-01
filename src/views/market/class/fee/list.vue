<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <!-- 新增，编辑-弹窗 -->
    <el-drawer
      :visible="showDetail"
      :withHeader="false"
      :show-close="false"
      :size="'80%'"
      :direction="'rtl'">
      <el-container style="height: 100%">
        <el-main>
          <CtjtCard :prop-data="{ title: `${formData.id ? '编辑' : '新增'}班别考试费/补考费管理` }">
            <template #content>
              <el-form ref="classFeeForm" :model="formData" :rules="formRules" label-width="140px">
                <el-row :gutter="4">
                  <el-col :span="24">
                    <el-form-item label="班别名称" class="ctjt_form_item_class" prop="classesId">
                      <el-select class="w_400" v-model="formData.classesId" clearable multiple placeholder="请选择" :disabled="isEdit || formData.id > 0">
                        <el-option v-for="item in classessList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="4">
                  <el-col :span="24">
                    <el-form-item label="活动时间" class="ctjt_form_item_class" prop="date">
                      <el-date-picker
                        v-model="formData.date"
                        class="w_400"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="4">
                  <el-col :span="24">
                    <el-form-item label="状态" class="ctjt_form_item_class" prop="status">
                      <el-radio-group v-model="formData.status" :disabled="isEdit">
                        <el-radio v-for="(item, index) in statusList" :key="index" :label="item.id">{{item.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider content-position="left">考试费</el-divider>
                <el-row :gutter="4">
                  <el-col :span="24">
                    <el-form-item label="包含科目" class="ctjt_form_item_class" prop="containFee">
                      <el-checkbox-group v-model="formData.containFee" :disabled="isEdit">
                        <el-checkbox v-for="(item, index) in containFeeOpt" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider content-position="left">补考费</el-divider>
                <el-form-item label="包含科目/考试次数" prop="resit">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item style="margin-bottom: 20px;" label="科目一" prop="subjectOneResit" label-width="90px">
                        <el-select class="w_200" v-model="formData.subjectOneResit" placeholder="请选择" :disabled="isEdit">
                          <el-option v-for="item in resitCountList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item style="margin-bottom: 20px;" label="科目二" prop="subjectTwoResit" label-width="90px">
                        <el-select class="w_200" v-model="formData.subjectTwoResit" placeholder="请选择" :disabled="isEdit">
                          <el-option v-for="item in resitCountList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item style="margin-bottom: 10px;" label="科目三" prop="subjectThreeResit" label-width="90px">
                        <el-select class="w_200" v-model="formData.subjectThreeResit" placeholder="请选择" :disabled="isEdit">
                          <el-option v-for="item in resitCountList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-divider content-position="left">缺考费</el-divider>
                <el-form-item label="包含科目/考试次数" prop="absent">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item style="margin-bottom: 20px;" label="科目一" prop="subjectOneAbsent" label-width="90px">
                        <el-select class="w_200" v-model="formData.subjectOneAbsent" placeholder="请选择" :disabled="isEdit">
                          <el-option v-for="item in resitCountList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item style="margin-bottom: 20px;" label="科目二" prop="subjectTwoAbsent" label-width="90px">
                        <el-select class="w_200" v-model="formData.subjectTwoAbsent" placeholder="请选择" :disabled="isEdit">
                          <el-option v-for="item in resitCountList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item style="margin-bottom: 10px;" label="科目三" prop="subjectThreeAbsent" label-width="90px">
                        <el-select class="w_200" v-model="formData.subjectThreeAbsent" placeholder="请选择" :disabled="isEdit">
                          <el-option v-for="item in resitCountList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </template>
          </CtjtCard>
        </el-main>
        <el-footer>
          <el-row type="flex" justify="center">
            <el-button type="info" @click="balaceCancel">取消</el-button>
            <el-button v-if="!isEdit" type="primary" style="margin-left: 32px;" :loading='submitLoading' @click="balaceSubmit">保存</el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { MARKET_CLASS_FEE_STATUS, MARKET_MAKE_UP_EXAM } from '@/enums';
import { examSubjectsOpt } from '@/views/educational/_enums';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';
import { deepClone } from '@/assets/js/common';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class MarketClassFeeList extends mixins(ctjtPaginationMixins) {
  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => ParamsType;

  @Action('goods/queryExamFeeList') private queryExamFeeList!: (data: any) => ParamsType;

  @Action('goods/postExamFee') private postExamFee!: (data: any) => ParamsType;

  @Action('goods/putExamFee') private putExamFee!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  private statusList = MARKET_CLASS_FEE_STATUS;

  private resitCountList = MARKET_MAKE_UP_EXAM;

  private classessList: ParamsType = [];

  private containFeeOpt = deepClone(examSubjectsOpt).splice(0, 3)

  /** 表单搜索 开始 */
  private searchForm = {
    inputList: [
      {
        label: '班别名称',
        key: 'classesName',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入班别名称',
      }
    ],
    selectList: [
      {
        label: '状态',
        key: 'status',
        value: '',
        width: 100,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_CLASS_FEE_STATUS
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      }
    ]
  }

  // 点击搜索回调方法
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  /** 表单搜索 结束 */

  /** 列表配置 开始 */
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 4,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 1,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
      {
        id: 2,
        label: '启用',
        type: 'warning',
        icon: '&#xe615;',
        path: 'btn_enable'
      },
      {
        id: 3,
        label: '停用',
        type: 'warning',
        icon: '&#xe617;',
        path: 'btn_disable'
      },
    ],
    labels: [
      {
        key: 'classesName',
        label: '班别名称',
        width: 160,
      },
      {
        key: 'containFee',
        label: '考试费',
        render(h: any, params: any) {
          const { containFee = '[]' } = params.row;
          const _list = containFee ? JSON.parse(containFee) : [];
          const _textArr: string[] = [];
          examSubjectsOpt.forEach((item: any) => {
            const { value, label } = item;
            if (_list.includes(value)) {
              _textArr.push(label);
            }
          });
          return h('span', `${_textArr.length > 0 ? _textArr.join('/') : '不'}包含`);
        },
      },
      {
        key: '',
        label: '补考费',
        align: 'left',
        render(h: any, params: any) {
          const {
            subjectOneResit, subjectThreeResit, subjectTwoResit
          } = params.row;
          const _list = MARKET_MAKE_UP_EXAM;
          const _textArr: string[] = [];
          const one: any = _list.filter((item: any) => item.id === subjectOneResit);
          const two: any = _list.filter((item: any) => item.id === subjectTwoResit);
          const three: any = _list.filter((item: any) => item.id === subjectThreeResit);
          [...one, ...two, ...three].forEach((item, index) => {
            if (index === 0) {
              _textArr.push(`科目一${item.label}`);
            }
            if (index === 1) {
              _textArr.push(`科目二${item.label}`);
            }
            if (index === 2) {
              _textArr.push(`科目三${item.label}`);
            }
          });
          return h('span', { style: 'white-space: pre-line;' }, _textArr.length > 0 ? _textArr.join('\n') : '-');
        },
      },
      {
        key: '',
        label: '缺考费',
        align: 'left',
        render(h: any, params: any) {
          const {
            subjectOneAbsent, subjectThreeAbsent, subjectTwoAbsent
          } = params.row;
          const _list = MARKET_MAKE_UP_EXAM;
          const _textArr: string[] = [];
          const one: any = _list.filter((item: any) => item.id === subjectOneAbsent);
          const two: any = _list.filter((item: any) => item.id === subjectTwoAbsent);
          const three: any = _list.filter((item: any) => item.id === subjectThreeAbsent);
          [...one, ...two, ...three].forEach((item, index) => {
            if (index === 0) {
              _textArr.push(`科目一${item.label}`);
            }
            if (index === 1) {
              _textArr.push(`科目二${item.label}`);
            }
            if (index === 2) {
              _textArr.push(`科目三${item.label}`);
            }
          });
          return h('span', { style: 'white-space: pre-line;' }, _textArr.length > 0 ? _textArr.join('\n') : '-');
        }
      },
      {
        key: 'beginDate',
        label: '开始时间-结束时间',
        render(h: any, params: any) {
          const { beginDate = '', endDate = '' } = params.row;
          return h('span', `${beginDate}—${endDate}`);
        },
      },
      {
        key: 'status',
        label: '状态',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_CLASS_FEE_STATUS;
          const _arr = _list.filter((item: any) => item.id === status);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
  }

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 4) {
      this.showDetail = true;
      this.queryClassessList();
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      if (id === 1) {
        // 编辑
        this.jumpDetail(selectionList[0], '');
      }
      if (id === 2 || id === 3) {
        this.upDataStatusFunc(selectionList[0], id);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表单项点击
  private jumpDetail(val: ParamsType, type: string) {
    this.isEdit = type === '1';
    // 深拷贝一份数据
    this._setFormDataFunc(val);
    this.showDetail = true;
    this.queryClassessList();
  }

  // 上下架商品
  private upDataStatusFunc(val: ParamsType, type: number) {
    const { status } = val;
    if ((status === 1 && type === 2) || (status !== 1 && type === 3)) {
      this.$message.warning(`${type === 2 ? '当前状态已经是启用' : '当前状态已经是停用'}`);
      return;
    }
    this.$confirm(`${status === 1 ? '状态修改为停用' : '状态修改为启用'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const sendData = JSON.parse(JSON.stringify(val));
      sendData.status = sendData.status === 1 ? 0 : 1;
      await this.putExamFee(sendData);
      this.$message.success('修改成功！');
      await this.queryList();
    });
  }
  /** 列表配置 结束 */

  /** 列表分页 开始 */

  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  /** 列表分页 结束 */

  /** 新增 编辑 弹窗 开始 */
  private showDetail = false; // 展示弹窗

  private isEdit = false; // 可编辑

  private submitLoading = false; // 提交loading

  // 重置表单
  private _resetFormFunc() {
    this.formData = {
      date: [],
      classesId: [],
      containFee: [],
      id: null,
      status: null,
      subjectOneAbsent: null,
      subjectOneResit: null,
      subjectThreeAbsent: null,
      subjectThreeResit: null,
      subjectTwoAbsent: null,
      subjectTwoResit: null,
    };
  }

  // 表单配置
  private formData: ParamsType= {
    date: [], // 活动时间
    classesId: [], // 班别id
    containFee: [], // 是否包含考试费用
    id: null, // 主键
    status: null, // 状态：1：启用 0：停用
    subjectOneAbsent: null,
    subjectOneResit: null,
    subjectThreeAbsent: null,
    subjectThreeResit: null,
    subjectTwoAbsent: null,
    subjectTwoResit: null,
  }

  // 校验表单
  private formRules = {
    date: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
    classesId: [{ required: true, message: '请选择班别', trigger: 'change' }],
    containFee: [{ required: false, message: '请选择考试费', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    subjectOneAbsent: [{ required: true, message: '必选项', trigger: 'change' }],
    subjectOneResit: [{ required: true, message: '必选项', trigger: 'change' }],
    subjectThreeAbsent: [{ required: true, message: '必选项', trigger: 'change' }],
    subjectThreeResit: [{ required: true, message: '必选项', trigger: 'change' }],
    subjectTwoAbsent: [{ required: true, message: '必选项', trigger: 'change' }],
    subjectTwoResit: [{ required: true, message: '必选项', trigger: 'change' }],
  }

  // 请求回来处理数据
  _setFormDataFunc(val: ParamsType) {
    // 深拷贝一份
    const _data = JSON.parse(JSON.stringify(val));
    const {
      beginDate, endDate, classesId, containFee
    } = _data;
    Object.keys(this.formData).forEach(key => {
      if (key === 'date') {
        this.formData[key] = [beginDate, endDate];
      } else if (key === 'classesId') {
        this.formData[key] = [classesId];
      } else if (key === 'containFee') {
        this.formData[key] = containFee ? JSON.parse(containFee) : [];
      } else {
        this.formData[key] = _data[key];
      }
    });
  }

  // 提交表单前处理数据
  _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const { date, classesId, containFee } = sendData;
    sendData.beginDate = this.$dayjs(date[0]).format('YYYY-MM-DD');
    sendData.endDate = this.$dayjs(date[1]).format('YYYY-MM-DD');
    delete sendData.date;
    const _classesName: string[] = [];
    this.classessList.forEach((item : any) => {
      const { id, name } = item;
      if (classesId.includes(id)) {
        _classesName.push(name);
      }
    });
    sendData.classesName = _classesName.join(',');
    sendData.classesId = classesId.join(',');
    sendData.containFee = JSON.stringify(containFee);
    return sendData;
  }

  // 取消提交
  private balaceCancel() {
    this.showDetail = false; // 收起弹窗
    this.submitLoading = false; // 重置提交
    this.isEdit = false;
    this._resetFormFunc();
    (this.$refs.classFeeForm as VueComponentParent).resetFields(); // 重置表单
  }

  // 确认提交
  private balaceSubmit() {
    (this.$refs.classFeeForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = this._specialHandleFormData();
        if (sendData.id) {
          this.putExamFee(sendData).then(() => {
            this.queryList();
            this.$message.success('修改成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id; // 新增删除id
          this.postExamFee(sendData).then(() => {
            this.queryList();
            this.$message.success('新增成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      }
    });
  }
  /** 新增 编辑 弹窗 结束 */

  /** 请求处理 */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
    };
    const body = await this.queryExamFeeList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  /** 查询用户下下面所有班别 */
  async queryClassessList() {
    const body = await this.queryClassesInfoList({ type: 1 });
    this.classessList = body;
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
</script>
