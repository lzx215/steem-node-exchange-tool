import Vue from 'vue'
import root from './root.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)

new Vue({ // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
})
