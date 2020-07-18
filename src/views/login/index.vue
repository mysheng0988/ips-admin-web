<template>
  <div class="login-bg">
    <div class="login-form-layout" >
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <div class="logo-img">
          <!--<svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>-->
          <img src="@/views/login/img/logo.png">
        </div>
        <el-form-item prop="username">
          <el-input name="phone"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix" >
            <svg-icon icon-class="user" class="color-gray"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix" class="svg-container">
            <svg-icon icon-class="password" class="color-gray"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon :icon-class="eye" class="color-gray"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            用户登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {validatePhone} from '@/utils/validate';
  export default {
    name: 'login',
    data() {
      const validateUserPhone = (rule, value, callback) => {
        if (!validatePhone(value)) {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      };
      const validateUserName=(rule, value, callback) => {
        if (value.length<2) {
          callback(new Error('用户名称不能小于四位'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 4) {
          callback(new Error('密码不能小于六位'))
        } else {
          callback()
        }
      };
      return {
        
        loginForm: {
          username: '',
          password: '',
          roleId:[13,18]
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUserName}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        eye:'eye',
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.eye='eyes'
          this.pwdType = ''
        } else {
          this.eye='eye'
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then((res) => {
              this.loading = false;
              if(res.code=="200"){
                this.$router.push({path: '/home'})
              }else{
                this.$message.error(res.msg);
              }

            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      },
    }
  }
</script>
<style lang="scss" >

  .login-bg{
    height: 100vh;
    width: 100%;
    background:url("img/bg.png") no-repeat;
    background-size: cover;
  }
  .login-form-layout {
    padding: 30px;
    position: absolute;
    right: 10%;
    top:50%;
    background:url("img/input_bg.png") no-repeat;
    background-size: cover;
    width: 480px;
    height:540px;
    margin: -270px 0;
  }

  .logo-img{
    margin: 50px 0;
    width: 100%;
    text-align: center;
  }

  .login-form-layout .el-form-item .el-input {
    display: inline-block;
    input {
      background-color: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 35px;
      color: #fff;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .login-form-layout .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .color-gray{
    color: #eee;
  }
</style>
