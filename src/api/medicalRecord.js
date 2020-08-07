import request from '@/utils/request'
export function medicalRecordList(data) {
  return request({
    url:'ips/medicalRecord/list/doctor/'+data.pageNum+"/"+data.pageSize,
    method:'get',
    params:data
  })
}
export function updateMedicalRecord(data) {
  return request({
    url:'ips/medicalRecord',
    method:'put',
    data:data,
  })
}
export function medicalRecordListData(data) {
  return request({
    url:'ips/medicalRecord/list/'+data.pageNum+"/"+data.pageSize,
    method:'post',
    data:data
  })
}

export function medicalRecordPatientList(data) {
  return request({
    url:'ips/medicalRecord/list/patient/'+data.pageNum+"/"+data.pageSize,
    method:'get',
    params:data
  })
}


export function savePatientComplaint(data) {
  return request({
    url:'ips/medicalRecord/patientComplaint',
    method:'post',
    data:data
  })
}