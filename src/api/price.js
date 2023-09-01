import http from '@/utils/http'
// 新增
export const addApi = async(para) => {
  return await http.post('/price-rule/add', para)
}
// 列表
export const listApi = async(para) => {
  return await http.post('/price-rule/list', para)
}
// 编辑
export const editApi = async(para) => {
  return await http.post('/price-rule/edit', para)
}
// 删除
export const deleteApi = async(para) => {
  return await http.post('/price-rule/delete', para)
}
