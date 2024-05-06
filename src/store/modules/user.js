import { login } from '@/api/user'
import { setToken, getToken, delToken } from '@/utils/storage'
// user模块相关
export default {
  namespaced: true,
  state () {
    return {
      // vuex的初始数据，默认应该从本地获取，如果本地没有，才初始化为 ''
      token: getToken() || '',
      words: '测试数据'
    }
  },
  mutations: {
    setUserToken (state, newToken) {
      state.token = newToken
      // 存入vuex的同时，持久化一份到本地
      setToken(newToken)
    },
    logout (state) {
      state.token = ''
      // 清除vuex的同时，需要将本地的也清空
      delToken()
    }
  },
  actions: {
    // async 函数的返回值，就是一个promise，所以action函数的调用
    // 可以通过 await 判定是否成功
    async loginAction (context, obj) {
      // 发送登录请求
      const res = await login(obj)
      // commit mutation
      context.commit('setUserToken', res.data.token)
    }
  },
  getters: {

  }
}
