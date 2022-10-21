import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
// import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'

import {
  ACCESS_TOKEN,
  // DEFAULT_COLOR,
  // DEFAULT_THEME,
  // DEFAULT_LAYOUT_MODE,
  // DEFAULT_COLOR_WEAK,
  // SIDEBAR_TYPE,
  // DEFAULT_FIXED_HEADER,
  // DEFAULT_FIXED_HEADER_HIDDEN,
  // DEFAULT_FIXED_SIDEMENU,
  // DEFAULT_CONTENT_WIDTH_TYPE,
  // DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

const storageOptions =  {
  namespace: 'pro__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
}

Vue.use(Storage,storageOptions)
Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

bootstrap({router, store, i18n, message: Vue.prototype.$message})

new Vue({
  router,
  store,
  i18n,
  mounted () {
    // store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
    // store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    // store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    // store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    // store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    // store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    // store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    // store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    // store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    // store.commit('SET_MULTI_PAGE',Vue.ls.get(DEFAULT_MULTI_PAGE,config.multipage))
  },
  render: h => h(App),
}).$mount('#app')
