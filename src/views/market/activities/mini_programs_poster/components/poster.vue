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
    <el-drawer
      :title="`${formData.id ? '编辑' : '新增'}海报`"
      :size="1200"
      :visible.sync="drawer"
      :direction="'rtl'"
      :before-close="handleClose">
      <el-form :model="formData" :rules="formRules" label-width="120px" ref="formRef">
        <el-form-item label="海报ID：" v-if="formData.id">{{formData.posterNum}}</el-form-item>
        <el-form-item label="参与区域：" prop="storeListDtoList">
          <el-cascader
            class="w_260"
            v-model="formData.storeListDtoList"
            :options="options"
            :props="props"
            collapse-tags
            clearable
            @change="storeDtoChange">
            </el-cascader>
        </el-form-item>
        <el-form-item label="海报名称：" prop="posterName">
          <el-input class="w_260" v-model.trim="formData.posterName" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="上传海报(建议尺寸690px/1488px，可等比缩小或放大)：" ref="photoUrl" prop="url">
          <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="goodsUploadFunc">
            <template #content>
              <el-image
              style="width: 230px; height: 496px"
              :src="coverUrl"
              :fit="'fill'">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
              </el-image>
            </template>
          </CtjtUploadOSS>
        </el-form-item>
        <el-form-item label="发布海报时间：" prop="beginDate">
          <el-row type="flex">
            <el-date-picker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              v-model="formData.beginDate"
              placeholder="选择日期时间">
            </el-date-picker>
            <el-form-item prop="endDate">
              <el-date-picker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                v-model="formData.endDate"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form-item>
        <el-form-item label="海报状态：" prop="posterState">
          <el-radio-group v-model="formData.posterState">
            <el-radio v-for="item in statusOpts" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button @click="closeDrawer">取消</el-button>
          <el-button type="primary" @click="submit" :loading="submitLoading">保存海报</el-button>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang='ts'>
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import {
  CtjtTable, CtjtPagination, CtjtUploadOSS
} from '@/components';
import { timestampSizeCompare, OSS_BASEURL, deepClone } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { ParamsType, VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import {
  posterTableData, statusOpts, form, rules
} from '../index';

@Component({
  components: { CtjtTable, CtjtPagination, CtjtUploadOSS }
})
export default class MarketMiniProgramsPoster extends mixins(ctjtPaginationMixins) {
  @Prop({ default: {} }) searchData!: ParamsType

  @State(state => state.base.userInfo) private userInfo: any;

  @Action('sale/queryRegionAndStore') private queryRegionAndStore!: () => ParamsType;

  @Action('sale/queryPosterPage') private queryPosterPage!: (data: any) => ParamsType;

  @Action('sale/addPoster') private addPoster!: (data: any) => ParamsType;

  @Action('sale/updatePoster') private updatePoster!: (data: any) => ParamsType;

  @Action('sale/updatePosterStatus') private updatePosterStatus!: (data: any) => ParamsType;

  @Action('sale/queryPosterById') private queryPosterById!: (data: any) => ParamsType;

  statusOpts = statusOpts;

  tableData = posterTableData;

  tableOptionCallback(val: any) {
    const { id: btnId } = val;
    const { selectionList } = this.tableData;
    const len = selectionList.length;
    switch (btnId) {
      case 1:
        this.drawerInit();
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        if (len > 1 || len === 0) {
          this.$message.warning('请勾选一条需要操作的数据');
        } else {
          const { id } = selectionList[0];
          if (btnId === 2) this.edit(id);
          if (btnId === 3) this.statusChange(0, id);
          if (btnId === 4) this.statusChange(1, id);
        }
        break;
      default:
        break;
    }
  }

  async edit(id: string) {
    await this.drawerInit();
    this.queryPosterById({ id }).then((r: any) => {
      Object.keys(this.formData).forEach(key => {
        if (key === 'storeListDtoList') {
          // 处理参与区域
          const { regionAndStoreOpts } = this;
          let newStoreListDtoList: ParamsType[] = [];
          r[key].forEach((item: ParamsType) => {
            const { regionId, storeId } = item;
            //
            if (regionId === '1' && storeId === '1') {
              this.isSelectAll = true;
              Object.keys(regionAndStoreOpts).forEach(ikey => {
                const _list = regionAndStoreOpts[ikey].map((i: ParamsType) => {
                  const { regionId: iRegionId, storeId: iStoreId } = i;
                  return [iRegionId, iStoreId];
                });
                newStoreListDtoList = newStoreListDtoList.concat(_list);
              });
              newStoreListDtoList.unshift(['']);
            } else if (storeId === '1') {
              // 片区下的全部门店都选中
              const _list = regionAndStoreOpts[regionId].map((i: any) => {
                const { storeId: iStoreId } = i;
                return [regionId, iStoreId];
              });
              newStoreListDtoList = newStoreListDtoList.concat(_list);
            } else {
              newStoreListDtoList.push([regionId, storeId]);
            }
          });
          this.formData[key] = newStoreListDtoList;
        } else {
          this.formData[key] = r[key];
        }
      });
    });
  }

  statusChange(key: number, id: string) {
    this.updatePosterStatus({ posterState: key, id }).then(() => {
      this.$message.success('状态修改成功');
      this.queryList();
    });
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  public parentSearchCall() {
    this.tableCurrentChange(1);
  }

  queryList() {
    const { searchData, paginationData } = this;
    const _data = drawSearchForm(searchData, paginationData);
    const { startDate, endDate } = _data;
    // 判断时间
    if (startDate && endDate && timestampSizeCompare(startDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    _data.posterType = 1;
    this.tableData.loading = true;
    this.queryPosterPage(_data).then((res: any) => {
      const { data, total, current } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).finally(() => {
      this.tableData.loading = false;
    });
  }

  // 弹窗
  drawer = false;

  handleClose() {
    this.$confirm('确认关闭？').then(() => {
      this.closeDrawer();
    });
  }

  closeDrawer() {
    (this.$refs.formRef as VueComponentParent).resetFields();
    this.formData = deepClone(form);
    this.drawer = false;
  }

  submitLoading = false;

  submit() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 特殊字段处理
        const sendData = this.handleFormData();
        if (sendData) {
          this.submitLoading = true;
          this[sendData.id ? 'updatePoster' : 'addPoster'](sendData).then(() => {
            this.$message.success(`${sendData.id ? '修改' : '新增'}成功`);
            this.tableCurrentChange(1);
          }).finally(() => {
            this.submitLoading = false;
            this.closeDrawer();
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  handleFormData() {
    const sendData = deepClone(this.formData);
    const {
      beginDate, endDate, storeListDtoList, id
    } = sendData;
    // 处理id
    if (id <= 0) delete sendData.id;
    // 处理时间
    if (timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return false;
    }
    sendData.beginDate = this.$dayjs(beginDate).format('YYYY-MM-DD HH:mm:ss');
    sendData.endDate = this.$dayjs(endDate).format('YYYY-MM-DD HH:mm:ss');
    // 处理参与区域
    const mapDto: ParamsType = new Map();
    storeListDtoList.forEach((item: ParamsType[]) => {
      const { 0: a, 1: b } = item;
      const arr = mapDto.has(a) ? deepClone(mapDto.get(a)) : [];
      arr.push(b);
      mapDto.set(a, arr);
    });
    const newList: ParamsType = [];
    if (this.isSelectAll) {
      newList.push({
        regionId: '1',
        regionName: '全部片区',
        storeId: '1',
        storeName: '全部门店'
      });
    } else {
      this.options.forEach((item: ParamsType) => {
        const { value, label, children } = item;
        if (mapDto.has(value) && Array.isArray(children)) {
          // 计算是否选中片区下的全部门店
          if (children.length === mapDto.get(value).length) {
            newList.push({
              regionId: value,
              regionName: label,
              storeId: '1',
              storeName: '全部门店'
            });
          } else {
            children.forEach((i: ParamsType) => {
              const ids = mapDto.get(value);
              if (ids.indexOf(i.value) > -1) {
                newList.push({
                  regionId: value,
                  regionName: label,
                  storeId: i.value,
                  storeName: i.label
                });
              }
            });
          }
        }
      });
    }
    sendData.storeListDtoList = newList;
    sendData.posterType = 1;
    return sendData;
  }

  // 表单
  props = {
    multiple: true,
  }

  options: ParamsType = []

  // 图片相关
  uploadConfig = {
    multiple: false,
    business: 'market/mini_programs/poster',
    size: 0.4,
    proportion: 0.46,
  }

  goodsUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).clearValidate();
    this.formData.url = val;
  }

  formData = deepClone(form);

  formRules = rules;

  get coverUrl() {
    const { url } = this.formData;
    if (url) return `${OSS_BASEURL}${url}`;
    return '';
  }

  isSelectAll = false; // 是否为全选

  optionsAll: ParamsType[] = [];

  storeDtoChange() {
    // 判断已选中的节点中是否包含全部
    const hasAllOption = this.formData.storeListDtoList.some((r: any) => r.length === 1);
    /**
     * 如果已选节点包含全部，且isSelectAll为true时，代表移除了选项中全部外的某个节点
     * 如果已选节点包含全部，且isSelectAll为false时，代表选择了全部节点
     * 如果已选节点不包含全部，且isSelectAll为true时，代表取消选择全部节点
     * 如果已选节点不包含全部，且isSelectAll为false时，代表取消或选中了单个
     */
    const { isSelectAll } = this;
    if (hasAllOption && isSelectAll) {
      this.isSelectAll = false;
      const list = deepClone(this.formData.storeListDtoList);
      list.shift();
      this.formData.storeListDtoList = list;
    } else if (hasAllOption && !isSelectAll) {
      this.formData.storeListDtoList = [[''], ...this.optionsAll];
      this.isSelectAll = true;
    } else if (!hasAllOption && isSelectAll) {
      this.formData.storeListDtoList = [];
      this.isSelectAll = false;
    } else if (JSON.stringify(this.formData.storeListDtoList) === JSON.stringify(this.optionsAll)) {
      this.formData.storeListDtoList = [[''], ...this.optionsAll];
      this.isSelectAll = true;
    }
  }

  regionAndStoreOpts: ParamsType = {};

  drawerInit() {
    return new Promise((res: any) => {
      this.drawer = true;
      this.queryRegionAndStore().then(async (r: ParamsType) => {
        this.regionAndStoreOpts = deepClone(r);
        const list: ParamsType[] = [];
        const strList: ParamsType[] = [];
        Object.keys(r).forEach(key => {
          const item = r[key];
          const { regionName } = item[0];
          const newItem = item.map((i: any) => {
            const newi = {
              ...i,
              value: i.storeId,
              label: i.storeName
            };
            strList.push([key, i.storeId]);
            return newi;
          });
          const data = {
            label: regionName,
            value: key,
            children: newItem
          };
          list.push(data);
        });
        // 查看片区有一个还是多个
        const len = list.length;
        if (len > 1) {
          // 参与区域全部选中备份
          this.optionsAll = strList;
          // 追加全部选项
          list.unshift({ value: '', label: '全部' });
        }
        this.options = list;
        res();
      });
    });
  }

  perm = {};

  async mounted() {
    const permObj = await this.$getPerm(
      this,
      this.tableData.options
    );
    this.tableData.options = permObj.tablePerm;
    this.perm = permObj.perm;
  }

  init() {
    this.tableData._this = this;
    this.queryList();
  }

  activated() {
    this.init();
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  overflow: auto;
}
::v-deep .image-slot {
  width: 100%;
  height: 100%;
  background-color: $--bg-grey;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-icon-picture-outline {
    font-size: 46px;
  }
}
</style>
