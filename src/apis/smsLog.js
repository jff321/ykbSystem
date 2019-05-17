import axios from "axios/index";

// 短信列表, 搜索短信列表
export async function  smsLog (id, keys, types, start_date, end_date, page, limit){
  const result = axios.get('manage/sms/smslog?id='+id+'&keys='+keys+'&types='+types+'&start_date='+start_date+'&end_date='+end_date+'&page='+page+'&limit='+limit);
  return result ? result : false
}