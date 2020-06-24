import request from '@/utils/request'
export function readCard() {
  return request({
    url:'api/ReadMsg',
    method:'get'
  })
}
export function readCardReset() {
  return request({
    url:'api/M1Reset',
    method:'get'
  })
}
export function M1AuthenKey() {
  return request({
    url:'api/M1AuthenKey?KeyType=0&BlockNo=38&Key=ffffffffffff',
    method:'get'
  })
}
export function readCardWriteData() {
  return request({
    url:'api/M1ReadBlock?BlockNo=38',
    method:'get'
  })
}
export function M1WriteBlock(){
  return request({
    url:"api/M1WriteBlock?BlockNo=9&Data=11223344556677889900112233445566",
    method:'get'
  })
}
