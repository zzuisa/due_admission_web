// Vue
import Vue from 'vue'
import App from './App'
// store
import 'xe-utils'
import ElementUI, {
  Button,
  Message,
  Upload,
  Select,
  Tabs
} from 'element-ui'
import axios from 'axios'
import VueCropper from 'vue-cropper'
import Antd, {
  Menu,
  Row,
  Col
} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import moment from 'moment'
import 'vxe-table/lib/index.css'
import XEClipboard from 'xe-clipboard'
import VXETable from 'vxe-table'
import enUS from 'vxe-table/lib/locale/lang/en-US'
import XEUtils from 'xe-utils/methods/xe-utils'

import store from '@/store/index'
// 模拟数据
import '@/mock'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'

// 菜单和路由设置
import router from './router'
import {
  menuAside2,
  menuHeader,
  menuAside
} from '@/config/menu'
import {
  frameInRoutes,
  router2
} from '@/config/routes'
import util from '@/libs/util.js'
Vue.use(VXETable)
Vue.use(XEClipboard)

VXETable.setup({
  i18n: key => XEUtils.get(enUS, key)
})
// 给 vue 实例挂载全局窗口对象
Vue.prototype.$XModal = VXETable.modal
Vue.config.productionTip = false
Vue.use(moment)
Vue.use(VueCropper)
Vue.use(Col)
Vue.use(Row)
Vue.use(Antd)
Vue.use(Menu)
Vue.use(Upload)
Vue.use(Button)
Vue.use(Select)
Vue.use(Message)
Vue.use(Tabs)
Vue.use(i18n)
Vue.use(ElementUI)
console.log('frameInRoutes', frameInRoutes, router2)

// 核心插件
Vue.use(d2Admin)

new Vue({
  router,
  store,
  i18n,
  el: '#app',
  render: h => h(App),
  created () {
    let user = JSON.parse(util.cookies.get('user'))
    let menu = user.username == 'admin' ? menuAside2 : menuAside
    console.log()
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    // this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 设置侧边栏菜单
    this.$store.commit('d2admin/menu/asideSet', menu)
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')
