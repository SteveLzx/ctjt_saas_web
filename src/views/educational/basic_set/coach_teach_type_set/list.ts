import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { deepClone } from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import { setTableLabels, marginTableLabels } from '@/views/educational/_common/common';
import { canTeachSubjectOpts, canTeachTypeOpts } from '@/views/educational/_enums/index';
import {
  CtjtTable, CtjtPagination, CtjtCard, CtjtSetField
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtSetField
  }
})
export default class EducationalBasicSetCoachTeachtypeSet extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('assignment/queryTeachTypeList') private queryTeachTypeList!: () => ParamsType;

  @Action('assignment/saveOrUpdateTeachType') private saveOrUpdateTeachType!: (data: any) => ParamsType;

  @Action('assignment/queryTeachTypeById') private queryTeachTypeById!: (data: any) => ParamsType;

  @Action('assignment/enableDisableById') private enableDisableById!: (data: any) => ParamsType;

  // 可带教科目
  subjectOpts = canTeachSubjectOpts;

  // 带教模式
  typeOpts = canTeachTypeOpts;

  // 弹窗名称
  private dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /**
   * @description 表格初始化设置
   */
  private initSetTableLabel() {
    const { tableLabelType } = this;
    const _originalLabelList = marginTableLabels(tableLabelType);
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(_originalLabelList, tableLabelType);
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  // 分页列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '新增带教类型',
        path: 'btn_xzdjlx'
      },
      {
        id: 2,
        label: '启用',
        type: 'success',
        path: 'btn_enable'
      },
      {
        id: 3,
        label: '停用',
        type: 'warning',
        path: 'btn_disable'
      },
      {
        id: 4,
        label: '编辑',
        type: 'primary',
        icon: '&#xe613;',
        path: 'btn_edit'
      }
    ],
    labels: [],
    list: [],
    selectionList: []
  }

  /**
   * @description 列表操作回调
   */
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.drawerDetail = true;
      return;
    }
    if (id >= 2) {
      const { selectionList } = this.tableData;
      const _len = selectionList.length;
      if (_len === 0) {
        this.$message.warning('请勾选列表项！');
      } else if (_len === 1) {
        if (id === 2 || id === 3) {
          const { status, id: _id } = selectionList[0];
          // 判断相同状态不能操作
          if ((status === 0 && id === 3) || (status === 1 && id === 2)) {
            this.$message.warning('当前状态和将要更改状态相同,不可操作!');
            return;
          }
          const sendData = {
            id: _id,
            flag: !status
          };
          this.enableDisableById(sendData).then(() => {
            this.$message.success(`${status === 0 ? '启用' : '停用'}成功!`);
            this.queryList();
          });
        }
        if (id === 4) {
          this.jumpDetail(selectionList[0].id, '1');
        }
      } else {
        this.$message.warning('仅支持单项操作！');
      }
    }
  }

  /**
   * @description 表单勾选回调
   */
  private tableSelectionChange(val: Array<any>) {
    this.tableData.selectionList = val;
  }

  private async jumpDetail(id: string, isEdit?: string) {
    this.isEdit = isEdit === '2';
    const sendData = {
      id
    };
    const body = await this.queryTeachTypeById(sendData);
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = body[key];
    });
    this.drawerDetail = true;
  }

  async queryList() {
    const body = await this.queryTeachTypeList();
    this.tableData.list = body;
  }

  // 抽屉
  private drawerDetail = false;

  private submitLoading = false;

  private isEdit = false;

  private formData: ParamsType = {
    id: null,
    model: null,
    name: '',
    property: 1,
    remarks: '',
    status: 1,
    subject: []
  }

  private formDataRules = {
    name: [
      { required: true, message: '请输入带教类型名称', trigger: ['change', 'blur'] }
    ],
    property: [
      { required: true, message: '请选择是否有带教属性', trigger: ['change', 'blur'] }
    ],
    subject: [
      { required: true, message: '请选择可带教科目', trigger: ['change', 'blur'] }
    ],
    model: [
      { required: true, message: '请选择带教模式', trigger: ['change', 'blur'] }
    ]
  }

  @Watch('formData.property', { deep: true, immediate: true })
  private watchPropertyFunc(newVal: number) {
    if (newVal === 0) {
      this.formData.subject = [];
      this.formData.model = null;
    }
  }

  /**
   * @description 关闭弹窗
   */
  private handleCloseClick() {
    (this.$refs.detailFormRef as VueComponentParent).resetFields();
    this.drawerDetail = false;
    this.submitLoading = false;
    this.formData.id = null;
    this.isEdit = false;
  }

  private submit() {
    (this.$refs.detailFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = deepClone(this.formData);
        const { id } = sendData;
        if (id === null) {
          delete sendData.id;
        }
        this.saveOrUpdateTeachType(sendData).then(() => {
          this.$message.success('操作成功!');
          this.queryList();
          this.handleCloseClick();
        }).finally(() => {
          this.submitLoading = false;
        });
      } else {
        this.$message.warning('按错误提示修改!');
      }
    });
  }

  // 生命周期
  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'BASIC_SET_COACH_TEACH_TYPE_SET_LABEL';
    this.initSetTableLabel();
    // 先默认请求驾校
    await this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
    this.perm = permObj.perm;
  }
}
