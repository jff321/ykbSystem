<template>
  <div>
    <div>MAC列表</div>
    <!--筛选-->
    <div>
      <el-select clearable class="mt-3 mr-4" v-model="code" placeholder="请选择">
        <el-option
          v-for="item in codes"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        >
          <!-- 插槽，用于放 option 和 option-group -->
          <slot>
            <span style="float: left">{{ item.name }}</span>
            <span v-if="item.online === 0" style="margin-top:13px;float: right;width: 8px;height: 8px;background-color: #999;border-radius: 50%;"></span>
            <span v-if="item.online === 1" style="margin-top:13px;float: right;width: 8px;height: 8px;background-color: #65B7AC;border-radius: 50%;"></span>
          </slot>
        </el-option>
      </el-select>
      <el-date-picker
        v-model="selDate"
        type="datetimerange"
        range-separator="-"
        :picker-options="pickerOptions"
        start-placeholder="开始筛选日期"
        end-placeholder="结束筛选日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change = "changeSelDate"
      >
      </el-date-picker>
      <el-button type="primary" class="ml-4" @click="queryMac">查询</el-button>
    </div>
    <!--人群采集-->
    <div class="mt-3">
      <div class="maps">
        <!--<img src="https://s1.ax1x.com/2018/06/20/CzTjVs.png" alt="" style="width: 100%;height: 100%;">-->
        <maps :showBusiness="false" :showSearchBox="false" :model="false" :number="1"></maps>
        <!--
        changeData map组件传值必须
        showSearchBox   是否显示搜索框
        model      是否是显示模式 或者点击模式
        makers      参数形式
           [
             {
                 position: [121.5273285, 31.21515044]
             }
           ]
        number   每调用一次必须不同的数值
        lnglat   点击模式必须的参数，才能正常的传值 与 changeData组合
        -->
        <div class="maptop"></div>
        <div class="radar">
          <div class="radartext">{{MatesTotal}}</div>

          <transition-group
            name="fade"
            tag="ul"
          >
            <li
              v-for="(items, index) in dataset"
              v-bind:key="index+1"
              v-bind:data-index="index"
              class="dot" :style="{left: items.left + 'px', top: items.right + 'px'}"
            >
            </li>
          </transition-group>

          <div class="circleone circle">
            <div class="circletwo circle"></div>
          </div>
        </div>
      </div>
    </div>
    <!--搜索-->
    <div class="mt-3">
      <div>
        <el-input
          class="inputStyle mr-4 mt-3"
          placeholder="请输入MAC"
          v-model="input"
          clearable
          @keyup.enter.native="query"
        >
        </el-input>
        <el-date-picker
          class="mr-4"
          v-model="date"
          type="datetimerange"
          range-separator="-"
          :picker-options="pickerOptions"
          start-placeholder="开始创建日期"
          end-placeholder="结束创建日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change = "changeDate"
        >
        </el-date-picker>
        <el-button type="primary" class="mr-3" @click="query">查询</el-button>
        <el-button v-if="group_id === 3" type="success" class="mr-3" @click="openAddDialog">新增</el-button>
        <el-button type="warning" @click="exportMacExcel">导出excel</el-button>
        <!--<download-excel-->
        <!--class="d-inline-block ml-4"-->
        <!--:data = "list"-->
        <!--:fields = "json_fields"-->
        <!--name = "MAC列表.xls">-->
        <!--&lt;!&ndash; 上面可以自定义自己的样式，还可以引用其他组件button &ndash;&gt;-->
        <!--<el-button type="success" @click="exportExcel">导出</el-button>-->
      <!--</download-excel>-->
      </div>
    </div>
    <!--表格-->
    <div class="mt-3">
      <el-table
        :loading="loading"
        :data="list"
        stripe
        :default-sort = "{prop: 'times', order: 'descending'}"
        style="width: 100%">
        <el-table-column
          prop="mac"
          label="MAC"
          sortable
        >
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="phone"-->
          <!--label="手机号"-->
          <!--sortable-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column
          prop="phone_name"
          label="机型"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="range"
          label="距离"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="停留时间(分)"
          sortable
        >
          <template slot-scope="scope">{{Math.ceil(scope.row.stoptime / 60)}}</template>
        </el-table-column>
        <el-table-column
          label="是否通话"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.is_call ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="times"
          label="创建时间"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          sortable
        >
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="float-right mt-3">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 60, 80, 100, 300, 500]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--确认导出对话框-->
    <el-dialog
      title="提示"
      :visible.sync="macVisible"
      width="20%"
    >
      <span>{{macText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="macVisible = false">取 消</el-button>
        <a :href="exportLink" id="test">
          <el-button class="ml-3" type="primary" @click="macVisible = false" :loading="isLoading">确定导出</el-button>
        </a>
      </span>
    </el-dialog>
    <!--新增对话框-->
    <el-dialog title="新增MAC" status-icon :visible.sync="addVisible" width="700px" center :before-close="handleAddClose">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="MAC名称" :label-width="formLabelWidth" prop="mac">
          <el-input v-model="addForm.mac" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子ID" :label-width="formLabelWidth" class="w-75" prop="code">
          <el-select clearable v-model="addForm.code" placeholder="请选择">
            <el-option
              v-for="item in addForm.codes"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
              <!-- 插槽，用于放 option 和 option-group -->
              <slot>
                <span style="float: left">{{ item.name }}</span>
                <span v-if="item.online === 0" style="margin-top:13px;float: right;width: 8px;height: 8px;background-color: #999;border-radius: 50%;"></span>
                <span v-if="item.online === 1" style="margin-top:13px;float: right;width: 8px;height: 8px;background-color: #65B7AC;border-radius: 50%;"></span>
              </slot>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="距离" :label-width="formLabelWidth" class="w-75">
          <el-input type="number" v-model="addForm.range" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone" required>
          <el-input v-model.number="addForm.phone" autocomplete="off" class="w-75" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="手机号型号" :label-width="formLabelWidth" prop="phoneType">
          <el-input v-model="addForm.phoneType" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClose('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Maps from '@/components/map/maps.vue'
  // import Vue from 'vue'
  // import JsonExcel from 'vue-json-excel'
  // Vue.component('downloadExcel', JsonExcel);
  import {
    mac,
    exportMac,
    addMac
  } from "@/apis/mac";
  import {
    boxs,
    todaymac
  } from '@/apis/mates'
  export default {
    name: "MAC",
    components: {
      Maps
    },
    data(){
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
          // console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        group_id: Number(localStorage.getItem('group_id')),
        id: '',
        list: [],
        codes: [],
        code: '',
        selDate: [],
        MatesTotal:0,
        dataset: [],
        loading: true,
        input: '',
        date: '',
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        start_date: '',
        end_date: '',
        // json_fields: {
        //   "MAC": "mac",    //常规字段
        //   "机型": "phone_name",
        //   "距离(米)": "range",
        //   // "停留时间(分)": "stoptime / 60",
        //   "停留时间(分)": {
        //     field: "stoptime",
        //     //自定义回调函数
        //     callback: value => {
        //       return `${Math.ceil(value / 60)}`;
        //     }
        //   },
        //   "是否通话": {
        //     field: "is_call",
        //     callback: value => {
        //       return value ? '是' : '否';
        //     }
        //   },
        //   "创建时间": "times",
        //   "更新时间": "update_time"
        // },
        // json_meta: [
        //   [
        //     {
        //       " key ": " charset ",
        //       " value ": " utf- 8 "
        //     }
        //   ]
        // ],
        macVisible: false,
        exportLink: '',
        macText: '数据获取中...',
        isLoading: true,
        formLabelWidth: '200px',
        addVisible: false,
        addForm: {
          mac: '',
          phone: '',
          codes: [],
          code: '',
          range: '',
          phoneType: ''
        },
        addRules: {
          mac: [
            { required: true, message: '请输入MAC', trigger: 'blur' },
            { min: 12, max: 17, message: '长度在 12 到 17 个字符', trigger: 'blur'  }
          ],
          phone: [
            { validator: checkPhone, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请选择盒子ID', trigger: 'blur' }
          ],
        }
      }
    },
    async mounted(){
      this.getDetailList();
      const todayInterval = setInterval(() => {
        this.getTodayMac();
      }, 6000);
      const interval = setInterval(()=>{
        this.setRondom();
      },3000);
      const interval1 = setInterval(()=>{
        this.deleteCircle();
      },5000);
      // 地图上获取盒子
      const result = await boxs();
      // console.log('result11111111', result);
      if(result.data.code === 200){
        result.data.data.forEach((item) => {
          this.codes.push({
            code: item.code,
            name: item.name,
            online: item.online
          })
        });
        this.addForm.codes = this.codes;
      } else {
        this.$status(result.data.msg);
      }

      // 我们的建立代码独立于我们的清理代码，这使得我们比较难于程序化地清理我们建立的所有东西。
      // 通过 $once(eventName, eventHandler) 一次性侦听一个事件
      // 你应该通过一个程序化的侦听器解决这两个问题：

      this.$once('hook:beforeDestroy', () => {
        clearInterval(todayInterval);
      });

      this.$once('hook:beforeDestroy', () => {
        clearInterval(interval);
      });

      this.$once('hook:beforeDestroy', () => {
        clearInterval(interval1);
      });
    },
    methods: {
      //随机出现扫描的探针点
      setRondom() {
        // this.dataset = [];
        this.circleNumber = Math.floor((Math.random() * 10) + 10);
        this.circlenumbers += this.circleNumber;
        // console.info( '每次', this.circleNumber);
        // console.info( '总的', this.circlenumbers);
        for(let i=0;i<=this.circleNumber;i++) {
          this.dataset.push({left:Math.floor(Math.random() * 400),right:Math.floor(Math.random() * 400)});
        }
      },
      // 删除扫描点
      deleteCircle() {
        this.dataset.splice(0,this.circlenumbers+3);
        // console.info( '删除剩下的', this.dataset.length);
        this.circlenumbers = null;
      },
      async getDetailList(){
        // console.log('this.end_date:', this.end_date);
        const result = await mac(this.code, this.start_date, this.end_date, this.input, this.currentPage, this.pageSize);
        this.loading = false;
        if(result.data.code === 200){
          result.data.data.list.forEach(function (item) {
            let date = new Date(parseInt(item.update_time) * 1000);
            let Y = date.getFullYear() + '-';
            let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            item.update_time = Y+M+D+h+m+s;
          });
          this.list = result.data.data.list;
          this.total = result.data.data.count;
        } else if(result.data.code === 403){
          this.$noAuth(result.data.msg);
        } else {
          this.$status(result.data.msg);
        }
      },
      // 分页
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getDetailList()
      },
      handleCurrentChange(val) {
        // console.log(`当前 ${val} 页`);
        this.currentPage = val;
        this.getDetailList()
      },
      // 查询筛选日期
      changeDate(val){
        if (val == null) {
          this.start_date = '';
          this.end_date = '';
        }
        if(val.length > 0){
          this.start_date = val[0];
          this.end_date = val[1];
        }
        this.getDetailList();
      },
      // 查询
      query(){
        this.getDetailList();
      },
      // 地图上筛选创建时间
      changeSelDate(val){
        // console.log(val);
        if (val == null) {
          this.start_date = '';
          this.end_date = '';
        }
        if(val.length > 0){
          this.start_date = val[0];
          this.end_date = val[1];
        }
      },
      // 筛选创建时间
      changeTimes(val){
        if (val == null) {
          this.start_date = '';
          this.end_date = '';
        }
        if(val.length > 0){
          this.start_date = val[0];
          this.end_date = val[1];
        }
      },
      async getTodayMac(){
        const result = await todaymac(this.code, this.start_date, this.end_date);
        // console.log('result: ', result);
        if(result.data.code === 200){
          this.MatesTotal = result.data.data;
        } else {
          this.$status(result.data.msg);
        }
      },
      queryMac(){
        this.getTodayMac();
      },
      async exportMacExcel(){
        this.macVisible = true;
        document.getElementById('test').onclick = function(ev){
          ev.preventDefault();
          // console.log('阻止a标签的默认行为');
        };
        const result = await exportMac(this.code, this.start_date, this.end_date, this.input);
        this.macText = '数据获取完毕';
        this.isLoading = false;
        document.getElementById('test').onclick = function(ev){
          ev.returnValue = true;
          // console.log('允许a标签的默认行为');
        };
        if(result.data.code === 200){
          this.exportLink = result.data.data;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 新增对话框
      openAddDialog(){
        this.addVisible = true;
        this.addForm.mac = '';
        this.addForm.phone = '';
        this.addForm.range = '';
        this.addForm.code = '';
        this.addForm.phoneType = '';
      },
      // 新增弹框取消按钮
      addClose(formName){
        this.addVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 新增弹框关闭按钮
      handleAddClose(){
        this.addClose('addForm');
      },
      // 新增确认框
      submitAdd(formName){
        this.$refs[formName].validate((valid) => {
          // if(!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.addForm.phone))){
          //   this.$status('请输入正确的手机号');
          //   return false;
          // } else {
          //   return true;
          // }
          if (valid) {
            let params = {
              mac: this.addForm.mac,
              phone: this.addForm.phone,
              phone_name: this.addForm.phoneType,
              box_id: this.addForm.code,
              range: this.addForm.range
            };
            addMac(params).then((result)=>{
              if(result.data.code === 200){
                this.getDetailList();
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.addVisible = false;
              } else {
                this.$status(result.data.msg);
              }
            });
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .inputStyle{
    width: 15%;
  }
  .maps{
    width:100%;
    height: 435px;
    /*padding: 10px 0;*/
    /*background-color:#EEEDDB ;*/
    /*background：url("http://picuser.city8.com/news/image/20141014/%B3%C9%B6%BC%BD%BB%CD%A8%B5%D8%CD%BC2014%B0%E6.jpg");*/
    /*overflow: hidden;*/
    position: relative;
  }
  .maptop{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.1);
  }
  .dot{
    position: absolute;
    z-index: 14;
    /*top: 100px;*/
    /*left: 100px;*/
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #29ea26;
    list-style: none;
  }
  .circleone{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 260px;
    height: 260px;
    margin: -130px 0 0 -130px;

  }
  .circletwo{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    margin: -50px 0 0 -50px;

  }
  .circle{
    border: 2px solid #169414;
    border-radius: 50%;
  }
  .radar {
    box-shadow: 0px 0px 30px #00ff33;
    background:-webkit-linear-gradient(90deg, rgba(12, 77, 11, 0.5) 49.5%, #4CA44B 50%, #4CA44B 50%, rgba(12, 77, 11, 0.5) 50.2%), -webkit-linear-gradient(0deg, rgba(12, 77, 11, 0.5) 49.5%, #29ea26 50%, #29ea26 50%, rgba(12, 77, 11, 0.5) 50.2%);
    /*background: linear-gradient(90deg, rgba(0, 128, 0, 0.6) 49.5%, #fff 50%, #fff 50%, rgba(0, 128, 0, 0.6) 50.2%), linear-gradient(0deg, rgba(0, 128, 0, 0.6) 49.5%, #fff 50%, #fff 50%, rgba(0, 128, 0, 0.6) 50.2%);*/
    width: 400px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    overflow: hidden;
  }
  .radartext{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 15;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 400px;
    color: #fff;
    font-size: 70px;

  }
  .radar:after {
    content: ' ';
    display: block;
    background-image: linear-gradient(50deg, rgba(0, 255, 51, 0) 50%, #00ff33 100%);
    width: 50%;
    height: 50%;
    position: absolute;
    top: 0;
    left: 0;
    animation: radar-beam 5s infinite;
    animation-timing-function: linear;
    transform-origin: bottom right;
    border-radius: 100% 0 0 0;
    z-index: 16;
  }

  @keyframes radar-beam {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes blips {
    14% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
    }
    14.0002% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
    }
    25% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
    }
    26% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
      opacity: 1;
    }
    100% {
      background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #20ff4d 30%, rgba(255, 255, 255, 0) 100%);
      opacity: 0;
    }
  }
</style>
<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>