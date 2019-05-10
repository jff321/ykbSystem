<template>
  <div>
    <div class="navigation">首页</div>
    <!--累计-->
    <div>
      <div class="d-flex text-center mt-3">
        <!--累计用户-->
        <div class="mt-3 w-25 mr-4">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/users.png" alt="" style="width: 35px;height: 35px;">
              累计用户
            </p>
            <p class="flow">{{user_num}}</p>
          </div>
        </div>
        <!--累计充值-->
        <div class="mt-3 w-25 mr-4">
          <div class="shadow p-5 cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/shouru.png" alt="" style="width: 35px;height: 35px;">
              累计充值
            </p>
            <p class="flow">{{income}}</p>
          </div>
        </div>
        <!--累计支出-->
        <div class="mt-3 w-25 mr-4">
          <div class="shadow p-5 cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/zhichu.png" alt="" style="width: 35px;height: 35px;">
              累计支出
            </p>
            <p class="flow">{{pays}}</p>
          </div>
        </div>
        <!--账户余额-->
        <div class="mt-3 w-25">
          <div class="shadow p-5 cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/yue.png" alt="" style="width: 35px;height: 35px;">
              账户余额
            </p>
            <p class="flow">{{balance}}</p>
          </div>
        </div>
      </div>
      <!--匹配-->
      <div v-if="group_id === 3" class="w-100 mt-5 d-flex">
        <!--累计发送闪信次数-->
        <div class="w-25 mr-4">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/hezi.png" alt="" style="width: 35px;height: 35px;">
              总匹配数量
            </p>
            <p class="flow">{{mate_total}}</p>
          </div>
        </div>
        <!--数据营销余额-->
        <div class="w-25 mr-4">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/pipei.png" alt="" style="width: 35px;height: 35px;">
              已使用匹配数量
            </p>
            <p class="flow">{{mate_use}}</p>
          </div>
        </div>
        <!--累计发送闪信次数-->
        <div class="w-25 mr-4">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/shanxin.png" alt="" style="width: 35px;height: 35px;">
              剩余匹配数量
            </p>
            <p class="flow">{{mate_over}}</p>
          </div>
        </div>
        <!--累计发送短信次数-->
        <div class="w-25">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/duanxin.png" alt="" style="width: 35px;height: 35px;">
              累计采集mac数量
            </p>
            <p class="flow">{{mac_total}}</p>
          </div>
        </div>
      </div>
      <div class="w-100 mt-5 d-flex">
        <!--累计发送闪信次数-->
        <div class="w-25 mr-4">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/hezi.png" alt="" style="width: 35px;height: 35px;">
              累计盒子数量
            </p>
            <p class="flow">{{box_num}}</p>
          </div>
        </div>
        <!--数据营销余额-->
        <div class="w-25 mr-4">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/pipei.png" alt="" style="width: 35px;height: 35px;">
              累计匹配线索次数
              <!--<el-tooltip-->
                <!--effect="dark"-->
                <!--placement="bottom"-->
              <!--&gt;-->
                <!--<div slot="content">-->
                  <!--线索收费标准：线索匹配0.1元/条-->
                <!--</div>-->
                <!--<i class="fa fa-tags icon text-secondary"></i>-->
              <!--</el-tooltip>-->
            </p>
            <p class="flow">{{mate_num}}</p>
          </div>
        </div>
        <!--累计发送闪信次数-->
        <div class="w-25 mr-4">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/shanxin.png" alt="" style="width: 35px;height: 35px;">
              累计发送闪信次数
              <!--<el-tooltip-->
                <!--effect="dark"-->
                <!--placement="bottom"-->
              <!--&gt;-->
                <!--<div slot="content">-->
                  <!--闪信收费标准：闪信发送0.2元/条-->
                <!--</div>-->
                <!--<i class="fa fa-tags icon text-secondary"></i>-->
              <!--</el-tooltip>-->
            </p>
            <p class="flow">{{fms_num}}</p>
          </div>
        </div>
        <!--累计发送短信次数-->
        <div class="w-25">
          <div class="shadow p-5 text-center cardHeight">
            <p class="font-weight-bold">
              <img src="../assets/duanxin.png" alt="" style="width: 35px;height: 35px;">
              累计发送短信次数
              <!--<el-tooltip-->
                <!--effect="dark"-->
                <!--placement="bottom"-->
              <!--&gt;-->
                <!--<div slot="content">-->
                  <!--短信收费标准：短信发送0.09元/条-->
                <!--</div>-->
                <!--<i class="fa fa-tags icon text-secondary"></i>-->
              <!--</el-tooltip>-->
            </p>
            <p class="flow">{{sms_num}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {counts} from "@/apis/index";

  export default {
  name: 'index',
  data(){
    return{
      flow: 0,
      balance: '0.00',
      income: '0.00',
      pays: '0.00',
      mate_num: 0,
      sms_num: 0,
      fms_num: 0,
      user_num: 0,
      box_num: 0,
      mate_total: 0,
      mate_use: 0,
      mate_over: 0,
      mac_total: 0,
      group_id: Number(localStorage.getItem('group_id'))
    }
  },
  async mounted() {
    const result = await counts();
    if(result.data.code === 200){
      this.balance = result.data.data.balance;
      this.income = result.data.data.income;
      this.pays = result.data.data.pays;
      this.mate_num = result.data.data.mate_num;
      this.sms_num = result.data.data.sms_num;
      this.fms_num = result.data.data.fms_num;
      this.user_num = result.data.data.user_num;
      this.box_num = result.data.data.box_num;
      this.mate_total = result.data.data.mate_total;
      this.mate_use = result.data.data.mate_use;
      this.mate_over = result.data.data.mate_over;
      this.mac_total = result.data.data.mac_total;
    } else if(result.data.code === 403){
      this.$noAuth(result.data.msg);
    } else {
      this.$status(result.data.msg);
    }
  },
  methods: {

  }
};
</script>

<style scoped>
  .flow{
    font-weight: 400;
    color: rgb(0, 172, 214);
    font-size: 28px;
  }
  .cardHeight{
    padding-top: 60px!important;
    padding-bottom: 55px!important;
  }
</style>