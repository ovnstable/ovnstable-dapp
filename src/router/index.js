import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


import store from "../store";


import getOverview from "./midleware/getOverview"
import getRewardPools from "./midleware/getRewardPools"
import getProposals from "./midleware/getProposals"
import getDapp from "./midleware/getDapp"
import getFarm from "./midleware/getFarm"
import middlewarePipeline from "./middlewarePipeline";
import getFinance from "@/router/midleware/getFinance";
import getClientBalance from "@/router/midleware/getClientBalance";

const routes = [
    {
        path: '/',
        name: 'Dapp',
        component: () => import('../Dapp.vue'),

        children: [

            {
                path: '/',
                name: 'EarnView',
                component: () => import('../views/EarnView.vue'),
                meta: {
                    middleware: [
                        getDapp,
                    ]
                }
            },
            {
                path: '/fund',
                name: 'DashboardView',
                component: () => import('../views/DashboardView.vue'),
                meta: {
                    middleware: [
                        getDapp,
                    ]
                }
            },
            {
                path: '/dashboard',
                name: 'OvnStatementView',
                component: () => import('../views/OvnStatementView.vue'),
                meta: {
                    middleware: [
                        getClientBalance,
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
            },
            {
                path: '/farm',
                name: 'FarmView',
                component: () => import('../views/FarmView.vue'),
                meta: {
                    middleware: [
                        getFarm,
                    ]
                }
            },
            {
                path: '/preovn',
                name: 'PreOvnView',
                component: () => import('../views/PreOvnView.vue'),
                meta: {
                    middleware: [
                        getDapp,
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
