import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import { drawSearchForm } from '@/assets/js/search_table';
import { deepClone } from '@/assets/js/common';
import { ParamsType } from '@/type';
import {
  examSubjectsOpt, examCarTypeOpt, examPlaceTypeOpt,
  examModeOpt, statusOpt, isOftenExamPlaceOpt, examDayOpt
} from '@/views/educational/_enums/index';
import {
  SearchTable, CtjtPagination, CtjtTable
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

// 数据处理-考试车型
const examCarTypeOptList: ParamsType = [];
examCarTypeOpt.forEach(item => {
  examCarTypeOptList.push({ value: item, label: item });
});

@Component({
  components: {
    SearchTable,
    CtjtPagination,
    CtjtTable
  }
})
export default class EducationalBasicSetExaminroomMg extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('assignment/queryExamPlaceById') private queryExamPlaceById!: (data: any) => ParamsType;

  @Action('assignment/queryExamPlaceList') private queryExamPlaceList!: (data: any) => ParamsType;

  // 列表搜索项
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '考场名称',
        key: 'examPlaceName',
        value: '',
        width: 300,
        clearable: true,
        placeholder: '请输入考场名称',
      }
    ],
    selectList: [
      {
        label: '考试科目',
        key: 'examSubjects',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: examSubjectsOpt,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      },
      {
        label: '考试车型',
        key: 'examCarType',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: examCarTypeOptList,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      },
      {
        label: '是否常用考场',
        key: 'isOftenExamPlace',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: isOftenExamPlaceOpt,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      },
      {
        label: '考试方式',
        key: 'examMode',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: examModeOpt,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      },
      {
        label: '考场类型',
        key: 'examPlaceType',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: examPlaceTypeOpt,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      },
      {
        label: '状态',
        key: 'status',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: statusOpt,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      }
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
        plain: false,
        path: 'btn_search'
      },
    ]
  }

  // 列表搜索 操作按钮回调
  private searchTableCallBack() {
    this.paginationData.current = 1;
    this.queryList();
  }

  // 分页列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    options: [
      {
        id: 1,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
        path: 'btn_edit'
      },
      // {
      //   id: 2,
      //   label: '删除',
      //   type: 'danger'
      // },
      {
        id: 3,
        label: '启用',
        type: 'success',
        path: 'btn_enable'
      },
      {
        id: 4,
        label: '停用',
        type: 'warning',
        path: 'btn_disable'
      },
    ],
    labels: [
      {
        key: 'examPlaceName',
        label: '考场名称',
        render(h: any, params: any) {
          const { examPlaceName, id } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '200',
              trigger: 'hover',
              content: examPlaceName,
            },
            scopedSlots: {
              reference: () => h('el-link', {
                props: {
                  type: 'primary',
                  underline: false
                },
                style: {
                  'word-break': 'break-all'
                },
                on: {
                  click: () => {
                    params._self.tableData._this.jumpDetail(id, '1');
                  }
                }
              }, examPlaceName)
            }
          });
        }
      },
      {
        key: 'examPlaceAlias',
        label: '考场别名'
      },
      {
        key: 'examSubjects',
        label: '考试科目',
      },
      {
        key: 'carType',
        label: '考试车型'
      },
      {
        key: 'examRoadNum',
        label: '考道数(条)',
        width: 90
      },
      {
        key: 'examPlaceCarNum',
        label: '考试车辆数(辆)',
        width: 115
      },
      {
        key: 'carBrand',
        label: '考试车辆品牌',
        width: 115
      },
      {
        key: 'teachingHours',
        label: '大纲教学学时(h)',
        width: 125
      },
      {
        key: 'dayNum',
        label: '日考量(人)',
        width: 90
      },
      {
        key: 'examPlaceType',
        label: '考场类型',
        render(h: any, params: any) {
          const { examPlaceType } = params.row;
          const _arr = examPlaceTypeOpt.filter(item => item.value === examPlaceType);
          return h('div', _arr[0] ? _arr[0].label : '');
        }
      },
      {
        key: 'isOftenExamPlace',
        label: '是否常用考场',
        width: 115,
        render(h: any, params: any) {
          const { isOftenExamPlace } = params.row;
          return h('div', isOftenExamPlace ? '是' : '否');
        }
      },
      {
        key: 'examMode',
        label: '考试方式',
        render(h: any, params: any) {
          const { examMode } = params.row;
          const _arr = examModeOpt.filter(item => item.value === examMode);
          return h('div', _arr[0] ? _arr[0].label : '');
        }
      },
      {
        key: 'examDay',
        label: '考试时间',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { examDay } = params.row;
          const _textArr: string[] = [];
          examDayOpt.forEach(item => {
            if (examDay.includes(item.value)) {
              _textArr.push(item.label);
            }
          });
          return h('div', _textArr.join(','));
        }
      },
      {
        key: 'cityReferenceCarNum',
        label: '全市备案车辆数',
        width: 120
      },
      {
        key: 'drivingSchoolReferenceCarNum',
        label: '驾校备案车辆数',
        width: 120
      },
      {
        key: 'drivingSchoolReferenceCarPercent',
        label: '驾校备案车辆占比(%)',
        width: 160
      },
      {
        key: 'status',
        label: '状态',
        render(h: any, params: any) {
          const { status } = params.row;
          return h('div', status ? '启用' : '停用');
        }
      }
    ],
    list: [],
    selectionList: [],
    spanMethod: ({
      row, column, rowIndex, columnIndex
    }: any) => {
      const mainList = [0, 1, 2, 10, 11, 14, 15, 16, 17];
      const list = [3, 12, 13];
      const { childMarge, marge } = row;
      if (mainList.includes(columnIndex)) {
        if (marge !== undefined) {
          return {
            rowspan: marge,
            colspan: 1
          };
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      if (list.includes(columnIndex)) {
        if (childMarge !== undefined) {
          return {
            rowspan: childMarge,
            colspan: 1
          };
        }
        return {
          rowspan: 1,
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
      this.jumpDetail();
      return;
    }
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) {
      this.$message.warning('请勾选列表项！');
      return;
    }
    if (_len > 1) {
      this.$message.warning('只能单项操作！');
      return;
    }
    if (_len === 1) {
      if (id === 2) {
        this.jumpDetail(selectionList[0].id);
      }
      if (id === 3 || id === 4) {
        // 判断当前状态和要操作的状态是否相同
        const { status, id: _id } = selectionList[0];
        if ((status && id === 3) || (!status && id === 4)) {
          this.$message.warning('当前状态和将要更改状态相同, 不可操作！');
        } else {
          const sendData = {
            id: _id,
            flag: !status
          };
          this.queryExamPlaceById(sendData).then(() => {
            this.$message.success('修改成功!');
            this.queryList();
          });
        }
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  private jumpDetail(id?: string, isEdit?: string) {
    this.$router.push({ path: '/educational/basic_set/examinroom_mg/detail', query: { id, isEdit } });
  }

  /**
   * @description 分页组件每页请求数量切换
   */
  private tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  /**
   * @description 分页组件页数切换
   */
  private tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  async queryList() {
    this.tableData.loading = true;
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data
    };
    try {
      const body = await this.queryExamPlaceList(sendData);
      const {
        data, current, total
      } = body;
      this.tableData.list = this.getList(data);
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  getList(data: Array<any>) {
    const list = deepClone(data);
    const _newList: any = [];
    list.forEach((item: any) => {
      // 数据拆分，合并成多层数组
      const _item = deepClone(item);
      _item.children = [];
      if (_item.subjectOne) {
        let _data: any = {};
        _data = { ..._item.subjectOne };
        _data.examSubjects = '科目一';
        _item.children.push(_data);
      }
      if (_item.subjectTwo) {
        const _arr: any[] = [];
        _item.subjectTwo.carTypeMsg.forEach((i: any) => {
          let _data: any = {};
          _data = { ..._item.subjectTwo, ...i };
          _data.examSubjects = '科目二';
          _arr.push(_data);
        });
        _item.children.push({
          children: _arr
        });
      }
      if (_item.subjectThree) {
        const _arr: any[] = [];
        item.subjectThree.carTypeMsg.forEach((i: any) => {
          let _data: any = {};
          _data = { ..._item.subjectThree, ...i };
          _data.examSubjects = '科目三';
          _arr.push(_data);
        });
        _item.children.push({
          children: _arr
        });
      }
      if (_item.subjectFour) {
        let _data: any = {};
        _data = { ..._item.subjectFour };
        _data.examSubjects = '科目三文明';
        _item.children.push(_data);
      }
      _newList.push(_item);
    });
    // 添加合并格式
    _newList.forEach((item: any) => {
      item.children.forEach((child: any, index: number) => {
        try {
          const _child = child;
          if (index === 0) {
            if (_child.children !== undefined) {
              _child.children.forEach((i: any, _index: number) => {
                const _i = i;
                if (_index === 0) {
                  _i.marge = this.getNums(item.children);
                  _i.childMarge = child.children.length;
                }
              });
            } else {
              _child.marge = this.getNums(item.children);
              _child.childMarge = child.children ? child.children.length : 1;
            }
          } else if (_child.children !== undefined) {
            _child.children.forEach((i: any, _index: number) => {
              const _i = i;
              if (_index === 0) {
                _i.childMarge = child.children.length;
              }
            });
          } else {
            _child.childMarge = 1;
          }
        } catch (error) {
          console.log(error);
        }
      });
    });
    // 合并渲染数组
    const _vlist: any[] = [];
    _newList.forEach((item: any) => {
      item.children.forEach((child: any) => {
        if (child.children !== undefined) {
          child.children.forEach((i: any) => {
            _vlist.push({ ...item, ...child, ...i });
          });
        } else {
          _vlist.push({ ...item, ...child });
        }
      });
    });
    return _vlist;
  }

  /**
   * @description 获取列表下面子数组长度之和
   */
  getNums(list: any[]): number {
    let _num = 0;
    list.forEach((item: any) => {
      if (item.children !== undefined) {
        _num += item.children.length;
      } else {
        _num += 1;
      }
    });
    return _num;
  }

  // 生命周期
  async mounted() {
    this.tableData._this = this;
    // 先默认请求驾校
    await this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
