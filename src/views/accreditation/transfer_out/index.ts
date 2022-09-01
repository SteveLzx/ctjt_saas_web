import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtSetField,
  CtjtAutoUpload
} from '@/components';
import {
  CtjtSupplementDrawer,
  CtjtAccreditationQuickEntry,
  CtjtCertificateResultDialog
} from '@/views/accreditation/_components';
import { timestampSizeCompare } from '@/assets/js/common';
import {
  getAccreditationProps, getTemplateDownloadProps, marginTableLabels, setTableLabels,
} from '@/views/accreditation/_common/common';
import download from '@/assets/js/download';

const name = '学员转出';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtSupplementDrawer,
    CtjtAccreditationQuickEntry,
    CtjtAutoUpload,
    CtjtCertificateResultDialog
  },
})
export default class AccreditationTransferOut extends mixins(ctjtAreaStoreSeachTableMixins, ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('license/queryForwardList') private queryForwardList!: (data: any) => any;

  @Action('license/queryForwardCancel') private queryForwardCancel!: (data: any) => any;

  private dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
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
      const sendData = { keyword: val };
      await this.queryStudentByKeyword(sendData).then((res: any) => {
        cb(res);
      });
    } else {
      cb([]);
    }
  }

  searchSelectChange(val: any) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        // 请求该片区下的门店列表
        this.queryStoreList(value);
      }
    }
  }

  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
    }
  }

  // 列表搜索项配置
  private localSearchForm: any = {
    datePickerList: [
      {
        label: '转出日期',
        key: 'beginDate',
        value: '',
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      }
    ],
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 220,
        placeholder: '请输入证件号/姓名',
        clearable: true,
      },
    ],
    buttonList: []
  }

  // 表格配置
  private tableData: any = {
    _this: {},
    index: true,
    loading: false,
    selection: true,
    selectionList: [],
    list: [],
    options: [
      // {
      //   id: 2,
      //   label: '下载导入模板',
      //   path: 'btn_import',
      // },
      {
        id: 3,
        label: '快速录入',
        type: 'primary',
        path: 'btn_quick_entry',
      },
      // {
      //   id: 4,
      //   label: '补录',
      //   type: 'primary',
      //   path: 'btn_blbzsj',
      // },
      {
        id: 5,
        label: '取消转出',
        type: 'danger',
        path: 'btn_cancel',
      },
    ],
    labels: [],
  };

  // 导入API路径
  private uploadPath = '';

  // 导入文件上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    fileAccept: '' // 限制上传文件格式
  };

  // 数据上传回调
  uploadCallback(val: any) {
    const { body = [] } = val;
    const len = body.length;
    if (len > 0) {
      this.dialogVisible = true;
      this.errorList = body;
    } else {
      this.$message.success('导入成功');
    }
    this.queryList();
  }

  private dialogVisible = false;

  private errorList = [];

  private tableOptionCallback(val: any) {
    const { id } = val;
    const { selectionList } = this.tableData;
    if (id === 2) {
      // 数据模板下载
      const { drivingSchoolId } = this.userInfo;
      download(getTemplateDownloadProps(name, drivingSchoolId));
    }
    if ([3, 4].includes(id)) {
      this.importProps = getAccreditationProps(name);
    }
    if (id === 3) {
      // 快速录入
      this.dialogName = 'quickEntry';
      return;
    }
    if (id === 4) {
      // 补录
      this.dialogName = 'supplement';
    }
    if (id === 5) {
      // 取消转出
      this.cancelForwardCancel(selectionList);
    }
  }

  // 取消转出
  cancelForwardCancel(list: any[]) {
    const len = list.length;
    if (len === 0) this.$message.warning('请先勾选列表操作项');
    if (len > 0) {
      this.$confirm('确定取消转出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const idList: any = [];
        list.forEach((item: any) => {
          const { idNo, id } = item;
          idList.push(id);
          // idList.push({ idNo, orderId: id });
        });
        this.queryForwardCancel(idList).then(() => {
          this.$message.success('操作成功');
          this.queryList();
        });
      });
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
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

  /**
  * @description 初始化列表搜索项
  */
  private initSearch() {
    // 合并混入的公共搜索项，和本地的搜索项
    const { searchForm, localSearchForm } = this;
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
  }

  queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('转出日期开始时间不能大于结束时间');
      return;
    }
    // 处理数据
    const sendData = {
      ..._data,
      dateType: 3
    };
    this.tableData.loading = true;
    this.queryForwardList(sendData).then((res: any) => {
      const {
        data = [], current, total
      } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).finally(() => {
      this.tableData.loading = false;
    });
  }

  // 导入办证数据配置
  private importProps = {};

  // 导入办证数据结果弹出框是否可见
  certificateResult = '';

  // 返回的导入办证结果
  importData: any = {};

  // 快速录入确定回调
  async submitQuickEntryCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.certificateResult = 'quickEntry';
        this.dialogName = '';
        this.importData = data;
        this.paginationData.current = 1;
        this.queryList();
      }
    } else {
      this.dialogName = '';
    }
  }

  // 补录按钮点击回调
  async submitSupplementCallback(val: any) {
    const { key, data } = val;
    if (key === 'submit') {
      if (data) {
        this.certificateResult = 'supplement';
        this.dialogName = '';
        this.importData = data;
        this.paginationData.current = 1;
        this.queryList();
      }
    } else {
      this.dialogName = '';
    }
  }

  perm = {}

  async mounted() {
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    this.tableLabelType = 'TRANSFER_OUT_LIST';
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    this.initSetTableLabel();
    this.queryList();

    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
