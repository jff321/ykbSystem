<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    :style={height:leftHeight}
    :unique-opened="uniqueOpened"
    router
    >
    <div v-for="(nav) in menus" :key="nav.id" >
      <el-submenu v-if="nav.child" :index="(nav.id).toString()">
        <template slot="title">
          <i :class="nav.ico"></i>
          <span>{{nav.title}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="item in nav.child" :key="item.id" :index="item.action"><span v-if="item.show">{{item.title}}</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item  v-else :key="nav.id" :index="nav.action">
        <i :class="nav.ico"></i>
        <span slot="title">{{nav.title}}</span>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script>
  export default {
    name: 'leftNav',
    data(){
      return {
        leftHeight: '',
        uniqueOpened: true,
        menus: JSON.parse(localStorage.getItem('menus'))
      }
    },
    mounted(){
      this.leftHeight = (document.documentElement.clientHeight - 65) + 'px';
      // console.log('MENU:', this.navMenus)
    },
    methods: {
    }
  };
</script>

<style scoped>
  a {
    text-decoraction: none;
  }
  .router-link-active {
    text-decoration: none;
  }
  .el-menu{
    border-right: none!important;
  }
</style>