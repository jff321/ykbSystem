<template>
  <div>
    <!--搜索-->
    <div class="mt-3">
      <div>
        <el-input
          class="inputStyle mr-4 mt-3"
          placeholder="请输入MAC/手机号"
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
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="success" @click="exportDetailMac">导出excel</el-button>
        <!--<download-excel-->
          <!--class="d-inline-block ml-4"-->
          <!--:data = "list"-->
          <!--:fields = "json_fields"-->
          <!--name = "匹配列表.xls">-->
          <!--&lt;!&ndash; 上面可以自定义自己的样式，还可以引用其他组件button &ndash;&gt;-->
          <!--<el-button type="success">导出</el-button>-->
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
        <el-table-column
          label="手机号"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="group_id === 3" @click="modifyPhone(scope.$index, scope.row.mac_id, scope.row.id)" style="cursor: pointer">{{scope.row.phone}}</span>
            <span v-else>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone_name"
          label="机型"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="imei"
          label="IMEI"
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
          <template slot-scope="scope">{{Math.floor(scope.row.stoptime / 60)}}</template>
        </el-table-column>
        <el-table-column
          label="是否通话"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.is_call ? '有' : '没有'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="times"
          label="完成时间"
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
        :page-sizes="[10, 20, 40, 60, 80, 100]"
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
    <!--修改手机号-->
    <el-dialog
      title="修正手机号"
      :visible.sync="phoneVisible"
      width="20%"
    >
      <!--<el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">-->
        <el-input v-model="phone" autocomplete="off" placeholder="请输入修正手机号"></el-input>
      <!--</el-form-item>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="phoneVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmPhone(phone)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import JsonExcel from 'vue-json-excel'
  // Vue.component('downloadExcel', JsonExcel);
  import {
    details,
    mateDetailMac,
    modify
  } from "@/apis/mates";
  export default {
    name: "Details",
    data(){
      return {
        group_id: Number(localStorage.getItem('group_id')),
        list: [],
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
        //   "手机号": "phone",
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
        phoneVisible: false,
        // macIndex: '',
        macId: 0,
        id: 0,
        phone: '',
        formLabelWidth: '120px'
      }
    },
    mounted(){
      this.getDetailList();
    },
    methods: {
      async getDetailList(){
        // console.log('this.end_date:', this.end_date);
        const result = await details(this.$route.query.id, this.input, this.currentPage, this.pageSize, this.start_date, this.end_date);
        this.loading = false;
        if(result.data.code === 200){
          result.data.data.list.forEach(function (item) {
            let date = new Date(parseInt(item.create_time) * 1000);
            let Y = date.getFullYear() + '-';
            let M = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            item.create_time = Y+M+D+h+m+s;
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
      async exportDetailMac(){
        this.macVisible = true;
        document.getElementById('test').onclick = function(ev){
          ev.preventDefault();
          // console.log('阻止a标签的默认行为');
        };
        const result = await mateDetailMac(this.$route.query.id, this.start_date, this.end_date, this.input);
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
      modifyPhone(index, mac_id, id){
        this.phoneVisible = true;
        // this.macIndex = index; // 用于保存
        this.macId = mac_id;
        this.id = id;
      },
      async confirmPhone(phone){
        if(!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phone))){
          this.$status('请输入正确的手机号');
        } else {
          return false;
        }
        let params = {
          id: this.macId,
          phone: phone
        };
        const result = await modify(params);
        if(result.data.code === 200){
          this.phoneVisible = false;
          this.list.find(x => x.id === this.id).phone = phone;
        } else {
          this.phoneVisible = false;
          this.$status(result.data.msg);
        }
      }
    }
  }
</script>

<style scoped>
  .inputStyle{
    width: 15%;
  }
</style>