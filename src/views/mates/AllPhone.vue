<template>
  <div>
    <div class="navigation">所有手机号</div>
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
        <el-button type="primary" class="mx-3" @click="query">查询</el-button>
        <el-button type="success" @click="exportDetailMac">导出excel</el-button>
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
  </div>
</template>

<script>
  import { allPhone, exportAllPhone } from '@/apis/mates'
  export default {
    name: "allPhone",
    data(){
      return {
        group_id: Number(localStorage.getItem('group_id')),
        list: [],
        loading: true,
        input: '',
        start_date: '',
        end_date: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
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
        macVisible: false,
        exportLink: '',
        macText: '数据获取中...',
        isLoading: true,
      }
    },
    mounted(){
      this.getAllPhone();
    },
    methods: {
      // 匹配列表
      async getAllPhone(){
        const result = await allPhone(this.start_date, this.end_date, this.input, this.currentPage, this.pageSize);
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
      query(){
        this.getAllPhone()
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
      // 导出手机号
      async exportDetailMac(){
        this.macVisible = true;
        document.getElementById('test').onclick = function(ev){
          ev.preventDefault();
          // console.log('阻止a标签的默认行为');
        };
        const result = await exportAllPhone(this.start_date, this.end_date, this.input, this.currentPage, this.pageSize);
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
    }
  }
</script>

<style scoped>
  .inputStyle{
    width: 15%;
  }
</style>