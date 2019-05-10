<template>
  <div>
    <div class="navigation">盒子管理/盒子列表</div>
    <!--搜索-->
    <div class="my-3">
      <el-input class="w-25" v-model="input" placeholder="请输入盒子名称/编码/KEY" @keyup.enter.native="query"></el-input>
      <el-button type="primary" class="mx-3" @click="query">查询</el-button>
      <el-button type="success" @click="openAddDialog">新增</el-button>
    </div>
    <!--盒子表格-->
    <div class="mt-3">
      <el-table
        :data="list"
        stripe
        :default-sort = "{prop: 'times', order: 'descending'}"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="盒子名称"
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
          prop="code"
          label="盒子ID"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="sim"
          label="盒子SIM"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="times"
          label="创建时间"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="盒子状态"
          sortable
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
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditShow(scope.row.id)">编辑</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row.id)"
              type="danger">删除</el-button>
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
    <el-dialog title="新增盒子" :visible.sync="addVisible" width="700px" center>
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="盒子名称" :label-width="formLabelWidth" prop="name" required>
          <el-input v-model="addForm.name" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <!--<el-form-item label="盒子用户" :label-width="formLabelWidth" prop="uname">-->
        <!--<el-input v-model="addForm.uname" autocomplete="off" class="w-75"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="盒子ID" :label-width="formLabelWidth" prop="code">
          <el-input v-model="addForm.code" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子SIM" :label-width="formLabelWidth" prop="sim">
          <el-input v-model="addForm.sim" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子状态" :label-width="formLabelWidth">
          <el-switch
            v-model="addForm.status"
            :active-value= "1"
            :inactive-value= "0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBox('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑对话框-->
    <el-dialog title="编辑" :visible.sync="editVisible" width="700px" center>
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="盒子名称" :label-width="formLabelWidth" prop="name" required>
          <el-input v-model="editForm.name" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <!--<el-form-item label="盒子用户" :label-width="formLabelWidth" prop="uname">-->
        <!--<el-input v-model="addForm.uname" autocomplete="off" class="w-75"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="盒子ID" :label-width="formLabelWidth" prop="code">
          <el-input v-model="editForm.code" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子SIM" :label-width="formLabelWidth" prop="sim">
          <el-input v-model="editForm.sim" autocomplete="off" class="w-75"></el-input>
        </el-form-item>
        <el-form-item label="盒子状态" :label-width="formLabelWidth">
          <el-switch
            v-model="editForm.status"
            :active-value= "1"
            :inactive-value= "0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditBox('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    usersBoxs,
    usersBindBox,
    editBoxShow,
    editBox,
    deleteBox,
    change
  } from '@/apis/boxs'
  export default {
    name: "BoxList",
    data(){
      return{
        input: '',
        list: [],
        loading: true,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        formLabelWidth: '200px',
        addVisible: false,
        addForm: {
          name: '',
          code: '',
          sim: '',
          status: 0,
        },
        addRules: {
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
          ]
        },
        // boxEditIndex: 0,
        boxEditId: 0,
        editVisible: false,
        editForm: {
          name: '',
          code: '',
          sim: '',
          status: 0,
        },
        editRules: {
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
          ]
        },
      }
    },
    async mounted(){
      this.getBoxsList();
    },
    methods: {
      // 得到列表
      async getBoxsList(){
        const result = await usersBoxs(this.$route.query.id, this.input, this.currentPage, this.pageSize);
        this.loading = false;
        // console.log('result:', result);
        if(result.data.code === 200){
          this.list = result.data.data.list;
          this.total = result.data.data.count;
        } else if(result.data.code === 403){
          this.$noAuth(result.data.msg);
        } else {
          this.$status(result.data.msg);
        }
      },
      // 查询
      async query(){
        // console.log(this.input);
        this.getBoxsList()
      },
      // 每页几条
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getBoxsList()
      },
      // 当前页
      handleCurrentChange(val) {
        // console.log(`当前 ${val} 页`);
        this.currentPage = val;
        this.getBoxsList()
      },
      // 新增对话框
      openAddDialog(){
        this.addVisible = true;
        this.addForm.name = '';
        this.addForm.code = '';
        this.addForm.sim = '';
        this.addForm.status = 1;
      },
      // 新增确认框
      submitAddBox(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              uid: this.$route.query.id,
              name: this.addForm.name,
              code: this.addForm.code,
              sim: this.addForm.sim,
              status: this.addForm.status
            };
            usersBindBox(params).then((result)=>{
              // console.log('result:', result);
              if(result.data.code === 200){
                this.getBoxsList();
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
      // 编辑显示对话框
      async handleEditShow(boxId) {
        // this.boxEditIndex = index;
        this.boxEditId = boxId;
        const result = await editBoxShow(boxId);
        if (result.data.code === 200) {
          this.editVisible = true;
          this.editForm.name = result.data.data.name;
          this.editForm.code = result.data.data.code;
          this.editForm.sim = result.data.data.sim;
          this.editForm.status = result.data.data.status;
        } else {
          this.$status(result.data.msg);
        }
      },
      // 编辑确认框
      submitEditBox(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              name: this.editForm.name,
              code: this.editForm.code,
              sim: this.editForm.sim,
              status: this.editForm.status
            };
            editBox(this.boxEditId, params).then((result)=>{
              if(result.data.code === 200){
                this.$message({
                  message: result.data.msg,
                  type: 'success'
                });
                this.list.find(x => x.id === this.boxEditId).name = this.editForm.name;
                this.list.find(x => x.id === this.boxEditId).code = this.editForm.code;
                this.list.find(x => x.id === this.boxEditId).sim = this.editForm.sim;
                this.list.find(x => x.id === this.boxEditId).status = this.editForm.status;
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
      // 删除
      handleDelete(index, boxId) {
        this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBox(boxId).then((result)=> {
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
      // 启用/禁用盒子状态
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
</style>