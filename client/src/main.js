import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import echarts from 'echarts'
import router from './router'
import store from './store'
import axios from './http'
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
echarts.dataTool = require("echarts/extension-src/dataTool/gexf");
Vue.prototype.$echarts = echarts;
Vue.prototype.$dataTool = echarts.dataTool;
Vue.config.productionTip = false

Vue.use(ElementUI, { locale });
Vue.prototype.$http = axios;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
