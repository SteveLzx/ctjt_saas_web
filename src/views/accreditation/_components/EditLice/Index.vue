<template>
  <el-drawer
    :visible="isShow"
    size="30%"
    title="编辑"
    :direction="'rtl'"
    :before-close="handleButtonClick"
  >
    <!--form 表单-->
    <CtjtForm
      ref="edit_form"
      class="page edit_form"
      :form-inline="false"
      :prop-data="commonForm"
      @form-submit="handleButtonClick"
    >
    </CtjtForm>
  </el-drawer>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Watch
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ParamsType, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { CtjtForm } from '@/components';
import {
  PAPERLESS_COLLECT_EDIT_FORM,
  SITE_DELIVERY_TABLE_EDIT_FORM,
  LICENSE_RECEIPT_FORM_EDIT_FORM,
  CLASS_SITUATION_EDIT_FORM,
  VEHICLE_APPROVAL_EDIT_FORM,
  EXAM_ACCEPTANCE_EDIT_FORM,
  EXAM_ACCEPTANCE_ERROR_EDIT_FORM,
  SUBJECT_TRAINING_EDIT_FORM,
} from '@/enums/accreditation/edit_form';

@Component({
  components: {
    CtjtForm,
  },
})
export default class CtjtEditLiceDrawer extends Vue {
  @Action('license/modifyFlowData') private modifyFlowData!: (data: any) => any;

  @Prop({ default: false }) isShow!: boolean;

  @Prop({ default: {} }) editProps!: any;

  @Prop({ default: {} }) data!: any;

  keydownFn(event: any) {
    if (event.keyCode === 13) {
      (this.$refs.edit_form as any).propClick('add');
    }
  }

  /** form表单配置 */
  private commonForm: ParamsType = {};

  @Watch('editProps', { immediate: true, deep: true })
  private watchEditPropsFun(val: any) {
    const { code, tabType } = val;
    switch (code) {
      case 'paperless_collect':
        this.commonForm = PAPERLESS_COLLECT_EDIT_FORM;
        break;
      case 'site_delivery_table':
        this.commonForm = SITE_DELIVERY_TABLE_EDIT_FORM;
        break;
      case 'license_receipt_form':
        this.commonForm = LICENSE_RECEIPT_FORM_EDIT_FORM;
        break;
      case 'class_situation':
        this.commonForm = CLASS_SITUATION_EDIT_FORM;
        break;
      case 'vehicle_approval':
        this.commonForm = VEHICLE_APPROVAL_EDIT_FORM;
        break;
      case 'exam_acceptance':
        this.commonForm = tabType === 1
          ? EXAM_ACCEPTANCE_EDIT_FORM
          : EXAM_ACCEPTANCE_ERROR_EDIT_FORM;
        break;
      case 'subject_training':
        this.commonForm = SUBJECT_TRAINING_EDIT_FORM;
        break;
      default:
        break;
    }
    const _buttonList = {
      buttonList: [
        {
          label: '取消',
          key: 'close',
          plain: false,
        },
        {
          label: '保存',
          key: 'submit',
          type: 'primary',
          plain: false,
        },
      ],
    };
    this.commonForm = { ..._buttonList, ...this.commonForm };
  }

  @Watch('isShow', { immediate: false, deep: true })
  watchShow(val: boolean) {
    if (val) {
      this.bindFormData();
    }
  }

  /** 根据传过来的选中的数据绑定表单数据 */
  bindFormData() {
    const { commonForm, data } = this;
    const { inputList, datePickerList } = commonForm;
    if (Array.isArray(inputList)) {
      inputList.forEach((item: any) => {
        const _item = item;
        const { key } = _item;
        _item.value = data[key];
      });
    }
    if (Array.isArray(datePickerList)) {
      datePickerList.forEach((item: any) => {
        const _item = item;
        const { key } = _item;
        _item.value = data[key];
      });
    }
  }

  /** form 回调 */
  async handleButtonClick(val: any) {
    const { key, result } = val;
    if (key === 'submit') {
      if (result) {
        const { commonForm, data } = this;
        const _data = drawSearchForm(commonForm);
        const { code, id } = data;
        const sendData = { ..._data, code, id };
        await this.modifyFlowData(sendData).then((res: any) => {
          const { code: resCode } = res;
          if (resCode === 200) {
            this.$emit('button-call', { key, data: '成功' });
            (this.$refs.edit_form as VueComponentParent).resetFields();
            this.$message.success('修改成功');
          }
        });
      }
    } else {
      (this.$refs.edit_form as VueComponentParent).resetFields();
      this.$emit('button-call', { key: 'close' });
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
.edit_form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
::v-deep .edit_form .el-form-item {
  margin-bottom: 40px;
  .el-date-editor,
  .el-select {
    width: 100%;
  }
  &:last-child {
    margin-top: 40px;
  }
}
</style>
