import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return await http.post('/driver-user/add', para)
}
// 列表
export const listApi = async(para) => {
  return await http.post('/driver-user/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.put('/driver-user/edit', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.delete('/driver-user', para)
}
// 绑定
export const bindApi = async(para) => {
  return await http.post('/driver-car-binding-relationship/bind', para)
}
// 解绑
export const unbindApi = async(para) => {
  return await http.post('/driver-car-binding-relationship/unbind', para)
}
