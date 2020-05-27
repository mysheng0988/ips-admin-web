import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'

import router from '@/router/index';
import { getToken ,setToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})
// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['access-token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  config.headers['service-id']="2000"
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
function refreshToken(){
   return service.post("/refreshtoken",{}).then((res)=>{
       if(res.code==200){
        let token=res.token;
        let refreshToken=res.refreshToken;
        setToken()
       }
   });
}
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    const config = response.config
    if(res.retcode||res.code==804||res.code=="200"){
      return response.data
      
    }else if(res.code=="601"||res.code=="602"){
      sessionStorage.clear()
      Message({
        message:"登录信息已过期",
        type: 'error',
        duration: 3 * 1000
      })
      router.push({path:"/login"})
      // if (!isRefreshing) {
      //   isRefreshing = true
      //   return refreshToken().then(res => {
      //     // 已经刷新了token，将所有队列中的请求进行重试
      //     requests.forEach(cb => cb())
      //     requests = []
      //     return service(config)
      //   }).catch(res => {
      //     console.error('refreshtoken error =>', res)
      //     router.push({path:"/login"})
      //   }).finally(() => {
      //     isRefreshing = false
      //   })
      // } else {
      //   // 正在刷新token，将返回一个未执行resolve的promise
      //   return new Promise((resolve) => {
      //     // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      //     requests.push(() => {
      //       resolve(service(config))
      //     })
      //   })
      // }


    }else{
      let message=res.message?res.message:res.msg;
      Message({
        message:message,
        type: 'error',
        duration: 3 * 1000
      })

      return Promise.reject('error')
    }
  },
  err => {
    console.log('err' + err)// for debug
    Message({
      message: "服务器连接失败",
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(err)
  }
)

export default service
