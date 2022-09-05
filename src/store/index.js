import Vue from 'vue';
import Vuex from 'vuex';


// Modals
import errorModal from '@/store/modules/modals/error-modal';
import waitingModal from '@/store/modules/modals/waiting-modal';
import successModal from '@/store/modules/modals/success-modal';
import riskModal from '@/store/modules/modals/market/risk-disclosure-modal';
import investorModal from '@/store/modules/modals/market/investor-modal';
import investModal from '@/store/modules/modals/market/invest-modal';
import swapModal from '@/store/modules/modals/swap/swap-modal';
import wrapModal from '@/store/modules/modals/wrap/wrap-modal';


// Views

import dashboardData from '@/store/modules/views/dashboard/data';
import dashboardUI from '@/store/modules/views/dashboard/ui';

import farmData from "@/store/modules/views/farm/data";
import farmUI from "@/store/modules/views/farm/ui";

import statsData from "@/store/modules/views/stats/data";
import statsUI from "@/store/modules/views/stats/ui";

import swapData from "@/store/modules/views/swap/data";
import swapUI from "@/store/modules/views/swap/ui";

import overcapData from "@/store/modules/views/market/overcap";
import marketData from "@/store/modules/views/market/data";
import marketUI from "@/store/modules/views/market/ui";

import wrapData from "@/store/modules/views/wrap/data";
import wrapUI from "@/store/modules/views/wrap/ui";

import accountUI from '@/store/modules/views/account/ui';
import accountData  from '@/store/modules/views/account/data';
import transaction from '@/store/modules/views/account/transaction';

import airdropUI from '@/store/modules/views/airdrop/ui';

import menuUI from '@/store/modules/views/menu/ui';


// Pools

import linearPoolFeeding from '@/store/modules/pools/linear-pool-feeding'
import linearPoolFeedingUnstake from '@/store/modules/pools/linear-pool-feeding-unstake'
import linearPoolDAI from '@/store/modules/pools/linear-pool-dai'
import linearPoolUsdt from '@/store/modules/pools/linear-pool-usdt'
import stablePoolFeeding from '@/store/modules/pools/stable-pool-feeding'


// Governance

import governance from '@/store/modules_governance/governance';
import ethers from '@/store/modules_governance/ethers';


// Common

import network from "@/store/modules/common/network";
import gasPrice from '@/store/modules/common/gas-price';
import web3 from "@/store/modules/common/web3";
import supplyData  from '@/store/modules/common/supply';

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        errorModal,
        waitingModal,
        successModal,
        riskModal,
        investorModal,
        investModal,
        swapModal,
        wrapModal,

        dashboardData,
        dashboardUI,
        farmData,
        farmUI,
        statsData,
        statsUI,
        swapData,
        swapUI,
        overcapData,
        marketData,
        marketUI,
        wrapData,
        wrapUI,
        accountUI,
        accountData,
        transaction,

        airdropUI,

        menuUI,

        linearPoolFeedingUnstake,
        linearPoolFeeding,
        linearPoolDAI,
        linearPoolUsdt,
        stablePoolFeeding,


        governance,
        ethers,

        network,
        gasPrice,
        web3,
        supplyData
    },
    plugins: [createPersistedState({paths: ['transaction']})]
});
