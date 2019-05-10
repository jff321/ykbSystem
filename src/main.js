import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from './store'
import router from './router'
import Router from 'vue-router'

// axios是promise实现的，提到promise，首先应该想到IE不支持，所以应该先加个垫片，给IE做下兼容性处理
import 'babel-polyfill'

// 引入Axios
import Axios from 'axios'

// 引入bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap'
import 'popper.js/dist/esm/popper'

// 引入font-awesome
import "font-awesome/css/font-awesome.css";

// 引入公共样式
import './common.css'

// 引入公共方法
import commonFun from './commonFun'

//  引入vue-amap
import VueAMap from 'vue-amap';

// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import  './axios'

// 引入viewerjs
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.prototype.$axios = Axios;

Vue.use(ElementUI);
Vue.use(VueAMap);
Vue.use(Vuex);
Vue.use(Router);
Vue.use(commonFun);
Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    "inline": true,
    "button": true,
    "navbar": true,
    "title": true,
    "toolbar": true,
    "tooltip": true,
    "movable": true,
    "zoomable": true,
    "rotatable": true,
    "scalable": true,
    "transition": true,
    "fullscreen": true,
    "keyboard": true,
    "url": "data-source"
  }
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');


