import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store";

// Governance sections
import getOverview from "./midleware/governance/getOverview"
import getRewardPools from "./midleware/governance/getRewardPools"
import getProposals from "./midleware/governance/getProposals"
import middlewarePipeline from "./middlewarePipeline";
import getFinance from "@/router/midleware/governance/getFinance";
import getAbroad from "@/router/midleware/governance/getAbroad";

// Dapp Sections
import Market from "./midleware/dapp/Market";
import Featured from "./midleware/dapp/Featured";
import Insurance from "./midleware/dapp/Insurance";
import Reserves from "./midleware/dapp/Reserves";
import Stats from "./midleware/dapp/Stats";
import DaiStats from "./midleware/dapp/DaiStats";
import UsdtStats from "./midleware/dapp/UsdtStats";
import Collateral from "./midleware/dapp/Collateral";
import CollateralDai from "./midleware/dapp/CollateralDai";
import CollateralUsdt from "./midleware/dapp/CollateralUsdt";
import Dashboard from "./midleware/dapp/Dashboard";
import Pools from "./midleware/dapp/Pools";

Vue.use(VueRouter)


const routes = [
    {
        path: '/',
        name: 'Dapp',
        component: () => import('../Dapp.vue'),

        children: [
            {
                path: '/market',
                name: 'MarketView',
                component: () => import('../views/MarketView.vue'),
                meta: {
                    middleware: [
                        Market
                    ]
                }
            },
            {
                path: '/market/archive',
                name: 'MarketArchiveView',
                component: () => import('../views/MarketArchiveView.vue'),
                meta: {
                    middleware: [
                        Market
                    ]
                }
            },
            {
                path: '/featured',
                name: 'FeaturedView',
                component: () => import('../views/FeaturedView.vue'),
                meta: {
                    middleware: [
                        Featured
                    ]
                }
            },
            {
                path: '/pools',
                name: 'UsdPoolsView',
                component: () => import('../views/UsdPoolsView.vue'),
                meta: {
                    middleware: [
                        Pools
                    ]
                }
            },
            {
                path: '/insurance',
                name: 'InsuranceView',
                component: () => import('../views/InsuranceView.vue'),
                meta: {
                    middleware: [
                        Insurance
                    ]
                }
            },
            {
                path: '/insurance/polygon',
                name: 'InsurancePageView',
                component: () => import('../views/insurance/InsurancePageView.vue'),
                meta: {
                    middleware: [
                        Insurance
                    ]
                }
            },
            {
                path: '/reserves',
                name: 'InsuranceReservesView',
                component: () => import('../views/InsuranceReservesView.vue'),
                meta: {
                    middleware: [
                        Reserves
                    ]
                }
            },
            {
                path: '/ets',
                redirect: '/market',
            },
            {
                path: '/ets/:name',
                name: 'EtsPageView',
                component: () => import('../views/strategy/ets/EtsPageView.vue'),
                meta: {
                    middleware: [
                        Market
                    ]
                }
            },
            {
                path: '/collateral',
                name: 'CollateralView',
                component: () => import('../views/performance/view/CollateralView.vue'),
                meta: {
                    middleware: [
                        Collateral,
                    ]
                }
            },
            {
                path: '/collateral/dai',
                name: 'CollateralDaiView',
                component: () => import('../views/performance/dai/view/CollateralView.vue'),
                meta: {
                    middleware: [
                        CollateralDai,
                    ]
                }
            },
            {
                path: '/collateral/usdt',
                name: 'CollateralUsdtView',
                component: () => import('../views/performance/usdt/view/CollateralView.vue'),
                meta: {
                    middleware: [
                        CollateralUsdt,
                    ]
                }
            },
            {
                path: '/stats',
                name: 'StatsPerformanceView',
                component: () => import('../views/performance/view/StatsPerformanceView.vue'),
                meta: {
                    middleware: [
                        Stats,
                    ]
                }
            },
            {
                path: '/stats/dai',
                name: 'StatsDaiPerformanceView',
                component: () => import('../views/performance/dai/view/StatsPerformanceView.vue'),
                meta: {
                    middleware: [
                        DaiStats,
                    ]
                }
            },
            {
                path: '/stats/usdt',
                name: 'StatsUsdtPerformanceView',
                component: () => import('../views/performance/usdt/view/StatsPerformanceView.vue'),
                meta: {
                    middleware: [
                        UsdtStats,
                    ]
                }
            },
            {
                path: '/',
                name: 'MyPerformanceView',
                component: () => import('../views/dashboard/MyPerformanceView'),
                meta: {
                    middleware: [
                        Dashboard
                    ]
                }
            },
        ],
    },

    {
        path: '/governance',
        name: 'Governance',
        component: () => import('../Governance.vue'),
        children: [
            {
                path: '/',
                name: 'Overview',
                component: () => import('../views/governance/Overview.vue'),
                meta: {
                    middleware: [
                        getOverview,
                    ]
                }
            },
            {
                path: '/governance/finance',
                name: 'Finance',
                component: () => import('../views/governance/Finance.vue'),
                meta: {
                    middleware: [
                        getFinance,
                    ]
                }
            },
            {
                path: '/governance/abroad',
                name: 'Abroad',
                component: () => import('../views/governance/Abroad.vue'),
                meta: {
                    middleware: [
                        getAbroad,
                    ]
                }
            },
            {
                path: '/governance/proposals',
                name: 'Proposals',
                component: () => import('../views/governance/Proposals.vue'),
                meta: {
                    middleware: [
                        getProposals,
                    ]
                }
            },
            {
                path: '/governance/control',
                name: 'Control',
                component: () => import('../views/governance/Control.vue'),
                meta: {
                    middleware: [
                        getOverview
                    ]
                }
            },
            {
                path: '/governance/reward_program',
                name: 'Reward program',
                component: () => import('../views/governance/RewardProgram.vue'),
                meta: {
                    middleware: [
                        getRewardPools
                    ]
                }
            },
        ],
    },

    {
        path: '/discord',
        name: 'Discord Connections',
        component: () => import('../Discord.vue'),
        children: [
            {
                path: '/discord/connect_wallet',
                name: 'Connect wallet',
                component: () => import('../views/discord/ConnectWallet.vue')
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {

    if (!to.meta.middleware || !to.meta.middleware.length) {
        console.debug(`root from:${from.path} to:${to.path} to.middleware:`, null);
        return next();
    }
    const middleware = to.meta.middleware;
    console.debug(`root from:${from.path} to:${to.path} to.middleware:`, middleware);

    const context = {
        to,
        from,
        next,
        store,
    };

    return middleware[0]({
        context,
        nextMiddleware: middlewarePipeline(context, middleware, 1)
    });

});

export default router;
