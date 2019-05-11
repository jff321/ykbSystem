<template>
  <div>
    <div class="navigation">财务管理/用户财务</div>
    <div class="mt-4">
      <el-input
        class="inputStyle mr-4 mt-3"
        placeholder="请输入账号/备注/说明"
        v-model="input"
        clearable
        @keyup.enter.native="query"
      >
      </el-input>
      <el-select clearable v-model="type" placeholder="请选择操作类型" class="mr-4">
        <el-option
          v-for="item in types"
          :key="item.type"
          :label="item.label"
          :value="item.type"
        >
        </el-option>
      </el-select>
      <el-date-picker
        class="mr-4"
        v-model="date"
        type="datetimerange"
        range-separator="-"
        :picker-options="pickerOptions"
        start-placeholder="开始提交日期"
        end-placeholder="结束提交日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change = "changeDate"
      >
      </el-date-picker>
      <el-button type="primary" @click="query">查询</el-button>
      <el-button class="mx-4" type="success" @click="exportExcel">导出excel</el-button>
    </div>
    <!--表格-->
    <div class="mt-4">
      <el-table
        :data="list"
        stripe
        :default-sort = "{prop: 'times', order: 'descending'}"
        :loading="loading"
        style="width: 100%">
        <el-table-column
          label="用户"
          prop="uname"
          sortable
          width="100"
        >
        </el-table-column>
        <el-table-column
          label="账号"
          prop="mobile"
          sortable
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="操作类型"
          sortable
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.types === 1">充值</span>
            <span v-if="scope.row.types === 2">匹配</span>
            <span v-if="scope.row.types === 3">拨号</span>
            <span v-if="scope.row.types === 4">短信</span>
            <span v-if="scope.row.types === 5">闪信</span>
            <span v-if="scope.row.types === 6">退款</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--label="数量"-->
          <!--prop="num"-->
          <!--sortable-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column
          prop="b_money"
          label="操作前余额"
          sortable
          width="130"
        >
        </el-table-column>
        <el-table-column
          label="金额"
          sortable
          width="110"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.model === 1" style="color: #67C23A;">+ {{scope.row.money}}</span>
            <span v-else style="color: #F56C6C;">- {{scope.row.money}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="a_money"
          label="操作后余额"
          sortable
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          sortable
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="intro"
          label="说明"
          sortable
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="times"
          label="更新时间"
          sortable
          width="200"
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
      :visible.sync="excelVisible"
      width="20%"
    >
      <span>{{excelText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="excelVisible = false">取 消</el-button>
        <a :href="exportLink" id="test">
          <el-button class="ml-3" type="primary" @click="excelVisible = false" :loading="isLoading">确定导出</el-button>
        </a>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    finance,
    usersFinance
  } from '@/apis/finance'
  export default {
    name: "BoxList",
    data(){
      return{
        group_id: Number(localStorage.getItem('group_id')),
        value1: '全部',
        input: '',
        types: [
          {
            type: 1,
            label: '充值'
          },
          {
            type: 2,
            label: '匹配'
          },
          {
            type: 3,
            label: '拨号'
          },
          {
            type: 4,
            label: '短信'
          },
          {
            type: 5,
            label: '闪信'
          },
          {
            type: 6,
            label: '退款'
          }
        ],
        type: '',
        start_time: '',
        end_time: '',
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
        date: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        list: [],
        editIndex: 0,
        editId: 0,
        excelVisible: false,
        exportLink: '',
        excelText: '数据获取中...',
        isLoading: true,
      }
    },
    mounted(){
      this.getMoneyList();
    },
    methods: {
      async getMoneyList () {
        const result = await finance('', this.input, this.type, this.start_time, this.end_time, this.currentPage, this.pageSize);
        this.loading = false;
        if(result.data.code === 200){
          this.list = result.data.data.list;
          this.total = result.data.data.count;
        } else if(result.data.code === 403){
          this.$noAuth(result.data.msg);
        } else {
          this.$status(result.data.msg);
        }
      },
      changeDate(val){
        if (val == null) {
          this.start_time = '';
          this.end_time = '';
        }
        if(val.length > 0){
          this.start_time = val[0];
          this.end_time = val[1];
        }
      },
      // 分页
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getMoneyList()
      },
      handleCurrentChange(val) {
        // console.log(`当前 ${val} 页`);
        this.currentPage = val;
        this.getMoneyList()
      },
      // 查询
      async query(){
        this.getMoneyList()
      },
      // 导出excel
      async exportExcel(){
        this.excelVisible = true;
        document.getElementById('test').onclick = function(ev){
          ev.preventDefault();
          // console.log('阻止a标签的默认行为');
        };
        const result = await usersFinance('', this.input, this.type, this.start_time, this.end_time);
        this.excelText = '数据获取完毕';
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
      }
    }
  }
</script>

<style scoped>
  .flow{
    font-weight: 400;
    color: rgb(0, 172, 214);
    font-size: 28px;
  }
  .inputStyle{
    width: 20%;
  }
</style>