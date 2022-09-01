<template>
  <div class="header_box">
    <i class="iconfont fold" @click="toggleMenu">&#xe614;</i>
    <ul class="parent_route_box">
      <li class="parent_route" v-for="route in routes" :key="route.path"
      :class="{'active': route.path === currentParentRoute.path}"
      @click="updateCurrentParentRoute(route)">
        {{route.meta.title}}
      </li>
    </ul>
    <div class="right_menu">
      <!-- <el-avatar shape="circle" :size="28" :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar> -->
      <el-dropdown @command="handleCommand">
        <span class="admin_name">{{userName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="1">修改密码</el-dropdown-item>
            <el-dropdown-item :command="2">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="passwordForm" label-width="80px" :rules="rules" ref="passwordForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model.trim="passwordForm.oldPassword" maxlength="16"
          show-password placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model.trim="passwordForm.newPassword" maxlength="16"
          show-password placeholder="密码须由数字、字母组成，且密码位数为6-16位"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model.trim="passwordForm.confirmPassword" maxlength="16"
          show-password placeholder="密码须由数字、字母组成，且密码位数为6-16位"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="validatePasswordForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { RouteMeta, RouteConfig } from 'vue-router';
import { signOut, deepClone } from '@/assets/js/common';

interface VueComponentParent extends Vue {
  validate: (callback: (valid: boolean) => boolean | void) => boolean | void;
}

@Component
export default class HeaderBox extends Vue {
  @State(state => state.routes.currentParentRoute) currentParentRoute: any;

  @State(state => state.routes.routes) vuexRoutes: any;

  @Action('user/updatePassword') private updatePassword!: (data: any) => any;

  foldMenu = false;

  userName = localStorage.getItem('user_name') || '管理员';

  toggleMenu() {
    this.foldMenu = !this.foldMenu;
    this.$emitter.emit('foldMenu', this.foldMenu);
  }

  dialogFormVisible = false;

  passwordForm = {
    confirmPassword: '',
    newPassword: '',
    oldPassword: ''
  };

  rules = {
    confirmPassword: [
      {
        required: true,
        message: '请再次输入新密码',
      },
      {
        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
        message: '密码须由数字、字母组成，且密码位数为6-16位',
        trigger: 'blur'
      }
    ],
    newPassword: [
      {
        required: true,
        message: '请输入新密码',
        trigger: 'blur'
      },
      {
        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
        message: '密码须由数字、字母组成，且密码位数为6-16位',
        trigger: 'blur'
      }
    ],
    oldPassword: [
      {
        required: true,
        message: '请输入原密码',
      },
    ],
  };

  handleCommand(command: number) {
    if (command === 2) {
      signOut();
    }
    if (command === 1) {
      this.dialogFormVisible = true;
    }
  }

  // 修改密码
  validatePasswordForm() {
    (this.$refs.passwordForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
          this.$message.error('请确认新密码和确认密码一致');
          return;
        }
        if (this.passwordForm.newPassword === this.passwordForm.oldPassword) {
          this.$message.error('新密码与旧密码不能一致');
          return;
        }
        this.updatePassword(this.passwordForm).then(() => {
          this.$message.success('修改成功');
          this.dialogFormVisible = false;
          this.passwordForm = {
            confirmPassword: '',
            newPassword: '',
            oldPassword: ''
          };
          signOut();
        });
      }
    });
  }

  created() {
    this.getCurrentParent();
  }

  // 获取当前菜单
  getCurrentParent() {
    const currentParent = this.vuexRoutes.find((item: RouteConfig) => item.name === this.$route.matched[0].name);
    if (currentParent) {
      this.$store.commit('routes/UPDATE_CURRENT_ROUTE', currentParent);
    }
  }

  @Watch('$route')
  routeChange(): void {
    this.getCurrentParent();
  }

  get routes() {
    return this.filterRoutes(this.vuexRoutes);
  }

  updateCurrentParentRoute(route: RouteConfig) {
    this.$store.commit('routes/UPDATE_CURRENT_ROUTE', route);
  }

  filterRoutes(routes: Array<RouteConfig>) {
    const menuList: Array<RouteConfig> = [];
    deepClone(routes).forEach((route: RouteConfig) => {
      const routeCopy = route;
      if (routeCopy.meta && !(routeCopy.meta as RouteMeta).menuHide) {
        if (routeCopy.children) {
          routeCopy.children = this.filterRoutes(routeCopy.children);
        }
        menuList.push(routeCopy);
      }
    });
    // 用于刷新时查找当前根路由
    if (!this.currentParentRoute.name) {
      const currentParent = menuList.find(item => item.name === this.$route.matched[0].name);
      if (currentParent) {
        this.updateCurrentParentRoute(currentParent);
      }
    }
    return menuList;
  }
}
</script>
<style lang="scss" scoped>
.iconfont{
  font-size: 14px;
  color: $--color-default-text;
}
.fold{
  color: #fff;
  cursor: pointer;
  margin-right: 10px;
}
.parent_route_box{
  height: 100%;
}
.parent_route{
  padding: 0 17px;
  justify-content: center;
  color: #D4E9FF;
  font-size: 16px;
  min-width: 64px;
  float: left;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  &:hover{
    background-color: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-weight: 600;
  }
  &.active{
    background-color: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-weight: 600;
    position: relative;
    &::after{
    content: "";
      height: 4px;
      background: #fff;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
}
.warn_order{
  cursor: pointer;
  padding-left: 17px;
}
.warn_order, .badge_box{
  &:hover{
    .iconfont{
      color: $--color-primary;
    }
    color: $--color-primary;
  }
}
.header_box{
  height: 100%;
  background: $--color-primary;
  line-height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px 0 8px;
  color: $--color-default-text;
  .el-icon-s-fold{
    font-size: 14px;
    width: 14px;
    height: 14px;
    color: $--color-border-split;
    cursor: pointer;
  }
  .route_name{
    .father{
      font-weight: 500;
    }
    margin-left: 16px;
  }
  .badge_box{
    margin-left: 20px;
    margin-right: 24px;
    cursor: pointer;
  }
  .right_menu{
    float: right;
  }
}
.el-menu.el-menu--horizontal{
  border: 0px;
}
.el-badge{
  margin-right: 4px;
  :deep(.el-badge__content){
    height: 14px;
    line-height: 14px;
    padding: 0 4px;
  }
}
:deep(.el-menu--horizontal > .el-submenu .el-submenu__title){
  height: 40px;
  line-height: 40px;
  color: $--color-default-text;
  border: 0px;
  padding: 0 0 0 4px;
}
:deep(.el-menu--horizontal > .el-submenu.is-active .el-submenu__title){
  border-bottom: 0px;
  color: $--color-default-text;
}
.right_menu{
  flex: 1;
  align-items: center;
  display: flex;
  justify-content: flex-end;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.admin_name{
  color: #fff;
  margin-left: 4px;
  &:hover{
    border: 0;
  }
}
</style>
