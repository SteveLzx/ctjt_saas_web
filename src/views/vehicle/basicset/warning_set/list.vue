<template>
  <div class="page">
    <CtjtTable :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"></CtjtTable>
    <el-drawer
      :visible.sync="drawer"
      size="80%">
      <CtjtCard :prop-data="{ title: '业务预警设置' }">
        <template slot='content'>
          <el-form :model="formData" :rules="formRules" ref="drawerFormRef" label-width="120px">
            <el-form-item label="保险到期前" prop="insuranceExpire">
              <el-input class="w_300" v-model="formData.insuranceExpire" placeholder="请输入"></el-input> 天
            </el-form-item>
            <el-form-item label="年审到期前" prop="annualVerificationExpire">
              <el-input class="w_300" v-model="formData.annualVerificationExpire" placeholder="请输入"></el-input> 天
            </el-form-item>
            <el-form-item label="报废到期前" prop="scrapExpire">
              <el-input class="w_300" v-model="formData.scrapExpire" placeholder="请输入"></el-input> 天
            </el-form-item>
            <el-form-item label="事故未处理后" prop="accident">
              <el-input class="w_300" v-model="formData.accident" placeholder="请输入"></el-input> 天
            </el-form-item>
            <el-row type="flex" justify="center">
              <el-button @click="close()">取消</el-button>
              <el-button type="primary" :loading="btnLoading" @click="btnSubmit()">保存</el-button>
            </el-row>
          </el-form>
        </template>
      </CtjtCard>
    </el-drawer>
  </div>
</template>
<script lang='ts'>
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { CtjtTable, CtjtCard } from '@/components';
import { ParamsType, VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import { REG_ZERO_INTEGER } from '@/assets/js/common';

@Component({
  components: {
    CtjtTable, CtjtCard
  }
})
export default class VehicleBasicsetWarningSet extends mixins(ctjtPaginationMixins) {
  @Action('car/queryEarlyWarningList') private queryEarlyWarningList!: () => any;

  @Action('car/saveOrUpdateEarlyWarning') private saveOrUpdateEarlyWarning!: (data: any) => any;

  // 列表
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    index: true,
    selection: true,
    list: [],
    selectionList: [],
    options: [
      {
        id: 1,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
    ],
    labels: [
      {
        key: 'drivingSchoolName',
        label: '驾校',
      },
      {
        key: 'insuranceExpire',
        label: '保险到期(天)',
      },
      {
        key: 'annualVerificationExpire',
        label: '年审到期(天)',
      },
      {
        key: 'scrapExpire',
        label: '报废到期(天)',
      },
      {
        key: 'accident',
        label: '事故未处理(天)',
      }
    ]
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      const { selectionList } = this.tableData;
      const len = selectionList.length;
      if (len === 0) this.$message.warning('请勾选需要操作的数据');
      if (len > 1) this.$message.warning('只能单条编辑');
      if (len === 1) {
        this.jumpDetail(selectionList[0]);
      }
    }
  }

  /**
   * 请求订单列表
   */
  async queryList() {
    try {
      const body = await this.queryEarlyWarningList();
      this.tableData.list = body;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  jumpDetail(row: any) {
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = row[key];
    });
    this.drawer = true;
  }

  private drawer = false;

  private btnLoading = false;

  close() {
    (this.$refs.drawerFormRef as VueComponentParent).resetFields();
    this.drawer = false;
  }

  btnSubmit() {
    (this.$refs.drawerFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { formData } = this;
        const sendData = { ...formData };
        this.btnLoading = true;
        this.saveOrUpdateEarlyWarning(sendData).then(() => {
          this.queryList();
          this.close();
          this.$message.success('修改成功');
        }).finally(() => {
          this.btnLoading = false;
        });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  private formData : ParamsType = {
    accident: null,
    annualVerificationExpire: null,
    id: null,
    insuranceExpire: null,
    scrapExpire: null
  }

  private formRules = {
    accident: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' }
    ],
    annualVerificationExpire: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' }
    ],
    insuranceExpire: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' }
    ],
    scrapExpire: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' }
    ],
  }

  // 生命周期函数
  async mounted() {
    this.tableData._this = this;
    this.queryList();

    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
    );
    this.tableData.options = permObj.tablePerm;
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
</style>
