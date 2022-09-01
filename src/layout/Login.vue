<template>
  <div class="login_layout">
    <div class="login_bg">
      <div class="form_box">
        <p class="saas_tit">科技驾培业务管理平台</p>
        <el-form ref="loginForm" :model="loginData" :rules="rules">
          <el-form-item prop="mobile">
            <el-input
              maxlength="11"
              type="tel"
              placeholder="请输入手机号"
              v-model="loginData.mobile"
            >
              <template #prefix>
                <i class="iconfont">&#xe619;</i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              maxlength="16"
              minlength="6"
              show-password
              placeholder="请输入密码"
              v-model="loginData.password"
            >
              <template #prefix>
                <i class="iconfont">&#xe628;</i>
              </template>
            </el-input>
          </el-form-item>
          <!-- <el-form-item prop="code">
          <el-input maxlength="11"
            type="tel"
            placeholder="请输入验证码"
            v-model="loginData.code">
            <template #prefix>
              <i class="iconfont">&#xe61b;</i>
            </template>
            <template #suffix>
              <i class="el-input__icon el-icon-date"></i>
            </template>
          </el-input>
        </el-form-item> -->
          <el-button type="primary" style="width: 316px" @click="submitForm"
            :loading="loginLoading">登录</el-button
          >
        </el-form>
      </div>
    </div>
    <div class="footer_position">
      <span style="color: #909399" v-html="COPY_RIGHT"></span>
      <el-link
        style="color: #909399"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        :underline="false"
        >{{ ICP }}</el-link
      >
    </div>
    <el-dialog
      title="请选择需要进入的组织"
      :visible.sync="dialogVisible"
      width="500px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <el-button type="" v-for="item in companyInfoList" :key="item.companyId" style="margin: 10px 10px 0;" @click="saveMsg(item.companyId)">{{item.companyName}}</el-button>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Action } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { setToken } from '@/assets/js/token_cookie';
import { ICP, COPY_RIGHT } from '@/assets/js/common';
import { ParamsType } from '@/type';
import actions from '@/assets/js/qiankun_actions';

interface VueComponentParent extends Vue {
  validate: (callback: (valid: boolean) => boolean | void) => boolean | void;
}
@Component
export default class Login extends Vue {
  @Action('user/postPwLogin') private postPwLogin!: (data: any) => ParamsType;

  private ICP = ICP;

  private COPY_RIGHT = COPY_RIGHT;

  dialogVisible = false;

  loginLoading = false;

  companyInfoList = [];

  rules = {
    mobile: [
      {
        required: true,
        message: '手机号不能为空',
      },
    ],
    password: [
      {
        required: true,
        message: '密码不能为空',
      },
    ],
    code: [
      {
        required: true,
        message: '验证码不能为空',
      },
    ],
  };

  loginData = {
    mobile: '',
    password: '',
  };

  loginMsg: any = {};

  created() {
    window.addEventListener('keydown', this.keydownFn);
  }

  keydownFn(event: any) {
    if (event.keyCode === 13) {
      this.submitForm();
    }
  }

  beforeDestroy() {
    window.removeEventListener('keydown', this.keydownFn, false);
  }

  // 提交
  submitForm() {
    (this.$refs.loginForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.pwdLogin();
      }
    });
  }

  async pwdLogin() {
    this.loginLoading = true;
    const frUrl = `https://bi.aicar365.com:8443/webroot/decision/login/cross/domain?fine_username=${this.loginData.mobile}&fine_password=${this.loginData.password}&validity=-2&callback=`;
    // const frUrl = 'https://bi.aicar365.com:8443/webroot/decision/login/cross/domain?fine_username=admin&fine_password=Ctjt@2022&validity=-2&callback=';
    const ifr = document.createElement('iframe');
    ifr.src = frUrl;
    document.getElementsByTagName('head')[0].appendChild(ifr);
    this.postPwLogin(this.loginData).then((res: any) => {
      this.loginMsg = res;
      const { companyInfoList } = res;
      if (companyInfoList && companyInfoList.length > 1) {
        this.dialogVisible = true;
        this.companyInfoList = companyInfoList;
        return;
      }
      this.saveMsg();
    }).catch(() => {
      this.loginLoading = false;
    });
  }

  saveMsg(companyId?: string) {
    const {
      token, name, companyInfoList, roleName
    } = this.loginMsg;
    localStorage.setItem('user_name', name || this.loginData.mobile);
    localStorage.setItem('user_roleName', roleName);
    localStorage.setItem('user_companyId', companyId || (companyInfoList && companyInfoList[0] && companyInfoList[0].companyId));
    setToken(token);
    actions.setGlobalState({ token }); // 放在qiankun状态管理内通知微应用token变化
    let { redirect } = this.$route.query;
    if (!redirect) redirect = '/workbench/home';
    this.$nextTick(() => {
      this.$router.replace(redirect as string, () => {
        console.log();
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.login_layout {
  width: 100%;
  height: 100%;
  background: url('../assets/images/login_bg.jpg') no-repeat;
  background-size: 100% 100%;
  position: relative;
  background-position: center;
}
.login_bg {
  width: 664px;
  height: 470px;
  background: url('../assets/images/login_img.png') no-repeat;
  background-size: 100% auto;
  right: 50%;
  top: 40%;
  position: absolute;
  transform: translateY(-50%);
}
.form_box {
  padding: 32px 32px 43px 32px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  position: absolute;
  right: -80%;
  top: 60%;
  transform: translateY(-50%);
  .saas_tit {
    line-height: 37px;
    font-size: 26px;
    font-weight: 500;
    margin-bottom: 32px;
    text-align: center;
  }
}
:deep(.el-input--prefix .el-input__inner) {
  width: 316px;
  padding-left: 39px;
  height: 38px;
  line-height: 38px;
}
:deep(.el-input--prefix .el-input__prefix) {
  left: 16px;
  top: 3px;
}
.el-form-item {
  margin-bottom: 24px;
}
.footer_position {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
