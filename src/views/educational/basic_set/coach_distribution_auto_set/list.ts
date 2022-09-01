import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { setTableLabels, marginTableLabels } from '@/views/educational/_common/common';
import { ParamsType } from '@/type';
import { deepClone } from '@/assets/js/common';
import { subjectOutAndOnAccessOpts } from '@/views/educational/_enums';
import {
  CtjtTable, CtjtPagination, CtjtSetField
} from '@/components';
import ctjttablefieldMixins from '@/mixins/tablefield';

@Component({
  components: {
    CtjtTable,
    CtjtPagination,
    CtjtSetField
  }
})
export default class EducationalBasicSetCoachDistributionAutoSet extends mixins(ctjttablefieldMixins) {
  @Action('assignment/queryAllotRulesList') private queryAllotRulesList!: () => ParamsType;

  @Action('assignment/doSystemCoachTask') private doSystemCoachTask!: () => ParamsType;

  @Action('assignment/modesStopSystem') private modesStopSystem!: () => ParamsType;

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

  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    options: [
      {
        id: 1,
        label: '新增分配规则',
        path: 'btn_xzfpgz'
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      }
    ],
    labels: [],
    list: [],
    selectionList: [],
    spanMethod: ({
      row, column, rowIndex, columnIndex
    }: any) => {
      const mainList = [0, 1, 2, 6];
      if (mainList.includes(columnIndex)) {
        if (row.marge !== undefined) {
          return {
            rowspan: row.marge,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      // 新增
      this.jumpDetail();
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      const { id: _id } = selectionList[0];
      if (id === 2) {
        // 编辑
        this.jumpDetail(_id);
      }
    }
  }

  private tableSelectionChange(val: ParamsType) {
    this.tableData.selectionList = val;
  }

  private jumpDetail(id?: string, isEdit?: string) {
    this.$router.push({ path: '/educational/basic_set/coach_distribution_auto_set/detail', query: { id, isEdit } });
  }

  private async queryList() {
    const body = await this.queryAllotRulesList();
    this._setTableList(body);
  }

  private _setTableList(val: any) {
    const list = deepClone(val);
    let _list: any = [];
    list.forEach((item: any) => {
      const {
        name, classesInfo, allowScope, subjectTwoTeach, subjectThreeTeach,
        subjectTwoAccess, subjectTwoOut, subjectThreeAccess, subjectThreeOut, id
      } = item;
      // 处理班别
      const _classesInfo = classesInfo ? JSON.parse(classesInfo) : [];
      // 处理科目二
      const _subjectTwoTeach = subjectTwoTeach ? JSON.parse(subjectTwoTeach) : [];
      // 处理科目三
      const _subjectThreeTeach = subjectThreeTeach ? JSON.parse(subjectThreeTeach) : [];
      const _data = {
        id,
        name,
        classesInfo: _classesInfo,
        allowScope
      };
      _list = [
        ..._list,
        ...[
          {
            ..._data,
            ...{
              subjectTeach: _subjectTwoTeach, subjectAccess: this.getLabelFunc(subjectTwoAccess, 1), subjectOut: this.getLabelFunc(subjectTwoOut, 1), marge: 2
            }
          },
          { ..._data, ...{ subjectTeach: _subjectThreeTeach, subjectAccess: this.getLabelFunc(subjectThreeAccess, 1), subjectOut: this.getLabelFunc(subjectThreeOut, 1) } }
        ]
      ];
    });
    this.tableData.list = _list;
  }

  private getLabelFunc(val: number, num: number): string {
    let _text = '';
    subjectOutAndOnAccessOpts.forEach((item: any) => {
      if (item.id === val) {
        item.children.forEach((child: any) => {
          if (child.id === num) {
            _text = `${item.label}${child.label}`;
          }
        });
      }
    });
    return _text;
  }

  /**
   * @description 立即执行分配
   */
  private doSystemCoachTaskFunc() {
    this.doSystemCoachTask().then(() => {
      this.$message.success('分配成功！');
    });
  }

  /**
   * @description 停用系统分配
   */
  private modesStopSystemFunc() {
    this.modesStopSystem().then(() => {
      this.$message.success('已停用分配！');
    });
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'BASIC_SET_COACH_DISTRIBUTION_AUTO_SET_LABEL';
    this.initSetTableLabel();
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
    this.perm = permObj.perm;
  }
}
