<template>
  <div class="w-100 head d-flex justify-content-center align-items-center">
    <div class="d-flex flex-grow-1">
      <div class="headLogo d-flex justify-content-center align-items-center border-right" @click="toIndex">
        <img class="logo rounded-circle" :src="logo_url" alt="LOGO">
      </div>
      <div class="company fontColor">
        <span>{{company}}({{name}})</span>
      </div>
    </div>
    <div class="mx-5">
      <el-dropdown v-if="group_id === 4">
        <span class="el-dropdown-link d-inline-block d-flex align-items-center fontColor" style="height: 65px;cursor: pointer">
         <i class="fa fa-rmb icon"></i> 账户余额 : {{balance}}元
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>短信单价：{{setting.sms}}元/条</el-dropdown-item>
          <el-dropdown-item>闪信单价：{{setting.fms}}元/分</el-dropdown-item>
          <el-dropdown-item>通话单价：{{setting.tel}}元/条</el-dropdown-item>
          <el-dropdown-item>匹配单价：{{setting.mate}}元/条</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-else class="fontColor" style="font-size: 14px;">
        <span class="el-dropdown-link d-inline-block d-flex align-items-center fontColor" style="height: 65px;">
         <i class="fa fa-rmb icon"></i> 账户余额 : {{balance}}元
        </span>
      </div>
    </div>
    <div class="mr-5">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link d-inline-block d-flex align-items-center fontColor" style="height: 65px;cursor: pointer">
          <i class="fa fa-address-book-o icon"></i>{{mobile}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <!--el-dropdown-item没有自定义click事件, 两个解决办法:
            1. 使用原生click事件 @click.native = "logout"
            2. 使用菜单项的指令事件
              @command="handleCommand"
              command="logout"
              handleCommand(command) {
                if (command === 'logout') {
                    this.logout()
                }
              }
          -->
          <el-dropdown-item command="basicInfo">基本信息</el-dropdown-item>
          <!--<el-dropdown-item>安全设置</el-dropdown-item>-->
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import {
    logo
  } from '@/apis/login'
  import {
    counts
  } from '@/apis/index'
  export default {
    name: 'topNav',
    data(){
      return {
        loginOutStatus : localStorage.getItem('token'),
        name: localStorage.getItem('name'),
        company: localStorage.getItem('company'),
        logo_url: localStorage.getItem('logo_url'),
        mobile: localStorage.getItem('mobile'),
        balance: localStorage.getItem('balance'),
        group_id: Number(localStorage.getItem('group_id')),
        setting: JSON.parse(localStorage.getItem('setting'))
      }
    },
    async mounted(){
      const result = await logo(document.domain, 2);
      const res = await counts();
      this.balance = res.data.data.balance;
      if(result.data.code === 200){
        this.logo_url = result.data.data.logo.logo_url;
        this.company = result.data.data.logo.company;
      } else {
        this.$status(result.data.msg);
      }
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          this.logout()
        }
        if (command === 'basicInfo') {
          this.basicInfo()
        }
      },
      logout () {
        this.$emit('listenLoginOut', this.loginOutStatus);
      },
      basicInfo () {
        this.$emit('listenBasicInfo', '基本信息');
      },
      toIndex(){
        this.$router.push({
          name: 'index'
        })
      }
    }
  };
</script>

<style scoped>
  .head{
    width: 100vw;
    background-color: #374254;
    color: #bfcbd9;
  }
  .headLogo{
    width: 200px;
    height: 35px;
    padding: 15px 0px;
  }
  .company{
    width: 500px;
    height: 35px;
    line-height: 35px;
    margin-left: 30px;
    font-size: 14px;
  }
  .logo{
    width: 50px;
    height: 50px;
  }
</style>