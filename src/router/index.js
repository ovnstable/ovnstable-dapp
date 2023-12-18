import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

// Governance sections
import middlewarePipeline from "./middlewarePipeline";

// Dapp Sections
import Market from "./midleware/dapp/Market";
import Featured from "./midleware/dapp/Featured";
import Insurance from "./midleware/dapp/Insurance";
import Stats from "./midleware/dapp/Stats";
import DaiStats from "./midleware/dapp/DaiStats";
import UsdtStats from "./midleware/dapp/UsdtStats";
import EthStats from "./midleware/dapp/EthStats";
import Collateral from "./midleware/dapp/Collateral";
import CollateralDai from "./midleware/dapp/CollateralDai";
import CollateralUsdt from "./midleware/dapp/CollateralUsdt";
import CollateralEth from "./midleware/dapp/CollateralEth";
import Dashboard from "./midleware/dapp/Dashboard";
import Pools from "./midleware/dapp/Pools";
import ProvideLp from "./midleware/dapp/ProvideLp";
import Swap from "./midleware/dapp/Swap";
import Presasle from "./midleware/dapp/Presasle";
import PresaleClaim from "./midleware/dapp/PresaleClaim";
import EtsAbout from "./midleware/dapp/EtsAbout";
import Bridge from "./midleware/dapp/Bridge";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dapp",
    component: () => import("../Dapp.vue"),

    children: [
      {
        path: "/christmas_pools",
        name: "ChristmasPoolsView",
        component: () => import("@/views/ChristmasPoolsView.vue")
      },
      {
        path: "/ets_about",
        name: "EtsAboutView",
        component: () => import("../views/EtsAboutView.vue"),
        meta: {
          middleware: [EtsAbout]
        }
      },
      {
        path: "/featured",
        name: "FeaturedView",
        component: () => import("../views/FeaturedView.vue"),
        meta: {
          middleware: [Featured]
        }
      },
      {
        path: "/pools",
        name: "PoolsView",
        component: () => import("../views/PoolsView.vue"),
        meta: {
          middleware: [Pools]
        }
      },
      {
        path: "/provide-lp",
        name: "ProvideLpView",
        component: () => import("../views/ProvideLpView.vue"),
        meta: {
          middleware: [ProvideLp]
        }
      },
      {
        path: "/",
        redirect: "/swap"
      },
      {
        path: "/swap",
        name: "SwapView",
        component: () => import("../views/SwapView.vue"),
        meta: {
          middleware: [Swap]
        }
      },
      {
        path: "/bridge",
        name: "BridgeView",
        component: () => import("../views/BridgeView.vue"),
        meta: {
          middleware: [Bridge]
        }
      },
      {
        path: "/presale",
        name: "PresaleView",
        component: () => import("../views/presale/PresaleView.vue"),
        meta: {
          middleware: [Presasle]
        }
      },
      {
        path: "/presale/claim",
        name: "ClaimView",
        component: () => import("../views/presale/ClaimView.vue"),
        meta: {
          middleware: [PresaleClaim]
        }
      },
      {
        path: "/insurance",
        name: "InsuranceView",
        component: () => import("../views/InsuranceView.vue"),
        meta: {
          middleware: [Insurance]
        }
      },
      {
        path: "/insurance/network/:network",
        name: "InsurancePageView",
        component: () => import("../views/insurance/InsurancePageView.vue"),
        meta: {
          middleware: [Insurance]
        }
      },
      {
        path: "/insurance/collateral/:network",
        name: "InsuranceCollateralView",
        component: () =>
          import("../views/insurance/InsuranceCollateralView.vue"),
        meta: {
          middleware: [Insurance]
        }
      },
      {
        path: "/ets",
        redirect: "/market"
      },
      {
        path: "/ets/:name",
        name: "EtsPageView",
        component: () => import("../views/strategy/ets/EtsPageView.vue"),
        meta: {
          middleware: [Market]
        }
      },
      {
        path: "/collateral",
        name: "CollateralView",
        component: () => import("../views/performance/view/CollateralView.vue"),
        meta: {
          middleware: [Collateral]
        }
      },
      {
        path: "/collateral/dai",
        name: "CollateralDaiView",
        component: () =>
          import("../views/performance/dai/view/CollateralView.vue"),
        meta: {
          middleware: [CollateralDai]
        }
      },
      {
        path: "/collateral/usdt",
        name: "CollateralUsdtView",
        component: () =>
          import("../views/performance/usdt/view/CollateralView.vue"),
        meta: {
          middleware: [CollateralUsdt]
        }
      },
      {
        path: "/collateral/eth",
        name: "CollateralEthView",
        component: () =>
          import("../views/performance/eth/view/CollateralView.vue"),
        meta: {
          middleware: [CollateralEth]
        }
      },
      {
        path: "/stats",
        name: "StatsPerformanceView",
        component: () =>
          import("../views/performance/view/StatsPerformanceView.vue"),
        meta: {
          middleware: [Stats]
        }
      },
      {
        path: "/stats/dai",
        name: "StatsDaiPerformanceView",
        component: () =>
          import("../views/performance/dai/view/StatsPerformanceView.vue"),
        meta: {
          middleware: [DaiStats]
        }
      },
      {
        path: "/stats/usdt",
        name: "StatsUsdtPerformanceView",
        component: () =>
          import("../views/performance/usdt/view/StatsPerformanceView.vue"),
        meta: {
          middleware: [UsdtStats]
        }
      },
      {
        path: "/stats/eth",
        name: "StatsEthPerformanceView",
        component: () =>
          import("../views/performance/eth/view/StatsPerformanceView.vue"),
        meta: {
          middleware: [EthStats]
        }
      },
      {
        path: "/dashboard",
        name: "MyPerformanceView",
        component: () => import("../views/dashboard/MyPerformanceView"),
        meta: {
          middleware: [Dashboard]
        }
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware || !to.meta.middleware.length) {
    console.debug(`root from:${from.path} to:${to.path} to.middleware:`, null);
    return next();
  }
  const middleware = to.meta.middleware;
  console.debug(
    `root from:${from.path} to:${to.path} to.middleware:`,
    middleware
  );

  const context = {
    to,
    from,
    next,
    store
  };

  return middleware[0]({
    context,
    nextMiddleware: middlewarePipeline(context, middleware, 1)
  });
});

export default router;
