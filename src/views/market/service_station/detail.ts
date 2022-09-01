import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { CtjtTable } from '@/components';
import { REG_NUMBER, deepClone } from '@/assets/js/common';
import { VueComponentParent } from '@/type';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: { CtjtTable }
})
export default class MarketServiceStationMgDetail extends mixins(clearCacheMixins) {
  @Action('sale/addServiceStation') private addServiceStation!: (data: any) => any;

  formData: any = {
    address: '',
    code: '',
    contactName: '',
    mobile: '',
    remark: '',
  }

  formRules: any = {
    code: [
      { required: true, message: '请输入服务站编号', trigger: ['change', 'blur'] }
    ],
    address: [
      { required: true, message: '请输入地址', trigger: ['change', 'blur'] }
    ],
    contactName: [
      { required: true, message: '请输入联系人', trigger: ['change', 'blur'] }
    ],
    mobile: [
      { required: true, message: '请输入联系方式', trigger: ['change', 'blur'] },
      { pattern: REG_NUMBER, message: '请输入数字', trigger: ['change', 'blur'] },
    ],
  }

  // 添加到列表
  add() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { formData, tableData } = this;
        const { list } = tableData;
        const _list = list.filter((item: any) => item.code === formData.code);
        if (_list.length > 0) {
          this.$message.warning(`服务站编号${_list[0].code}已存在，请勿重复添加`);
          return;
        }
        const data = deepClone(formData);
        this.tableData.list.push(data);
        (this.$refs.formRef as VueComponentParent).resetFields();
      }
    });
  }

  tableData: any = {
    _this: {},
    selection: true,
    selectionList: [],
    list: [],
    options: [
      {
        id: 1,
        label: '删除',
        type: 'danger'
      },
    ],
    labels: [
      {
        key: 'code',
        label: '服务站编号',
        minWidth: 100,
        showOverflowTooltip: true
      },
      {
        key: 'address',
        label: '地址',
        minWidth: 200,
        showOverflowTooltip: true
      },
      {
        key: 'contactName',
        label: '联系人',
        minWidth: 80,
        showOverflowTooltip: true
      },
      {
        key: 'mobile',
        label: '联系方式',
        minWidth: 120,
        showOverflowTooltip: true
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 150,
        showOverflowTooltip: true
      },
    ]
  }

  // 列表操作回调
  tableOptionCallback(val: any) {
    const { id: _id } = val;
    const { selectionList, list } = this.tableData;
    const len = selectionList.length;
    if (len === 0) this.$message.warning('请先选择数据');
    if (len > 0) {
      const codes: string[] = [];
      selectionList.forEach((item: any) => {
        codes.push(item.code);
      });
      const _list = list.filter((item: any) => codes.indexOf(item.code) === -1);
      this.tableData.list = _list;
    }
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  cancel() {
    this.clearCache();
    this.$router.push({ path: '/market/service_station' });
  }

  submitLoading = false;

  submit() {
    const { list } = this.tableData;
    if (list.length > 0) {
      this.submitLoading = true;
      this.addServiceStation(list).then(() => {
        this.$message.success('添加成功');
        this.cancel();
      }).finally(() => {
        this.submitLoading = false;
      });
    } else {
      this.$message.warning('请先添加数据');
    }
  }
}
