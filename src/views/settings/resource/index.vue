<template>
  <div class="page">
    <div class="tree_box">
      <el-tree
        :data="roleAuthThree"
        node-key="id"
        @node-click="nodeClick"
        ref="tree"
        empty-text="加载中..."
        :props="defaultProps">
      </el-tree>
    </div>
    <div class="tree_box">
      <el-form ref="resourceParent" label-width="100px" :disabled="!editResource" v-show="resourceDetail.id" :rules="rules" :model="resourceDetail">
        <el-form-item label="名称" prop="name">
          <el-input v-model="resourceDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="resourceDetail.path"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input :value="filterType(resourceDetail.type)" disabled v-if="!resourceDetail.type || resourceDetail.type === 1 || resourceDetail.type === 4"></el-input>
          <el-select v-model="resourceDetail.type" v-else>
            <el-option :value="2" label="菜单"/>
            <el-option :value="3" label="页面"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model="resourceDetail.seq"></el-input>
        </el-form-item>
        <el-form-item label="拓展" prop="remark">
          <el-input v-model="resourceDetail.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" v-if="resourceDetail.id">
        <el-form-item label="">
          <el-button type="primary" v-if="!editResource && perm['btn_edit']" @click="editResource = true">编辑</el-button>
          <el-button type="primary" @click="save" v-if="editResource">保存</el-button>
          <el-button type="warning" @click="del" v-if="(!resourceDetail.children || resourceDetail.children.length === 0) && perm['btn_del']">删除</el-button>
          <el-button type="success" @click="openAddChild" v-if="resourceDetail.type !== 4 && !addResourceFlag && perm['btn_add']">添加子资源</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="resourceChild" label-width="100px" v-show="addResourceFlag" :rules="rules" :model="resourceChild">
        <el-form-item label="子资源名称" prop="name">
          <el-input v-model="resourceChild.name"></el-input>
        </el-form-item>
        <el-form-item label="子资源路径" prop="path">
          <el-input v-model="resourceChild.path"></el-input>
        </el-form-item>
        <el-form-item label="子资源类型" prop="type">
          <el-select v-model="resourceChild.type">
            <el-option :value="2" label="菜单"/>
            <el-option :value="3" label="页面"/>
            <el-option :value="4" label="按钮"/>
          </el-select>
        </el-form-item>
        <el-form-item label="子资源排序" prop="seq">
          <el-input v-model="resourceChild.seq"></el-input>
        </el-form-item>
        <el-form-item label="子资源拓展" prop="remark">
          <el-input v-model="resourceChild.remark"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addResource">确认添加</el-button>
          <el-button type="warning" @click="addResourceFlag = false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Action } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import { VueComponentParent } from '@/type';

const resourceDetail = {
  name: '',
  path: '',
  type: null,
  seq: null,
  id: 0,
  children: [],
  remark: ''
};

@Component
export default class SettingsResource extends Vue {
  @Action('auth/findRoleAuthTree') private findRoleAuthTree!: (data: any) => any;

  @Action('auth/createAndUpdatePermission') private createAndUpdatePermission!: (data: any) => any;

  @Action('auth/batchDeletePermission') private batchDeletePermission!: (data: any) => any;

  roleAuthThree: any[] = [];

  editResource = false; // 编辑资源

  addResourceFlag = false; // 添加子资源

  defaultProps = {
    children: 'children',
    label: 'name'
  };

  resourceDetail = { ...resourceDetail }; // 当前所选中的资源

  resourceChild = { ...resourceDetail }; // 所添加的子资源

  rules = {
    name: [
      {
        required: true,
        message: '请输入资源名称',
        trigger: 'blur'
      },
    ],
    path: [
      {
        required: true,
        message: '请输入资源路径',
        trigger: 'blur'
      },
    ],
    type: [
      {
        required: true,
        message: '请选择资源类型',
        trigger: 'blur'
      },
    ],
    seq: [
      {
        required: true,
        message: '请输入资源排序',
        trigger: 'blur'
      },
    ],
  }

  perm = {};

  async created() {
    this.init();
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }

  async init() {
    const body = await this.findRoleAuthTree({ type: 4 });
    this.roleAuthThree = body;
  }

  nodeClick(resource: any) {
    (this.$refs.resourceParent as VueComponentParent).clearValidate(); // 重置表单校验
    (this.$refs.resourceChild as VueComponentParent).clearValidate();
    this.addResourceFlag = false; // 关闭添加子资源
    this.editResource = false; // 关闭编辑资源
    this.resourceDetail = resource;
  }

  // 删除资源
  del() {
    this.$confirm(`确认删除${this.filterType(this.resourceDetail.type)}${this.resourceDetail.name}`, '提示', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await this.batchDeletePermission({ ids: [this.resourceDetail.id] });
      this.$message.success('删除成功');
      // this.init();
      // this.resourceDetail = { ...resourceDetail };
    });
  }

  save() {
    (this.$refs.resourceParent as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const {
          id,
          name,
          path,
          type,
          seq,
          remark
        } = this.resourceDetail;
        const data = {
          id,
          pid: this.resourceDetail.id,
          name,
          path,
          type,
          seq: Number(seq),
          remark
        };
        this.createAndUpdatePermission(data).then(() => {
          this.$message.success('保存成功');
          this.init();
          this.editResource = false;
        });
      }
    });
  }

  // 添加子资源
  addResource() {
    (this.$refs.resourceChild as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const {
          name,
          path,
          type,
          seq,
          remark
        } = this.resourceChild;
        const data = {
          id: 0,
          pid: this.resourceDetail.id,
          name,
          path,
          type,
          seq: Number(seq),
          remark
        };
        this.createAndUpdatePermission(data).then(() => {
          this.$message.success('添加成功');
          this.init();
        });
      }
    });
  }

  openAddChild() {
    this.addResourceFlag = true;
    this.resourceChild = { ...resourceDetail };
  }

  filterType(type: number | null) {
    const typeArr = ['系统', '菜单', '页面', '按钮'];
    return type ? typeArr[type - 1] : '';
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
.tree_box{
  width: 50%;
  float: left;
}
</style>
