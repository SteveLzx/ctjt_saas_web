import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import {
  CtjtTable,
  CtjtTabBar
} from '@/components';
import {
  VERIFY_STRTUS,
  EXAM_TYPE,
} from '@/enums';
import {
  ParamsType
} from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

// 无纸化采集变更列表
const wuzhihuaLabels = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 100,
  },
  {
    key: 'name',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'carModel',
    label: '车型',
    minWidth: 120,
    render(h: any, params: any) {
      const { carModel } = params.row;
      if (Object.prototype.toString.call(carModel) === '[object Object]') {
        return h('div', carModel.value);
      }
      return h('div', carModel);
    }
  },
  {
    key: 'date',
    label: '采集日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { date } = params.row;
      if (Object.prototype.toString.call(date) === '[object Object]') {
        if (date.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: dayjs(date.value).format('YYYY-MM-DD'),
            }
          });
        }
        return h('div', dayjs(date.value).format('YYYY-MM-DD'));
      }
      return h('div', dayjs(date).format('YYYY-MM-DD'));
    }
  },
];

// 考试批复变更列表
const kaoshipifuLabels = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 100,
  },
  {
    key: 'name',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'examDate',
    label: '考试日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { examDate } = params.row;
      if (Object.prototype.toString.call(examDate) === '[object Object]') {
        if (examDate.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: examDate.value,
            }
          });
        }
        return h('div', examDate.value);
      }
      return h('div', examDate);
    }
  },
  {
    key: 'examTime',
    label: '考试时间',
    minWidth: 120,
    render(h: any, params: any) {
      const { examTime } = params.row;
      if (Object.prototype.toString.call(examTime) === '[object Object]') {
        if (examTime.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: examTime.value,
            }
          });
        }
        return h('div', examTime.value);
      }
      return h('div', examTime);
    }
  },
  {
    key: 'examAddress',
    label: '考试地点',
    minWidth: 120,
    render(h: any, params: any) {
      const { examAddress } = params.row;
      if (Object.prototype.toString.call(examAddress) === '[object Object]') {
        if (examAddress.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: examAddress.value,
            }
          });
        }
        return h('div', examAddress.value);
      }
      return h('div', examAddress);
    }
  },
  {
    key: 'replyAbnormal',
    label: '批复异常信息',
    minWidth: 120,
    render(h: any, params: any) {
      const { replyAbnormal } = params.row;
      if (Object.prototype.toString.call(replyAbnormal) === '[object Object]') {
        if (replyAbnormal.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: replyAbnormal.value,
            }
          });
        }
        return h('div', replyAbnormal.value);
      }
      return h('div', replyAbnormal);
    }
  },
];

// 考试缴费变更列表
const kaoshijiaofeiLabels = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 100,
  },
  {
    key: 'name',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'payNumber',
    label: '缴费流水号',
    minWidth: 120,
    render(h: any, params: any) {
      const { payNumber } = params.row;
      if (Object.prototype.toString.call(payNumber) === '[object Object]') {
        if (payNumber.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: payNumber.value,
            }
          });
        }
        return h('div', payNumber.value);
      }
      return h('div', payNumber);
    }
  }
];

// 场点交表变更列表
const sitedeliverytableLabels = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 100,
  },
  {
    key: 'name',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'deliverDate',
    label: '场点交表日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { deliverDate } = params.row;
      if (Object.prototype.toString.call(deliverDate) === '[object Object]') {
        if (deliverDate.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: deliverDate.value,
            }
          });
        }
        return h('div', deliverDate.value);
      }
      return h('div', deliverDate);
    }
  }
];
// 牌证收表变更列表
const licensereceiptformLabels = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 100,
  },
  {
    key: 'name',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'recoveryDate',
    label: '牌证收表日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { recoveryDate } = params.row;
      if (Object.prototype.toString.call(recoveryDate) === '[object Object]') {
        if (recoveryDate.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: recoveryDate.value,
            }
          });
        }
        return h('div', recoveryDate.value);
      }
      return h('div', recoveryDate);
    }
  }
];
// 车管所送审变更列表
const vehicleapprovalLabels = [
  {
    key: 'batchNo',
    label: '批次号',
    minWidth: 100,
  },
  {
    key: 'name',
    label: '姓名',
    minWidth: 80,
  },
  {
    key: 'idNo',
    label: '证件号码',
    minWidth: 170,
  },
  {
    key: 'inspectionDate',
    label: '送审日期',
    minWidth: 120,
    render(h: any, params: any) {
      const { inspectionDate } = params.row;
      if (Object.prototype.toString.call(inspectionDate) === '[object Object]') {
        if (inspectionDate.flag) {
          return h('div', {
            style: {
              color: 'red',
            },
            domProps: {
              innerHTML: inspectionDate.value,
            }
          });
        }
        return h('div', inspectionDate.value);
      }
      return h('div', inspectionDate);
    }
  }
];

@Component({
  components: {
    CtjtTable,
    CtjtTabBar
  },
  filters: {
    isVerifyFilter(val: number): string {
      let text = '';
      if (val === undefined || val === null) return '';
      const list = VERIFY_STRTUS.filter(item => item.id === val);
      text = list.length > 0 ? list[0].label : '';
      return text;
    },
    assessTypeFilter(val: number): string {
      let text = '';
      const list = EXAM_TYPE.filter(item => item.id === val);
      text = list.length > 0 ? list[0].label : '';
      return text;
    }
  }
})
export default class AccreditationChangeInfoDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('workflow/queryChangeDetailedById') private queryChangeDetailedById!: (data: any) => any;

  // tab list
  private tabList = [
    {
      label: '变更前',
      id: 1
    },
    {
      label: '变更后',
      id: 2
    },
    {
      label: '审核信息',
      id: 3
    },
  ];

  // tab下标id
  private tabIndex = 1;

  @Watch('tabIndex')
  async checkTab() {
    this._setTabDataFunc();
  }

  // 详情返回全部数据
  private detailData: any = {};

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: wuzhihuaLabels,
    list: [],
    selectionList: [],
  };

  // 审核表单
  private formData: ParamsType = {}

  // 审核表单验证规则
  private formRules = {}

  // 审核信息列表配置
  private examineTable: ParamsType = {
    labels: [
      {
        key: 'verifyNode',
        label: '审批环节',
        minWidth: 100,
      },
      {
        key: 'verifyUser',
        label: '审核人',
        minWidth: 100,
      },
      {
        key: 'verifyOperation',
        label: '审核操作',
        minWidth: 100,
      },
      {
        key: 'verifyOpinion',
        label: '审核意见',
        minWidth: 100,
      },
      {
        key: 'verifyDate',
        label: '申请/审核时间',
        minWidth: 100,
        render(h: any, params: any) {
          const { verifyDate } = params.row;
          if (!verifyDate) return h('div', '');
          return h('div', dayjs(verifyDate).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
    ],
    list: [],
  }

  /**
   * @description 设置表格labels
   * 根据列表传进来的类型设置表格labels
   */
  private _setTabLabelsFunc(subjects: string) {
    if (subjects === '无纸化采集') {
      this.tableData.labels = wuzhihuaLabels;
    }
    if (subjects === '考试批复') {
      this.tableData.labels = kaoshipifuLabels;
    }
    if (subjects === '考试交费') {
      this.tableData.labels = kaoshijiaofeiLabels;
    }
    if (subjects === '场点交表') {
      this.tableData.labels = sitedeliverytableLabels;
    }
    if (subjects === '牌证收表') {
      this.tableData.labels = licensereceiptformLabels;
    }
    if (subjects === '车管所送审') {
      this.tableData.labels = vehicleapprovalLabels;
    }
  }

  /**
   * @description 设置切换标签更改列表数据
   */
  private _setTabDataFunc() {
    const { changeBeforeData, changeLaterData } = this.detailData;
    const { tabIndex } = this;
    if (tabIndex === 1) {
      this.tableData.list = changeBeforeData;
    }
    if (tabIndex === 2) {
      this.tableData.list = changeLaterData;
    }
  }

  /**
   * @description 请求列表详情
   */
  async queryList(changeNo: string) {
    // 处理数据
    try {
      const sendData = { changeNo };
      this.tableData.loading = true;
      const body = await this.queryChangeDetailedById(sendData);
      this.detailData = body;
      this._setTabDataFunc();
      this.examineTable.list = body.verifyMsgDate;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 列表传过来单条对象数据
  private changeDetailData: any = {};

  async activated() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.changeDetailData = JSON.parse(obj);
      const { changeNo, subjects } = this.changeDetailData;
      this._setTabLabelsFunc(subjects);
      this.queryList(changeNo);
    }
  }
}
