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

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {
  toastClassName: "toast",
};
Vue.use(Toast, options);


Vue.use(Vuex)

Vue.prototype.$moment = moment;
Vue.prototype.$utils = utils;
Vue.prototype.$abiDecoder = abiDecoder;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

import VueGtag from "vue-gtag";

Vue.use(VueGtag, {
  config: { id: "G-97YQSM714C" }
}, router);

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

// describe widget configuration and saving to a global variable for future use
var configuration = {
  from: 'USDC',
  to: 'USDC',
  fromChain: 'ETH',
  toChain: 'POLYGON',
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

// prevent accidental changes to the object, for example, when re-creating a widget for another theme
Object.freeze(configuration);

// create widget
rubicWidget.init(configuration);
