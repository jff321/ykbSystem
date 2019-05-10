<template>
  <div>
    <div class="navigation">财务管理/客户充值</div>
    <!--搜索-->
    <div class="mt-3">
      <div>
        <el-input
          class="inputStyle mr-4"
          placeholder="账号名称"
          v-model="inputName"
          clearable>
        </el-input>
        <el-input
          class="inputStyle mr-4"
          placeholder="账号余额"
          v-model="inputName"
          clearable>
        </el-input>
        <el-button type="primary">查询</el-button>
        <el-button type="success" class="ml-4" @click="dialogFormVisible = true">充值</el-button>
      </div>
    </div>
    <!--表格-->
    <div class="mt-3">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="date"
          label="账号名称"
          style="width: 33.3%;"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          label="充值方式"
          style="width: 33.3%;"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          label="充值金额"
          style="width: 33.3%;"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          label="支付方式"
          style="width: 33.3%;"
        >
        </el-table-column>
        <el-table-column
          prop="date"
          label="备注信息"
          style="width: 33.3%;"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="账户余额（元）"
          style="width: 33.3%;"
        >
        </el-table-column>
        <el-table-column
        label="操作"
        >
        <template slot-scope="scope">
        <el-button
        size="mini"
        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
        size="mini"
        type="danger"
        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
      <div class="mt-3 float-right">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000">
        </el-pagination>
      </div>
    </div>
    <!--充值对话框-->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账户名称(登录手机号)" :label-width="formLabelWidth">
          <el-input class="w-75" v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" :label-width="formLabelWidth">
          <el-input class="w-75" v-model="form.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" :label-width="formLabelWidth">
          <el-select clearable v-model="form.method" placeholder="请选择支付方式">
            <el-option label="微信" value="weixin"></el-option>
            <el-option label="支付宝" value="zhifubao"></el-option>
            <el-option label="银行卡" value="yinhangka"></el-option>
            <el-option label="线下" value="xianxia"></el-option>
            <el-option label="其它" value="qita"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" :label-width="formLabelWidth">
          <el-input class="w-75" type="textarea" v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "BoxList",
    data(){
      return{
        inputName: '',
        tableData: [
          // {
          //   date: '2016-05-01',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1519 弄'
          // },
          // {
          //   date: '2016-05-03',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1516 弄'
          // },
          // {
          //   date: '2016-05-02',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1518 弄'
          // },
          // {
          //   date: '2016-05-04',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1517 弄'
          // },
          // {
          //   date: '2016-05-01',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1519 弄'
          // },
          // {
          //   date: '2016-05-03',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1516 弄'
          // },
          // {
          //   date: '2016-05-02',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1518 弄'
          // },
          // {
          //   date: '2016-05-04',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1517 弄'
          // },
          // {
          //   date: '2016-05-01',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1519 弄'
          // },
          // {
          //   date: '2016-05-03',
          //   name: '王小虎',
          //   address: '上海市普陀区金沙江路 1516 弄'
          // }
        ],
        dialogFormVisible: false,
        form: {
          phone: '',
          money: '',
          method: '',
          remark: '',
          // date1: '',
          // date2: '',
          // delivery: false,
          // type: [],
          // resource: '',
          // desc: ''
        },
        formLabelWidth: '180px'
      }
    }
  }
</script>

<style scoped>
  @import "../common.css";
  .el-dialog{
    width: 35%!important;
  }
</style>