import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { ParamsType, VueComponentParent } from '@/type';
import { REG_PRICE_OR_ZONE } from '@/assets/js/common';
import { approveStatusOpts, delayTypeOpts } from '@/views/market/_enums';
import {
  CtjtTable, CtjtCard, CtjtRejectDialog, CtjtSelect,
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';
import { STUDY_STAGE } from '@/enums';

@Component({
  components: {
    CtjtTable,
    CtjtCard,
    CtjtRejectDialog,
    CtjtSelect,
  },
  filters: {
    auditStatusFilter(val: number): string {
      const _item = approveStatusOpts.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
  }
})
export default class DelayedLearningApprovalDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('order/queryPostponeOrderById') private queryPostponeOrderById!: (data: any) => ParamsType;

  @Action('order/noPassApproveDelayedLearning') private noPassApproveDelayedLearning!: (data: any) => ParamsType;

  @Action('order/passApproveDelayedLearning') private passApproveDelayedLearning!: (data: any) => ParamsType;

  @Action('order/backOutApproveDelayedLearning') private backOutApproveDelayedLearning!: (data: any) => ParamsType;

  @Action('order/addDelayedLearning') private addDelayedLearning!: (data: any) => ParamsType;

  @Action('order/updateDelayedLearningById') private updateDelayedLearningById!: (data: any) => ParamsType;

  @Action('license/queryByIdNo') private queryByIdNo!: (data: any) => any;

  @Action('order/queryPostponeOrderByIdNo') private queryPostponeOrderByIdNo!: (data: any) => any;

  @Action('order/queryPayInfoByOrderId') private queryPayInfoByOrderId!: (data: any) => any;

  @Action('order/deletePostponeByIds') private deletePostponeByIds!: (data: any) => ParamsType;

  isDetail = true;

  // 延期类型
  postponeTypeList = delayTypeOpts;

  learnDrivingScheduleList = STUDY_STAGE;

  // 收据编号list
  receiptList: any = [];

  handleReceiptChange(value: any) {
    const list = this.receiptList.filter((item: any) => item.receiptNumber === value);
    if (list.length > 0) {
      const data: any = list[0];
      Object.keys(data).forEach(key => {
        this.formData[key] = data[key];
      });
    }
  }

  private studentVo: ParamsType = {};

  private invoiceVo: ParamsType = {};

  private formData: ParamsType = {
    orderId: null,
    idNo: '', // 证件号码
    userName: '', // 姓名
    acceptNumber: '', // 受理号
    classesName: '', // 班别
    mobile: '', // 联系电话
    carModel: '', // 车型
    learnDrivingSchedule: null, // 学车进度
    examDate: null, // 科目一合格日期
    createdTime: null, // 报名日期
    salePrice: null, // 订单金额
    amount: null, // 实收金额
    postponeType: this.postponeTypeList[0].id, // 延期类型
    receiptNumber: '', // 收据编号
    postponeFee: null, // 延期费用
    postponeDate: null, // 延期日期
    postponeReason: '', // 延期原因
    nodeDtoList: [], // 审批流程表
  };

  private formDataRules: ParamsType = {
    idNo: [
      { required: true, message: '请输入证件号码', trigger: ['change', 'blur'] }
    ],
    userName: [
      { required: true, message: '找不到学员', trigger: ['change', 'blur'] }
    ],
    classesName: [
      { required: true, message: '找不到班别', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '找不到联系电话', trigger: 'blur' }
    ],
    carModel: [
      { required: true, message: '找不到车型', trigger: 'blur' }
    ],
    learnDrivingSchedule: [
      { required: true, message: '找不到学车进度', trigger: 'blur' }
    ],
    createdTime: [
      { required: true, message: '找不到报名日期', trigger: 'blur' }
    ],
    salePrice: [
      { required: true, message: '找不到订单金额', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: '找不到实收金额', trigger: 'blur' }
    ],
    postponeType: [
      { required: true, message: '请选择延期类型', trigger: ['change'] }
    ],
    receiptNumber: [
      { required: true, message: '延期类型为正常延期时，收据单号必选', trigger: ['change', 'blur'] },
    ],
    postponeFee: [
      { required: true, message: '延期费用为必填项', trigger: 'blur' },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    postponeDate: [
      { required: true, message: '延期日期为必填项', trigger: ['change', 'blur'] },
    ],
    postponeReason: [
      { required: true, message: '延期原因为必填项', trigger: 'blur' },
    ],
  };

  private auditStatus: any = 0;

  private applyNo: any = '';

  /** 延期类型改变时候 */
  postponeTypeChange() {
    this.formData.receiptNumber = null;
    this.formData.postponeFee = null;
  }

  // 身份证搜索下拉配置项
  private idNoOption = {
    options: [],
    loading: false,
    bodyOption: [],
  };

  /**
   * @description 根据证件模糊搜索，查询可退节点信息以及学员基础信息
   */
  private async queryIdNoSearch(val: any) {
    this.idNoOption.loading = true;
    if (val.length >= 2) {
      const body = await this.queryPostponeOrderByIdNo({ keyword: val }) || [];
      const userOps = body.map((a: any) => ({ idNo: a.idNo, userName: a.userName }));
      this.idNoOption.options = userOps;
      this.idNoOption.bodyOption = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数
  */
  async formDataSelectCallback(val: any) {
    this.idNoOption.options = [];
    const { bodyOption: list } = this.idNoOption;
    // 设置根据证件号拿到的用户信息
    const _data: any = list.filter((a: any) => a.idNo === val);
    const data = _data && _data[0] ? _data[0] : {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        this.formData[key] = data[key];
      }
    });
    if (this.formData.orderId) {
      this.receiptList = await this.queryPayInfoByOrderId({ orderId: this.formData.orderId });
    }
    this.formData.receiptNumber = null;
    this.formData.postponeFee = null;
  }

  private approvalTableData: ParamsType = {
    _this: {},
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
        label: '申请/审核时间',
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
  private async btnSubmit(val: number) {
    const { id } = this.$route.query;
    if (val === 1) { // 通过
      this.$prompt('请输入通过理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{0,50}$/,
        inputErrorMessage: '输入内容长度为0-50'
      }).then((res: any) => {
        const { value } = res;
        if (value === null || value.length <= 50) {
          const sendData = { id, verifyOpinion: value ? `同意，${value}` : '同意' };
          this.passApproveDelayedLearning(sendData).then(() => {
            this.resetFunc();
          });
        } else {
          this.$message.warning('输入内容长度为1-50');
        }
      });
    }
    if (val === 2) { // 驳回
      this.rejectShow = true;
    }
    if (val === 3) { // 撤销
      this.$confirm('审核撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sendData = { id };
        this.backOutApproveDelayedLearning(sendData).then(() => {
          this.resetFunc();
        });
      });
    }
    if (val === 4) {
      this.isEdit = true;
      const { orderId } = this.formData;
      if (orderId) {
        this.receiptList = await this.queryPayInfoByOrderId({ orderId: this.formData.orderId }) || [];
      }
    }
    if (val === 5) {
      this.$confirm('确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids: any = [id];
        await this.deletePostponeByIds(ids);
        this.$message.success('删除成功');
        this.resetFunc();
      });
    }
  }

  // 驳回至某一个环节弹出框
  rejectShow = false;

  /** 驳回回调 */
  rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { id } = this.$route.query;
    const sendData = { id, verifyOpinion: remark, verifyNode: data.verifyNode };
    this.noPassApproveDelayedLearning(sendData).then(() => {
      this.resetFunc();
    });
  }

  submitLoading = false;

  // 新增保存
  private submit() {
    (this.$refs.formDataRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const {
          id,
          orderId,
          postponeDate,
          postponeFee,
          postponeReason,
          postponeType,
          receiptNumber
        } = this.formData;
        const sendData = {
          id,
          orderId,
          postponeDate: this.$dayjs(postponeDate).format('YYYY-MM-DD'),
          postponeFee,
          postponeReason,
          postponeType,
          receiptNumber
        };
        if (sendData.id) {
          this.updateDelayedLearningById(sendData).then(() => {
            this.$message.success('修改成功！');
            this.goback();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id;
          this.addDelayedLearning(sendData).then(() => {
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

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/market/order_approval/delayed_learning' });
  }

  // 生命周期
  perm = {};

  isEdit = false;

  async activated() {
    const {
      id = null, auditStatus = null, applyNo = '', type = 0
    } = this.$route.query;
    this.isEdit = Number(type) === 1;
    this.isDetail = id !== null;
    this.auditStatus = Number(auditStatus);
    this.applyNo = applyNo;
    if (id) {
      this.queryPostponeOrderById({ id }).then((res: any) => {
        const { approveRecord } = res;
        this.approvalTableData.list = approveRecord;
        this.formData = res;
      });
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
