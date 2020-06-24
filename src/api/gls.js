import request from '@/utils/request'
export function testData(data) {
  return request({
    url:'kg/medications_treatment',
    method:'post',
    data:data
  })

}

