import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import '@/styles/index.scss' // global css
import htmlToPdf from "@/utils/html2pdf"
import App from './App'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap';
import '@/icons' // icon
import '@/permission' // permission control
import 'viewerjs/dist/viewer.css'
import VDistpicker from 'v-distpicker'

Vue.component('v-distpicker', VDistpicker)
import Viewer from 'v-viewer'
import VueClipboard from 'vue-clipboard2'
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

Vue.use(ElementUI, { locale })
Vue.use(VCharts)
Vue.config.productionTip = false
Vue.use(VueClipboard)
Vue.use(VueAMap);
Vue.use(Viewer);
Vue.use(htmlToPdf);
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
