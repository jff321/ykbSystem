<template>
  <div>
    <div class="navigation">短信管理/短信报表</div>
    <div>
      <el-input
        class="inputStyle mr-4 mt-3"
        placeholder="请输入用户/账号"
        v-model="input"
        clearable
        @keyup.enter.native="query"
      >
      </el-input>
      <el-select clearable v-model="type" placeholder="请选择模板类型" class="mr-4">
        <el-option
          v-for="item in types"
          :key="item.type"
          :label="item.label"
          :value="item.type"
        >
        </el-option>
      </el-select>
      <el-date-picker
        class="mr-4 mt-3"
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
      <el-button type="primary" class="mr-3 mt-3" @click="query">查询</el-button>
      <el-button type="warning" @click="exportMacExcel">导出excel</el-button>
    </div>
    <!--表格-->
    <div class="mt-3">
      <el-table
        v-loading="loading"
        :data="list"
        stripe
        :default-sort = "{prop: 'times', order: 'descending'}"
        style="width: 100%">
        <el-table-column
          prop="uname"
          label="用户"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="账号"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="类型"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.types === 1">短信</span>
            <span v-if="scope.row.types === 2">闪信</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ren"
          label="触达人数"
          :sortable="true"
          :sort-method="sortByRen"
        >
        </el-table-column>
        <el-table-column
          prop="nums"
          label="总数量"
          :sortable="true"
          :sort-method="sortByNums"
        >
        </el-table-column>
        <el-table-column
          prop="suc_nums"
          label="成功数量"
          :sortable="true"
          :sort-method="sortBySucNums"
        >
        </el-table-column>
        <el-table-column
          prop="fail_nums"
          label="失败数量"
          :sortable="true"
          :sort-method="sortByFailNums"
        >
        </el-table-column>
        <el-table-column
          prop="money"
          label="实际消费"
          :sortable="true"
          :sort-method="sortByMoney"
        >
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="price"-->
          <!--label="单价"-->
          <!--sortable-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column
          prop="times"
          label="提交时间"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="toSmsLog(scope.row.id)">发送明细</el-button>
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
  import {
    usersms,
    exportSms
  } from '@/apis/sms'
  export default {
    name: "Template",
    data(){
      return{
        group_id: Number(localStorage.getItem('group_id')),
        input: '',
        types: [
          {
            type: 1,
            label: '短信'
          },
          {
            type: 2,
            label: '闪信'
          },
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
        list: [],
        loading: true,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        macVisible: false,
        exportLink: '',
        macText: '数据获取中...',
        isLoading: true,
      }
    },
    mounted(){
      this.getSmsList();
    },
    methods: {
      // 短信列表
      async getSmsList(){
        const result = await usersms(this.input, this.type, this.start_time, this.end_time, this.currentPage, this.pageSize);
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
      // 分页
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getSmsList()
      },
      handleCurrentChange(val) {
        // console.log(`当前 ${val} 页`);
        this.currentPage = val;
        this.getSmsList()
      },

      // 查询
      async query(){
        this.getSmsList();
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
      // 导出excel
      async exportMacExcel(){
        this.macVisible = true;
        document.getElementById('test').onclick = function(ev){
          ev.preventDefault();
          // console.log('阻止a标签的默认行为');
        };
        const result = await exportSms(this.input, this.type, this.start_time, this.end_time);
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
      toSmsLog(id){
        this.$router.push({
          path: '/sms/smslog',
          query: {
            id: id
          }
        })
      },
      // 按总数量排序
      sortByNums(obj1, obj2){
        let val1 = Number(obj1.nums);
        let val2 = Number(obj2.nums);
        return val1 - val2
      },
      // 按成功数量排序
      sortBySucNums(obj1, obj2){
        let val1 = Number(obj1.suc_nums);
        let val2 = Number(obj2.suc_nums);
        return val1 - val2
      },
      // 按失败数量排序
      sortByFailNums(obj1, obj2){
        let val1 = Number(obj1.fail_nums);
        let val2 = Number(obj2.fail_nums);
        return val1 - val2
      },
      // 按实际消费排序
      sortByMoney(obj1, obj2){
        let val1 = Number(obj1.money);
        let val2 = Number(obj2.money);
        return val1 - val2
      },
      // 按触达人数排序
      sortByRen(obj1, obj2){
        let val1 = Number(obj1.ren);
        let val2 = Number(obj2.ren);
        return val1 - val2
      },
    }
  }
</script>

<style scoped>
.inputStyle{
  width: 15%;
}
</style>