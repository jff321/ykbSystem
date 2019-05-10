<template>
  <div class="loginBg d-flex justify-content-center align-items-center">
    <div class="d-flex">
      <div class="pt-5 leftDiv">
        <div class="text-center mb-4">
          <img src="../assets/logo.png" alt="" class="logoImg" />
          <div class="mt-2 commonFontColor">优客宝</div>
        </div>
        <div class="mt-2 commonFontColor pl-4">
          <div class="d-flex mb-3 ml-5">
            <div class="mr-4">
              <i class="el-icon-success"></i>
            </div>
            <div>
              <p class="mb-0 secondTitle">优势之势</p>
              <p class="mb-0 thirdTitle">"硬科技+大产业"的无线可能</p>
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
        <div class="title text-center">优客宝</div>
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
        <div class="login-ing" @click="login">登&nbsp;陆</div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/apis/login'
export default {
  name: "Login",
  data(){
    return{
      user: {
        phone: '',
        password: ''
      }
    }
  },
  mounted(){
    // if(localStorage.getItem('token')){
    //
    // }
  },
  methods: {
    async login() {
      if (!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.user.phone))) {
        this.$message({
          message: '请输入手机号',
          type: 'error'
        });
      } else if (!this.user.password) {
        this.$message({
          message: '请输入密码',
          type: 'error'
        });
      } else {
        let params = {
          phone: this.user.phone,
          password: this.user.password
        };
        const result = await login(params);
        if (result.status === 1) {
          this.$emit('listenToLogin', this.user);
          let beforeTime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
          localStorage.setItem('token', result.data.api_token);
          localStorage.setItem('beforeTime', beforeTime);
          console.log('localStorage:', localStorage);
        } else {
          this.$message({
            message: result.msg,
            type: 'error'
          });
        }
      }
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
</style>