<template>
  <div class="loginBg d-flex justify-content-center align-items-center">
    <div class="d-flex">
      <div class="pt-5 leftDiv">
        <div class="text-center mb-4">
          <img :src="logo_url" alt="" class="logoImg" />
          <div class="mt-2 commonFontColor">{{company}}</div>
        </div>
        <div class="mt-2 commonFontColor pl-4">
          <div class="d-flex mb-3 ml-5">
            <div class="mr-4">
              <i class="el-icon-success"></i>
            </div>
            <div>
              <p class="mb-0 secondTitle">优势之势</p>
              <p class="mb-0 thirdTitle">"硬科技+大产业"的无限可能</p>
            </div>
          </div>
          <div class="d-flex mb-3 ml-5">
            <div class="mr-4">
              <i class="el-icon-success"></i>
            </div>
            <div>
              <p class="mb-0 secondTitle">解决方案</p>
              <p class="mb-0 thirdTitle">客户推广整体解决方案提供商</p>
            </div>
          </div>
          <div class="d-flex mb-3 ml-5">
            <div class="mr-4">
              <i class="el-icon-success"></i>
            </div>
            <div>
              <p class="mb-0 secondTitle">客户案例</p>
              <p class="mb-0 thirdTitle">优势科技产品广泛应用各行业</p>
            </div>
          </div>
          <div class="d-flex mb-3 ml-5">
            <div class="mr-4">
              <i class="el-icon-success"></i>
            </div>
            <div>
              <p class="mb-0 secondTitle">合作伙伴</p>
              <p class="mb-0 thirdTitle" style="font-size: 12px;">与优势-共发展-赢未来</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pt-5 rigthDiv">
        <div class="title text-center">{{company}}</div>
        <div class="d-flex justify-content-center py-4">
          <el-input
            placeholder="用户名"
            v-model="user.phone" class="userInput"
            style="width: 80%"
          >
            <i slot="prefix" class="fa fa-user user-icon"></i>
          </el-input>
        </div>
        <!--用户名：<input type="text" placeholder="用户名" v-model="user.phone">-->
        <!--密码：<input type="password" placeholder="密码" v-model="user.password">-->
        <div class="d-flex justify-content-center py-2">
          <!--<el-input-->
            <!--v-if="user.sms"-->
            <!--placeholder="验证码"-->
            <!--v-model="user.code"-->
            <!--type="password"-->
            <!--class="userInputCode"-->
            <!--style="width: 80%"-->
          <!--&gt;-->
            <!--<el-button slot="suffix" :disabled="user.isDisabled" class="d-inline-block code" @click="getCode">-->
              <!--<span v-if="user.sendCodeDisabled">{{user.time}}秒后重试</span>-->
              <!--<span v-if="!user.sendCodeDisabled">获取验证码</span>-->
            <!--</el-button>-->
          <!--</el-input>-->
          <el-input
            placeholder="密码"
            v-model="user.password"
            type="password"
            class="userInput"
            style="width: 80%"
          >
            <i slot="prefix" class="fa fa-unlock-alt user-icon"></i>
          </el-input>
        </div>
        <!--<div class="d-flex justify-content-center w-100">-->
          <!--<div class="text-right forget" @click="openCode">忘记密码？用短信验证码登录</div>-->
        <!--</div>-->
        <div class="login-ing" @click="login">登&nbsp;录</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    login,
    logo
  } from '@/apis/login'
  export default {
    name: "Login",
    data(){
      return{
        user: {
          phone: '',
          password: ''
        },
        logo_url: '',
        company: ''
      }
    },
    async mounted(){
      if(localStorage.getItem('token')){
        this.$router.push({name: 'index'});
      }
      const result = await logo(document.domain, 2);
      if(result.data.code === 200){
        this.logo_url = result.data.data.logo.logo_url;
        this.company = result.data.data.logo.company
      }
    },
    methods: {
      login() {
        if(!this.user.phone){
          this.$message({
            message: '请输入手机号',
            type: 'error'
          });
          return false;
        }
        if (!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.user.phone))) {
          this.$message({
            message: '手机号格式不正确',
            type: 'error'
          });
          return false;
        }
        if (!this.user.password) {
          this.$message({
            message: '请输入密码',
            type: 'error'
          });
          return false;
        }
        // else if(!this.user.code){
        //   this.$message({
        //     message: '请输入验证码',
        //     type: 'error'
        //   });
        //   return false;
        // }
        let params = {
          phone: this.user.phone,
          pwd: this.user.password
        };
        login(params).then( result => {
          // console.log('result:', result);
          if (result.data.code === 200) {
            localStorage.setItem('token', result.data.data.auth_token);
            localStorage.setItem('menus', JSON.stringify(result.data.data.menus));
            localStorage.setItem('mobile', result.data.data.user.mobile);
            localStorage.setItem('balance', result.data.data.user.balance);
            localStorage.setItem('name', result.data.data.user.contact);
            localStorage.setItem('company', result.data.data.user.company);
            localStorage.setItem('logo_url', result.data.data.user.logo_url);
            localStorage.setItem('setting', result.data.data.user.setting);
            localStorage.setItem('group_id', result.data.data.user.group_id);
            this.$router.push({
              name: 'index'
            });
            // this.$route.meta.requireAuth = true;
            // console.log('this.$route.meta:', this.$route.meta);
          } else {
            this.$message({
              message: result.data.msg,
              type: 'error'
            });
            return false
          }
        });
      }
    }
  };
</script>

<style scoped>
  .leftDiv{
    width: 385px;
    height: 450px;
    background-color: rgba(0,0,0,.3);
  }
  .rigthDiv{
    width: 385px;
    height: 450px;
    background-color: hsla(0,0%,100%,.3);
  }
  .commonFontColor{
    color: #ffffff;
  }
  .loginBg{
    width: 100vw;
    height: 100vh;
    background: url("https://s1.ax1x.com/2018/07/05/PVIlgH.jpg");
  }
  .logoImg{
    width: 70px;
    height: 70px;
  }
  .el-icon-success{
    color: hsla(0,0%,100%,.4);
    font-size: 40px;
  }
  .secondTitle{
    font-size: 14px;
    color: hsla(0,0%,100%,.9);
  }
  .thirdTitle{
    font-size: 12px;
    color: hsla(0,0%,100%,.7);
  }
  .title{
    font-size: 36px;
    color: rgb(204, 204, 204);
    text-shadow: rgb(204, 204, 204) -1px -1px, rgb(51, 51, 51) 1px 1px;
  }
  .user-icon{
    font-size: 28px;
    color: rgba(255,255,255,0.6);
    line-height: 50px;
    margin-left: 30px;
  }
  .login-ing{
    width: 80%;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    margin: 40px auto 0;
    border-radius: 3px;
    color: hsla(0,0%,100%,.8);
    background-color: rgba(0,0,0,.3);
    text-align: center;
    cursor: pointer;
  }
  .forget{
    width: 80%;
    color: hsla(0,0%,100%,.9);
    font-size: 12px;
    cursor: pointer;
  }
  .code{
    border: 1px solid hsla(0,0%,100%,.9);
    line-height: 30px;
    margin: 10px 0px;
    padding: 0px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
<style>
  .userInput .el-input__inner{
    background-color: rgba(0,0,0,.3)!important;
    padding-left: 70px!important;
    height: 50px;
    border-color: hsla(0,0%,100%,0)!important;
    color: hsla(0,0%,100%,.5);
    font-size: 16px;
  }
  .userInputCode .el-input__inner{
    background-color: rgba(0,0,0,.3)!important;
    height: 50px;
    border-color: hsla(0,0%,100%,0)!important;
    color: hsla(0,0%,100%,.5);
    font-size: 16px;
  }
</style>