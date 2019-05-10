import axios from 'axios'

// mac列表
export async function  mac (box_id, start_date, end_date, keys, page, limit){
  const result = await axios.get(`manage/mates/maclist?box_id=${box_id}&start_date=${start_date}&end_date=${end_date}&keys=${keys}&page=${page}&limit=${limit}`);
  return result ? result : false
}

// 添加MAC
export async function  addMac (data){
  const result = await axios.post(`manage/mates/addmac`, data);
  return result ? result : false
}

// 查询盒子采集数据
export async function  todaymac (box_id, start_date, end_date){
  const result = await axios.get(`manage/mates/todaymac?box_id=${box_id}&start_date=${start_date}&end_date=${end_date}`);
  return result ? result : false
}

// 盒子数据
export async function  boxs (){
  const result = await axios.get(`manage/mates/getbox`);
  return result ? result : false
}

// 导出mac列表
export async function  exportMac (box_id, start_date, end_date, keys){
  const result = await axios.get(`manage/mates/outmac?box_id=${box_id}&start_date=${start_date}&end_date=${end_date}&keys=${keys}&page=all&limit=all`);
  return result ? result : false
}