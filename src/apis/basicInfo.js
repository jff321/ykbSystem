import axios from 'axios'

// 获取基本信息
export async function  basic (){
  const result = await axios.get(`manage/admin/show`);
  return result ? result : false
}

// 修改基本信息
export function  comfirmBasic (data){
  const result = axios.post(`manage/admin/update`, data);
  return result ? result : false
}