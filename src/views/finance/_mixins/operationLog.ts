/**
 * @author zy
 * @description 财务管理=>操作日志
 */
import { Action } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { matchNumberList } from '@/assets/js/common';

@Component
export default class financeOperationLogMixins extends Vue {
  @Action('finance/queryOpLogPageByType') private queryOpLogPageByType!: (data: any) => any;

  type = '系统交易流水';

  // 日志显示
  logshow = false;

  // 日志分页
  logPaginationData = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  // 日志
  logTableOptions = {
    labels: [
      {
        key: 'createdName',
        label: '操作人',
        minWidth: 100
      },
      {
        key: 'event',
        label: '操作',
        minWidth: 100
      },
      {
        key: 'description',
        label: '操作结果',
        minWidth: 200,
        render(h: any, params: any) {
          const { description, failLogDtoList } = params.row;
          let _text = description.replaceAll('null', '');
          if (Array.isArray(failLogDtoList)) {
            failLogDtoList.forEach(item => {
              _text += `；${item}`;
            });
          }
          return h('el-popover', {
            props: {
              placement: 'top-start',
              trigger: 'hover',
            },
            scopedSlots: {
              default: () => h(
                'div',
                {
                  style: {
                    minWidth: '150px',
                    maxWidth: '500px',
                    maxHeight: '200px',
                    overflow: 'auto',
                  },
                  domProps: {
                    innerHTML: _text
                  }
                }
              ),
              reference: () => h('p', _text),
            },
          });
        }
      },
      {
        key: 'batchNo',
        label: '批次号',
        minWidth: 120,
        render(h: any, params: any) {
          const { batchNo, description, event } = params.row;
          if (event.startsWith('新增') || event.startsWith('导入') || event === '补录办证数据' || event === '导入办证数据') {
            return h('span', description.startsWith('成功0条') ? '' : batchNo);
          }
          return h('span', batchNo);
        }
      },
      {
        key: 'createdTime',
        label: '操作时间',
        minWidth: 120
      },
    ]
  }

  // 日志列表
  loglist: Array<any> = [];

  logTableCurrentChange(val: number) {
    this.logPaginationData.current = val;

    this.queryOperationLogPage(this.type);
  }

  logTableSizeChange(val: number) {
    this.logPaginationData.pageSize = val;
    this.logPaginationData.current = 1;
    this.queryOperationLogPage(this.type);
  }

  /**
   * @description 查询日志信息列表
   */
  async queryOperationLogPage(type: string) {
    if (this.type !== type) this.type = type;
    const sendData = {
      current: this.logPaginationData.current,
      pageSize: this.logPaginationData.pageSize
    };
    const body = await this.queryOpLogPageByType({ type, ...sendData });
    const { data = [], current, total } = body;
    this.logPaginationData.current = current;
    this.logPaginationData.total = total;
    this.loglist = data;
  }
}
