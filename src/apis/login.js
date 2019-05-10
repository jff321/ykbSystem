import axios from 'axios'

// 登录
export function login(data) {
  const  result = axios.post('manage/login', data);
  return result
}

// 退出登录
export function logout(data) {
  const  result = axios.post('manage/logout', data);
  return result
}

// LOGO展示
export async function logo(domain, type) {
  const  result = await axios.get(`client/logo?domain=${domain}&type=${type}`);
  return result
}


