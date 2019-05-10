<template>
  <div class="mt-4">
    <!--表格-->
    <tree-table
      :data="data"
      :columns="columns"
      @listenToMenuShow="isMenuShow"
      @listenToMenuEnables="isMenuEnables"
      @listenToHandleDelete = "isMenuDelete"
      border/>
  </div>
</template>

<script>
  import treeTable from "@/components/treeTable/index";
  import {
    rules,
    showMenu,
    enableMenu,
    deleteMenu
  } from '@/apis/rules'
  export default {
    name: "rules",
    components: { treeTable },
    data() {
      return {
        columns: [
          {
            text: "ID",
            value: "id"
          },
          {
            text: "权限名称",
            value: "title"
          },
          {
            text: "图标",
            value: "ico"
            // width: 200
          },
          {
            text: "地址",
            value: "name"
          },
          {
            text: "等级",
            value: "level"
          },
          {
            text: "排序",
            value: "order_number"
          },
          {
            text: "菜单显示",
            value: "show"
          },
          {
            text: "菜单启用/禁用",
            value: "status"
          }
        ],
        data: [],
      };
    },
    mounted(){
      this.getRulesList();
    },
    methods: {
      // 短信列表
      async getRulesList(){
        const result = await rules();
        if(result.data.code === 200){
          this.data = result.data.data;
          // console.log('this.data:', this.data);
        } else if(result.data.code === 403){
          this.$noAuth(result.data.msg);
        } else {
          this.$status(result.data.msg);
        }
      },
      // 菜单显示及隐藏
      async isMenuShow(data1, data2){
        // console.log('id:'+data1, 'types:'+data2);
        let params = {
          id: data1,
          types: data2
        };
        const result = await showMenu(params);
        // console.log('result:', result);
        if(result.data.code !== 200){
          this.$status(result.data.msg);
          return false;
        }
        // else {
        //   // console.log('this.$store.state.menus前:', this.$store.state.menus);
        //   this.$store.state.menus.forEach(item => {
        //     if(item.id === data1){
        //       item.show = data2;
        //     }
        //     // item.child.forEach(item => {
        //     //   if(item.id === data1){
        //     //     item.show = data2;
        //     //     console.log('改变！！！')
        //     //   }
        //     // })
        //   });
        //   // console.log('this.$store.state.menus后:', this.$store.state.menus);
        //   // this.$store.commit('menuShowed', data2)
        // }
      },
      // 菜单启用禁用
      async isMenuEnables(data1, data2){
        // console.log(data1, data2);
        let params = {
          id: data1,
          types: data2
        };
        const result = await enableMenu(params);
        // console.log('result:', result);
        if(result.data.code !== 200){
          this.$status(result.data.msg);
          return false;
        }
      },
      // 删除
      isMenuDelete(index, id) {
        // console.log(index, id);
        this.$confirm('确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu(id).then((result)=> {
            // console.log('result:', result);
            if(result.data.code === 200) {
              this.getRulesList();
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
    }
  }
</script>

<style scoped>

</style>