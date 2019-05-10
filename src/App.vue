<template>
  <div id="app">
    <el-container v-if="$route.meta.requireAuth">
      <el-header class="fixed-top">
        <TopNav @listenLoginOut="listenLoginOut" @listenBasicInfo="listenBasicInfo"></TopNav>
      </el-header>
      <el-container style="padding-top: 65px;">
        <el-aside width="200px">
          <LeftNav></LeftNav>
        </el-aside>
        <el-main
          class="main"
          :style={height:leftHeight}
        >
          <transition name="slide-fade">
          <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
    <el-container v-else>
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
  import LeftNav from '@/components/LeftNav.vue'
  import TopNav from '@/components/TopNav.vue'
  import {logout} from "@/apis/login";

  export default {
    name: 'App',
    data(){
      return {
        leftHeight: 0,
        transitionName: ''
      }
    },
    components:{
      LeftNav,
      TopNav
    },
    watch: {
      //使用watch 监听$router的变化
      // 监控路由跳转,判断切换页面之间的层级关系,并以此来判断路由前进或者后退.
      $route(to, from) {
        //如果to索引大于from索引,判断为前进状态,反之则为后退状态
        if(to.meta.index > from.meta.index){
          //设置动画名称
          this.transitionName = 'slide-left';
        }else{
          this.transitionName = 'slide-right';
        }
      }
    },
    mounted () {
      this.leftHeight = (document.documentElement.clientHeight - 65) + 'px';
      if (!localStorage.getItem('token')){
        this.$router.push({
          name: 'login'
        });
      }
    },
    methods: {
      listenLoginOut (res) {
        if (res) {
          this.$confirm('确定退出?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            logout(res).then(result => {
              // console.log('result:', result);
              if(result.data.code === 200){
                this.$message({
                  type: 'success',
                  message: result.data.msg
                });
                localStorage.removeItem('token');
                // location.reload();
                this.$router.push({
                  path: '/login'
                });
              } else {
                this.$status(result.data.msg);
              }
            });

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }
      },
      listenBasicInfo (data) {
        if (data) {
         this.$router.push({name: 'basicInfo'});
        }
      }
    }
  }
</script>

<style lang="scss">
  .el-header{
    padding: 0px!important;
  }
  .main{
    background-color: #f8f8f8;
    padding: 10px 20px 20px 20px!important;
  }
  .mainMap{
    background-color: #f8f8f8;
    padding: 0px!important;
  }
  .slide-fade-enter-active {
    /*ease：（逐渐变慢）默认值，ease函数等同于贝塞尔曲线(0.25, 0.1, 0.25, 1.0).*/
    transition: 0.4s all 0.3s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translate3d(40px, 0, 0);
    opacity: 0;
  }
</style>
