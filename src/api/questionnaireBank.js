import request from '@/utils/request'
export function insertQusetion(data) {
  return request({
    url: 'questionnaireBank/question',
    method: 'post',
    data: data
  })
}

export function fetchList(data) {
    return request({
      url: 'questionnaireBank/question/page/'+data.pageNum+"/"+data.pageSize,
      method: 'get',
    })
  }


  export function getQusetionNumInfo(num) {
    return request({
      url: 'questionnaireBank/question/'+num,
      method: 'get',
    })
  }

  export function updataQusetion(data) {
    return request({
      url: 'questionnaireBank/question',
      method: 'put',
      data: data
    })
  }
  
  export function insertQuestionnaire(data) {
    return request({
      url: 'questionnaireBank/questionnaire',
      method: 'post',
      data: data
    })
  }
  export function updateQuestionnaire(data) {
    return request({
      url: 'questionnaireBank/questionnaire',
      method: 'put',
      data: data
    })
  }

  export function fetchListTemp(data) {
    return request({
      url: 'questionnaireBank/questionnaire/page/'+data.pageNum+"/"+data.pageSize,
      method: 'get',
    })
  }
  
export function getTempInfo(num) {
  return request({
    url: 'questionnaireBank/questionnaire/'+num,
    method: 'get',
  })
}

export function getTempDetail(num) {
  return request({
    url: 'questionnaireBank/questionnaire/number/details/'+num,
    method: 'get',
  })
}