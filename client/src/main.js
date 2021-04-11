import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import * as echarts from 'echarts'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import api from './api/'

Vue.prototype.$echarts = echarts;
Vue.prototype.$api = api
Vue.config.productionTip = false

Vue.use(ElementUI, { locale });
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
