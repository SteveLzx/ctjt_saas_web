import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import ctjtPaginationMixins from '@/mixins/pagination';
import { ParamsType, VueComponentParent } from '@/type';
import {
  timestampSizeCompare, deepClone, OSS_BASEURL, baseImg
} from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  searchData, tweetTableData, form, rules, statusOpts
} from './index';

@Component
export default class List extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('sale/queryRegionAndStore') private queryRegionAndStore!: () => ParamsType;

  @Action('sale/addTweet') private addTweet!: (data: any) => ParamsType;

  @Action('sale/updateTweet') private updateTweet!: (data: any) => ParamsType;

  @Action('sale/updateTweetStatus') private updateTweetStatus!: (data: any) => ParamsType;

  @Action('sale/deleteTweet') private deleteTweet!: (data: any) => ParamsType;

  @Action('sale/queryTweetPage') private queryTweetPage!: (data: any) => ParamsType;

  @Action('sale/queryTweetById') private queryTweetById!: (data: any) => ParamsType;

  @Action('user/queryWeChatQRCode') private queryWeChatQRCode!: (data: any) => string;

  statusOpts = statusOpts;

  searchForm = searchData;

  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      if (key === 'reset') {
        this.searchForm.selectList[1].value = '';
        this.searchForm.selectList[1].options = [];
      }
      this.tableCurrentChange(1);
    }
  }

  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) this.querySearchRegionAndStore('store', value);
    }
  }

  tableData = tweetTableData;

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
          if (btnId === 3) this.statusChange(2, id);
          if (btnId === 4) this.statusChange(1, id);
          if (btnId === 5) this.delete(id);
        }
        break;
      default:
        break;
    }
  }

  async edit(id: string) {
    await this.drawerInit();
    this.queryTweetById({ id }).then((r: any) => {
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
    this.updateTweetStatus({ status: key, id }).then(() => {
      this.$message.success('状态修改成功');
      this.queryList();
    });
  }

  delete(id: string) {
    this.deleteTweet({ id }).then(() => {
      this.$message.success('删除成功');
      this.queryList();
    });
  }

  // 预览
  dialogVisible = false;

  qrImg = '';

  async miniProgramsQRCode(id: string) {
    const { drivingSchoolId } = this.userInfo;
    const img = await this.queryWeChatQRCode({
      url: 'pages/public/dynamic/publish/article',
      params: `id-${id}`,
      schoolId: Number(drivingSchoolId)
    });
    this.qrImg = baseImg(img);
    this.dialogVisible = true;
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

  queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { startDate, endDate } = _data;
    // 判断时间
    if (startDate && endDate && timestampSizeCompare(startDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    this.tableData.loading = true;
    this.queryTweetPage(_data).then((res: any) => {
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
          this[sendData.id ? 'updateTweet' : 'addTweet'](sendData).then(() => {
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
    return sendData;
  }

  // 表单
  props = {
    multiple: true,
  }

  options:ParamsType = []

  // 图片相关
  uploadConfig = {
    multiple: false,
    business: 'market/mini_programs/tweet'
  }

  goodsUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).clearValidate();
    this.formData.cover = val;
  }

  formData = deepClone(form);

  formRules = rules;

  get coverUrl() {
    const { cover } = this.formData;
    if (cover) return `${OSS_BASEURL}${cover}`;
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

  querySearchRegionAndStore(key: string, pid: string) {
    this.queryGroupMechanismData({ pid }).then((data: any) => {
      if (key === 'region') {
        this.searchForm.selectList[0].options = data;
      }
      if (key === 'store') {
        this.searchForm.selectList[1].options = data;
      }
    });
  }

  init() {
    this.tableData._this = this;
    this.queryList();
    const { drivingSchoolId } = this.userInfo;
    this.querySearchRegionAndStore('region', drivingSchoolId);
  }

  activated() {
    this.init();
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
}
