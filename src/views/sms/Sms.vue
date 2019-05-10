<template>
  <div>
    <div class="navigation">短信闪信</div>
    <div>
      <el-input
        class="inputStyle mr-4 mt-3"
        placeholder="请输入标题/签名"
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
      <!--<el-button type="success" class="mt-3" @click="addSmsDialog">新增模板</el-button>-->
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
          prop="title"
          label="标题"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="sign"
          label="签名"
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
          label="类型"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.types === 1">短信</span>
            <span v-if="scope.row.types === 2">闪信</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="times"
          label="提交时间"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="审核状态"
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
        <el-table-column
          prop="u_times"
          label="审核时间"
          sortable
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
    <!--<div>-->
      <!--<el-dialog title="添加短信模板" :visible.sync="addVisible" width="500px" :before-close="handleAddClose">-->
        <!--<el-form :model="addForm" :rules="addRules" ref="addForm">-->
          <!--<el-form-item label="模板类型" prop="type" :label-width="formLabelWidth">-->
            <!--<el-select clearable v-model="addForm.type" placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in addForm.types"-->
                <!--:key="item.type"-->
                <!--:label="item.label"-->
                <!--:value="item.type"-->
              <!--&gt;-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="标题" prop="title" :label-width="formLabelWidth">-->
            <!--<el-input v-model="addForm.title" style="width: 300px"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="签名" prop="sign" :label-width="formLabelWidth">-->
            <!--<el-input v-model="addForm.sign" style="width: 300px"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="内容" prop="content" :label-width="formLabelWidth">-->
            <!--<el-input-->
              <!--type="textarea"-->
              <!--:rows="4"-->
              <!--style="width: 300px"-->
              <!--v-model="addForm.content">-->
            <!--</el-input>-->
            <!--<p class="notice">营销内容发送格式：【签名】+内容+回复TD退订。营销内容不超过66个字符，支持英文格式的,.!?</p>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="是否审核通过" :label-width="formLabelWidth">-->
            <!--<el-switch-->
              <!--v-model="addForm.status"-->
              <!--:active-value= "1"-->
              <!--:inactive-value= "0"-->
            <!--&gt;-->
            <!--</el-switch>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
          <!--<el-button @click="addClose('addForm')">取 消</el-button>-->
          <!--<el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->
    <!--</div>-->
    <!--编辑对话框-->
    <div>
      <el-dialog title="编辑短信模板" :visible.sync="editVisible" width="500px" :before-close="handleEditClose">
        <el-form :model="editForm" :rules="editRules" ref="editForm">
          <el-form-item label="模板类型" prop="type" :label-width="formLabelWidth">
            <el-select clearable v-model="editForm.type" placeholder="请选择">
              <el-option
                v-for="item in editForm.types"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
            <el-input v-model="editForm.title" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="签名" prop="sign" :label-width="formLabelWidth">
            <el-input v-model="editForm.sign" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="4"
              style="width: 300px"
              v-model="editForm.content">
            </el-input>
          </el-form-item>
          <el-form-item label="示例" :label-width="formLabelWidth">
            <p style="line-height: 25px;padding-top: 6px;">
              <span style="color: #DCDFE6;">【xxx旗舰店】</span>
              <span>偷偷告诉您！10月狂欢将于10月10日，火爆开启！更有定金膨胀。</span>
              <span v-if="editForm.type === 1" style="color: #DCDFE6;">退订回复T。</span>
            </p>
            <p v-if="editForm.type === 1" class="notice"> 注：灰色部分不用填写，系统自动添加。普通短信70字符，长短信67字符为一条计费。</p>
            <p v-if="editForm.type === 2" class="notice"> 注：灰色部分不用填写，系统自动添加。每条闪信内容不能超过67个字符，67个字符（含以下）为一条计费。</p>
          </el-form-item>
          <el-form-item label="是否审核通过" :label-width="formLabelWidth">
            <el-switch
              v-model="editForm.status"
              :active-value= "1"
              :inactive-value= "0"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editClose('editForm')">取 消</el-button>
          <el-button type="primary" @click="submitEdit('editForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    sms,
    // addSms,
    deleteSms,
    change,
    showSms,
    editSms
  } from '@/apis/sms'
  export default {
    name: "Template",
    data(){
      return{
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
        formLabelWidth: '120px',
        addVisible: false,
        addForm: {
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
          title: '',
          sign: '',
          content: '',
          status: 0
        },
        addRules: {
          type: [
            { required: true, message: '请选择模板类型', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入短信标题', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '请输入短信签名', trigger: 'blur' }
          ],
          content: [
            { message: '营销内容发送格式：【短信签名】+短信内容+回复TD退订。营销内容不超过66个字符，支持英文格式的,.!?' },
            { required: true, message: '请输入短信内容', trigger: 'blur' }
          ]
        },
        // editIndex: 0,
        editId: 0,
        editVisible: false,
        editForm: {
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
          title: '',
          sign: '',
          content: '',
          status: 0
        },
        editRules: {
          type: [
            { required: true, message: '请选择模板类型', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入短信标题', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '请输入短信签名', trigger: 'blur' }
          ],
          content: [
            { message: '营销内容发送格式：【短信签名】+短信内容+回复TD退订。营销内容不超过66个字符，支持英文格式的,.!?' },
            { required: true, message: '请输入短信内容', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getSmsList();
    },
    methods: {
      // 短信列表
      async getSmsList(){
        const result = await sms(this.input, this.type, this.start_time, this.end_time, this.currentPage, this.pageSize);
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
      // 审核状态
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
      // 新增对话框
      // addSmsDialog(){
      //   this.addVisible = true;
      //   this.addForm.type = '';
      //   this.addForm.title = '';
      //   this.addForm.sign = '';
      //   this.addForm.content = '';
      // },
      // 新增确认框
      // submitAdd(formName){
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       let params = {
      //         types: this.addForm.type,
      //         title: this.addForm.title,
      //         sign: this.addForm.sign,
      //         content: this.addForm.content,
      //         status: this.addForm.status
      //       };
      //       addSms(params).then((result)=>{
      //         // console.log('result:', result);
      //         if(result.data.code === 200){
      //           this.getSmsList();
      //           this.$message({
      //             message: result.data.msg,
      //             type: 'success'
      //           });
      //           this.addVisible = false;
      //         } else {
      //           this.$status(result.data.msg);
      //         }
      //       });
      //     } else {
      //       return false;
      //     }
      //   });
      // },
      // 新增弹框取消按钮
      // addClose(formName){
      //   this.addVisible = false;
      //   this.$refs[formName].clearValidate();
      // },
      // 新增弹框关闭按钮
      // handleAddClose(){
      //   this.addClose('addForm');
      // },
      // 删除
      handleDelete(index, id) {
        // console.log(index, id);
        this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSms(id).then((result)=> {
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
      // 编辑弹框取消按钮
      editClose(formName){
        this.editVisible = false;
        this.$refs[formName].clearValidate();
      },
      // 编辑弹框关闭按钮
      handleEditClose(){
        this.editClose('editForm');
      },
      // 编辑对话框
      async handleEdit(id) {
        // this.editIndex = index;
        this.editId = id;
        const result = await showSms(id);
        if (result.data.code === 200) {
          this.editVisible = true;
          this.editForm.type = result.data.data.types;
          this.editForm.title = result.data.data.title;
          this.editForm.sign = result.data.data.sign;
          this.editForm.content = result.data.data.content;
          this.editForm.status = result.data.data.status;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 编辑确认框
      submitEdit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              types: this.editForm.type,
              title: this.editForm.title,
              sign: this.editForm.sign,
              content: this.editForm.content,
              status: this.editForm.status
            };
            editSms(this.editId, params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.list.find(x => x.id === this.editId).types = this.editForm.type;
                this.list.find(x => x.id === this.editId).title = this.editForm.title;
                this.list.find(x => x.id === this.editId).sign = this.editForm.sign;
                this.list.find(x => x.id === this.editId).content = this.editForm.content;
                this.list.find(x => x.id === this.editId).status = this.editForm.status;
                this.editVisible = false;
              } else {
                this.$status(result.data.msg);
              }
            });
          } else {
            return false;
          }
        });
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
      }
    }
  }
</script>

<style scoped>
  .notice{
    color: #f56c6c;
    font-size: 12px;
    line-height: 1.7;
    margin-bottom: 0px!important;
    padding-top: 4px;
    width: 300px;
  }
  .inputStyle{
    width: 15%;
  }
  .content {
    color: #333;
    font-size: 0;
  }
  .auto-text {
    font-size: 14px;
    color: #ccc;
  }
  .text {
    font-size: 14px;
  }
</style>