<template>
  <div>
    <div class="navigation">匹配列表</div>
    <!--筛选-->
    <!--<div>-->
      <!--<el-select clearable class="mt-3 mr-4" v-model="code" placeholder="请选择" @change="changeCode">-->
        <!--<el-option-->
          <!--v-for="item in codes"-->
          <!--:key="item.code"-->
          <!--:label="item.name"-->
          <!--:value="item.code"-->
        <!--&gt;-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-date-picker-->
        <!--v-model="selDate"-->
        <!--type="datetimerange"-->
        <!--range-separator="-"-->
        <!--:picker-options="pickerOptions"-->
        <!--start-placeholder="开始筛选日期"-->
        <!--end-placeholder="结束筛选日期"-->
        <!--format="yyyy-MM-dd HH:mm:ss"-->
        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--@change = "changeSelDate"-->
      <!--&gt;-->
      <!--</el-date-picker>-->
      <!--<el-button type="primary" class="ml-4" @click="queryMac">查询</el-button>-->
    <!--</div>-->
    <!--&lt;!&ndash;人群采集&ndash;&gt;-->
    <!--<div class="mt-3">-->
      <!--<div class="maps">-->
        <!--&lt;!&ndash;<img src="https://s1.ax1x.com/2018/06/20/CzTjVs.png" alt="" style="width: 100%;height: 100%;">&ndash;&gt;-->
        <!--<maps :showBusiness="false" :showSearchBox="false" :model="false" :number="1"></maps>-->
        <!--&lt;!&ndash;-->
        <!--changeData map组件传值必须-->
        <!--showSearchBox   是否显示搜索框-->
        <!--model      是否是显示模式 或者点击模式-->
        <!--makers      参数形式-->
           <!--[-->
             <!--{-->
                 <!--position: [121.5273285, 31.21515044]-->
             <!--}-->
           <!--]-->
        <!--number   每调用一次必须不同的数值-->
        <!--lnglat   点击模式必须的参数，才能正常的传值 与 changeData组合-->
        <!--&ndash;&gt;-->
        <!--<div class="maptop"></div>-->
        <!--<div class="radar">-->
          <!--<div class="radartext">{{MatesTotal}}</div>-->

          <!--<transition-group-->
            <!--name="fade"-->
            <!--tag="ul"-->
          <!--&gt;-->
            <!--<li-->
              <!--v-for="(items, index) in dataset"-->
              <!--v-bind:key="index+1"-->
              <!--v-bind:data-index="index"-->
              <!--class="dot" :style="{left: items.left + 'px', top: items.right + 'px'}"-->
            <!--&gt;-->
            <!--</li>-->
          <!--</transition-group>-->

          <!--<div class="circleone circle">-->
            <!--<div class="circletwo circle"></div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--搜索-->
    <div class="mt-3">
      <div>
        <el-input
          class="inputStyle mr-4 mt-3"
          placeholder="请输入匹配名称/用户"
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
          @change = "changeTimes"
        >
        </el-date-picker>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="success" class="ml-4" @click="openAddDialog">新增匹配</el-button>
        <!--<router-link to="/mates/allPhone">-->
          <!--<el-button type="info" class="ml-4" @click="openAddDialog">所有手机号</el-button>-->
        <!--</router-link>-->
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
          prop="name"
          label="匹配名称"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="盒子ID"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.box_id == null || scope.row.box_id === '0' ">全部</span>
            <span v-else>{{scope.row.box_id}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_date"
          label="开始时间"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="end_date"
          label="结束时间"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="uname"
          label="用户"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="匹配数量"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.t_nums}}/{{scope.row.y_nums}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="距离范围"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.range_id===0">不限制</span>
            <span v-if="scope.row.range_id===1">50米内</span>
            <span v-if="scope.row.range_id===2">30米内</span>
            <span v-if="scope.row.range_id===3">10米内</span>
            <span v-if="scope.row.range_id===4">5米内</span>
          </template>
        </el-table-column>
        <el-table-column
          label="匹配状态"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status===0">计算中</span>
            <span v-if="scope.row.status===1">计算完成</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="扣费金额"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="times"
          label="创建时间"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="完成时间"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleDetails(scope.row.id)">详情</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index,scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="float-right mt-3">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 60, 80, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--新增对话框-->
    <el-dialog title="新增匹配" status-icon :visible.sync="addVisible" width="700px" center :before-close="handleAddClose">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="匹配名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子ID" :label-width="formLabelWidth" class="w-75">
          <el-select clearable v-model="addForm.code" placeholder="请选择" @change="changeCode">
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
        <el-form-item label="距离范围" :label-width="formLabelWidth" class="w-75">
          <el-select clearable v-model="addForm.range" placeholder="请选择" @change="changeRange">
            <el-option
              v-for="item in addForm.ranges"
              :key="item.range"
              :label="item.label"
              :value="item.range"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驻留时间" :label-width="formLabelWidth">
          <el-input placeholder="请输入最短时间" @change="changeMin" v-model="addForm.min_time" autocomplete="off" style="width: 42%;margin-right: 10px;">
            <template slot="prepend">最短(分)</template>
          </el-input>
          <el-input placeholder="请输入最长时间" @change="changeMax" v-model="addForm.max_time" autocomplete="off" style="width: 42%;">
            <template slot="prepend">最长(分)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="筛选日期" :label-width="formLabelWidth" prop="date">
          <el-date-picker
            v-model="addForm.date"
            type="datetimerange"
            range-separator="-"
            :picker-options="pickerOptions"
            start-placeholder="开始筛选日期"
            end-placeholder="结束筛选日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change = "changeDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计匹配数量" :label-width="formLabelWidth" prop="y_nums">
          <span>{{addForm.y_nums}}</span>
        </el-form-item>
        <el-form-item label="预计扣费" :label-width="formLabelWidth" prop="y_nums">
          <span>{{addForm.money}}元(备注：实际扣费按匹配数量计算)</span>
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
  import {
    mates,
    boxs,
    addMates,
    getMayNums,
    todaymac,
    deleteMate
  } from '@/apis/mates'
  export default {
    // components: {
    //   Maps
    // },
    data(){
      return{
        // interval: null,
        // interval1: null,
        dataset: [],
        circleNumber: 30,
        circlenumbers: null,
        selDate: [],
        codes: [],
        code: '',
        MatesTotal:0,
        list: [],
        loading: true,
        id: '',
        input: '',
        date: [],
        start_date: '',
        end_date: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
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
        formLabelWidth: '200px',
        addVisible: false,
        addForm: {
          name: '',
          min_time: 0,
          max_time: '不限',
          codes: [],
          code: '',
          ranges: [
            {
              label: '不限',
              range: 0
            },
            {
              label: '50米内',
              range: 1
            },
            {
              label: '30米内',
              range: 2
            },
            {
              label: '10米内',
              range: 3
            },
            {
              label: '5米内',
              range: 4
            },
          ],
          range: 0,
          date: [],
          start_date: '',
          end_date: '',
          y_nums: 0,
          money: '0.00'
        },
        addRules: {
          name: [
            { required: true, message: '请输入匹配名称', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '请输入筛选日期', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      // 'addForm.date':function(newVal, oldVal) {
      //   console.log(newVal, oldVal);
      //   if(newVal === null) {
      //     this.addForm.date = [];
      //   }
      // },
    },
    async mounted(){
      this.getMatesList();
      this.getBoxs();
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
      // const result = await boxs();
      // if(result.data.code === 200){
      //   result.data.data.forEach((item) => {
      //     this.codes.push({
      //       code: item.code,
      //       name: item.name
      //     })
      //   });
      // } else {
      //   this.$status(result.data.msg);
      // }

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
      // 匹配列表
      async getMatesList(){
        const result = await mates(this.id, this.start_date, this.end_date, this.input, this.currentPage, this.pageSize);
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
      // 获取盒子
      async getBoxs(){
        const result = await boxs();
        if(result.data.code === 200){
          result.data.data.forEach((item) => {
            this.addForm.codes.push({
              code: item.code,
              name: item.name,
              online: item.online
            })
          });
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
        this.getMatesList()
      },
      handleCurrentChange(val) {
        // console.log(`当前 ${val} 页`);
        this.currentPage = val;
        this.getMatesList()
      },
      // 新增对话框
      openAddDialog(){
        this.addVisible = true;
        this.addForm.name = '';
        this.addForm.min_time = 0;
        this.addForm.max_time = '不限';
        this.addForm.date = [];
        this.addForm.y_nums = 0;
        this.addForm.money = '0.00';
      },
      // 新增确认框
      submitAdd(formName){
        if(this.addForm.y_nums === 0){
          this.$status('预计匹配数量为0，请重新匹配');
          return false
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let params = {
                name: this.addForm.name,
                box_id: this.addForm.code,
                range_id: this.addForm.range,
                min_time: this.addForm.min_time,
                max_time: this.addForm.max_time,
                start_date: this.addForm.start_date,
                end_date: this.addForm.end_date,
                y_nums: this.addForm.y_nums,
                money: this.addForm.money
              };
              addMates(params).then((result)=>{
                // console.log('result:', result);
                if(result.data.code === 200){
                  this.getMatesList();
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
        }
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
      async getMayData(){
        if(this.addForm.max_time === '不限'){
          this.addForm.max_time = ''
        }
        const result = await getMayNums(this.addForm.code, this.addForm.range, this.addForm.min_time, this.addForm.max_time, this.addForm.start_date, this.addForm.end_date);
        if(result.data.code === 200){
          this.addForm.y_nums = result.data.data.count;
        } else {
          this.$status(result.data.msg);
        }
        this.addForm.money = result.data.data.total;
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
      // 新增筛选日期选择完之后触发
      changeDate(val){
        if (val == null) {
          this.start_date = '';
          this.end_date = '';
        }
        if(val.length > 0){
          this.addForm.start_date = val[0];
          this.addForm.end_date = val[1];
          this.getMayData();
        }
      },
      // 新增筛选盒子选择完之后触发
      changeCode(){
        if(this.addForm.date.length > 0){
          this.getMayData();
        } else {
          this.addForm.y_nums = 0;
          this.addForm.money = '0.00';
        }
      },
      // 新增筛选距离选择完之后触发
      changeRange(){
        if(this.addForm.date.length > 0){
          this.getMayData();
        } else {
          this.addForm.y_nums = 0;
          this.addForm.money = '0.00';
        }
      },
      // 新增最短时间填完之后触发
      changeMin(){
        if(this.addForm.date.length > 0){
          this.getMayData();
        } else {
          this.addForm.y_nums = 0;
          this.addForm.money = '0.00';
        }
      },
      // 新增最长时间填完之后触发
      changeMax(){
        if(this.addForm.date.length > 0){
          this.getMayData();
        } else {
          this.addForm.y_nums = 0;
          this.addForm.money = '0.00';
        }
      },
      // 查询
      async query(){
        this.getMatesList();
      },
      async handleDetails(id){
        this.$router.push({
          name: `details`,
          query: {
            id: id
          }
        })
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
      // 删除
      handleDelete(index, boxId) {
        let params = {
          id: boxId
        };
        this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMate(params).then((result)=> {
            if(result.data.code === 200) {
              this.list.splice(index, 1);
              this.total--;
              this.$message({
                type: 'success',
                message: result.data.msg
              });
            } else {
              this.$status(result.data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    }
  };
</script>

<style scoped>
  .inputStyle{
    width: 15%;
  }
</style>