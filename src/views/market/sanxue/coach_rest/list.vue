// 教练休息管理
<template>
  <div class="page" ref="pageRef">
    <SearchTable
      :prop-data.sync="searchForm"
      @select-change="searchSelectChange"
    ></SearchTable>
    <section class="table_section" ref="table_section">
      <CtjtTable
        ref="ctjtTableReference"
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
      />
    </section>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
    <!-- 导出表单 -->
    <CtjtCreateTable :tableData.sync="downTableData"></CtjtCreateTable>
    <!-- 约车详情 -->
    <el-drawer
      :visible="showDetail"
      size="1000px"
      :withHeader="false"
      :direction="'rtl'"
      :show-close="false"
    >
      <el-container style="height: 100%">
        <el-main>
          <CtjtCard :prop-data="{ title: isAdd ? '新增休假' : '修改休假' }">
            <template #content>
              <el-form ref="coachRestForm" :model="coachRestData" label-width="80px" :rules="rules">
                <el-form-item label="教练姓名" prop="coachId">
                  <el-select
                    v-model="coachRestData.coachId"
                    placeholder="请选择"
                    filterable
                    @change="changeSelect"
                  >
                    <el-option
                      v-for="(item, index) in searchForm.selectList[0].options"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="休假日期" prop="restDate">
                  <el-date-picker
                    type="date"
                    placeholder="请选择休假日期"
                    v-model="coachRestData.restDate"
                    :picker-options="pickerOptions"
                    @change="restDateChange"
                  />
                </el-form-item>
                <el-form-item label="请假时段" prop="checkedList">
                  <el-checkbox
                    class="all_checkbox_wrap"
                    v-model="allLabelCheck"
                    @change="allChecked"
                    >全选</el-checkbox
                  >
                  <el-checkbox-group v-model="coachRestData.checkedList">
                    <el-checkbox
                      v-for="(item, index) in timeList"
                      :label="item.label"
                      :key="index"
                      :disabled="item.disabled"
                      @change="allLabelCheck = coachRestData.checkedList.length === timeList.length"
                      class="checkbox_wrap"
                      >{{ item.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="请假原因" prop="cause">
                  <el-radio-group v-model="coachRestData.cause">
                    <el-radio
                      :label="item.label"
                      v-for="item in reasonList"
                      :key="item.key"
                    ></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="备注: " prop="remark">
                  <el-input
                    type="textarea"
                    v-model="coachRestData.remark"
                    placeholder="请输入备注"
                    :rows="2"
                    class="w_600"
                    maxlength="200"
                  ></el-input>
                </el-form-item>
              </el-form>
            </template>
          </CtjtCard>
        </el-main>
        <el-footer>
          <el-row type="flex" justify="center">
            <el-button type="info" @click="showDetail = false">取消</el-button>
            <el-button
              type="primary"
              style="margin-left: 32px"
              :loading="submitLoading"
              @click="submit"
              >确定</el-button
            >
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import Component, { mixins } from 'vue-class-component';
import {
  Watch
} from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtCreateTable,
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { deepClone } from '@/assets/js/common';
import {
  tableData,
  searchForm as formData,
  rules,
  reasonList,
  coachRestData
} from './index';

let checkedList: string[] = [];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtCreateTable,
  },
})
export default class MarketSanXueCoachRestList extends mixins(ctjtPaginationMixins) {
  @Action('assignment/queryScatteredCoach') private queryScatteredCoach!: () => ParamsType;

  @Action('assignment/queryCoachRestList') private queryCoachRestList!: (data: ParamsType) => ParamsType;

  @Action('assignment/queryRestTimeList') private queryRestTimeList!: () => any[];

  @Action('assignment/addOrUpdateCoachRest') private addOrUpdateCoachRest!: (data: ParamsType) => ParamsType;

  @Action('assignment/cancelRest') private cancelRest!: (data: ParamsType) => ParamsType;

  @Action('assignment/exportCoachRestList') private exportCoachRestList!: (data: ParamsType) => any;

  searchForm: any = formData;

  showDetail = false; // 展示休假详情

  isAdd = true; // 是新增还是修改

  timeList: any[] = [];

  reasonList = reasonList;

  submitLoading = false;

  coachRestData = { ...coachRestData };

  rules = rules;

  pickerOptions = {
    disabledDate: (time: Date) => { // 禁用日期
      let nowData = new Date();
      nowData = new Date(nowData.setDate(nowData.getDate() - 1));
      return time < nowData;
    }
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }

  async mounted() {
    this.searchForm.selectList[0].options = await this.queryScatteredCoach();
    this.init();
    this.queryList();
  }

  tableData = { ...tableData };

  init() {
    const today = this.$dayjs(new Date()).format('YYYY-MM-DD');
    this.searchForm.datePickerList[0].value = today;
    this.searchForm.datePickerList[1].value = today;
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'reset') {
      this.init();
    }
    this.paginationData.current = 1;
    this.queryList();
  }

  searchSelectChange(val: ParamsType) {
    console.log(val);
  }

  async queryList() {
    this.tableData.loading = true;
    this.filterDate(this.searchForm);
    const { searchForm, paginationData } = this;
    const _data: ParamsType = drawSearchForm(searchForm, paginationData);
    const body = await this.queryCoachRestList(_data);
    const {
      data, current, total
    } = body;
    this.tableData.list = data || [];
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  filterDate(data: any) {
    const _data = data;
    const startDate = _data.datePickerList[0].value;
    const endDate = _data.datePickerList[1].value;
    if (new Date(endDate) < new Date(startDate)) {
      [_data.datePickerList[0].value, _data.datePickerList[1].value] = [_data.datePickerList[1].value, _data.datePickerList[0].value];
    }
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 表格配置 */
  downTableData: ParamsType = {
    labels: [],
    list: [],
    name: '教练休息时段管理',
  };

  async tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 1 || id === 3) {
      if (this.timeList.length === 0) {
        this.timeList = await this.queryRestTimeList();
      }
      if (id === 1) { // 新增休假
        this.coachRestData = { ...coachRestData };
        this.showDetail = true;
        this.isAdd = true;
        return;
      }
    }
    const { selectionList, labels } = this.tableData;
    const idList: Array<number | string> = [];
    const itemList: any[] = [];
    selectionList.forEach((item: any) => {
      idList.push(item.id);
      itemList.push(item);
    });
    const _len = selectionList.length;
    // 导出
    if (id === 4) {
      if (_len < 1) {
        this.exportList();
        return;
      }
      this.downTableData.list = deepClone(selectionList);
      this.downTableData.labels = deepClone(labels);
      return;
    }
    // 操作数据至少选中一条
    if (_len < 1) {
      this.$message.warning('请先勾选一条数据！');
      return;
    }
    // 取消和修改只允许一条
    if (_len > 1) {
      this.$message.warning('请先勾选一条数据！');
      return;
    }
    if (id === 2) { // 取消休假
      this.cancelRestFn(idList[0]);
      return;
    }
    if (id === 3) { // 修改休假
      this.showDetail = true;
      this.isAdd = false;
      const [data] = itemList;
      data.checkedList = [];
      data.timeFrameInfoList.forEach((item: any) => {
        data.checkedList.push(item.name);
      });
      checkedList = [...data.checkedList];
      this.coachRestData = { ...data };
      this.coachRestData.restDate = new Date(this.coachRestData.restDate);
      this.filterTimeList(); // 禁用已过时间的时间段
    }
  }

  async exportList() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    // 处理数据
    const body = await this.exportCoachRestList(_data);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `教练休息时段管理${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  cancelRestFn(id: string | number) {
    this.$confirm('确认取消教练休假?').then(async () => {
      await this.cancelRest({ id });
      this.$message.success('取消成功');
      this.tableSizeChange(this.paginationData.pageSize);
    });
  }

  restDateChange() {
    this.filterTimeList(); // 禁用已过时间的时间段
  }

  /**
   *
   * @param list
   * @param flag 是否置为全可选
   */
  filterTimeList(flag?: boolean) {
    const list = this.timeList;
    const date = new Date(this.coachRestData.restDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    console.log(day);
    function compare(startTime: string) {
      const start = `${year}-${month < 9 ? `0${month}` : month}-${day < 9 ? `0${day}` : day} ${startTime}`;
      return new Date().getTime() > new Date(start).getTime();
    }
    list.forEach((item: any) => {
      const itemCopy = item;
      itemCopy.disabled = flag ? false : compare(itemCopy.startTime);
      // 被禁用的选项不应该被选中
      // const index = this.coachRestData.checkedList.indexOf(item.name);
      // if (itemCopy.disabled && index > -1) {
      //   this.coachRestData.checkedList.splice(index, 1);
      // }
    });
    this.allLabelCheck = this.coachRestData.checkedList.length === this.timeList.length;
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

  submit() {
    (this.$refs.coachRestForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const timeFrameInfoList: any[] = [];
        this.timeList.forEach((item: any) => {
          if (this.coachRestData.checkedList.includes(item.name)) {
            timeFrameInfoList.push(item);
          }
        });
        const data = {
          ...this.coachRestData,
          timeFrameInfoList
        };
        data.restDate = this.$dayjs(data.restDate).format('YYYY-MM-DD');
        this.addOrUpdateCoachRest(data).then(() => {
          this.$message.success('新增成功');
          this.tableSizeChange(this.paginationData.pageSize); // 重新查询最新数据
          this.showDetail = false; // 关闭详情弹窗
          this.filterTimeList(true); // 打开所有时段选择
          (this.$refs.coachRestForm as VueComponentParent).clearValidate(); // 清除校验
        });
      }
    });
  }

  @Watch('showDetail')
  clearValidate() {
    setTimeout(() => (this.$refs.coachRestForm as VueComponentParent).clearValidate(), 1); // 清除校验
  }

  changeSelect(id: string) {
    const coach = this.searchForm.selectList[0].options.filter((item: any) => item.id === id);
    this.coachRestData.name = coach[0].name;
  }

  allLabelCheck = false;

  allChecked() {
    const list: string[] = [];
    if (this.allLabelCheck) {
      this.timeList.forEach(item => {
        // 全选时没有被禁用的添加进来，已禁用但是之前提交过的时间段添加进来
        if (!item.disabled || checkedList.includes(item.name)) list.push(item.name);
      });
      this.coachRestData.checkedList = list;
    } else {
      const resetArr: string[] = [];
      this.timeList.forEach((item: any) => {
        // 全不选时已禁用但是之前提交过的时间段添加进来
        if (item.disabled && checkedList.includes(item.name)) {
          resetArr.push(item.name);
        }
      });
      this.coachRestData.checkedList = [...resetArr];
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
