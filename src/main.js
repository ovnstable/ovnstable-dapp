import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from "./store/index.js";
import utils from "./plugins/utils";
import wu from "./plugins/window-utils";
import colorUtils from "./plugins/color-utils";
import abiDecoder from "./plugins/abiDecoder";
import vuetify from './plugins/vuetify'
import router from './router/index'
import {axios} from './plugins/http-axios';
import moment from 'moment';
import VueGtm from '@gtm-support/vue2-gtm';
import VueYandexMetrika from 'vue-yandex-metrika'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';
import 'vue-resize/dist/vue-resize.css'
import {ResizeObserver} from 'vue-resize'

Vue.use(Vuex)

Vue.prototype.$moment = moment;
Vue.prototype.$utils = utils;
Vue.prototype.$wu = wu;
Vue.prototype.$colorUtils = colorUtils;
Vue.prototype.$abiDecoder = abiDecoder;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

Vue.use(VueGtm, {
  id: 'GTM-TBCD9KR',
  enabled: true,
  vueRouter: router,
  debug: false,
});

Vue.use(VueYandexMetrika, {
  id: 86928892,
  router: router,
  env: process.env.NODE_ENV,
  options: {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true}
})

Vue.use(Donut);

Vue.component('resize-observer', ResizeObserver)

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
