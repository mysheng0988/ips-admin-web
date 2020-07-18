import request from '@/utils/request'
export function patientList(data) {
  return request({
    url: 'base/user/list/'+data.pageNum+"/"+data.pageSize,
    method: 'post',
    data: data
  })
}
export function updatePatint(data) {
    return request({
      url: 'base/user',
      method: 'put',
      data: data
    })
}
export function insertPatint(data) {
    return request({
      url: 'base/user/patient',
      method: 'post',
      data: data
    })
}
export function getUserInfo(userId) {
  return request({
    url: 'base/user/'+userId,
    method: 'get',
  })
}