import App from './App'
import config from './config.js'
import request from './utils/request.js' 

// #ifndef VUE3
import Vue from 'vue'

Vue.prototype.config = config
Vue.prototype.request = request
App.mpType = 'app'

import uView from "uview-ui"
Vue.use(uView)

let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif