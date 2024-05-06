// 这个模块是对于axios实例的封装
/* 封装axios用于发送请求 */
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'

// 创建一个新的axios实例
const request = axios.create({
  baseURL: 'http://interview-api-t.itheima.net/',
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const token = store.state.user.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 所有的响应错误信息，统一处理
  if (error.response) {
    console.log(error.response)
    // 错误也需要细分情况
    // 1. 如果是 401 错误，说明 token 失效，给提示，清除失效token，拦登录
    if (error.response.status === 401) {
      Message.error('尊敬的用户，当前登录状态已过期')
      // 提交清除的mutation，完成失效token的移除
      store.commit('user/logout')
      // 拦截到登录
      router.push('/login')
    } else {
      // 2. 如果是 其他 错误，正常给提示
      Message.error(error.response.data.message)
    }
  }
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request
