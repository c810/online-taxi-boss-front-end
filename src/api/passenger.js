import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return await http.post('/passenger-user/add', para)
}
// 列表
export const listApi = async(para) => {
  return await http.post('/passenger-user/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/passenger-user/edit', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/passenger-user', para)
}
