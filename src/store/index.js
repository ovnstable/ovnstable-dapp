import Vue from 'vue';
import Vuex from 'vuex';


// Modals
import errorModal from '@/store/modules/modals/error-modal';
import waitingModal from '@/store/modules/modals/waiting-modal';
import successModal from '@/store/modules/modals/success-modal';
import riskModal from '@/store/modules/modals/market/risk-disclosure-modal';
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
import accountData from '@/store/modules/views/account/data';
import transaction from '@/store/modules/views/account/transaction';

import menuUI from '@/store/modules/views/menu/ui';


// Governance
import governance from '@/store/modules_governance/governance';
import ethers from '@/store/modules_governance/ethers';


// Web3
import network from "@/store/modules/common/web3/network";
import walletAction from "@/store/modules/common/web3/action/wallet-action";
import contractAction from "@/store/modules/common/web3/action/contract-action";
import web3 from "@/store/modules/common/web3/web3";
import tokenAction from "@/store/modules/common/web3/action/token-action";
import dappDataAction from "@/store/modules/common/web3/action/dapp/dapp-data-action";
import dappUIAction from "@/store/modules/common/web3/action/dapp/dapp-ui-action";

// Common
import gasPrice from '@/store/modules/common/gas-price';
import supplyData from '@/store/modules/common/supply';

// Theme
import theme from '@/store/modules/theme/theme';

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        errorModal,
        waitingModal,
        successModal,
        investModal,
        swapModal,
        wrapModal,
        riskModal,

        dashboardData,
        dashboardUI,

        farmData,
        farmUI,

        statsData,
        statsUI,

        swapData,
        swapUI,

        wrapData,
        wrapUI,

        overcapData,

        marketData,
        marketUI,

        accountUI,
        accountData,

        transaction,

        menuUI,

        governance,
        ethers,

        network,
        walletAction,
        contractAction,
        web3,
        tokenAction,
        dappDataAction,
        dappUIAction,

        gasPrice,
        supplyData,

        theme
    },

    plugins: [
        createPersistedState({paths: ['transaction']})
    ]
});
