import request from '@/utils/request'
export function submitQuestion(params) {
  return request({
    url:'ips/questionnaire/inspection/submit',
    method:'post',
    data:params
  })
}

export function submitSacleQuestion(params) {
  return request({
    url:'ips/scale/submit',
    method:'post',
    data:params
  })
}
export function getMedicalRecord(params) {
  return request({
    url:'ips/medicalRecord/'+params,
    method:'get',
  })
}
export function getQuestionnaire(params) {
  return request({
    url:'ips/questionnaire/echo',
    method:'get',
    params:params,
  })
}
export function additionalQuestions(medicalRecordId) {
  return request({
    url:'ips/scale/additionalQuestions/'+medicalRecordId,
    method:'get',
  })
}
export function additionalScreeningA(medicalRecordId) {
  return request({
    url:'ips/scale/screeningA/'+medicalRecordId,
    method:'post',
  })
}
export function submitAdditionalQuestions(data) {
  return request({
    url:'ips/scale/additionalQuestions',
    method:'post',
    data:data
  })
}
export function scaleConfirm(data,medicalRecordId) {
  return request({
    url:'ips/scale/scaleConfirm/'+medicalRecordId,
    method:'post',
    data:data
  })
}

//获取量表分类
export function getScaleSelectData(medicalRecordId) {
  return request({
    url:'ips/scale/list/recommend/scaleByCategory',
    method:'get',
    params:{medicalRecordId:medicalRecordId}
  })
}
//获取已经选择量表
export function getScaleSelectedData(medicalRecordId) {
  return request({
    url:'ips/scale/list/completion',
    method:'get',
    params:{medicalRecordId:medicalRecordId}
  })
}

export function appendQuestionSubmit(data) {
  return request({
    url:'ips/questionnaire/appendQuestionSubmit',
    method:'post',
    data:data
  })
}


export function appendQuestion(medicalRecordId) {
  return request({
    url:'ips/questionnaire/appendQuestion/'+medicalRecordId,
    method:'get',
  })
}
export function getQuestionnaireDetail(params) {
  return request({
    url:'ips/questionnaire/details/',
    method:'get',
    params:params
  })
}
export function screeningQuestionSubmit(data) {
  return request({
    url:'ips/questionnaire/screening/submit',
    method:'post',
    data:data
  })
}
export function appendScreeningQuestion(data) {
  return request({
    url: 'ips/questionnaire/screening/appendQuestion/submit',
    method: 'post',
    data: data
  })
}