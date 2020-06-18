import request from '@/utils/request'
//主诉症状
export function querySymptoms(data) {
  return request({
    url:'base/symptoms/list',
    method:'get',
    params:data,
  })
}
//获取就诊经历
export function queryExperience(patientId) {
  return request({
    url:'base/visitingExperience/list/patientId/'+patientId,
    method:'get',
  })
}
export function queryExperienceList(patientId,createTime) {
  return request({
    url:'base/visitingExperience/list/patientId/'+patientId,
    method:'get',
    params:{
      visitDateBefore:createTime
    }
  })
}
export function queryCheckUp(data) {
  return request({
    url:'base/medicalExaminationItem/list',
    method:'get',
    params:{queryParam:data}
  })
}
export function saveExperience(data) {
  return request({
    url:'base/visitingExperience',
    method:'post',
    data:data,
  })
}
export function updateExperience(data) {
  return request({
    url:'base/visitingExperience',
    method:'put',
    data:data,
  })
}
export function deleteExperience(id) {
  return request({
    url:'base/visitingExperience/'+id,
    method:'delete',
  })
}
//获取家族史
export function familyHistory(patientId) {
  return request({
    url:'base/familyMedicalHistory/patientId/'+patientId,
    method:'get',
  })
}
//保存家族史
export function saveFamily(data) {
  return request({
    url:'base/familyMedicalHistory',
    method:'post',
    data:data,
  })
}
//更新家族史
export function updateFamliy(data) {
  return request({
    url:'base/familyMedicalHistory',
    method:'put',
    data:data,
  })
}
export function deleteFamliy(id) {
  return request({
    url:'base/familyMedicalHistory/disease/'+id,
    method:'delete',
  })
}
//全部应急源
export function getStress() {
  return request({
    url:'ips/stress/stressor/list/all',
    method:'get',
  })
}

export function getStressPatient(medicalRecordId) {
  return request({
    url:'ips/stress/event/list/'+medicalRecordId,
    method:'get',
  })
}export function deleteStressPatient(id) {
  return request({
    url:'ips/stress/event/'+id,
    method:'delete',
  })
}
//保存应急源
export function saveStress(data) {
  return request({
    url:'ips/stress/event',
    method:'post',
    data:data
  })
}
export function savaPursue(data) {
  return request({
    url:'ips/patientComplaint',
    method:'post',
    data:data,
  })
}
export function updatePursue(data) {
  return request({
    url:'ips/patientComplaint',
    method:'put',
    data:data,
  })
}
export function getPursue(medicalRecordId) {
  return request({
    url:'ips/patientComplaint/medicalRecordId/'+medicalRecordId,
    method:'get',
  })
}
export function queryHospital(matchingString) {
  return request({
    url:"base/hospital/list/fuzzyMatching?matchingString="+matchingString,
    method:'get',
  })
}



