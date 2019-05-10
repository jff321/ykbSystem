/**
 * Created by superman on 17/2/16.
 * http配置
 */
import axios from 'axios'
import router from './router'

// axios 配置
axios.defaults.timeout = 6000;
axios.defaults.baseURL = 'http://api.51miaozhuan.com/';
// axios.defaults.baseURL = 'http://192.168.0.120/';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('token')) {
      config.headers.authToken = `${localStorage.getItem('token')}`;
    } else { // 登录过验证token
      loginRedirect();
    }
    return config
  },
  err => {
    return Promise.reject(err);
  },
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT);

          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
          router.replace({
            path: '/login',
          });
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  },
);
function loginRedirect () { // 跳转
  router.replace({name: 'login'});
}

export default axios