import axios from 'axios'

// 短信列表, 搜索短信列表
export async function  sms (keys, types, start_date, end_date, page, limit){
  const result = axios.get('manage/sms?keys='+keys+'&types='+types+'&start_date='+start_date+'&end_date='+end_date+'&page='+page+'&limit='+limit);
  return result ? result : false
}

// 新增
export async function  addSms (data){
  const result = axios.post('manage/sms', data);
  return result ? result : false
}

// 审核状态
export async function change(data) {
  const result = axios.post('manage/sms/enables', data);
  return result ? result : false
}

// 删除
export function deleteSms(id) {
  const result = axios.delete(`manage/sms/${id}`);
  return result ? result : false
}

// 编辑显示
export async function showSms(id) {
  const result = await axios.get(`manage/sms/${id}`);
  return result ? result : false
}

//编辑确认
export function editSms(id, data) {
  const result = axios.put(`manage/sms/${id}`, data);
  return result ? result : false
}