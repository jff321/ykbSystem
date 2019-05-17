<template>
  <div>
    <div class="my-3">
      <el-input class="w-25" v-model="input" placeholder="请输入登录账号/公司名称/联系人" @keyup.enter.native="query"></el-input>
      <el-button type="primary" class="mx-3" @click="query">查询</el-button>
      <el-button type="success" @click="openAddDialog">新增</el-button>
    </div>
    <!--代理列表-->
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
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司名称"
        sortable
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="公司LOGO"
        sortable
        width="120"
      >
        <template slot-scope="scope">
          <viewer>
            <img :src="scope.row.logo_url" class="w-50">
          </viewer>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="a_domain"-->
        <!--label="前台域名"-->
        <!--sortable-->
        <!--width="160"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="b_domain"-->
        <!--label="后台域名"-->
        <!--sortable-->
        <!--width="160"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="contact"
        label="联系人"
        sortable
        width="100"
        >
      </el-table-column>
      <el-table-column
        prop="sms"
        label="短信"
        sortable
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
      <el-table-column
        prop="address"
        label="地址"
        sortable
      >
      </el-table-column>
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
      <el-table-column label="操作" width="250">
        <template slot-scope="scope" class="text-left border">
          <el-button
            size="mini"
            @click="handleRecharge(scope.row.id)">充值</el-button>
          <el-button
            size="mini"
            @click="handleRecharge2(scope.row.id)">虚拟充值</el-button>
          <el-button
            size="mini"
            @click="handleCash(scope.row.id)">退款</el-button>
          <el-button
            size="mini"
            class="ml-0"
            style="margin-right: 10px;"
            @click="handleSet(scope.row.id)">设置</el-button>
          <el-button
            size="mini"
            class="mt-2 ml-0"
            @click="handleEditShow(scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            class="mt-2"
            @click="handleBindBox(scope.row.id)">绑定盒子</el-button>
          <el-button
            size="mini"
            class="mt-2 ml-0"
            style="margin-right: 10px;"
            @click="toAgentsBox(scope.row.id)">盒子明细</el-button>
          <el-button
            size="mini"
            class="mt-2 ml-0"
            style="margin-right: 10px;"
            @click="toLists(scope.row.id)">财务明细</el-button>
          <el-button
            class="mt-2 ml-0"
            size="mini"
            style="margin-right: 10px;"
            @click="handleAgentPwd(scope.row.id)">修改密码</el-button>
          <el-button
            class="mt-2 ml-0 ml-0 ml-0 ml-0"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--代理分页-->
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
    <el-dialog title="新增代理" status-icon :visible.sync="addVisible" width="700px" center :before-close="handleAddClose">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="登录账号" :label-width="formLabelWidth" prop="mobile" required>
          <el-input v-model="addForm.mobile" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth" prop="pwd">
          <el-input type="password" v-model="addForm.pwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="pwd">
          <el-input type="password" v-model="addForm.epwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="前台域名" :label-width="formLabelWidth">
          <el-input v-model="addForm.beforeDomain" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="后台域名" :label-width="formLabelWidth">
          <el-input v-model="addForm.backDomain" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth" prop="company">
          <el-input v-model="addForm.company" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="contact">
          <el-input v-model="addForm.contact" autocomplete="off" class="w-75"></el-input>
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
        </el-form-item>
        <el-form-item label="公司LOGO" :label-width="formLabelWidth">
          <el-upload
            :headers="addForm.myHeaders"
            class="avatar-uploader"
            action="http://api.51miaozhuan.com/manage/upload/image"
            :limit="1"
            :show-file-list="false"
            :on-success="addLogoSuccess"
            :before-upload="beforeLogoUpload">
            <img v-if="addForm.imageUrl" :src="addForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClose('addForm')">取 消</el-button>
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
          <p>{{payForm.payBalance ? payForm.payBalance : '0.00'}}</p>
        </el-form-item>
        <el-form-item label="充值金额" :label-width="formLabelWidth" prop="pay">
          <el-input type="number" v-model.number="payForm.pay" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payClose('payForm')">取 消</el-button>
        <el-button type="primary" @click="submitPay('payForm')" :disabled="buttonDisabled">{{payText}}</el-button>
      </div>
    </el-dialog>

    <!--虚拟充值对话框-->
    <el-dialog title="虚拟充值" :visible.sync="payVisible2" width="700px" center :before-close="handlePayClose2">
      <el-form :model="payForm2" :rules="payRules2" ref="payForm2">
        <el-form-item label="登录账号 :" :label-width="formLabelWidth">
          <p>{{payForm2.payAgent ? payForm2.payAgent : '无'}}</p>
        </el-form-item>
        <el-form-item label="联系人 :" :label-width="formLabelWidth">
          <p>{{payForm2.payContact}}</p>
        </el-form-item>
        <el-form-item label="短信充值" :label-width="formLabelWidth" prop="sms">
          <el-input type="number" v-model.number="payForm2.sms" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="闪信充值" :label-width="formLabelWidth" prop="fms">
          <el-input type="number" v-model.number="payForm2.fms" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="匹配充值" :label-width="formLabelWidth" prop="mate">
          <el-input type="number" v-model.number="payForm2.mate" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="拨号充值" :label-width="formLabelWidth" prop="tel">
          <el-input type="number" v-model.number="payForm2.tel" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payClose2('payForm2')">取 消</el-button>
        <el-button type="primary" @click="submitPay2('payForm2')" :disabled="buttonDisabled2">{{payText2}}</el-button>
      </div>
    </el-dialog>
    <!--退款对话框-->
    <el-dialog title="退款" :visible.sync="cashVisible" width="700px" center :before-close="handleCashClose">
      <el-form :model="cashForm" :rules="cashRules" ref="cashForm">
        <el-form-item label="登录账号 :" :label-width="formLabelWidth">
          <p>{{cashForm.cashAgent ? cashForm.cashAgent : '无'}}</p>
        </el-form-item>
        <el-form-item label="联系人 :" :label-width="formLabelWidth">
          <p>{{cashForm.cashContact}}</p>
        </el-form-item>
        <el-form-item label="账户余额 :" :label-width="formLabelWidth" >
          <p>{{cashForm.cashBalance ? cashForm.cashBalance : '0.00'}}</p>
        </el-form-item>
        <el-form-item label="退款金额" :label-width="formLabelWidth" prop="pay">
          <el-input v-model.number="cashForm.cash" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cashClose('cashForm')">取 消</el-button>
        <el-button type="primary" @click="submitCash('cashForm')" :disabled="cashDisabled">{{cashText}}</el-button>
      </div>
    </el-dialog>
    <!--编辑对话框-->
    <el-dialog title="编辑代理商" :visible.sync="dialogFormVisible" width="700px" center :before-close="handleEditClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="公司名称" :label-width="formLabelWidth" prop="company">
          <el-input v-model="ruleForm.company" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="前台域名" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.beforeDomain" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="后台域名" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.backDomain" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="contact">
          <el-input v-model="ruleForm.contact" autocomplete="off" class="w-75"></el-input>
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
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.address" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="是否登录" :label-width="formLabelWidth">
          <el-switch
            v-model="ruleForm.status"
            :active-value= "1"
            :inactive-value= "0"
          >
          </el-switch>
        </el-form-item>
        <!--<el-form-item label="是否外呼" :label-width="formLabelWidth">-->
          <!--<el-switch-->
            <!--v-model="ruleForm.is_outcall"-->
            <!--:active-value= "1"-->
            <!--:inactive-value= "0"-->
          <!--&gt;-->
          <!--</el-switch>-->
        <!--</el-form-item>-->
        <el-form-item label="公司LOGO" :label-width="formLabelWidth">
          <el-upload
            :headers="ruleForm.myHeaders"
            class="avatar-uploader"
            action="http://api.51miaozhuan.com/manage/upload/image"
            :limit="1"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
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
    <el-dialog title="设置" :visible.sync="setDialogVisible" width="700px" center :before-close="handleSetClose">
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
        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="setForm.remark" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setClose('setForm')">取 消</el-button>
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
  </div>
</template>

<script>
  import {
    agents,
    change,
    addAgent,
    showAgent,
    commitAgent,
    commitCash,
    deleteAgent,
    commitCost,
    commitPwd,
    commitPay,
    commitInventPay,
    bindBox
  } from "../../apis/agents";
  import {
    provinceAndCityData ,
    CodeToText,
  } from 'element-china-area-data'
  export default {
    name: "agents",
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
        CodeToText,
        tempList: [],
        list: [],
        logoImages: [],
        loading: true,
        buttonDisabled: false,
        buttonDisabled2: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        input: '',
        dialogFormVisible: false,
        ruleForm: {
          company: '',
          imageUrl: '',
          myHeaders:{
            authToken: localStorage.getItem('token')
          },
          contact: '',
          options: provinceAndCityData,
          selectedOptions: [],
          address: '',
          status: '',
          // is_outcall: ''
          beforeDomain: '',
          backDomain: ''
        },
        // userPayIndex: 0,
        userPayId: 0,
        userPayId2: 0,
        // userCashIndex: 0,
        userCashId: 0,
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
          contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ]
        },
        setDialogVisible: false,
        setForm:{
          sms: '',
          fms: '',
          mate: '',
          tel: '',
          remark: ''
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
          ],
        },
        payVisible: false,
        payText: '充值',
        payForm: {
          payAgent: '',
          payContact: '',
          payBalance: '',
          pay: ''
        },
        payRules: {
          pay: [
            { required: true, message: '请输入充值金额', trigger: 'blur' },
            { type: 'number', min: 0, message: '金额必须为数字且大于0', trigger: 'blur'}
          ],
        },

        payVisible2: false,
        payText2: '充值',
        payForm2: {
          payAgent: '',
          payContact: '',
          sms: '',
          fms: '',
          mate: '',
          tel: '',
        },
        payRules2: {
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
        cashVisible: false,
        cashDisabled: false,
        cashText: '退款',
        cashForm: {
          cashAgent: '',
          cashContact: '',
          cashBalance: '',
          cash: ''
        },
        cashRules: {
          cash: [
            { required: true, message: '请输入充值金额', trigger: 'blur' },
            { type: 'number',  min: 0, message: '金额必须为数字且大于0', trigger: 'blur'}
          ],
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
          imageUrl: '',
          contact: '',
          options: provinceAndCityData,
          selectedOptions: [],
          address: '',
          sms: '',
          fms: '',
          mate: '',
          tel: '',
          status: '',
          beforeDomain: '',
          backDomain: ''
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
          contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
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
      }
    },
    async mounted(){
      this.getDataList();
    },
    methods: {
      openAddDialog(){
        this.addVisible = true;
        this.addForm.mobile = '';
        this.addForm.pwd = '';
        this.addForm.epwd = '';
        this.addForm.company = '';
        this.addForm.imageUrl = '';
        this.addForm.contact = '';
        this.addForm.selectedOptions = [];
        this.addForm.address = '';
        this.addForm.sms = '';
        this.addForm.fms = '';
        this.addForm.mate = '';
        this.addForm.tel = '';
        this.addForm.status = 1;
        this.addForm.beforeDomain = '';
        this.addForm.backDomain = '';
      },
      submitAddAgent(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              mobile: this.addForm.mobile,
              pwd: this.addForm.pwd,
              epwd: this.addForm.epwd,
              company: this.addForm.company,
              logo_url: this.addForm.imageUrl,
              contact: this.addForm.contact,
              province_id: this.addForm.selectedOptions[0],
              city_id: this.addForm.selectedOptions[1],
              address: this.addForm.address,
              sms: this.addForm.sms,
              fms: this.addForm.fms,
              mate: this.addForm.mate,
              tel: this.addForm.tel,
              status: this.addForm.status,
              a_domain: this.addForm.beforeDomain,
              b_domain: this.addForm.backDomain
            };
            addAgent(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.getDataList();
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
      async getDataList(){
        const result = await agents(this.input, this.currentPage, this.pageSize);
        // console.log('result.data.data.list:', result.data.data.list);
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
      async query(){
        this.getDataList()
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getDataList()
      },
      handleCurrentChange(val) {
        // console.log(`当前 ${val} 页`);
        this.currentPage = val;
        this.getDataList()
      },
      // 编辑
      async handleEditShow(userId) {
        // this.userEditIndex = index;
        this.userEditId = userId;
        const result = await showAgent(userId);
        if (result.data.code === 200) {
          // console.log('result:', result);
          this.dialogFormVisible = true;
          this.ruleForm.company = result.data.data.company;
          this.ruleForm.imageUrl = result.data.data.logo_url;
          this.ruleForm.contact = result.data.data.contact;
          this.ruleForm.selectedOptions = [result.data.data.province_id, result.data.data.city_id];
          this.ruleForm.address = result.data.data.address;
          this.ruleForm.status = result.data.data.status;
          this.ruleForm.beforeDomain = result.data.data.a_domain;
          this.ruleForm.backDomain = result.data.data.b_domain;
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
              contact: this.ruleForm.contact,
              province_id: this.ruleForm.selectedOptions[0],
              city_id: this.ruleForm.selectedOptions[1],
              address: this.ruleForm.address,
              status: this.ruleForm.status,
              a_domain: this.ruleForm.beforeDomain,
              b_domain: this.ruleForm.backDomain
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
                this.list.find(x => x.id === this.userEditId).a_domain = this.ruleForm.beforeDomain;
                this.list.find(x => x.id === this.userEditId).b_domain = this.ruleForm.backDomain;
                // this.list[this.userEditIndex].is_outcall = this.ruleForm.is_outcall;
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
      // 充值显示
      async handleRecharge(userId){
        this.buttonDisabled = false;
        this.payText = '充值';
        this.payForm.pay = '';
        // this.userPayIndex = index;
        this.userPayId = userId;
        const result = await showAgent(userId);
        if (result.data.code === 200) {
          this.payVisible = true;
          this.payForm.payAgent = result.data.data.mobile;
          this.payForm.payContact = result.data.data.contact;
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
              money: this.payForm.pay
            };
            commitPay(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.list.find(x => x.id === this.userPayId).balance = Number(this.list.find(x => x.id === this.userPayId).balance) + Number(this.payForm.pay);
                this.payVisible = false;
                this.buttonDisabled = false;
                this.payText = '充值';
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

      // 虚拟充值显示
      async handleRecharge2(userId){
        this.buttonDisabled2 = false;
        this.payText2 = '充值';
        // this.userPayIndex = index;
        this.userPayId2 = userId;
        const result = await showAgent(userId);
        if (result.data.code === 200) {
          this.payVisible2 = true;
          this.payForm2.payAgent = result.data.data.mobile;
          this.payForm2.payContact = result.data.data.contact;
          this.payForm2.sms = result.data.data.sms_pay;
          this.payForm2.fms = result.data.data.fms_pay;
          this.payForm2.mate = result.data.data.mate_pay;
          this.payForm2.tel = result.data.data.tel_pay;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 虚拟充值提交
      submitPay2(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.buttonDisabled2 = true;
            this.payText2 = '充值中...';
            let params = {
              id: this.userPayId2,
              sms_pay: this.payForm2.sms,
              fms_pay: this.payForm2.fms,
              tel_pay: this.payForm2.tel,
              mate_pay: this.payForm2.mate,
            };
            commitInventPay(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.payVisible2 = false;
                this.buttonDisabled2 = false;
                this.payText2 = '充值';
              } else {
                this.$status(result.data.msg);
                this.buttonDisabled2 = false;
                this.payText2 = '充值';
              }
            });
          } else {
            return false;
          }
        });
      },

      // 退款显示
      async handleCash(userId){
        this.cashDisabled = false;
        this.cashText = '退款';
        this.cashForm.cash = '';
        // this.userCashIndex = index;
        this.userCashId = userId;
        const result = await showAgent(userId);
        if (result.data.code === 200) {
          this.cashVisible = true;
          this.cashForm.cashAgent = result.data.data.mobile;
          this.cashForm.cashContact = result.data.data.contact;
          this.cashForm.cashBalance = result.data.data.balance;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 退款提交
      submitCash(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.cashDisabled = true;
            this.cashText = '退款中...';
            let params = {
              id: this.userCashId,
              money: this.cashForm.cash
            };
            commitCash(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.list.find(x => x.id === this.userCashId).balance =Number(this.list.find(x => x.id === this.userCashId).balance) - Number(this.cashForm.cash);
                this.cashVisible = false;
                this.cashDisabled = false;
                this.cashText = '退款';
              } else {
                this.$status(result.data.msg);
                this.cashDisabled = false;
                this.cashText = '退款';
              }
            });
          } else {
            return false;
          }
        });
      },
      // 设置显示
      async handleSet(userId){
        // this.userSetIndex = index;
        this.userSetId = userId;
        const result = await showAgent(userId);
        if (result.data.code === 200) {
          this.setDialogVisible = true;
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
        const result = await showAgent(userId);
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
        let params = {
          id: id,
          types: status
        };
        const result = await change(params);
        if (result.data.code !== 200){
          this.$status(result.data.msg);
        }
      },
      // 上传LOGO
      handleAvatarSuccess(result) {
        if (result.code === 200) {
          this.ruleForm.imageUrl = result.data.big_url;
        } else {
          this.$status(result.msg);
        }
      },
      // 限制图片大小和格式
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 新增上传LOGO
      addLogoSuccess(result){
        if (result.code === 200) {
          this.addForm.imageUrl = result.data.big_url;
        } else {
          this.$status(result.msg);
        }
      },
      // 新增上传LOGO 限制图片大小
      beforeLogoUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 选择地址并赋值
      handleChange (value) {
        // 编辑对话框
        this.ruleForm.address = CodeToText[value[0]]+""+CodeToText[value[1]];
      },
      addAddressChange(value){
        // 新增对话框
        this.addForm.address = CodeToText[value[0]]+""+CodeToText[value[1]];
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
      addClose(formName){
        this.addVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 新增弹框关闭按钮
      handleAddClose(){
        this.addClose('addForm');
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

      // 虚拟充值弹框取消按钮
      payClose2(formName){
        this.payVisible2 = false;
        this.$refs[formName].clearValidate();
      },
      // 虚拟充值弹框关闭按钮
      handlePayClose2(){
        this.payClose2('payForm2');
      },
      // 退款弹框取消按钮
      cashClose(formName){
        this.cashVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 退款弹框关闭按钮
      handleCashClose(){
        this.cashClose('cashForm');
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
      // 设置弹框取消按钮
      setClose(formName){
        this.setDialogVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 设置弹框关闭按钮
      handleSetClose(){
        this.setClose('setForm');
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
      // 绑定盒子弹框取消按钮
      bindClose(formName){
        this.bindVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 绑定盒子弹框关闭按钮
      handleBindClose(){
        this.bindClose('bindForm');
      },
      toLists(id){
        this.$router.push({
          name: 'agentCounts',
          query: {
            id: id
          }
        })
      },
      toAgentsBox(id){
        this.$router.push({
          name: 'agentsBox',
          query: {
            id: id
          }
        })
      }
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
