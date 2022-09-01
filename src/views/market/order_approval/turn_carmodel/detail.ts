import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { deepClone, REG_PRICE_OR_ZONE } from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import { approveStatusOpts } from '@/views/market/_enums';
import { STUDY_STAGE } from '@/enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import {
  CtjtTable, CtjtCard, CtjtRejectDialog
} from '@/components';

@Component({
  components: {
    CtjtTable, CtjtCard, CtjtRejectDialog
  },
  filters: {
    auditStatusFilter(val: number): string {
      const _item = approveStatusOpts.filter((item: any) => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    learnDrivingScheduleFilter(val: number): string {
      const _item = STUDY_STAGE.filter((item: any) => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
  }
})
export default class MarketOrderApprovalTurnCarmodelDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('order/queryApprovesDetail') private queryApprovesDetail!: (data: any) => ParamsType;

  @Action('order/putNoPassApproves') private putNoPassApproves!: (data: any) => ParamsType;

  @Action('order/putPassApproves') private putPassApproves!: (data: any) => ParamsType;

  @Action('order/putUndoApproves') private putUndoApproves!: (data: any) => ParamsType;

  @Action('order/queryOrderFuzzyUsers') private queryOrderFuzzyUsers!: (data: any) => any;

  @Action('order/queryOrderPaysList') private queryOrderPaysList!: (data: any) => any;

  @Action('order/addApprovesChangeCarModel') private addApprovesChangeCarModel!: (data: any) => any;

  @Action('order/editApproves') private editApproves!: (data: any) => any;

  @Action('order/deleteApproves') private deleteApproves!: (data: any) => any;

  @Watch('formData.type', { deep: true, immediate: true })
  handleWatchType(val: number): void {
    this.formRules.receipt[0].required = val === 3;
  }

  handleTypeChange(val: number) {
    if (val === 4) {
      this.formData.receipt = '';
      this.formData.amount = 0;
    }
  }

  deepFormData: ParamsType = {
    amount: null, // 应收金额
    carModel: '', // 学员车型
    classesName: '', // 班别名称
    extOrderId: 0, // 其他订单id
    idNo: '',
    newModel: '', // 新班别、新车型
    orderId: 0,
    receipt: '', // 收据编号
    remark: '',
    type: 3, // 变更类型
    id: ''
  }

  formData = deepClone(this.deepFormData)

  formRules = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    type: [
      { required: true, message: '请选择变更类型', trigger: ['change', 'blur'] }
    ],
    newModel: [
      { required: true, message: '请选择新车型', trigger: ['change', 'blur'] }
    ],
    receipt: [
      { required: false, message: '请选择收据编号', trigger: ['change', 'blur'] }
    ],
    amount: [
      { required: true, message: '请输入应收金额', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ]
  }

  // 用户搜索
  async queryIdNoSearch(value: string, cb: any) {
    if (!value) {
      cb([]);
      return;
    }
    const body = await this.queryOrderFuzzyUsers({ keyword: value });
    cb(body);
  }

  async hanldIdNoSelect(value: any) {
    Object.keys(value).forEach(key => {
      this.formData[key] = value[key];
    });
    const { idNo } = this.formData;
    const body = await this.queryOrderPaysList({ type: 1, idNo });
    this.receiptOptes = body || [];
  }

  // 收款单据号
  receiptOptes: any[] = []

  handleReceiptChange(value: any) {
    const list = this.receiptOptes.filter((item: any) => item.receipt === value);
    if (list.length > 0) {
      const data = list[0];
      Object.keys(data).forEach(key => {
        this.formData[key] = data[key];
      });
    }
  }

  submitLoading = false;

  submit() {
    (this.$refs.formDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const { id } = this.formData;
        if (id) {
          this.editApproves(this.formData).then(() => {
            this.goback();
            this.$message.success('修改成功！');
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          this.addApprovesChangeCarModel(this.formData).then(() => {
            this.goback();
            this.$message.success('新增成功！');
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  goback() {
    this.clearCache();
    this.$router.push({ path: '/market/order_approval/turn_carmodel' });
  }

  examineTableData: ParamsType = {
    labels: [
      {
        label: '审批环节',
        key: 'verifyNode'
      },
      {
        label: '审核人',
        key: 'createdName'
      },
      {
        label: '审核操作',
        key: 'verifyOperation'
      },
      {
        label: '审核意见',
        key: 'verifyOpinion',
        render(h: any, params: any) {
          const { verifyOpinion } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: verifyOpinion,
            },
            scopedSlots: {
              reference: () => h('p', verifyOpinion),
            },
          });
        }
      },
      {
        label: '审核时间',
        key: 'verifyDate'
      }
    ],
    list: [],
  }

  private resetFunc() {
    this.$message.success('操作成功！');
    this.goback();
  }

  // 操作按钮函数
  async btnSubmit(val: number) {
    const { id } = this.formData;
    if (val === 1) {
      this.$prompt('请输入通过理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{0,50}$/,
        inputErrorMessage: '输入内容长度为0-50'
      }).then((res: any) => {
        const { value } = res;
        if (value === null || value.length <= 50) {
          const sendData = { id, verifyOpinion: value ? `同意，${value}` : '同意' };
          this.putPassApproves(sendData).then(() => {
            this.resetFunc();
          });
        } else {
          this.$message.warning('输入内容长度为1-50');
        }
      });
    }
    if (val === 2) {
      this.rejectShow = true;
    }
    if (val === 3) {
      this.$confirm('审核撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sendData = { id };
        this.putUndoApproves(sendData).then(() => {
          this.resetFunc();
        });
      });
    }
    if (val === 4) {
      this.type = 2;
      const { idNo } = this.formData;
      const body = await this.queryOrderPaysList({ type: 1, idNo });
      this.receiptOptes = body || [];
    }
    if (val === 5) {
      this.$confirm('确定删除该条申请单?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids: string[] = [id];
        await this.deleteApproves(ids);
        this.resetFunc();
      });
    }
  }

  rejectShow = false;

  rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { id } = this.formData;
    const sendData = { id, verifyOpinion: remark, verifyNode: data.verifyNode };
    this.putNoPassApproves(sendData).then(() => {
      this.resetFunc();
    });
  }

  auditStatus = 0;

  type = 0 // 0新增 1查看 2编辑

  queryDetail() {
    const {
      id, orderId, type, auditStatus
    } = this.$route.query;
    if (Number(id) > 0) {
      this.queryApprovesDetail({ id, orderId, type: 1 }).then((res: any) => {
        const { changeOrderDto, orderDto, records } = res;
        this.examineTableData.list = records;
        Object.keys(changeOrderDto).forEach(key => {
          this.formData[key] = changeOrderDto[key];
        });
        Object.keys(orderDto).forEach(key => {
          this.formData[key] = orderDto[key];
        });
        this.formData.id = id;
        this.type = Number(type) || 0;
        this.auditStatus = Number(auditStatus) || 0;
      });
    }
  }

  perm = {};

  async activated() {
    this.queryDetail();
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
