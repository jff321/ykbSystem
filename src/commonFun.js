let commonFun = {};

commonFun.install = function (Vue) {
  // 报错提示
  Vue.prototype.$status = function (msg) {
    this.$message.error(msg);
  };

  // 没有登录
  Vue.prototype.$noAuth = function (msg) {
    this.$alert(msg, '提示', {
      confirmButtonText: '确定',
      type: 'warning',
      callback: () => {
        localStorage.clear();
        this.$router.push({
          name: 'login'
        })
      }
    });
  };

  // 手机号正则验证
  Vue.prototype.isPhone = function (phone) {
    if (!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phone))) {
      return false;
    } else {
      return true;
    }
  };

  // 将数字转换成字符串
  Vue.prototype.str = function (val) {
    if (val) {
      return val.toString();
    }
  };

  // 隐藏手机中间四位
  Vue.prototype.hidePhone = function (phone) {
    if(phone){
      return phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    }
  }
};

export default commonFun;