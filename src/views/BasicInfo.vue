<template>
  <div>
    <div class="navigation">基本信息</div>
    <!--基本信息表单-->
    <div class="mt-5">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="w-50">
        <el-form-item label="登录账号" :label-width="formLabelWidth" required>
          <p>{{ruleForm.mobile}}</p>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="ruleForm.pwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="ruleForm.epwd" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth" prop="company">
          <el-input v-model="ruleForm.company" autocomplete="off" class="w-75"></el-input>
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
        <el-form-item label="公司LOGO" :label-width="formLabelWidth">
          <el-upload
            :headers="ruleForm.myHeaders"
            class="avatar-uploader"
            action="http://api.51miaozhuan.com/manage/upload/image"
            :limit="1"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            >
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    basic,
    comfirmBasic
  } from "@/apis/basicInfo";
  import {
    provinceAndCityData ,
    CodeToText,
  } from 'element-china-area-data'
  export default {
    name: "basicInfo",
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
        ruleForm: {
          company: '',
          imageUrl: '',
          myHeaders:{
            authToken: localStorage.getItem('token')
          },
          contact: '',
          mobile: '',
          options: provinceAndCityData,
          selectedOptions: [],
          address: ''
        },
        formLabelWidth: '130px',
        rules: {
          mobile: [
            {validator: checkPhone, trigger: 'blur'}
          ],
          company: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
          ],
          contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ]
        },
      }
    },
    mounted(){
      this.getBasicList();
    },
    methods: {
      async getBasicList(){
        const result = await basic();
        if(result.data.code === 200){
          this.ruleForm.mobile = result.data.data.mobile;
          this.ruleForm.company = result.data.data.company;
          this.ruleForm.contact = result.data.data.contact;
          this.ruleForm.selectedOptions = [result.data.data.province_id, result.data.data.city_id];
          this.ruleForm.address = result.data.data.address;
          this.ruleForm.trade_id = result.data.data.trade_id;
          this.ruleForm.imageUrl = result.data.data.logo_url;
        } else if(result.data.code === 403){
          this.$noAuth(result.data.msg);
        } else {
          this.$status(result.data.msg);
        }
      },
      // 选择地址并赋值
      handleChange (value) {
        // console.log(this.ruleForm.selectedOptions);
        this.ruleForm.address = CodeToText[value[0]]+""+CodeToText[value[1]];
      },
      // 上传LOGO
      handleAvatarSuccess(result) {
        if (result.code === 200) {
          this.ruleForm.imageUrl = result.data.small_url;
        } else {
          this.$status(result.msg);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              pwd: this.ruleForm.pwd,
              epwd: this.ruleForm.epwd,
              company: this.ruleForm.company,
              contact: this.ruleForm.contact,
              province_id: this.ruleForm.selectedOptions[0],
              city_id: this.ruleForm.selectedOptions[1],
              trade_id: this.ruleForm.trade_id,
              address: this.ruleForm.address,
              logo_url: this.ruleForm.imageUrl,
            };
            comfirmBasic(params).then((result)=>{
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
              } else {
                this.$status(result.data.msg);
              }
            });
          } else {
            return false;
          }
        });
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