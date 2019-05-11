import axios from 'axios'

// 财务明细列表(用户)
export async function  finance (id, keys, types, start_date, end_date, page, limit){
  const result = axios.get(`manage/finance/lists?id=${id}&keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}&page=${page}&limit=${limit}`);
  return result ? result : false
}

// 财务统计列表(代理)
export async function  counts (id, keys, types, start_date, end_date, page, limit){
  const result = axios.get(`manage/finance/counts?id=${id}&keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}&page=${page}&limit=${limit}`);
  return result ? result : false
}

// 导出代理财务明细
export async function  agentsFinance (id, keys, types, start_date, end_date){
  const result = axios.get(`manage/finance/agent_fund?id=${id}&keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}&page=all&limit=all`);
  return result ? result : false
}

// 导出用户财务明细
export async function  usersFinance (id, keys, types, start_date, end_date){
  const result = axios.get(`manage/finance/user_fund?id=${id}&keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}&page=all&limit=all`);
  return result ? result : false
}

// 代理财务报表(总管理登录，查看代理财务)
export async function  agentfunlists (keys, start_date, end_date, page, limit){
  const result = axios.get(`manage/finance/funlist?keys=${keys}&start_date=${start_date}&end_date=${end_date}&page=${page}&limit=${limit}`);
  return result ? result : false
}

// 代理财务报表导出(总管理登录，查看代理财务)
export async function  exportAgentfunlists (keys, start_date, end_date){
  const result = axios.get(`manage/finance/out_fund?keys=${keys}&start_date=${start_date}&end_date=${end_date}`);
  return result ? result : false
}

// 用户财务报表(代理商登录，查看用户财务)
export async function  userfunlists (keys, types, start_date, end_date, page, limit){
  const result = axios.get(`manage/finance/report?keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}&page=${page}&limit=${limit}`);
  return result ? result : false
}

// 用户财务报表导出(代理商登录，查看用户财务)
export async function  exportUserfunlists (keys, types, start_date, end_date){
  const result = axios.get(`manage/finance/out_report?keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}`);
  return result ? result : false
}
// 总管理查看代理商下面的用户财务明细
export async function  userfunDetail (id, keys, types, start_date, end_date, page, limit){
  const result = axios.get(`manage/finance/relist?id=${id}&keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}&page=${page}&limit=${limit}`);
  return result ? result : false
}

// 总管理查看代理商下面的用户财务明细并导出
export async function  exportUserfunDetail (id, keys, types, start_date, end_date){
  const result = axios.get(`manage/finance/out_relist?id=${id}&keys=${keys}&types=${types}&start_date=${start_date}&end_date=${end_date}`);
  return result ? result : false
}