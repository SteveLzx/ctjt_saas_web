import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { IN_LIBRARY_STATUS, SHENHE_STATUS } from '@/enums';
import { API_FINANCE_V1_EXPENSES_DETAIL_EXPORT } from '@/api';
import { OTHER_FEE_MG_DETAIL_LABEL } from '@/views/finance/_common/tablelabel';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

const tableOptionList = [
  {
    id: 1,
    label: '审核通过',
    type: 'success',
    path: 'btn_shtg'
  },
  {
    id: 2,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
  {
    id: 3,
    label: '导出',
    path: 'btn_export'
  }
];
const name = '其他费用明细';
@Component
export default class FinanceOtherFeeMgDetail extends mixins(ctjtPaginationMixins, financeOperationLogMixins, clearCacheMixins) {
  @Action('finance/queryOtherFeeDetailList') private queryOtherFeeDetailList!: (data: any) => ParamsType;

  @Action('finance/otherFeeDetailDelete') private otherFeeDetailDelete!: (data: any) => ParamsType;

  @Action('finance/otherFeeDetailModifyStatus') private otherFeeDetailModifyStatus!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 搜索关键字
  private keyword = '';

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: tableOptionList,
    labels: OTHER_FEE_MG_DETAIL_LABEL,
    list: [],
    selectionList: [],
  };

  /** 操作日志 */
  logShow() {
    this.queryOperationLogPage(name);
    this.logshow = true;
  }

  /**
  * @description 表格操作回调
  */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const hasApproval = selectionList.filter((a: any) => a.status === SHENHE_STATUS[1].id).length > 0; // 已审核
    const isHistory = selectionList.filter((a: any) => a.studentStatus === IN_LIBRARY_STATUS[2].id).length > 0; // 存在历史学员
    if (id === 1) {
      // 审核通过
      if (_len >= 1) {
        if (hasApproval) {
          this.$message.warning('已审核的数据不可审核，请重新选择!');
        } else if (isHistory) {
          this.$message.warning('历史学员不可审核，请重新选择!');
        } else this._approvalFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 2) {
      // 删除
      if (_len >= 1) {
        if (hasApproval) {
          this.$message.warning('已审核数据不可删除，请重新选择!');
        } else if (isHistory) {
          this.$message.warning('历史学员不可删除，请重新选择!');
        } else this._deleteFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据');
      }
    }
    if (id === 3) {
      // 导出
      this._exportData(selectionList);
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  private detailObj = { createdName: '', createdTime: null, expensesId: '' };

  /** 导出 */
  private async _exportData(selectionList: any) {
    const { expensesId } = this.detailObj;
    const { keyword } = this;
    const ids: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      ids.push(_item.id);
    });
    const sendData = {
      expensesId,
      keyWord: keyword,
      ids
    };
    const body = await this.$http.post(API_FINANCE_V1_EXPENSES_DETAIL_EXPORT, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** @description 审核通过 */
  private _approvalFun(selectionList: any) {
    const sendData: any = [];
    const { expensesId } = this.detailObj;
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        id: _item.id,
        expensesId,
        batchNo: _item.batchNo,
        idNo: _item.idNo,
        userName: _item.userName,
      };
      sendData.push(data);
    });
    this.$confirm('确定审核通过？', '审核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.otherFeeDetailModifyStatus(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('审核成功');
      });
    }).catch(() => {
      this.$message.info('已取消审核');
    });
  }

  /** @description 删除 */
  private _deleteFun(selectionList: any) {
    const sendData: any = [];
    const { expensesId } = this.detailObj;
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        id: _item.id,
        expensesId,
        batchNo: _item.batchNo,
        idNo: _item.idNo,
        userName: _item.userName,
      };
      sendData.push(data);
    });
    this.$confirm('确定删除？', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.otherFeeDetailDelete(sendData)
        .then(() => {
          this.querFirstPageList();
          this.$message.success('删除成功');
        });
    }).catch(() => {
      this.$message.info('已取消删除');
    });
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { batchNo, keyword: idNo = '' } = this.detailParams;
    if (idNo) {
      this.keyword = idNo;
    }
    const { keyword } = this;
    // 处理数据
    const sendData = { keyword, batchNo };
    try {
      const body = await this.queryOtherFeeDetailList({ ...sendData });
      const {
        expensesDetailDtoList, createdName, createdTime, expensesId
      } = body;
      this.detailObj = { createdName, createdTime, expensesId };
      this.tableData.list = expensesDetailDtoList;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  perm = {};

  historyParams: any = '';

  async activated() {
    let { obj } = this.$route.query;
    const { historyParams } = this;
    if (obj !== historyParams) {
      this.keyword = '';
    }
    this.historyParams = obj;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
    const permObj = await this.$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
    this.perm = permObj.perm;
  }
}
