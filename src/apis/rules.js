import axios from 'axios'

// 权限列表
export async function  rules (){
  const result = await axios.get('manage/rules');
  return result ? result : false
}

// 菜单显示及隐藏
export async function  showMenu (data){
  const result = await axios.post('manage/rules/isshow', data);
  return result ? result : false
}

// 菜单启用禁用
export async function  enableMenu (data){
  const result = await axios.post('manage/rules/enables', data);
  return result ? result : false
}

//删除权限
export function  deleteMenu (id){
  const result = axios.delete(`manage/rules/${id}`);
  return result ? result : false
}