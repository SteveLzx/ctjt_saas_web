<template>
  <el-drawer
    :visible="isShow"
    size="80%"
    :direction="'rtl'"
    :show-close="false"
  >
    <!--form 表单-->
    <CtjtCard :prop-data="{ title: '快速录入', tips: title }">
      <template slot="header">
        <span
          style="float: right"
          class="iconfont close_icon"
          @click="handleButtonClick()"
          >&#xe62b;</span
        >
      </template>
      <template slot="content">
        <CtjtForm
          ref="insert_form"
          :prop-data="commonForm"
          @form-submit="formCallBack"
          @select-change="selectChange"
          @input-blur="inputBlurFunc"
        >
          <template slot="autocomplete">
            <el-form-item
              v-for="(item, index) in commonForm.autocompleteList"
              :key="`autocomplete-${index}`"
              :label="item.label"
              :label-width="`${item.labelWidth + 'px' || 'auto'}`"
              :prop="`autocompleteList.${index}.value`"
              :rules="item.rules"
            >
              <el-autocomplete
                popper-class="seach_table_autocomplete"
                v-model="item.value"
                value-key="idNo"
                :maxlength="item.maxlength"
                :clearable="item.clearable"
                :fetch-suggestions="autocompleteQuerySearch"
                @select="autocompleteChange"
                :placeholder="item.placeholder || '请输入内容'"
                style="width: 240px"
              >
                <template slot-scope="{ item }">
                  <div class="idNo">{{ item.idNo }}</div>
                  <span class="userName">{{ item.userName }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </template>
        </CtjtForm>
        <span style="color: red" v-if="supplementProps.code === 'exam_results'"
          >注：考试结果和考试成绩二选一即可，但缺考或取消考试必须选【考试结果】</span
        >
      </template>
    </CtjtCard>
    <CtjtTable
      :tableData="previewData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
    </CtjtTable>
  </el-drawer>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Watch
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ParamsType, VueComponentParent, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { CtjtTable, CtjtForm, CtjtCard } from '@/components';
import {
  REG_NUMBER,
  matchNumberList,
  drivingSchool,
  deepClone,
  REG_TWO_FLOAT_NUMBER,
} from '@/assets/js/common';
import {
  PAPERLESS_COLLECT_FORM,
  SITE_DELIVERY_TABLE_FORM,
  LICENSE_RECEIPT_FORM_FORM,
  CLASS_SITUATION_FORM,
  AREA_DELIVERY_TABLE_FORM,
  VEHICLE_APPROVAL_FORM,
  CAPITAL_SUPERVISION_FORM,
  EXAM_ACCEPTANCE_FORM,
  HUIZHOU_EXAM_ACCEPTANCE_FORM,
  SUBJECT_TRAINING_FORM,
  APPLY_EXAM_FORM,
  EXAM_APPROVAL_FORM,
  HUIZHOU_EXAM_APPROVAL_FORM,
  EXAM_FEE_FORM,
  HUIZHOU_EXAM_FEE_FORM,
  EXAM_RESULTS_FORM,
  HUIZHOU_EXAM_RESULTS_FORM,
  REPORT_CARD_FORM,
  TRANSFER_OUT_FORM,
} from '@/enums/accreditation/quick_entry_form';

import {
  PAPERLESS_COLLECT_TABLE,
  CLASS_SITUATION_TABLE,
  SITE_DELIVERY_TABLE_TABLE,
  LICENSE_RECEIPT_FORM_TABLE,
  AREA_DELIVERY_TABLE_TABLE,
  VEHICLE_APPROVAL_TABLE,
  CAPITAL_SUPERVISION_TABLE,
  EXAM_ACCEPTANCE_TABLE,
  HUIZHOU_EXAM_ACCEPTANCE_TABLE,
  SUBJECT_TRAINING_TABLE,
  APPLY_EXAM_TABLE,
  EXAM_APPROVAL_TABLE,
  HUIZHOU_EXAM_APPROVAL_TABLE,
  EXAM_FEE_TABLE,
  HUIZHOU_EXAM_FEE_TABLE,
  EXAM_RESULTS_TABLE,
  HUIZHOU_EXAM_RESULTS_TABLE,
  REPORT_CARD_TABLE,
  TRANSFER_OUT_TABLE,
} from '@/enums/accreditation/quick_entry_table';

import { SUBJECT, EXAM_RESULT, FEE_SUBJECT } from '@/enums';

const feeEnus: any = {
  考试费: [
    {
      subject: 1,
      fee: 70,
    },
    {
      subject: 2,
      fee: 130,
    },
    {
      subject: 3,
      fee: 280,
    },
    {
      subject: 4,
      fee: 0,
    },
  ],
  补考费: [
    {
      subject: 1,
      fee: 35,
    },
    {
      subject: 2,
      fee: 65,
    },
    {
      subject: 3,
      fee: 140,
    },
    {
      subject: 4,
      fee: 0,
    },
  ],
  工本费: [
    {
      subject: 1,
      fee: 0,
    },
    {
      subject: 2,
      fee: 0,
    },
    {
      subject: 3,
      fee: 0,
    },
    {
      subject: 4,
      fee: 10,
    },
  ],
};

@Component({
  components: {
    CtjtForm,
    CtjtTable,
    CtjtCard,
  },
})
export default class CtjtAccreditationQuickEntry extends Vue {
  @Action('assignment/queryAllExamPlaceList')
  private queryAllExamPlaceList!: () => ParamsType;

  @Prop({ default: false }) isShow!: boolean;

  @Prop({ default: {} }) supplementProps!: any;

  private title = '';

  @Watch('isShow')
  watchShow(val: boolean) {
    if (val) {
      const { code } = this.supplementProps;
      if (code === 'exam_approval') {
        this._setExamAddressList();
      }
      window.addEventListener('keydown', this.keydownFn);
      if (code === 'exam_results') {
        this.title = '请先选择科目，再进行【证件号码】查询';
      }
    } else {
      window.removeEventListener('keydown', this.keydownFn, false);
      (this.$refs.insert_form as VueComponentParent).resetFields();
    }
    this._setCancelReasonIsRequired(false); // 考试结果-取消原因非必填
  }

  keydownFn(event: any) {
    if (event.keyCode === 13) {
      (this.$refs.insert_form as any).propClick('add');
    }
  }

  private previewData: ParamsType = {};

  /** form表单配置 */
  private commonForm: ParamsType = {};

  @Watch('supplementProps', { immediate: false, deep: true })
  private watchSupplementPropsFun(val: any) {
    const { code, drivingSchoolId } = val;
    switch (code) {
      case 'paperless_collect':
        this.previewData.labels = PAPERLESS_COLLECT_TABLE;
        this.commonForm = PAPERLESS_COLLECT_FORM;
        break;
      case 'site_delivery_table':
        this.previewData.labels = SITE_DELIVERY_TABLE_TABLE;
        this.commonForm = SITE_DELIVERY_TABLE_FORM;
        break;
      case 'license_receipt_form':
        this.previewData.labels = LICENSE_RECEIPT_FORM_TABLE;
        this.commonForm = LICENSE_RECEIPT_FORM_FORM;
        break;
      case 'class_situation':
        this.previewData.labels = CLASS_SITUATION_TABLE;
        this.commonForm = CLASS_SITUATION_FORM;
        break;
      case 'area_delivery_table':
        this.previewData.labels = AREA_DELIVERY_TABLE_TABLE;
        this.commonForm = AREA_DELIVERY_TABLE_FORM;
        break;
      case 'vehicle_approval':
        this.previewData.labels = VEHICLE_APPROVAL_TABLE;
        this.commonForm = VEHICLE_APPROVAL_FORM;
        break;
      case 'capital_supervision':
        this.previewData.labels = CAPITAL_SUPERVISION_TABLE;
        this.commonForm = CAPITAL_SUPERVISION_FORM;
        break;
      case 'exam_acceptance':
        this.previewData.labels = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_ACCEPTANCE_TABLE
          : EXAM_ACCEPTANCE_TABLE;
        this.commonForm = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_ACCEPTANCE_FORM
          : EXAM_ACCEPTANCE_FORM;
        break;
      case 'subject_training':
        this.previewData.labels = SUBJECT_TRAINING_TABLE;
        this.commonForm = SUBJECT_TRAINING_FORM;
        break;
      case 'apply_exam':
        this.previewData.labels = APPLY_EXAM_TABLE;
        this.commonForm = APPLY_EXAM_FORM;
        break;
      case 'exam_approval':
        this.previewData.labels = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_APPROVAL_TABLE
          : EXAM_APPROVAL_TABLE;
        this.commonForm = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_APPROVAL_FORM
          : EXAM_APPROVAL_FORM;
        break;
      case 'exam_fee':
        this.previewData.labels = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_FEE_TABLE
          : EXAM_FEE_TABLE;
        this.commonForm = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_FEE_FORM
          : EXAM_FEE_FORM;
        break;
      case 'exam_results':
        this.previewData.labels = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_RESULTS_TABLE
          : EXAM_RESULTS_TABLE;
        this.commonForm = drivingSchool(drivingSchoolId) === 'huizhou'
          ? HUIZHOU_EXAM_RESULTS_FORM
          : EXAM_RESULTS_FORM;
        break;
      case 'report_card':
        this.previewData.labels = REPORT_CARD_TABLE;
        this.commonForm = REPORT_CARD_FORM;
        break;
      case 'transfer_out':
        this.previewData.labels = TRANSFER_OUT_TABLE;
        this.commonForm = TRANSFER_OUT_FORM;
        break;
      default:
        break;
    }
    const _data = {
      loading: false,
      index: true,
      selection: true,
      list: [],
      options: [
        {
          id: 1,
          label: '删除',
          type: 'danger',
        },
        {
          id: 2,
          label: '保存',
          type: 'success',
        },
        {
          id: 3,
          label: '取消',
          type: 'info',
        },
      ],
    };
    const _buttonList = {
      buttonList: [
        {
          label: '添加',
          key: 'add',
          type: 'primary',
          plain: false,
        },
      ],
    };
    this.previewData = { ..._data, ...this.previewData };
    this.commonForm = { ..._buttonList, ...this.commonForm };
  }

  /** form 回调 */
  formCallBack(val: any) {
    const { key, result } = val;
    if (key === 'add' && result) {
      const { commonForm, previewData, supplementProps } = this;
      const { drivingSchoolId, code } = supplementProps;
      const _data = drawSearchForm(commonForm);
      if (code === 'exam_acceptance') {
        if (
          drivingSchool(drivingSchoolId) !== 'huizhou'
          && (!_data.acceptNumber || _data.acceptNumber === undefined)
          && (!_data.acceptFailReason || _data.acceptFailReason === undefined)
        ) {
          this.$message.warning('受理号和失败原因必须任意填写一项！');
          return;
        }
      }
      if (code === 'exam_results') {
        if (
          (!_data.examResult || _data.examResult === undefined)
          && (!_data.examGrade || _data.examGrade === undefined)
        ) {
          this.$message.warning('考试结果和考试成绩必须任意填写一项！');
          return;
        }
        _data.examResult = _data.examResult || _data.examGrade;
      }
      if (
        code === 'exam_approval'
        || code === 'exam_fee'
        || code === 'exam_results'
      ) {
        _data.step = Number.isFinite(Number(_data.step))
          ? SUBJECT[_data.step - 1].label
          : _data.step;
      }
      const sendData = {
        ..._data,
        id: previewData.list ? this._getMax(previewData.list) + 1 : 1,
      };
      this.previewData.list.push(sendData);
      this.$message.success('添加成功');
      this.resetForm();
      // 考试成绩可输入
      this._setExamResultOrExamGradeDisabled(false, 'examGrade');
      // 考试结果可输入
      this._setExamResultOrExamGradeDisabled(false, 'examResult');
    }
  }

  /** 获取最大的id */
  _getMax(array: []) {
    let max = 0;
    array.map((obj: any) => {
      if (obj.id > max) max = obj.id;
      return max;
    });
    return max;
  }

  resetForm() {
    // 清空搜索出来的固定数据
    const { autocompleteList, selectList, inputList } = this.commonForm;
    const { code } = this.supplementProps;
    let delKeyList: string[] = [];
    switch (code) {
      case 'paperless_collect':
        delKeyList = ['carModel'];
        break;
      case 'site_delivery_table':
        break;
      case 'license_receipt_form':
        break;
      case 'class_situation':
        break;
      case 'area_delivery_table':
        break;
      case 'vehicle_approval':
        break;
      case 'capital_supervision':
        break;
      case 'exam_acceptance':
        delKeyList = ['carModel', 'acceptNumber'];
        break;
      case 'subject_training':
        break;
      case 'apply_exam':
        break;
      case 'exam_approval':
        delKeyList = ['acceptNumber'];
        break;
      case 'exam_fee':
        delKeyList = ['storeName', 'payNumber'];
        break;
      case 'exam_results':
        delKeyList = ['acceptNumber', 'examDate'];
        break;
      case 'report_card':
        break;
      default:
        break;
    }
    autocompleteList.forEach((item: any) => {
      const _item = item;
      _item.value = '';
    });
    inputList.forEach((item: any) => {
      const _item = item;
      const { key } = _item;
      // 公共删除项
      if (key === 'userName') {
        _item.value = '';
      }
      // 单个争对删除项
      if (delKeyList.includes(key)) {
        _item.value = '';
      }
    });
    selectList.forEach((item: any) => {
      const _item = item;
      const { key } = _item;
      // 公共删除项
      // 单个争对删除项
      if (delKeyList.includes(key)) {
        _item.value = '';
      }
    });
    this._setExamAcceptDisabled(false);
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
      let step = null;
      const { selectList } = this.commonForm;
      selectList.forEach((item: any) => {
        const _item = item;
        if (_item.customKey === 'resultStep') {
          step = _item.value;
        }
      });
      const { supplementIdNoPath, id } = this.supplementProps;
      const body = await this.$http.get(supplementIdNoPath, {
        params: {
          idNo: val,
          subjectCode: step,
        },
      });
      cb(body);
    } else {
      cb([]);
    }
  }

  /** 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList } = this.previewData;
    const idList: Array<number> = [];
    if (selectionList) {
      selectionList.forEach((item: any) => {
        const _item = item;
        idList.push(_item.id);
      });
    }
    const _len = selectionList ? selectionList.length : 0;
    const { id } = val;
    if (id === 1) {
      // 删除
      if (_len >= 1) {
        this.previewData.list = this.previewData.list.filter(
          (item: any) => !idList.includes(item.id)
        );
        this.$message.success('删除成功');
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
    // 保存
    if (id === 2) {
      this.handleButtonClick('submit');
    }
    if (id === 3) {
      // 取消
      this.handleButtonClick('cancel');
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.previewData.selectionList = val;
  }

  /** @description 提交快速录入方法 */
  async handleButtonClick(key?: string) {
    if (key === 'submit') {
      const { list } = this.previewData;
      if (list.length > 0) {
        let sendData: any = list;
        const { payType = null } = sendData;
        const { code: supCode } = this.supplementProps;
        if (supCode === 'transfer_out') {
          const idList: any = [];
          list.forEach((item: any) => {
            const { idNo } = item;
            idList.push({ idNo });
          });
          sendData = idList;
        }
        const { quickEntryPath } = this.supplementProps;
        await this.$http
          .post(quickEntryPath, sendData, {
            hasUseCode: true,
          })
          .then((res: any) => {
            const { code, body } = res;
            if (code === 200) {
              const { description = '', failLogDtoList } = body;
              const _list: any = matchNumberList(description);
              this.$emit('button-call', {
                data: {
                  ...body,
                  importSuccess: (_list && _list[0]) || 0,
                  imporError: (failLogDtoList && failLogDtoList.length) || 0,
                },
                key,
              });
              this.resetForm(); // 清空form表单
              this.previewData.list = []; // 清空列表
            }
          });
      } else {
        this.$message.warning('请先添加基础数据');
      }
    } else {
      this.resetForm(); // 清空form表单
      this.previewData.list = []; // 清空列表
      this.$emit('button-call', { key });
    }
  }

  private teachingType = '';

  private autocompleteChange(item: any) {
    // 设置根据证件号拿到的用户信息
    (this.$refs.insert_form as VueComponentParent).clearValidate();
    this.teachingType = item && item.teachingType ? item.teachingType : '';
    this._setFormDataByUserInfo(item || {});
  }

  /**
   * @param { any } item 搜索项 下拉选中返回当前对象
   * @description 搜索组件 下拉项选中回调函数
   */
  selectChange(item: any) {
    const _item = item;
    if (_item.customKey === 'resultStep') {
      // 用户基本信息重置
      this._resetUserInfo(_item.customKey);
      this._setExamResultList(_item.value); // 未联考是否可选
    }
    if (_item.key === 'examResult') {
      const examResult = _item.value;
      // 考试结果=取消考试时,取消原因必选
      if (examResult === '取消考试') {
        this._setCancelReasonIsRequired(true);
      } else this._setCancelReasonIsRequired(false);
      // 设置考试成绩不可输入
      if (_item.value) {
        _item.disabled = false;
        _item.rules = [
          { required: true, message: '请选择考试结果', trigger: 'change' },
        ];
        // 考试结果-考试结果选中值时，考试成绩清空不可输入
        this._setExamResultOrExamGradeDisabled(true, 'examGrade');
      } else {
        // 考试成绩可输入
        this._setExamResultOrExamGradeDisabled(false, 'examGrade');
        // 考试结果可输入
        this._setExamResultOrExamGradeDisabled(false, 'examResult');
      }
    }
    if (_item.customKey === 'feeStep') {
      const subject: any = this.getSubject('feeStep');
      this.setFeeSubjectDisabled(subject);
    }
    if (_item.customKey === 'feeStep' || _item.key === 'feeSubject') {
      // 考试交费科目和费用科目联动 得到费用
      const subject: any = this.getSubject('feeStep');
      const feeSubject: any = this.getFeeSubject('feeSubject');
      this.setFeeForSubject(subject, feeSubject);
    }
  }

  /** 设置费用科目是否可点击 */
  setFeeSubjectDisabled(subject: number) {
    const { selectList, inputList } = this.commonForm;
    selectList[2].value = '';
    inputList[1].value = null;
    const feeSubjectList = JSON.parse(JSON.stringify(FEE_SUBJECT));
    feeSubjectList.forEach((item: any) => {
      const _item = item;
      if (
        (_item.label === '工本费' && subject !== 4)
        || (_item.label !== '工本费' && subject === 4)
      ) {
        _item.disabled = true;
      } else {
        _item.disabled = false;
      }
    });
    selectList[2].options = feeSubjectList;
  }

  /** 根据科目和费用科目联动设置补考费考试费工本费金额 */
  setFeeForSubject(subject: number, feeSubject: string) {
    const feeSubjects = feeEnus[feeSubject];
    const feeItem = feeSubjects && feeSubjects
      ? feeSubjects.filter((a: any) => a.subject === subject)[0]
      : null;
    const fee = feeItem ? feeItem.fee : null;
    const { inputList } = this.commonForm;
    inputList[1].value = fee;
  }

  /** 获取费用科目 */
  getFeeSubject(key: string) {
    let feeSubject = null;
    const { selectList } = this.commonForm;
    if (Array.isArray(selectList)) {
      selectList.forEach((item: any) => {
        const _item = item;
        if (_item.key === key) {
          feeSubject = _item.value;
        }
      });
    }
    return feeSubject;
  }

  /** 获取科目 */
  getSubject(key: string) {
    let subject = null;
    const { selectList } = this.commonForm;
    if (Array.isArray(selectList)) {
      selectList.forEach((item: any) => {
        const _item = item;
        if (_item.customKey === key) {
          subject = _item.value;
        }
      });
    }
    return subject;
  }

  /** 获取考试结果 */
  getExamResult() {
    let result = '';
    const { selectList } = this.commonForm;
    if (Array.isArray(selectList)) {
      selectList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'examResult') {
          result = _item.value;
        }
      });
    }
    return result;
  }

  /** input blur回调事件 */
  inputBlurFunc(item: any) {
    const _item = item;
    if (
      _item.customKey === 'examAcceptNum'
      || _item.key === 'acceptFailReason'
    ) {
      //
      if (_item.value) {
        if (_item.customKey === 'examAcceptNum') {
          _item.disabled = false;
          _item.rules = [
            {
              required: true,
              message: '请输入受理号',
              trigger: 'blur',
            },
            {
              max: 50,
              message: '长度在50个字以内',
              trigger: 'blur',
            },
            {
              pattern: REG_NUMBER,
              message: '受理号只能为纯数字',
            },
          ];
          // 考场受理-受理号有值时，失败原因不可输入
          this._setExamAcceptDisabled(true, 'acceptFailReason');
        } else {
          _item.disabled = false;
          _item.rules = [
            {
              max: 200,
              message: '长度在200个字以内',
              trigger: 'blur',
            },
            {
              required: true,
              message: '请输入失败原因',
              trigger: 'blur',
            },
          ];
          // 考场受理-失败原因有值时，受理号不可输入
          this._setExamAcceptDisabled(true, 'examAcceptNum');
        }
      } else {
        // 失败原因可输入
        this._setExamAcceptDisabled(false, 'acceptFailReason');
        // 受理号可输入
        this._setExamAcceptDisabled(false, 'examAcceptNum');
      }
    }
    if (_item.key === 'examGrade') {
      if (_item.value) {
        _item.disabled = false;
        _item.rules = [
          { required: true, message: '请输入考试成绩' },
          {
            pattern: REG_TWO_FLOAT_NUMBER,
            message: '请输入最多保留两位小数的数值',
          },
          {
            validator: (rule: any, value: any, callback: any) => {
              if (Number(value) > 100) {
                callback(new Error('成绩不能超过100'));
              }
              callback();
            },
          },
        ];
        // 考试结果-考试成绩输入框有值时，考试结果下拉框清空不可输入&&考试结果类型和补合格原因清空不可输入
        this._setExamResultOrExamGradeDisabled(true, 'examResult');
      } else {
        // 考试成绩可输入
        this._setExamResultOrExamGradeDisabled(false, 'examGrade');
        // 考试结果可输入
        this._setExamResultOrExamGradeDisabled(false, 'examResult');
      }
    }
  }

  /** 根据用户信息设置表单数据 */
  _setFormDataByUserInfo(val: any) {
    const {
      userName,
      carModel,
      storeName = '',
      examDate = '',
      acceptNumber = '',
    } = val;
    const { inputList } = this.commonForm;
    if (Array.isArray(inputList)) {
      inputList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'userName') {
          _item.value = userName;
        }
        if (_item.key === 'carModel') {
          _item.value = carModel;
        }
        if (_item.key === 'storeName') {
          _item.value = storeName;
        }
        if (_item.customKey === 'resultExamDate') {
          _item.value = examDate || null;
        }
        if (
          _item.customKey === 'resultAcceptNumber'
          || _item.customKey === 'feeAcceptNumber'
          || _item.customKey === 'approvalAcceptNumber'
        ) {
          _item.value = acceptNumber || '';
        }
      });
    }
  }

  /** 科目改变时候重置用户基本信息 */
  private _resetUserInfo(type: string) {
    const { autocompleteList, inputList } = this.commonForm;
    autocompleteList[0].value = '';
    if (Array.isArray(inputList)) {
      inputList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'userName') {
          _item.value = '';
        }
        if (type === 'feeStep') {
          if (
            //  _item.key === 'acceptNumber'
            _item.key === 'storeName'
          ) {
            _item.value = '';
          }
        }
        if (type === 'approvalStep') {
          if (_item.key === 'acceptNumber') {
            _item.value = '';
          }
        }
        if (type === 'resultStep') {
          if (
            _item.key === 'acceptNumber'
            || _item.customKey === 'resultExamDate'
          ) {
            _item.value = '';
          }
        }
        if (
          _item.customKey === 'resultAcceptNumber'
          || _item.customKey === 'feeAcceptNumber'
          || _item.customKey === 'approvalAcceptNumber'
        ) {
          _item.value = '';
        }
      });
    }
  }

  /** 重新根据科目设置考试结果list数据-只有科目四可选择未联考 */
  _setExamResultList(subject: number) {
    const result = JSON.parse(JSON.stringify(EXAM_RESULT));
    result.forEach((item: any) => {
      const _item = item;
      if (_item.id === '未联考' && subject === 4) {
        _item.disabled = false;
      }
    });
    const { selectList } = this.commonForm;
    if (Array.isArray(selectList)) {
      selectList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'examResult') {
          _item.value = '';
          _item.options = result;
        }
      });
    }
  }

  /** 设置不合格原因 */
  _setFailResonList(val: number) {
    const { selectList } = this.commonForm;
    // 拉取考试结果类型以及不合格原因json
    const examResontJson = require('@/assets/json/exam_unqualified.json');
    if (Array.isArray(selectList)) {
      selectList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'failReason') {
          const resonArray = examResontJson.find((a: any) => a.label === val);
          const _array = resonArray ? resonArray.children : [];
          _item.options = _array;
        }
      });
    }
  }

  /** 设置考试批复-考试地点下拉框list */
  async _setExamAddressList() {
    // 获取考试地点数据
    await this.queryAllExamPlaceList().then((res: Array<any>) => {
      const _list = deepClone(res);
      const _arr: Array<any> = [];
      _list.forEach((item: any) => {
        _arr.push({
          id: item.id,
          label: item.examPlaceName,
        });
      });
      this.$nextTick(() => {
        const { selectList } = this.commonForm;
        if (Array.isArray(selectList)) {
          selectList.forEach((item: any) => {
            const _item = item;
            if (_item.key === 'examAddress') {
              _item.options = _arr;
            }
          });
        }
      });
    });
  }

  /** 设置考试结果-取消原因下拉框是否必填 */
  _setCancelReasonIsRequired(disabled: boolean) {
    const { selectList } = this.commonForm;
    if (Array.isArray(selectList)) {
      selectList.forEach((opt: any) => {
        const _opt = opt;
        if (_opt.key === 'remark') {
          _opt.rules[0].required = disabled;
          _opt.disabled = !disabled;
          if (!disabled) {
            _opt.value = '';
            this.$nextTick(() => {
              (this.$refs.insert_form as VueComponentParent).clearValidate();
            });
          }
        }
      });
    }
  }

  /** 设置考场受理失败原因以及受理号是否可用以及设置其是否必填 */
  _setExamAcceptDisabled(disabled?: boolean, key?: string) {
    const { inputList } = this.commonForm;
    if (Array.isArray(inputList)) {
      inputList.forEach((opt: any) => {
        const _opt = opt;
        if (key) {
          if (_opt.key === key || _opt.customKey === key) {
            _opt.disabled = disabled;
            _opt.rules = [];
            (this.$refs.insert_form as VueComponentParent).clearValidate();
          }
        } else if (
          _opt.key === 'acceptFailReason'
          || _opt.customKey === 'examAcceptNum'
        ) {
          _opt.disabled = disabled;
          _opt.rules = [];
          (this.$refs.insert_form as VueComponentParent).clearValidate();
        }
      });
    }
  }

  /** 设置考试结果和考试成绩任选其一 */
  _setExamResultOrExamGradeDisabled(disabled?: boolean, key?: string) {
    const { inputList, selectList } = this.commonForm;
    if (key === 'examResult') {
      if (Array.isArray(selectList)) {
        selectList.forEach((opt: any) => {
          const _opt = opt;
          if (key) {
            if (_opt.key === key) {
              _opt.disabled = disabled;
              _opt.rules = [];
              _opt.value = null;
              (this.$refs.insert_form as VueComponentParent).clearValidate();
            }
          }
        });
      }
    }
    if (key === 'examGrade') {
      if (Array.isArray(inputList)) {
        inputList.forEach((opt: any) => {
          const _opt = opt;
          if (key) {
            if (_opt.key === key) {
              _opt.disabled = disabled;
              _opt.rules = [];
              _opt.value = null;
              (this.$refs.insert_form as VueComponentParent).clearValidate();
            }
          }
        });
      }
    }
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
.close_icon {
  cursor: pointer;
}
</style>
