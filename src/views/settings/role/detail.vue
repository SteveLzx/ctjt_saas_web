<template>
  <div class="page">
    <div class="tree_box">
      <el-tree
        :data="roleAuthThree"
        show-checkbox
        node-key="id"
        ref="tree"
        empty-text="加载中..."
        :default-checked-keys="defaultKeys"
        :props="defaultProps">
      </el-tree>
    </div>
    <div class="tree_box">
      <el-form ref="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleDetail.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属机构">
          <el-input v-model="roleDetail.companyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save" v-if="perm['btn_save']">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Action } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { VueComponentParent } from '@/type';

@Component
export default class SettingsRoleDetail extends Vue {
  @Action('auth/findRoleAuthTree') private findRoleAuthTree!: (data: any) => any;

  @Action('auth/updateRoleAuth') private updateRoleAuth!: (data: any) => any;

  roleAuthThree: any[] = [];

  defaultProps = {
    children: 'children',
    label: 'name'
  };

  defaultKeys: string[] = [];

  roleDetail = {};

  async mounted() {
    const { roleName, companyId } = this.$route.query;
    this.roleDetail = this.$route.query;
    const body = await this.findRoleAuthTree({ roleName, companyId, type: 4 });
    this.roleAuthThree = body;
    this.filterTree(this.roleAuthThree);
  }

  filterTree(tree: any) {
    tree.forEach((item: any) => {
      if (item.action === 1) {
        if (item.children) {
          this.filterTree(item.children);
        } else {
          this.defaultKeys.push(item.id);
        }
      }
    });
  }

  async save() {
    const checkedKeys = (this.$refs.tree as VueComponentParent).getCheckedKeys().concat((this.$refs.tree as VueComponentParent).getHalfCheckedKeys());
    // console.log(checkedKeys);
    const data = {
      ...this.roleDetail,
      ids: checkedKeys
    };
    await this.updateRoleAuth(data);
    this.$message.success('保存成功');
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
</script>
<style lang="scss" scoped>
.page{
  overflow: hidden;
  .el-input{
    width: 280px;
  }
}
::v-deep .tree_box{
  width: 50%;
  float: left;
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
    &::after {
      height: 9px;
      left: 6px;
    }
    &::before {
      top: 7px;
    }
  }
}
</style>
