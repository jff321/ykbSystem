import axios from 'axios'

// 代理列表, 搜索代理列表
export async function  agents (keys, page, limit){
  const result = axios.get('manage/agents?keys='+keys+'&page='+page+'&limit='+limit);
  return result ? result : false
}

// 启用，禁用代理商
export async function change(data) {
  const result = axios.post('manage/agents/enables', data);
  return result ? result : false
}

// 新增代理
export function addAgent(data) {
  const result = axios.post('manage/agents', data);
  return result ? result : false
}

// 编辑代理显示
export async function showAgent(userId) {
  const result = axios.get('manage/agents/' + userId);
  return result ? result : false
}

// 编辑代理提交
export function commitAgent(userId, data) {
  const result = axios.put(`manage/agents/${userId}`, data);
  return result ? result : false
}

// 设置价格提交
export function commitCost(data) {
  const result = axios.post(`manage/agents/setting`, data);
  return result ? result : false
}

// 修改密码提交
export function commitPwd(data) {
  const result = axios.post(`manage/agents/safepwd`, data);
  return result ? result : false
}

// 充值提交
export function commitPay(data) {
  const result = axios.post(`manage/agents/pays`, data);
  return result ? result : false
}

// 提现提交
export function commitCash(data) {
  const result = axios.post(`manage/agents/cashed`, data);
  return result ? result : false
}

// 删除代理
export function deleteAgent(userId) {
  const result = axios.delete(`manage/agents/${userId}`);
  return result ? result : false
}

// 绑定盒子
export function bindBox(data) {
  const result = axios.post(`manage/agents/bindbox`, data);
  return result ? result : false
}