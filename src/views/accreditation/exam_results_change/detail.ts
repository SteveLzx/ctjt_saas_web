import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import { CtjtTable, CtjtCard } from '@/components';
import { VERIFY_STRTUS, EXAM_RESULT_CHANGE_TYPE } from '@/enums';
import { ParamsType } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtTable,
    CtjtCard,
  },
  filters: {
    auditStatusFilter(val: number): string {
      let text = '';
      if (val === undefined) return '';
      const list = VERIFY_STRTUS.filter(item => item.id === val);
      text = list.length > 0 ? list[0].label : '';
      return text;
    }
  }
})
export default class AccreditationExamResultsChangeDetailIndex extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('license/queryResultChangeDetail') private queryResultChangeDetail!: (data: any) => any;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 变更信息表格配置
  private changeInfoTableData: ParamsType = {
    _this: {},
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'batchNo',
        label: '批次号',
        minWidth: 100,
      },
      {
        key: 'regionName',
        label: '片区',
        minWidth: 100,
        showOverflowTooltip: true,
      },
      {
        key: 'storeName',
        label: '门店',
        minWidth: 100,
        showOverflowTooltip: true,
      },
      {
        key: 'userName',
        label: '学员姓名',
        minWidth: 80,
      },
      {
        key: 'idNo',
        label: '证件号码',
        width: 170,
      },
      {
        key: 'mobile',
        label: '联系电话',
        width: 120,
      },
      {
        key: 'applyDate',
        label: '报名日期',
        width: 160,
        render(h: any, params: any) {
          const { applyDate } = params.row;
          if (!applyDate) return h('div', '');
          return h('div', dayjs(applyDate).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'carModel',
        label: '车型',
        minWidth: 80,
      },
      {
        key: 'coachName',
        label: '教练',
        minWidth: 100,
      },
      {
        key: 'step',
        label: '科目',
        minWidth: 100,
      },
      {
        key: 'examAddress',
        label: '考试地点',
        minWidth: 150,
        render(h: any, params: any) {
          const { examAddress } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: examAddress,
            },
            scopedSlots: {
              reference: () => h('p', examAddress),
            },
          });
        },
      },
      {
        key: 'examDate',
        label: '考试日期',
        minWidth: 120,
        render(h: any, params: any) {
          const { examDate } = params.row;
          if (!examDate) return h('div', '');
          return h('div', dayjs(examDate).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'examTime',
        label: '考试时间',
        minWidth: 100,
      },
      {
        key: 'examResultOld',
        label: '考试结果',
        minWidth: 100,
      }
    ],
    list: [],
    selectionList: [],
  };

  // 抽屉弹窗详情表单
  private detailFormData: ParamsType = {
    id: 0,
    seq: '', // 撤销单编号
    status: 1, // 审核状态 1通过，2驳回，3撤回
    type: null, // 考核类型
    changeInfo: [],
    examResultNew: '', // 变更后考试结果
    reason: '', // 变更原因
    isApprove: true, // 是否审核中
    approveResult: null, // 审核结果 1:通过，2：驳回
    opinion: '', // 驳回原因
  };

  private typeList = [{
    label: '客观出错',
    id: 1,
  }, {
    label: '主观出错',
    id: 2,
  },
  ];

  private examResultList = EXAM_RESULT_CHANGE_TYPE;

  // 详情审批详情表格配置
  private approvalInfoTableData: ParamsType = {
    _this: {},
    selection: false,
    index: false,
    options: [],
    labels: [
      {
        key: 'taskName',
        label: '审批环节',
        minWidth: 170,
      },
      {
        key: 'userName',
        label: '审核人',
        minWidth: 80,
      },
      {
        key: 'status',
        label: '审核操作',
        minWidth: 80,
        render(h: any, params: any) {
          const { status } = params.row;
          if (status === undefined) return h('div', '');
          const list = VERIFY_STRTUS.filter(item => item.id === status);
          return h('div', list[0] ? list[0].label : '');
        }
      },
      {
        key: 'opinion',
        label: '审核意见',
        minWidth: 80,
      },
      {
        key: 'updatedTime',
        label: '申请/审核时间',
        minWidth: 170,
        render(h: any, params: any) {
          const { status, updatedTime } = params.row;
          const result = status === VERIFY_STRTUS[0].id;
          return h('div', result ? '' : updatedTime);
        }
      },
    ],
    list: [],
    selectionList: [],
  };

  /** 返回list页面 */
  cancelFun() {
    this.$router.push({ path: '/accreditation/information/exam_results_change' });
  }

  /** 撤销详情 */
  async queryDetail() {
    const { seq } = this.detailParams;
    const body = await this.queryResultChangeDetail({ seq });
    const list = [].concat(body);
    this.changeInfoTableData.list = list;
    const {
      status, type, reason, examResultNew
    } = body;
    this.detailFormData.status = status;
    this.detailFormData.type = type;
    this.detailFormData.reason = reason;
    this.detailFormData.examResultNew = examResultNew;
  }

  activated() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryDetail();
    }
  }
}
