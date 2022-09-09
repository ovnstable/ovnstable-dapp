import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store";

// Governance sections
import getOverview from "./midleware/governance/getOverview"
import getRewardPools from "./midleware/governance/getRewardPools"
import getProposals from "./midleware/governance/getProposals"
import middlewarePipeline from "./middlewarePipeline";
import getFinance from "@/router/midleware/governance/getFinance";

// Dapp Sections
import Market from "./midleware/dapp/Market";
import Wmatic from "./midleware/dapp/Wmatic";
import Wbnb from "./midleware/dapp/Wbnb";
import Stats from "./midleware/dapp/Stats";
import Collateral from "./midleware/dapp/Collateral";
import Dashboard from "./midleware/dapp/Dashboard";

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
                        Market,
                    ]
                }
            },
            {
                path: '/ets',
                redirect: '/market',
            },
            {
                path: '/ets/usd-plus-wbnb',
                name: 'WbnbPageView',
                component: () => import('../views/strategy/wbnb/WbnbPageView.vue'),
                meta: {
                    middleware: [
                        Wbnb
                    ]
                }
            },
            {
                path: '/ets/busd-wbnb',
                name: 'BusdWbnbPageView',
                component: () => import('../views/strategy/busdWbnb/BusdWbnbPageView.vue'),
                meta: {
                    middleware: [
                        Wbnb
                    ]
                }
            },
            {
                path: '/ets/usd-plus-wmatic',
                name: 'WmaticPageView',
                component: () => import('../views/strategy/wmatic/WmaticPageView.vue'),
                meta: {
                    middleware: [
                        Wmatic
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
