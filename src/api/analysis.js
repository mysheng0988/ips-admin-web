import request from '@/utils/request'
export function analysisData(params) {
  return request({
    url:'ips/report/medicalRecordId/'+params.medicalRecordId,
    method:'get',
    params:params
  })
}
export function analysisFirstData(params) {
  return request({
    url:'ips/report/first/medicalRecordId/'+params.medicalRecordId,
    method:'get',
    params:params
  })
}
export function updataData(data) {
  return request({
    url:'ips/report/',
    method:'put',
    data:data
  })
}
export function saveContraindications(data,medicalRecordId) {
  return request({
    url:'ips/report/filter/contraindications/'+medicalRecordId,
    method:'post',
    data:data
  })
}
export function saveFilter(data,medicalRecordId) {
  return request({
    url:'ips/report/filter/interaction/'+medicalRecordId,
    method:'post',
    data:data
  })
}

export function updataReportData(data) {
  return request({
    url:'ips/report/submit',
    method:'put',
    data:data
  })
}



export function medicationsTreatment(params) {
  return request({
    url:'ips/report/medicationsTreatment/'+params.medicalRecordId,
    method:'put',
  })
}
//药品过滤
export function filterParam(medicalRecordId) {
  return request({
    url:'ips/report/filterParam/'+medicalRecordId,
    method:'get',
  })
}
//保存过滤药品
export function saveMedicationsTreatment(data) {
  return request({
    url:'ips/report/medicationsTreatment',
    method:'put',
    data:data
  })
}