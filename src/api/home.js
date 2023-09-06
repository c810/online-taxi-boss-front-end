import http from '@/utils/http'
// 统计首页总数
export const getHomeCountApi = async() => {
  return await http.get('/api/login/get-home-count')
}
