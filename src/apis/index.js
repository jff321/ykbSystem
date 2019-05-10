import axios from 'axios'

// 首页统计
export async function counts() {
  const  result = axios.get('manage/admin/counts');
  return result
}