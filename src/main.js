import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import swal from 'sweetalert2';
window.Swal = swal;
import setupInterceptors from "@/services/setupInterceptors";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false
setupInterceptors(store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
