import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'aui-active',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index',
      name: 'index',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/Index.vue')
    },
    {
      path: '/',
      name: 'index',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/Index.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/Login.vue')
    },
    {
      path: '/rules',
      name: 'rules',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/group/Rules.vue')
    },
    {
      path: '/mates',
      name: 'mates',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/mates/Mates.vue')
    },
    {
      path: '/mates/store',
      name: 'addMate',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/mates/Store.vue')
    },
    {
      path: '/sms',
      name: 'sms',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/sms/Sms.vue')
    },
    {
      path: '/sms/smslog',
      name: 'smslog',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/sms/Smslog.vue')
    },
    {
      path: '/boxs',
      name: 'boxs',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/boxs/Boxs.vue')
    },
    {
      path: '/boxs/agentsBox',
      name: 'agentsBox',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/boxs/AgentsBox.vue')
    },
    {
      path: '/boxs/usersBox',
      name: 'usersBox',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/boxs/UsersBox.vue')
    },
    {
      path: '/finance/lists',  // 后台-->财务管理-->用户财务
      name: 'lists',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/finance/Lists.vue')
    },
    {
      path: '/finance/funlist', // 后台-->财务管理-->代理财务报表
      name: 'funlist',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/finance/Funlist.vue')
    },
    {
      path: '/finance/report', // 后台-->财务管理-->用户财务报表
      name: 'report',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/finance/Report.vue')
    },
    {
      path: '/finance/userLists', // 后台-->客户-->财务明细
      name: 'userLists',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/finance/UserLists.vue')
    },
    {
      path: '/finance/agentCounts',
      name: 'agentCounts',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/finance/AgentCounts.vue')
    },
    {
      path: '/finance/counts', // 后台-->财务管理-->财务统计
      name: 'counts',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/finance/Counts.vue')
    },
    {
      path: '/agents',
      name: 'agents',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/agents/Agents.vue')
    },
    {
      path: '/users',
      name: 'users',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        index: 0 //meta对象的index用来定义当前路由的层级,由小到大,由低到高
      },
      component: () => import('./views/users/Users.vue')
    },
    {
      path: '/users/userList',
      name: 'pays',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/users/UserList.vue')
    },
    {
      path: '/details',
      name: 'details',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/mates/Details.vue')
    },
    {
      path: '/basicInfo',
      name: 'basicInfo',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/BasicInfo.vue')
    },
    {
      path: '/mates/maclist',
      name: 'macList',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/mac/MacList.vue')
    },
    {
      path: '/mates/tellist',
      name: 'allPhone',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: () => import('./views/mates/AllPhone.vue')
    }
  ]
})
