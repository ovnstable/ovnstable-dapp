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

import * as Sentry from "@sentry/vue";
import { CaptureConsole } from '@sentry/integrations';
import { BrowserTracing } from "@sentry/tracing";

import Web3 from "web3";

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

Sentry.init({
  Vue,
  dsn: "https://3ba3e27bc8674321b5e4177080ca8bf9@o4504417259552768.ingest.sentry.io/4504417260863488",
  // dsn: "https://e237794d4a6d441f9f9e8b4b8cd62a96@o4504559540305920.ingest.sentry.io/4504559547121664",
  logErrors: true,
  integrations: [
    new CaptureConsole({
      levels: ['debug', 'error']
    }),
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ["app.overnight.fi", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

Sentry.configureScope(function(scope) {
  scope.setLevel("debug");
});

async function initNetwork() {
  try {
    let web3 = await new Web3(Web3.givenProvider);
    let networkID = await web3.eth.net.getId();
    networkID = networkID + "";
    store.dispatch('network/saveNetworkToLocalStore', networkID, {root: true});
    console.log('main created networkId: ', networkID);
  } catch (e) {
    console.log("Error when init network:", e)
    //ignore
  }
}

Vue.use(Donut);

Vue.component('resize-observer', ResizeObserver)


initNetwork().then(() => {

  store.dispatch('network/changeDappNetwork', localStorage.getItem('selectedNetwork'), {root: true});

  new Vue({
    store,
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app')
})
