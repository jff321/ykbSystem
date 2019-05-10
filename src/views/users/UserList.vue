<template>
  <div>
    <div class="my-3">
      <el-input class="w-25" v-model="input" placeholder="请输入登录账号/公司名称/负责人" @keyup.enter.native="query"></el-input>
      <el-button type="primary" class="mx-3" @click="query">查询</el-button>
      <el-button type="success" @click="openAddDialog">新增</el-button>
      <el-button class="mx-4" type="warning" @click="exportExcel">导出excel</el-button>
    </div>
    <!--用户列表-->
    <el-table
      class="mt-3"
      v-loading="loading"
      :data="list"
      :default-sort = "{prop: 'date', order: 'descending'}"
      style="width: 100%">
      <el-table-column
        width="120"
        prop="mobile"
        label="登录账号"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="balance"
        label="账户余额"
        sortable
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="frozen"
        label="累计消费"
        sortable
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="today"
        label="今日花费"
        sortable
        width="100"
      >
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="company"-->
        <!--label="所属代理"-->
        <!--sortable-->
        <!--width="120"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--label="公司LOGO"-->
      <!--sortable-->
      <!--width="120"-->
      <!--&gt;-->
      <!--<template slot-scope="scope">-->
      <!--<img :src="scope.row.logo_url" class="w-50">-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="uname"
        label="负责人"
        sortable
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="所属行业"
        sortable
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.trade_id === 0">其他</span>
          <span v-if="scope.row.trade_id === 1">生活服务</span>
          <span v-if="scope.row.trade_id === 2">家具家装</span>
          <span v-if="scope.row.trade_id === 3">服饰鞋包</span>
          <span v-if="scope.row.trade_id === 4">食品</span>
          <span v-if="scope.row.trade_id === 5">教育培训</span>
          <span v-if="scope.row.trade_id === 6">汽车</span>
          <span v-if="scope.row.trade_id === 7">房地产</span>
          <span v-if="scope.row.trade_id === 8">综合电商</span>
          <span v-if="scope.row.trade_id === 9">钟表首饰</span>
          <span v-if="scope.row.trade_id === 10">运动户外用品</span>
          <span v-if="scope.row.trade_id === 11">母婴儿童</span>
          <span v-if="scope.row.trade_id === 12">护肤彩妆</span>
          <span v-if="scope.row.trade_id === 13">日用百货</span>
          <span v-if="scope.row.trade_id === 14">数码家电</span>
          <span v-if="scope.row.trade_id === 15">自媒体</span>
          <span v-if="scope.row.trade_id === 16">交通运输</span>
          <span v-if="scope.row.trade_id === 17">金融</span>
          <span v-if="scope.row.trade_id === 18">旅游</span>
          <span v-if="scope.row.trade_id === 19">游戏</span>
          <span v-if="scope.row.trade_id === 20">软件应用</span>
          <span v-if="scope.row.trade_id === 21">网站门户</span>
          <span v-if="scope.row.trade_id === 22">商务服务</span>
          <span v-if="scope.row.trade_id === 23">文化娱乐</span>
          <span v-if="scope.row.trade_id === 24">虚拟</span>
          <span v-if="scope.row.trade_id === 25">法律服务</span>
          <span v-if="scope.row.trade_id === 26">安全安保</span>
          <span v-if="scope.row.trade_id === 27">节能环保</span>
          <span v-if="scope.row.trade_id === 28">工农业</span>
          <span v-if="scope.row.trade_id === 29">结婚服务</span>
          <span v-if="scope.row.trade_id === 30">餐饮美食</span>
          <span v-if="scope.row.trade_id === 31">零售百货</span>
          <span v-if="scope.row.trade_id === 32">机构协会</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所在地区"
        sortable
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.province_id && scope.row.city_id">{{CodeToText[scope.row.province_id]+""+CodeToText[scope.row.city_id]}}</span>
          <span v-else>未选择</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sms"
        label="短信"
        sortable
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="fms"
        label="闪信"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="mate"
        label="匹配"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="tel"
        label="拨号"
        sortable
      >
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="address"-->
      <!--label="地址"-->
      <!--sortable-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="times"
        label="创建时间"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="是否登录"
        sortable
        width="120px"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value= "1"
            :inactive-value= "0"
            @change="changeStatus(scope.row.id, scope.row.status)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="是否外呼"-->
      <!--sortable-->
      <!--width="120px"-->
      <!--&gt;-->
      <!--<template slot-scope="scope">-->
      <!--<el-switch-->
      <!--v-model="scope.row.is_outcall"-->
      <!--:active-value= "1"-->
      <!--:inactive-value= "0"-->
      <!--@change="changeStatus(scope.row.id, scope.row.status)"-->
      <!--&gt;-->
      <!--</el-switch>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作" width="250">
        <template slot-scope="scope" class="text-left border">
          <el-button
            size="mini"
            @click="handleRecharge(scope.row.id)">充值</el-button>
          <el-button
            size="mini"
            style="margin-right: 10px;"
            @click="handleEditShow(scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            style="margin-right: 10px;"
            class="mt-2 ml-0"
            @click="handleSet(scope.row.id)">设置</el-button>
          <el-button
            size="mini"
            class="mt-2 ml-0"
            style="margin-right: 10px;"
            @click="toLists(scope.row.id)">财务明细</el-button>
          <el-button
            size="mini"
            class="mt-2 ml-0"
            style="margin-right: 10px;"
            @click="handleBindBox(scope.row.id)">绑定盒子</el-button>
          <el-button
            size="mini"
            class="mt-2 ml-0"
            style="margin-right: 10px;"
            @click="toUsersBox(scope.row.id)">盒子明细</el-button>
          <el-button
            size="mini"
            class="mt-2 ml-0"
            style="margin-right: 10px;"
            @click="handleAgentPwd(scope.row.id)">修改密码</el-button>
          <el-button
            class="mt-2 ml-0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--用户分页-->
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
    <el-dialog title="新增用户" status-icon :visible.sync="addVisible" width="700px" center :before-close="handleAddClose">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="登录账号" :label-width="formLabelWidth" prop="mobile" required>
          <el-input v-model="addForm.mobile" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth" prop="pwd">
          <el-input type="password" v-model="addForm.pwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="epwd">
          <el-input type="password" v-model="addForm.epwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth" prop="company">
          <el-input v-model="addForm.company" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="短信签名" :label-width="formLabelWidth" prop="sign">
          <el-input v-model="addForm.sign" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="负责人" :label-width="formLabelWidth" prop="uname">
          <el-input v-model="addForm.uname" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="选择省市" :label-width="formLabelWidth">
          <el-cascader
            class="w-75"
            size="large"
            :options="addForm.options"
            v-model="addForm.selectedOptions"
            @change="addAddressChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="addForm.address" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="选择行业" :label-width="formLabelWidth">
          <el-select clearable v-model="addForm.trade_id" placeholder="请选择行业" class="w-75">
            <el-option
              v-for="item in addForm.trades"
              :key="item.trade_id"
              :label="item.trade"
              :value="item.trade_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信扣费单价（元/条）" :label-width="formLabelWidth" prop="sms">
          <el-input v-model.number="addForm.sms" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="闪信扣费单价（元/条）" :label-width="formLabelWidth" prop="fms">
          <el-input v-model.number="addForm.fms" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="匹配扣费单价（元/条）" :label-width="formLabelWidth" prop="mate">
          <el-input v-model.number="addForm.mate" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="拨号扣费单价（元/分钟）" :label-width="formLabelWidth" prop="tel">
          <el-input v-model.number="addForm.tel" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="是否登录" :label-width="formLabelWidth">
          <el-switch
            v-model="addForm.status"
            :active-value= "1"
            :inactive-value= "0"
          >
          </el-switch>
          <span class="mx-3">是否外呼</span>
          <el-switch
            v-model="addForm.is_outcall"
            :active-value= "1"
            :inactive-value= "0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="身份证" :label-width="formLabelWidth">
          <el-upload
            :headers="addForm.myHeaders"
            class="avatar-uploader"
            action="http://api.51miaozhuan.com/manage/upload/image"
            :limit="1"
            :show-file-list="false"
            :on-success="addCardSuccess"
          >
            <img v-if="addForm.cardUrl" :src="addForm.cardUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="营业执照" :label-width="formLabelWidth">
          <el-upload
            :headers="addForm.myHeaders"
            class="avatar-uploader"
            action="http://api.51miaozhuan.com/manage/upload/image"
            :limit="1"
            :show-file-list="false"
            :on-success="addLicenceSuccess"
          >
            <img v-if="addForm.licenceUrl" :src="addForm.licenceUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitAddAgent('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--充值对话框-->
    <el-dialog title="充值" :visible.sync="payVisible" width="700px" center :before-close="handlePayClose">
      <el-form :model="payForm" :rules="payRules" ref="payForm">
        <el-form-item label="登录账号 :" :label-width="formLabelWidth">
          <p>{{payForm.payAgent ? payForm.payAgent : '无'}}</p>
        </el-form-item>
        <el-form-item label="联系人 :" :label-width="formLabelWidth">
          <p>{{payForm.payContact}}</p>
        </el-form-item>
        <el-form-item label="账户余额 :" :label-width="formLabelWidth" >
          <p>{{payForm.payBalance ? payForm.payBalance : '0.00'}}元</p>
        </el-form-item>
        <el-form-item label="充值金额" :label-width="formLabelWidth" prop="pay">
          <el-input type="number" v-model.number="payForm.pay" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="payForm.remark" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payClose('payForm')">取 消</el-button>
        <el-button type="primary" @click="submitPay('payForm')" :disabled="buttonDisabled">{{payText}}</el-button>
      </div>
    </el-dialog>
    <!--编辑对话框-->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible" width="700px" center :before-close="handleEditClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="公司名称" :label-width="formLabelWidth" prop="company">
          <el-input v-model="ruleForm.company" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="短信签名" :label-width="formLabelWidth" prop="sign">
          <el-input v-model="ruleForm.sign" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="负责人" :label-width="formLabelWidth" prop="uname">
          <el-input v-model="ruleForm.uname" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="选择省市" :label-width="formLabelWidth">
          <el-cascader
            class="w-75"
            size="large"
            :options="ruleForm.options"
            v-model="ruleForm.selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="ruleForm.address" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="选择行业" :label-width="formLabelWidth">
          <el-select clearable v-model="ruleForm.trade_id" placeholder="请选择行业" class="w-75">
            <el-option
              v-for="item in ruleForm.trades"
              :key="item.trade_id"
              :label="item.trade"
              :value="item.trade_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否外呼" :label-width="formLabelWidth">
          <!--<el-switch-->
            <!--v-model="ruleForm.status"-->
            <!--:active-value= "1"-->
            <!--:inactive-value= "0"-->
          <!--&gt;-->
          <!--</el-switch>-->
          <!--<span class="mx-3">是否外呼</span>-->
          <el-switch
            v-model="ruleForm.is_outcall"
            :active-value= "1"
            :inactive-value= "0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="身份证" :label-width="formLabelWidth">
          <el-upload
            :headers="ruleForm.myHeaders"
            class="avatar-uploader"
            action="http://api.51miaozhuan.com/manage/upload/image"
            :limit="1"
            :show-file-list="false"
            :on-success="editCardSuccess"
          >
            <img v-if="ruleForm.cardUrl" :src="ruleForm.cardUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="营业执照" :label-width="formLabelWidth">
          <el-upload
            :headers="ruleForm.myHeaders"
            class="avatar-uploader"
            action="http://api.51miaozhuan.com/manage/upload/image"
            :limit="1"
            :show-file-list="false"
            :on-success="editLicenceSuccess"
          >
            <img v-if="ruleForm.licenceUrl" :src="ruleForm.licenceUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClose('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--设置对话框-->
    <el-dialog title="设置" :visible.sync="setDialogVisible" width="700px" center :before-close="setClose">
      <el-form :model="setForm" :rules="setRules" ref="setForm">
        <el-form-item label="短信扣费单价（元/条）" :label-width="formLabelWidth" prop="sms">
          <el-input type="number" v-model.number="setForm.sms" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="闪信扣费单价（元/条）" :label-width="formLabelWidth" prop="fms">
          <el-input type="number" v-model.number="setForm.fms" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="匹配扣费单价（元/条）" :label-width="formLabelWidth" prop="mate">
          <el-input type="number" v-model.number="setForm.mate" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="拨号扣费单价（元/分钟）" :label-width="formLabelWidth" prop="tel">
          <el-input type="number" v-model.number="setForm.tel" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSetDialog('setForm')">取 消</el-button>
        <el-button type="primary" @click="submitSet('setForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改密码对话框-->
    <el-dialog title="修改密码" :visible.sync="PwdVisible" width="700px" center :before-close="handlePwdClose">
      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdForm">
        <el-form-item label="登录账号 :" :label-width="formLabelWidth">
          <p>{{pwdForm.pwdAgent ? pwdForm.pwdAgent : '无'}}</p>
        </el-form-item>
        <el-form-item label="联系人 :" :label-width="formLabelWidth">
          <p>{{pwdForm.pwdContact ? pwdForm.pwdContact : '无'}}</p>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="pwd">
          <el-input type="password" v-model="pwdForm.pwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="pwd">
          <el-input type="password" v-model="pwdForm.epwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdClose('pwdForm')">取 消</el-button>
        <el-button type="primary" @click="submitPwd('pwdForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--绑定盒子对话框-->
    <el-dialog title="绑定盒子" :visible.sync="bindVisible" width="700px" center :before-close="handleBindClose">
      <el-form :model="bindForm" :rules="bindRules" ref="bindForm">
        <el-form-item label="盒子名称" :label-width="formLabelWidth" prop="name" required>
          <el-input v-model="bindForm.name" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子ID" :label-width="formLabelWidth" prop="code">
          <el-input v-model="bindForm.code" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子SIM" :label-width="formLabelWidth" prop="sim">
          <el-input v-model="bindForm.sim" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="选择省市" :label-width="formLabelWidth" prop="selectedOptions">
          <el-cascader
            class="w-75"
            size="large"
            :options="bindForm.options"
            v-model="bindForm.selectedOptions"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="盒子状态" :label-width="formLabelWidth">
          <el-switch
            v-model="bindForm.status"
            :active-value= "1"
            :inactive-value= "0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindClose('bindForm')">取 消</el-button>
        <el-button type="primary" @click="submitBindBox('bindForm')">确 定</el-button>
      </div>
    </el-dialog>
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
    usersList,
    change,
    addUser,
    showUser,
    commitAgent,
    deleteAgent,
    commitCost,
    commitPwd,
    commitPay,
    bindBox,
    exportUser
  } from "@/apis/users";
  import {
    provinceAndCityData ,
    CodeToText,
  } from 'element-china-area-data'
  export default {
    name: "users",
    data(){
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          // console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        CodeToText,
        tempList: [],
        list: [],
        loading: true,
        buttonDisabled: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        input: '',
        dialogFormVisible: false,
        ruleForm: {
          company: '',
          myHeaders:{
            authToken: localStorage.getItem('token')
          },
          options: provinceAndCityData,
          selectedOptions: [],
          address: '',
          cardUrl: '',
          licenceUrl: '',
          uname: '',
          sign: '',
          status: '',
          is_outcall: '',
          trades: [
            {
              trade_id: 1,
              trade: '生活服务'
            },
            {
              trade_id: 2,
              trade: '家具家装'
            },
            {
              trade_id: 3,
              trade: '服饰鞋包'
            },
            {
              trade_id: 4,
              trade: '食品'
            },
            {
              trade_id: 5,
              trade: '教育培训'
            },
            {
              trade_id: 6,
              trade: '汽车'
            },
            {
              trade_id: 7,
              trade: '房地产'
            },
            {
              trade_id: 8,
              trade: '综合电商'
            },
            {
              trade_id: 9,
              trade: '钟表首饰'
            },
            {
              trade_id: 10,
              trade: '运动户外用品'
            },
            {
              trade_id: 11,
              trade: '母婴儿童'
            },
            {
              trade_id: 12,
              trade: '护肤彩妆'
            },
            {
              trade_id: 13,
              trade: '日用百货'
            },
            {
              trade_id: 14,
              trade: '数码家电'
            },
            {
              trade_id: 15,
              trade: '自媒体'
            },
            {
              trade_id: 16,
              trade: '交通运输'
            },
            {
              trade_id: 17,
              trade: '金融'
            },
            {
              trade_id: 18,
              trade: '旅游'
            },
            {
              trade_id: 19,
              trade: '游戏'
            },
            {
              trade_id: 20,
              trade: '软件应用'
            },
            {
              trade_id: 21,
              trade: '网站门户'
            },
            {
              trade_id: 22,
              trade: '商务服务'
            },
            {
              trade_id: 23,
              trade: '文化娱乐'
            },
            {
              trade_id: 24,
              trade: '虚拟'
            },
            {
              trade_id: 25,
              trade: '法律服务'
            },
            {
              trade_id: 26,
              trade: '安全安保'
            },
            {
              trade_id: 27,
              trade: '节能环保'
            },
            {
              trade_id: 28,
              trade: '工农业'
            },
            {
              trade_id: 29,
              trade: '结婚服务'
            },
            {
              trade_id: 30,
              trade: '餐饮美食'
            },
            {
              trade_id: 31,
              trade: '零售百货'
            },
            {
              trade_id: 32,
              trade: '机构协会'
            },
            {
              trade_id: 0,
              trade: '其他'
            }
          ],
          trade_id: '',
        },
        // userPayIndex: 0,
        userPayId: 0,
        userEditId: 0,
        // userEditIndex: 0,
        // userSetIndex: 0,
        userSetId: 0,
        userRechargeId: 0,
        userRechargeIndex: 0,
        // userPwdIndex: 0,
        userPwdId: 0,
        formLabelWidth: '200px',
        rules: {
          company: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
          ],
          uname: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '请输入短信签名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
        },
        setDialogVisible: false,
        setForm:{
          sms: '',
          fms: '',
          mate: '',
          tel: ''
        },
        setRules: {
          sms: [
            { required: true, message: '请输入短信扣费单价（元/条）', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ],
          fms: [
            { required: true, message: '请输入闪信扣费单价（元/条）', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ],
          mate: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ],
          tel: [
            { required: true, message: '请选择拨号扣费单价（元/分钟）', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ]
        },
        PwdVisible: false,
        pwdForm: {
          pwdAgent: '',
          pwdContact: '',
          pwd: '',
          epwd: ''
        },
        pwdRules: {
          pwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          epwd: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ]
        },
        addVisible: false,
        addForm: {
          mobile: '',
          pwd: '',
          epwd: '',
          company: '',
          myHeaders:{
            authToken: localStorage.getItem('token')
          },
          options: provinceAndCityData,
          selectedOptions: [],
          address: '',
          cardUrl: '',
          licenceUrl: '',
          uname: '',
          sign: '',
          sms: '',
          fms: '',
          mate: '',
          tel: '',
          status: '',
          is_outcall: '',
          trades: [
            {
              trade_id: 1,
              trade: '生活服务'
            },
            {
              trade_id: 2,
              trade: '家具家装'
            },
            {
              trade_id: 3,
              trade: '服饰鞋包'
            },
            {
              trade_id: 4,
              trade: '食品'
            },
            {
              trade_id: 5,
              trade: '教育培训'
            },
            {
              trade_id: 6,
              trade: '汽车'
            },
            {
              trade_id: 7,
              trade: '房地产'
            },
            {
              trade_id: 8,
              trade: '综合电商'
            },
            {
              trade_id: 9,
              trade: '钟表首饰'
            },
            {
              trade_id: 10,
              trade: '运动户外用品'
            },
            {
              trade_id: 11,
              trade: '母婴儿童'
            },
            {
              trade_id: 12,
              trade: '护肤彩妆'
            },
            {
              trade_id: 13,
              trade: '日用百货'
            },
            {
              trade_id: 14,
              trade: '数码家电'
            },
            {
              trade_id: 15,
              trade: '自媒体'
            },
            {
              trade_id: 16,
              trade: '交通运输'
            },
            {
              trade_id: 17,
              trade: '金融'
            },
            {
              trade_id: 18,
              trade: '旅游'
            },
            {
              trade_id: 19,
              trade: '游戏'
            },
            {
              trade_id: 20,
              trade: '软件应用'
            },
            {
              trade_id: 21,
              trade: '网站门户'
            },
            {
              trade_id: 22,
              trade: '商务服务'
            },
            {
              trade_id: 23,
              trade: '文化娱乐'
            },
            {
              trade_id: 24,
              trade: '虚拟'
            },
            {
              trade_id: 25,
              trade: '法律服务'
            },
            {
              trade_id: 26,
              trade: '安全安保'
            },
            {
              trade_id: 27,
              trade: '节能环保'
            },
            {
              trade_id: 28,
              trade: '工农业'
            },
            {
              trade_id: 29,
              trade: '结婚服务'
            },
            {
              trade_id: 30,
              trade: '餐饮美食'
            },
            {
              trade_id: 31,
              trade: '零售百货'
            },
            {
              trade_id: 32,
              trade: '机构协会'
            },
            {
              trade_id: 0,
              trade: '其他'
            }
          ],
          trade_id: '',
        },
        addRules: {
          mobile: [
            {validator: checkPhone, trigger: 'blur'}
          ],
          pwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          epwd: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ],
          uname: [
            { required: true, message: '请输入负责人', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '请输入短信签名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          sms: [
            { required: true, message: '请输入短信扣费单价（元/条）', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ],
          fms: [
            { required: true, message: '请输入闪信扣费单价（元/条）', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ],
          mate: [
            { required: true, message: '请输入匹配扣费单价（元/条）', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ],
          tel: [
            { required: true, message: '请选择拨号扣费单价（元/分钟）', trigger: 'blur' },
            { type: 'number', message: '金额必须为数字', trigger: 'blur'}
          ]
        },
        bindVisible: false,
        userBindId: 0,
        // userBindIndex: 0,
        bindForm: {
          name: '',
          code: '',
          sim: '',
          status: 0,
          options: provinceAndCityData,
          selectedOptions: [],
        },
        bindRules: {
          name: [
            { required: true, message: '请输入盒子名称', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入盒子ID', trigger: 'blur' },
            { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
          ],
          sim: [
            { required: true, message: '请输入盒子SIM', trigger: 'blur' },
            { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
          ],
          selectedOptions: [
            { required: true, message: '请选择所在地区', trigger: 'blur' },
          ]
        },
        payVisible: false,
        payText: '充值',
        payForm: {
          payAgent: '',
          payContact: '',
          payBalance: '',
          pay: '',
          remark: ''
        },
        payRules: {
          pay: [
            { required: true, message: '请输入充值金额'},
            { type: 'number', message: '金额必须为数字', min: 0}
          ],
        },
        excelVisible: false,
        exportLink: '',
        excelText: '数据获取中...',
        isLoading: true,
      }
    },
    async mounted(){
      this.getUserList();
    },
    methods: {
      async getUserList(){
        const result = await usersList(this.input, this.currentPage, this.pageSize);
        this.loading = false;
        if(result.data.code === 200){
          this.list = result.data.data.list;
          this.tempList = result.data.data.list;
          this.total = result.data.data.count;
        } else if(result.data.code === 403){
          this.$noAuth(result.data.msg);
        } else {
          this.$status(result.data.msg);
        }
      },
      // 选择地址并赋值
      addAddressChange(value){
        // 新增对话框
        this.addForm.address = CodeToText[value[0]]+""+CodeToText[value[1]];
      },
      handleChange (value) {
        // 编辑对话框
        this.ruleForm.address = CodeToText[value[0]]+""+CodeToText[value[1]];
      },
      // 新增对话框
      openAddDialog(){
        this.addVisible = true;
        this.addForm.mobile = '';
        this.addForm.pwd = '';
        this.addForm.epwd = '';
        this.addForm.company = '';
        this.addForm.cardUrl = '';
        this.addForm.licenceUrl = '';
        this.addForm.uname = '';
        this.addForm.sign = '';
        this.addForm.selectedOptions = [];
        this.addForm.address = '';
        this.addForm.sms = '';
        this.addForm.fms = '';
        this.addForm.mate = '';
        this.addForm.tel = '';
        this.addForm.status = 1;
        this.addForm.trade_id = '';
      },
      // 新增确认提交
      submitAddAgent(formName){
        // console.log('新增');
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              mobile: this.addForm.mobile,
              pwd: this.addForm.pwd,
              epwd: this.addForm.epwd,
              company: this.addForm.company,
              uname: this.addForm.uname,
              sign: this.addForm.sign,
              id_url: this.addForm.cardUrl,
              biz_url: this.addForm.licenceUrl,
              province_id: this.addForm.selectedOptions[0],
              city_id: this.addForm.selectedOptions[1],
              address: this.addForm.address,
              sms: this.addForm.sms,
              fms: this.addForm.fms,
              mate: this.addForm.mate,
              tel: this.addForm.tel,
              status: this.addForm.status,
              trade_id: this.addForm.trade_id
            };
            addUser(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.getUserList();
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
      async query(){
        this.getUserList()
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getUserList()
      },
      handleCurrentChange(val) {
        // console.log(`当前 ${val} 页`);
        this.currentPage = val;
        this.getUserList()
      },
      // 编辑对话框
      async handleEditShow(userId) {
        // this.userEditIndex = index;
        this.userEditId = userId;
        const result = await showUser(userId);
        if (result.data.code === 200) {
          // console.log('result:', result);
          this.dialogFormVisible = true;
          this.ruleForm.company = result.data.data.company;
          this.ruleForm.sign = result.data.data.sign;
          this.ruleForm.cardUrl = result.data.data.id_url;
          this.ruleForm.licenceUrl = result.data.data.biz_url;
          this.ruleForm.uname = result.data.data.uname;
          this.ruleForm.selectedOptions = [(result.data.data.province_id).toString(), (result.data.data.city_id).toString()];
          this.ruleForm.address = result.data.data.address;
          this.ruleForm.trade_id = result.data.data.trade_id;
          this.ruleForm.status = result.data.data.status;
          this.ruleForm.is_outcall = result.data.data.is_outcall;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 编辑提交表单
      submit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              company: this.ruleForm.company,
              logo_url: this.ruleForm.imageUrl,
              uname: this.ruleForm.uname,
              id_url: this.ruleForm.cardUrl,
              biz_url: this.ruleForm.licenceUrl,
              province_id: this.ruleForm.selectedOptions[0],
              city_id: this.ruleForm.selectedOptions[1],
              address: this.ruleForm.address,
              status: this.ruleForm.status,
              is_outcall: this.ruleForm.is_outcall,
              sign: this.ruleForm.sign,
              trade_id: this.ruleForm.trade_id
            };
            commitAgent(this.userEditId, params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.list.find(x => x.id === this.userEditId).company = this.ruleForm.company;
                this.list.find(x => x.id === this.userEditId).logo_url = this.ruleForm.imageUrl;
                this.list.find(x => x.id === this.userEditId).contact = this.ruleForm.contact;
                this.list.find(x => x.id === this.userEditId).address = this.ruleForm.address;
                this.list.find(x => x.id === this.userEditId).status = this.ruleForm.status;
                this.list.find(x => x.id === this.userEditId).is_outcall = this.ruleForm.is_outcall;
                this.list.find(x => x.id === this.userEditId).trade_id = this.ruleForm.trade_id;
                this.dialogFormVisible = false;
              } else {
                this.$status(result.data.msg);
              }
            });
          } else {
            return false;
          }
        });
      },
      // 删除
      handleDelete(index, userId) {
        this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAgent(userId).then((result)=> {
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
      // 设置显示
      async handleSet(userId){
        // this.userSetIndex = index;
        this.userSetId = userId;
        const result = await showUser(userId);
        if (result.data.code === 200) {
          this.setDialogVisible = true;
          // ？？？此处字段名没有  新增之后才有
          this.setForm.sms = result.data.data.setting.sms;
          this.setForm.fms = result.data.data.setting.fms;
          this.setForm.mate = result.data.data.setting.mate;
          this.setForm.tel = result.data.data.setting.tel;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 设置提交
      submitSet(formName){
        // console.log(this.userSetId);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              id: this.userSetId,
              sms: this.setForm.sms,
              fms: this.setForm.fms,
              mate: this.setForm.mate,
              tel: this.setForm.tel
            };
            commitCost(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.list.find(x => x.id === this.userSetId).sms = this.setForm.sms;
                this.list.find(x => x.id === this.userSetId).fms = this.setForm.fms;
                this.list.find(x => x.id === this.userSetId).mate = this.setForm.mate;
                this.list.find(x => x.id === this.userSetId).tel = this.setForm.tel;
                this.setDialogVisible = false;
              } else {
                this.$status(result.data.msg);
              }
            });
          } else {
            return false;
          }
        });
      },
      // 修改密码显示
      async handleAgentPwd(userId){
        this.pwdForm.pwd = '';
        this.pwdForm.epwd = '';
        // this.userPwdIndex = index;
        this.userPwdId = userId;
        const result = await showUser(userId);
        if (result.data.code === 200) {
          this.PwdVisible = true;
          this.pwdForm.pwdAgent = result.data.data.mobile;
          this.pwdForm.pwdContact = result.data.data.contact;
          this.pwdForm.balance = result.data.data.balance;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 修改密码提交
      submitPwd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              id: this.userPwdId,
              pwd: this.pwdForm.pwd,
              epwd: this.pwdForm.epwd
            };
            commitPwd(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.PwdVisible = false;
              } else {
                this.$status(result.data.msg);
              }
            });
          } else {
            return false;
          }
        });
      },
      // 启用/禁用用户登录状态
      async changeStatus(id, status){
        // console.log(id, status);
        let params = {
          id: id,
          types: status
        };
        const result = await change(params);
        if (result.data.code !== 200){
          this.$status(result.data.msg);
        }
      },
      // 新增上传身份证
      addCardSuccess(result){
        // console.log(1);
        if (result.code === 200) {
          this.addForm.cardUrl = result.data.big_url;
        } else {
          this.$status(result.msg);
        }
      },
      // 新增上传营业执照
      addLicenceSuccess(result){
        if (result.code === 200) {
          this.addForm.licenceUrl = result.data.big_url;
        } else {
          this.$status(result.msg);
        }
      },
      // 编辑上传身份证
      editCardSuccess(result){
        if (result.code === 200) {
          this.ruleForm.cardUrl = result.data.big_url;
        } else {
          this.$status(result.msg);
        }
      },
      // 编辑上传营业执照
      editLicenceSuccess(result){
        if (result.code === 200) {
          this.ruleForm.licenceUrl = result.data.big_url;
        } else {
          this.$status(result.msg);
        }
      },
      // 绑定盒子对话框
      handleBindBox(userId){
        this.userBindId = userId;
        // this.userBindIndex = index;
        this.bindVisible = true;
        this.bindForm.name = '';
        this.bindForm.code = '';
        this.bindForm.sim = '';
        this.bindForm.status = '';
        this.bindForm.selectedOptions = [];
      },
      // 绑定盒子确认框
      submitBindBox(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              uid: this.userBindId,
              name: this.bindForm.name,
              code: this.bindForm.code,
              sim: this.bindForm.sim,
              status: this.bindForm.status,
              province_id: this.bindForm.selectedOptions[0],
              city_id: this.bindForm.selectedOptions[1],
            };
            bindBox(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.bindVisible = false;
              } else {
                this.$status(result.data.msg);
              }
            });
          } else {
            return false;
          }
        });
      },
      // 新增弹框取消按钮
      closeAddDialog(formName){
        this.addVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 新增弹框关闭按钮
      handleAddClose(){
        this.closeAddDialog('addForm');
      },
      // 设置弹框取消按钮
      closeSetDialog(formName){
        this.setDialogVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 设置弹框关闭按钮
      setClose(){
        this.closeSetDialog('setForm');
      },
      // 编辑弹框取消按钮
      editClose(formName){
        this.dialogFormVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 编辑弹框关闭按钮
      handleEditClose(){
        this.editClose('ruleForm');
      },
      // 绑定盒子弹框取消按钮
      bindClose(formName){
        this.bindVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 绑定盒子弹框关闭按钮
      handleBindClose(){
        this.bindClose('bindForm');
      },
      // 修改密码弹框取消按钮
      pwdClose(formName){
        this.PwdVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 修改密码弹框关闭按钮
      handlePwdClose(){
        this.pwdClose('pwdForm');
      },
      // 充值显示
      async handleRecharge(userId){
        this.buttonDisabled = false;
        this.payText = '充值';
        this.payForm.pay = '';
        this.payForm.remark = '';
        // this.userPayIndex = index;
        this.userPayId = userId;
        const result = await showUser(userId);
        if (result.data.code === 200) {
          this.payVisible = true;
          this.payForm.payAgent = result.data.data.mobile;
          this.payForm.payContact = result.data.data.uname;
          this.payForm.payBalance = result.data.data.balance;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 充值提交
      submitPay(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttonDisabled = true;
            this.payText = '充值中...';
            let params = {
              id: this.userPayId,
              money: this.payForm.pay,
              intro: this.payForm.remark
            };
            commitPay(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.list.find(x => x.id === this.userPayId).balance = Number(this.list.find(x => x.id === this.userPayId).balance) +  Number(this.payForm.pay);
                this.buttonDisabled = false;
                this.payText = '充值';
                // console.log(this.list[this.userPayIndex].balance);
                this.payVisible = false;
              } else {
                this.$status(result.data.msg);
                this.buttonDisabled = false;
                this.payText = '充值';
              }
            });
          } else {
            return false;
          }
        });
      },
      // 充值弹框取消按钮
      payClose(formName){
        this.payVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 充值弹框关闭按钮
      handlePayClose(){
        this.payClose('payForm');
      },
      toLists(id){
        this.$router.push({
          name: 'userLists',
          query: {
            id: id
          }
        })
      },
      toUsersBox(id){
        this.$router.push({
          name: 'usersBox',
          query: {
            id: id
          }
        })
      },
      // 导出excel
      async exportExcel(){
        this.excelVisible = true;
        document.getElementById('test').onclick = function(ev){
          ev.preventDefault();
          // console.log('阻止a标签的默认行为');
        };
        const result = await exportUser(this.input);
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
      },
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
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
