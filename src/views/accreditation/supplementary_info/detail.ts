import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtAutocomplete,
  CtjtPrint,
  CtjtCreateTable,
  CtjtSetField,
  CtjtStatistics,
} from '@/components';
import {
  ParamsType, TableOptionsValue
} from '@/type';
import { deepClone, searchTableKeyword } from '@/assets/js/common';
import {
  marginTableLabels, setTableLabels
} from '@/views/accreditation/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import clearCacheMixins from '@/mixins/clearCache';

const tableOptionList = [
  {
    id: 1,
    label: '保存修改',
    type: 'primary',
    path: 'btn_save'
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
    type: 'warning',
    path: 'btn_export'
  },
  {
    id: 4,
    label: '打印',
    path: 'btn_print'
  },
];

const getLabelFunc = (type: number) => {
  let _text = '';
  if (type === 1) _text = '片区交资料';
  if (type === 2) _text = '牌证收资料';
  if (type === 3) _text = '牌证退资料';
  return _text;
};

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtStatistics,
    CtjtCard,
    CtjtAutocomplete,
    CtjtPrint,
    CtjtCreateTable
  },
})
export default class AccreditationSupplementaryInformationDetail extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, clearCacheMixins) {
  @Action('license/putMaterialsDetail') private putMaterialsDetail!: (data: any) => any;

  @Action('license/deleteMaterialsDetail') private deleteMaterialsDetail!: (data: any) => any;

  @Action('license/queryMaterialsDetails') private queryMaterialsDetails!: (data: any) => any;

  // 弹窗名称
  private dialogName = '';

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
   * @description 字段设置保存回调
   */
  submitField(val: any) {
    // 保存设置的字段到缓存
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  // 打印列表配置
  private printTableData: ParamsType = {};

  // 打印列表展示
  private printShow = false;

  // 列表搜索项配置
  public searchForm: ParamsType = {
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '请输入学员姓名、证件号',
        clearable: true,
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        type: '',
        plain: false,
        path: 'btn_search'
      },
    ]
  }

  /**
   * @description 列表搜索 操作按钮回调
   */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      const { list, searchForm } = this;
      const { inputList } = searchForm;
      this.tableData.list = searchTableKeyword(inputList[0].value, list);
    }
    if (key === 'reset') {
      this._resetSearchFunc();
    }
  }

  /** 重置列表搜索回调 */
  private _resetSearchFunc() {
    this.queryList();
  }

  // 导出表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name: '补交资料明细列表'
  };

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: tableOptionList,
    labels: [],
    list: [],
    selectionList: [],
  };

  /**
   * @description 修改列表remark值
   * @param index 数组列表序号
   * @param value 修改值
   */
  public setItemRemarkFunc(index: number, value: string) {
    this.tableData.list[index].remarks = value;
  }

  /**
   * @description 修改列表key的value
   * @param index 数组列表序号
   * @param value 修改值
   */
  public setItemValFunc(index: number, value: string) {
    this.tableData.list[index].materialName = value;
  }

  /**
   * @description 列表操作回调
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, labels } = this.tableData;
    const _len = selectionList.length;
    if (id === 1) {
      // 保存修改
      this.submit();
    }
    if (id === 2) {
      if (_len < 1) {
        this.$message.warning('请先勾选信息');
      } else {
        this.deteleFunc(selectionList);
      }
    }
    if (id === 3) {
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        const _labels = deepClone(labels);
        _labels.forEach((item: any) => {
          if (item.key === 'materialName' || item.key === 'remarks') {
            const _item = item;
            delete _item.render;
          }
        });
        this.downTableData.labels = _labels;
      } else {
        this.$message.warning('请先勾选信息');
      }
    }
    if (id === 4) {
      // 打印
      const { list } = this.tableData;
      const { type, batchNo, certificateDate } = list[0];
      const _labels = deepClone(labels);
      _labels.forEach((item: any) => {
        if (item.key === 'materialName' || item.key === 'remarks') {
          const _item = item;
          delete _item.render;
        }
      });
      this.printTableData = {
        index: true,
        list,
        labels: _labels,
        title: `补交资料-${getLabelFunc(type)}`,
        batchNo,
        certificateDate: certificateDate ? dayjs(certificateDate).format('YYYY-MM-DD') : ''
      };
      this.printShow = true;
    }
  }

  /**
   * @description 删除
   */
  private deteleFunc(val: Array<any>) {
    const { type, batchNo } = val[0];
    if (type === 1) {
      const _flagList = val.filter(item => item.materialStatus > 1);
      if (_flagList.length > 0) {
        this.$message.warning('已完成或已退回状态不可删除');
        return;
      }
    }
    this.$confirm('确定删除?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const idNos: Array<string> = [];
      val.forEach(item => {
        idNos.push(item.idNo);
      });
      await this.deleteMaterialsDetail({ type, batchNo, idNos });
      this.$message.success('删除成功');
      this.queryList();
    });
  }

  /**
   * @description 保存列表修改
   */
  private submit() {
    this.$confirm('确定保存修改?', '保存', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const sendData = this.tableData.list;
      await this.putMaterialsDetail(sendData);
      this.queryList();
    });
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表数据
  private list: Array<any> = [];

  /**
   * @description 请求列表
   */
  async queryList() {
    const { batchNo } = this.$route.query;
    const body = await this.queryMaterialsDetails({ batchNo });
    this.tableData.list = body;
    this.list = body;
  }

  perm = {};

  historyParams: any = '';

  async activated() {
    this.tableData._this = this;
    this.tableLabelType = 'SUPPLEMENTARY_INFO_DETAIL';
    const { batchNo } = this.$route.query;
    const { historyParams } = this;
    if (batchNo !== historyParams) {
      this.searchForm.inputList[0].value = '';
    }
    this.historyParams = batchNo;
    this.queryList();
    this.initSetTableLabel();

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
