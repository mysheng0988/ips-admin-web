import request from '@/utils/request'
export function queryHospital(data) {
  return request({
    url:'base/organization/list/'+data.pageNum+"/"+data.pageSize+"?name="+data.name,
    method:'get',
  })
}
export function getHospitalData(hospitalId) {
  return request({
    url:'base/organization/'+hospitalId,
    method:'get',
  })
}
export function saveHospital(data) {
  return request({
    url:'base/organization',
    method:'post',
    data:data,
  })
}
export function updateHospital(data) {
  return request({
    url:'base/organization',
    method:'put',
    data:data,
  })
}
export function saveUser(data) {
  return request({
    url:'base/user',
    method:'post',
    data:data,
  })
}
export function updateUser(data) {
  return request({
    url:'base/user',
    method:'put',
    data:data,
  })
}
export function getUserinfo(userId) {
  return request({
    url:'base/user/info/'+userId,
    method:'get',
  })
}
export function changeState(uid,enable) {
  return request({
    url:'base/user/status/'+uid+'/'+enable,
    method:'put',
  })
}
export function getUserList(data) {
  return request({
    url:'base/user/list/'+data.pageNum+"/"+data.pageSize,
    method:'post',
    data:data
  })
}

export function getRoleList(data) {
  return request({
    url:'/base/role/list/'+data.pageNum+"/"+data.pageSize+"?roleName="+data.roleName,
    method:'get',
    data:data
  })
}
export function getDeptList(data) {
  return request({
    url:'/base/dept/list/'+data.hospitalId+"/"+data.pageNum+"/"+data.pageSize+"?deptName="+data.deptName,
    method:'get',
  })
}
//获取权限菜单
export function getRoleMenu() {
  return request({
    url:'/base/authority',
    method:'get',
  })
}
export function createRole(data) {
  return request({
    url:'/base/role',
    method:'post',
    data:data
  })
}
export function updateRole(data) {
  return request({
    url:'/base/role',
    method:'put',
    data:data
  })
}
export function getRoleInfo(roleId) {
  return request({
    url:'/base/role/info/'+roleId,
    method:'get',
  })
}
export function getDeptCategory() {
  return request({
    url:'base/dept/category/list',
    method:'get',
  })
}
export function createDept(data) {
  return request({
    url:'/base/dept',
    method:'post',
    data:data
  })
}
export function updateDept(data) {
  return request({
    url:'/base/dept',
    method:'put',
    data:data
  })
}

