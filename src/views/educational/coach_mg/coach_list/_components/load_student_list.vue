<template>
  <div>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { ParamsType } from '@/type';
import { STUDY_STAGE } from '@/enums';
import {
  CtjtTable, CtjtPagination
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    CtjtTable, CtjtPagination
  }
})
export default class LoadStudentList extends mixins(ctjtPaginationMixins) {
  @Action('license/queryLoadStudentList') private queryLoadStudentList!: (data: any) => any;

  @Action('license/exportLoadStudentList') private exportLoadStudentList!: (data: any) => any;

  @Prop({}) unsolvedData: any;

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    // selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '导出',
        type: 'primary',
        path: 'btn_export'
      },
    ],
    list: [],
    selectionList: [],
    labels: [
      {
        key: 'userName',
        label: '学员姓名',
      },
      {
        key: 'storeName',
        label: '门店',
        minWidth: 120,
      },
      {
        key: 'idNo',
        label: '证件号码',
        minWidth: 170,
      },
      {
        key: 'sex',
        label: '性别',
        render(h: any, params: any) {
          const { sex } = params.row;
          let _text = '未知';
          if (sex === 1) _text = '男';
          if (sex === 2) _text = '女';
          if (sex === 3) _text = '其他';
          return h('div', _text);
        }
      },
      {
        key: 'classesName',
        label: '班别',
      },
      {
        key: 'learnDrivingStatus',
        label: '学车进度',
        render(h: any, params: any) {
          const { learnDrivingStatus } = params.row;
          const _list = STUDY_STAGE.filter((item: any) => item.id === learnDrivingStatus);
          return h('div', _list[0] ? _list[0].label : '');
        }
      },
      {
        key: 'carModel',
        label: '所学车型',
      },
      {
        key: 'createdTime',
        label: '报名时间',
        minWidth: 120,
      },
      {
        key: 'subjectOneQualifiedDate',
        label: '科目一合格日期',
        minWidth: 120,
      },
      {
        key: 'acceptNumber',
        label: '流水号',
        minWidth: 120,
      },
    ]
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /**
   * @description 列表操作回调
   */
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      // 导出
      this._exportData();
    }
  }

  /** 导出所有数据 */
  private async _exportData() {
    const { id } = this.$route.query;
    const body = await this.exportLoadStudentList({ coachId: id });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `负荷学员${this.$dayjs(new Date()).format('YYYYMMDD')}`);
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

  private async queryList() {
    const { id: coachId } = this.$route.query;
    const { current, pageSize } = this.paginationData;
    const sendData = {
      coachId,
      current,
      pageSize
    };
    const body = await this.queryLoadStudentList(sendData);
    const {
      studentList, unsolvedFour, unsolvedOne, unsolvedThree, unsolvedTwo, loadStudentCount
    } = body;
    const unsolvedAll = loadStudentCount;
    this.unsolvedData.list = [{
      unsolvedFour,
      unsolvedOne,
      unsolvedThree,
      unsolvedTwo,
      unsolvedAll
    }];
    const {
      current: _current, total, data
    } = studentList;
    this.paginationData.current = _current;
    this.paginationData.total = total;
    this.tableData.list = data;
  }

  async mounted() {
    this.queryList();
    const permObj = await (this as any).$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
  }
}
</script>
