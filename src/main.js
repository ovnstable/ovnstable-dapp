import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from "./store/index.js";
import utils from "./plugins/utils";
import abiDecoder from "./plugins/abiDecoder";
import vuetify from './plugins/vuetify'
import router from './router/index'
import {axios} from './plugins/http-axios';
import moment from 'moment';

Vue.use(Vuex)

Vue.prototype.$moment = moment;
Vue.prototype.$utils = utils;
Vue.prototype.$abiDecoder = abiDecoder;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

import VueGtm from '@gtm-support/vue2-gtm';
Vue.use(VueGtm, {
  id: 'GTM-TBCD9KR',
  enabled: true,
  vueRouter: router,
  debug: false,
});

import VueYandexMetrika from 'vue-yandex-metrika'
Vue.use(VueYandexMetrika, {
  id: 86928892,
  router: router,
  env: process.env.NODE_ENV,
  options: {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true}
})

import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';
Vue.use(Donut);


new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')


// Rubic widget configuration part
var configuration = {
  from: 'USDC',
  to: 'USDC',
  fromChain: 'ETH',
  toChain: process.env.VUE_APP_POLYGON.toUpperCase(),
  amount: 1,
  iframe: 'vertical',
  hideSelectionFrom: false,
  hideSelectionTo: true,
  theme: 'dark',
  background: '#1d2029',
  language: 'en',
  injectTokens: {},
  slippagePercent: {
    instantTrades: 2,
    crossChain: 5
  }
}

Object.freeze(configuration);
rubicWidget.init(configuration);
