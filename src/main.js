import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/element-ui'
import './styles/index.scss'
import './styles/common.scss'

// element-ui 全部导入 => 立刻可以使用整个组件库的所有组件
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
