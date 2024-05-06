import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Dashboard from '@/views/dashboard'
import Article from '@/views/article'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      // 配嵌套子路由
      // (1) 完整路径写法 /dashboard
      // (2) 相对路径写法 dashboard 会自动拼接上前面的父路由路径
      children: [
        { path: 'dashboard', component: Dashboard },
        { path: 'article', component: Article }
      ]
    }
  ]
})

// 白名单，定义成登录
const whiteList = ['/login']

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 1. 看有没有 token (vuex)，如果有，直接放行
  const token = store.state.user.token
  if (token) {
    next()
    return
  }

  // 2. 看是否在 白名单，如果在，直接放行
  if (whiteList.includes(to.path)) {
    next()
    return
  }

  // 3. 其他情况，拦截到登录
  next('/login')
})

export default router
