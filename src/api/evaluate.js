import http from '@/utils/http'

// 列表
export const listApi = async(para) => {
  return await http.post('/evaluate/list', para)
}
