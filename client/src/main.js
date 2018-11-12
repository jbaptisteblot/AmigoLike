import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from './axios'

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.getItem("accessId") == null || localStorage.getItem("accessId").length === 0) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
