import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


import store from "../store";

import getDapp from "./midleware/getDapp"


// Governance sections

import getOverview from "./midleware/governance/getOverview"
import getRewardPools from "./midleware/governance/getRewardPools"
import getProposals from "./midleware/governance/getProposals"
import middlewarePipeline from "./middlewarePipeline";
import getFinance from "@/router/midleware/governance/getFinance";

// Dapp Sections
import Swap from "./midleware/dapp/Swap";
import Market from "./midleware/dapp/Market";
import Wmatic from "./midleware/dapp/Wmatic";
import Wrap from "./midleware/dapp/Wrap";
import Farm from "./midleware/dapp/Farm";
import Stats from "./midleware/dapp/Stats";
import Dashboard from "./midleware/dapp/Dashboard";
import PreOvn from "./midleware/dapp/PreOvn";


const routes = [
    {
        path: '/',
        name: 'Dapp',
        component: () => import('../Dapp.vue'),

        children: [
            {
                path: '/',
                name: 'MarketView',
                component: () => import('../views/MarketView.vue'),
                meta: {
                    middleware: [
                        Market,
                    ]
                }
            },
            {
                path: '/hedged',
                name: 'WmaticPageView',
                component: () => import('../views/strategy/WmaticPageView.vue'),
                meta: {
                    middleware: [
                        Wmatic,
                    ]
                }
            },
            /*{
                path: '/',
                name: 'SwapView',
                component: () => import('../views/SwapView.vue'),
                meta: {
                    middleware: [
                        Swap,
                    ]
                }
            },
            {
                path: '/wrap',
                name: 'WrapView',
                component: () => import('../views/WrapView.vue'),
                meta: {
                    middleware: [
                        Wrap,
                    ]
                }
            },
            {
                path: '/fund',
                name: 'StatsView',
                component: () => import('../views/StatsView.vue'),
                meta: {
                    middleware: [
                        Stats,
                    ]
                }
            },
            {
                path: '/dashboard',
                name: 'DashboardView',
                component: () => import('../views/DashboardView.vue'),
                meta: {
                    middleware: [
                        Dashboard,
                    ]
                }
            },
            {
                path: '/farm',
                name: 'FarmView',
                component: () => import('../views/FarmView.vue'),
                meta: {
                    middleware: [
                        Farm,
                    ]
                }
            },
            {
                path: '/preovn',
                name: 'PreOvnView',
                component: () => import('../views/PreOvnView.vue'),
                meta: {
                    middleware: [
                        PreOvn,
                    ]
                }
            },

            {
                path: '/poolsFeeding',
                name: 'PoolFeedingView',
                component: () => import('../views/PoolFeedingView.vue'),
                meta: {
                    middleware: [
                        getDapp,
                    ]
                }
            },*/
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
        console.log(`root from:${from.path} to:${to.path} to.middleware:`, null);
        return next();
    }
    const middleware = to.meta.middleware;
    console.log(`root from:${from.path} to:${to.path} to.middleware:`, middleware);

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
