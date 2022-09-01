import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';

@Component
export default class ExamRecord extends Vue {
  @Action('license/queryExamRecordList') private queryExamRecordList!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'carModel',
        label: '车型',
        render(h: any, params: any) {
          const { carModel } = params._self.tableData._this.detailParams;
          if (!carModel) return h('div', '');
          return h('div', carModel);
        }
      },
      {
        key: 'batchNo',
        label: '批次号',
        minWidth: 120,
      },
      {
        key: 'step',
        label: '科目',
      },
      {
        key: 'subject',
        label: '办证科目',
        minWidth: 120,
      },
      {
        key: 'coachName',
        label: '教练',
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
      },
      {
        key: 'address',
        label: '考试地点',
        minWidth: 100,
      },
      {
        key: 'result',
        label: '考试结果',
        minWidth: 100,
      },
      {
        key: 'abnormal',
        label: '批复异常',
        minWidth: 130,
        render(h: any, params: any) {
          const { abnormal } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: abnormal,
            },
            scopedSlots: {
              reference: () => h('p', abnormal),
            },
          });
        },
      },
      {
        key: 'operationName',
        label: '操作人',
      },
      {
        key: 'createdTime',
        label: '操作时间',
        minWidth: 150,
        render(h: any, params: any) {
          const { createdTime } = params.row;
          if (!createdTime) return h('div', '');
          return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 130,
        render(h: any, params: any) {
          const { remark } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remark,
            },
            scopedSlots: {
              reference: () => h('p', remark),
            },
          });
        }
      },
    ],
    list: [],
    selectionList: [],
    setCellClassName: (val: any) => {
      const { result } = val.row;
      return (result === '不合格' || result === '缺考') ? 'td_text_red' : '';
    }
  };

  async queryList() {
    const { id } = this.detailParams;
    try {
      const body = await this.queryExamRecordList({ orderId: id });
      this.tableData.list = body;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  mounted() {
    this.tableData._this = this;
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
  }
}
