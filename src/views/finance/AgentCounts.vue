<template>
  <div>
    <div class="navigation">财务管理/财务统计</div>
    <!--<div class="d-flex text-center justify-content-between">-->
      <!--&lt;!&ndash;账户余额&ndash;&gt;-->
      <!--<div class="mt-3 mr-4" style="width: 32%">-->
        <!--<div class="shadow p-5">-->
          <!--<p class="font-weight-bold">-->
            <!--<img src="../../assets/yue.png" alt="" style="width: 35px;height: 35px;">-->
            <!--账户余额-->
          <!--</p>-->
          <!--<p class="flow">{{balance}}</p>-->
        <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;累计充值&ndash;&gt;-->
      <!--<div class="mt-3 mr-4" style="width: 32%">-->
        <!--<div class="shadow p-5">-->
          <!--<p class="font-weight-bold">-->
            <!--<img src="../../assets/shouru.png" alt="" style="width: 35px;height: 35px;">-->
            <!--累计充值-->
          <!--</p>-->
          <!--<p class="flow">{{income}}</p>-->
        <!--</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;累计支出&ndash;&gt;-->
      <!--<div class="mt-3" style="width: 32%">-->
        <!--<div class="shadow p-5">-->
          <!--<p class="font-weight-bold">-->
            <!--<img src="../../assets/zhichu.png" alt="" style="width: 35px;height: 35px;">-->
            <!--累计支出-->
          <!--</p>-->
          <!--<p class="flow">{{pays}}</p>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--搜索-->
    <div class="mt-4">
      <el-input class="inputStyle mr-4" v-model="input" placeholder="请输入备注" @keyup.enter.native="query"></el-input>
      <el-select clearable v-model="type" placeholder="请选择操作类型" class="mr-4">
        <el-option
          v-for="item in types"
          :key="item.type"
          :label="item.label"
          :value="item.type"
        >
        </el-option>
      </el-select>
      <!--<el-select v-model="type" placeholder="请选择标识类型" class="mr-4">-->
      <!--<el-option-->
      <!--v-for="item in types"-->
      <!--:key="item.type"-->
      <!--:label="item.label"-->
      <!--:value="item.type"-->
      <!--&gt;-->
      <!--</el-option>-->
      <!--</el-select>-->
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
      <!--<el-button class="mx-4" type="info">导出excel</el-button>-->
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
          label="操作类型"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.types === 1">充值</span>
            <span v-else-if="scope.row.types === 2">匹配</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="contact"
          label="用户"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="b_money"
          label="操作前余额"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="金额"
          sortable
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
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          sortable
          width="320"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="times"
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
        :page-sizes="[10, 20, 40, 60, 80, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    counts
  } from "@/apis/finance";
  export default {
    name: "counts",
    data () {
      return {
        balance: '0.00',
        income: '0.00',
        pays: '0.00',
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
        editId: 0
      }
    },
    mounted(){
      this.getCountsList();
    },
    methods: {
      async getCountsList () {
        const result = await counts(this.$route.query.id, this.input, this.type, this.start_time, this.end_time, this.currentPage, this.pageSize);
        this.loading = false;
        if(result.data.code === 200){
          this.list = result.data.data.list;
          this.balance = result.data.data.balance;
          this.income = result.data.data.income;
          this.pays = result.data.data.pays;
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
        this.pageSize = val;
        this.getCountsList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getCountsList()
      },
      // 查询
      async query(){
        this.getCountsList()
      },
    }
  }
</script>

<style scoped>
  .inputStyle{
    width: 15%;
  }
  .flow{
    font-weight: 400;
    color: rgb(0, 172, 214);
    font-size: 28px;
  }
</style>