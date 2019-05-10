<template>
  <div>
    <div class="navigation mb-3">匹配列表/新增匹配数据</div>
    <div class="mt-3">
      <div>
        <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;">匹配数据名称</span>
        <el-input
          class="w-25 mr-4"
          placeholder="请输入匹配名称"
          v-model="inputClues"
          clearable>
        </el-input>
      </div>
      <div class="mt-4">
        <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;">数据来源</span>
        <el-radio-group v-model="radioButton">
          <el-radio-button label="盒子线索"></el-radio-button>
          <el-radio-button label="数据包线索"></el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="radioButton === '盒子线索'">
        <div class="mt-4">
          <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;">盒子设备</span>
          <el-select clearable v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="mt-4">
          <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;">日期范围</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="mt-4">
          <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;"></span>
          <el-button type="primary">立即匹配</el-button>
          <el-button type="info" class="ml-4">预告匹配数</el-button>
        </div>
      </div>
      <div v-else>
        <div class="mt-4">
          <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;">数据类型</span>
          <el-select clearable v-model="dataValue" placeholder="请选择">
            <el-option
              v-for="item in dataTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="mt-4">
          <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;">文件类型</span>
          <el-button type="primary">上传文件</el-button>
        </div>
        <div class="mt-4">
          <span class="navigation mr-3 text-right d-inline-block" style="width: 120px;"></span>
          <div class="navigation d-inline-block">
            <p class="mb-0" style="color:#8391a5;">文件格式说明：</p>
            <p class="mb-0" style="color:#8391a5;">1、上传文件为.xls.xlsx格式文档，一行一条；</p>
            <p class="mb-0" style="color:#8391a5;">2、Mac格式为6组16进制数，用半角英文":"分隔</p>
            <p class="mb-0" style="color:#8391a5;">3、单个上传文件大小不超过5M，不超过10万条。</p>
          </div>
        </div>
        <div class="mt-4">
          <span class="navigation mr-3 text-right d-inline-block " style="width: 120px;"></span>
          <el-button type="info">上传完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AddClues",
    data(){
      return {
        inputClues: '',
        radioButton: '盒子线索',
        options: [
          // {
          //   value: '选项1',
          //   label: '黄金糕'
          // },
          // {
          //   value: '选项2',
          //   label: '双皮奶'
          // },
          // {
          //   value: '选项3',
          //   label: '蚵仔煎'
          // },
          // {
          //   value: '选项4',
          //   label: '龙须面'
          // },
          // {
          //   value: '选项5',
          //   label: '北京烤鸭'
          // }
        ],
        value: '',
        dataTypes: [
          {
            value: '选项1',
            label: '明文mac'
          },
          {
            value: '选项2',
            label: 'imei'
          },
          {
            value: '选项3',
            label: 'IDFA'
          }
        ],
        dataValue: '选项1',
        date: ''
      }
    }
  }
</script>

<style scoped>

</style>