import axios from 'axios'

// 用户列表, 搜索用户列表
export async function  users(keys, page, limit){
  const result = axios.get('manage/users?keys='+keys+'&page='+page+'&limit='+limit);
  return result ? result : false
}

// 用户列表, 搜索用户列表
export async function  usersList(keys, page, limit){
  const result = axios.get('manage/users/userlist?keys='+keys+'&page='+page+'&limit='+limit);
  return result ? result : false
}

// 启用，禁用用户商
export async function change(data) {
  const result = axios.post('manage/users/enables', data);
  return result ? result : false
}

// 新增用户
export function addUser(data) {
  const result = axios.post('manage/users', data);
  return result ? result : false
}

// 编辑用户显示
export async function showUser(userId) {
  const result = axios.get('manage/users/' + userId);
  return result ? result : false
}

// 编辑用户提交
export function commitAgent(userId, data) {
  const result = axios.put(`manage/users/${userId}`, data);
  return result ? result : false
}

// 设置价格提交
export function commitCost(data) {
  const result = axios.post(`manage/users/setting`, data);
  return result ? result : false
}

// 修改密码提交
export function commitPwd(data) {
  const result = axios.post(`manage/users/safepwd`, data);
  return result ? result : false
}

// 充值提交
export function commitPay(data) {
  const result = axios.post(`manage/users/pays`, data);
  return result ? result : false
}

// 提现提交
export function commitCash(data) {
  const result = axios.post(`manage/users/boxlist`, data);
  return result ? result : false
}

// 删除用户
export function deleteAgent(userId) {
  const result = axios.delete(`manage/users/${userId}`);
  return result ? result : false
}

// 绑定盒子
export function bindBox(data) {
  const result = axios.post(`manage/users/bindbox`, data);
  return result ? result : false
}

// 导出客户
export async function  exportUser (keys){
  const result = axios.get(`manage/users/out_user?keys=${keys}`);
  return result ? result : false
}