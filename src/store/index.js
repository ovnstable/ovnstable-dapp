import Vue from 'vue';
import Vuex from 'vuex';
import profile from "./modules/profile";
import showTransactions from './modules/show-transaction';
import errorModal from './modules/error-modal';
import waitingModal from './modules/waiting-modal';
import successModal from './modules/success-modal';
import dashboardBalance from './modules/dashboard-balance.js';
import transaction from './modules/transaction'
import gasPrice from './modules/gas-price';
import airDrop from './modules/airdrop-dialog'
import linearPoolFeeding from './modules/linear-pool-feeding'
import stablePoolFeeding from './modules/stable-pool-feeding'
import web3 from "./modules/web3";
import accountProfile from './modules/account-profile';
import mintRedeemView from './modules/mint-redeem-view';
import governance from './modules_governance/governance';
import ethers from './modules_governance/ethers';
import approve from "@/store/modules/approve";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        profile,
        gasPrice,
        airDrop,
        linearPoolFeeding,
        stablePoolFeeding,
        showTransactions,
        errorModal,
        waitingModal,
        successModal,
        dashboardBalance,
        transaction,
        web3,
        accountProfile,
        mintRedeemView,
        governance,
        ethers,
        approve,
    },
    plugins: [createPersistedState({paths: ['transaction']})]
});
