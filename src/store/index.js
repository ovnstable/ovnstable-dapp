import Vue from "vue";
import Vuex from "vuex";

// Modals
import errorModal from "@/store/modules/modals/error-modal";
import waitingModal from "@/store/modules/modals/waiting-modal";
import successModal from "@/store/modules/modals/success-modal";
import riskModal from "@/store/modules/modals/market/risk-disclosure-modal";
import insuranceRiskModal from "@/store/modules/modals/insurance/insuranse-risk-modal";
import insuranceInvestModal from "@/store/modules/modals/insurance/insurance-invest-modal";
import investModal from "@/store/modules/modals/market/invest-modal";
import swapModal from "@/store/modules/modals/swap/swap-modal";
import swapDaiModal from "@/store/modules/modals/swap/swap-dai-modal";
import swapUsdtModal from "@/store/modules/modals/swap/swap-usdt-modal";
import swapUsdcModal from "@/store/modules/modals/swap/swap-usdc-modal";
import swapEthModal from "@/store/modules/modals/swap/swap-eth-modal";
import wrapModal from "@/store/modules/modals/wrap/wrap-modal";
import ethWrapModal from "@/store/modules/modals/wrap/eth-wrap-modal";
import bscInfoModal from "@/store/modules/modals/bsc-info-modal";

// Views
import dashboardData from "@/store/modules/views/dashboard/data";
import dashboardUI from "@/store/modules/views/dashboard/ui";

import swapData from "@/store/modules/views/swap/data";
import swapUI from "@/store/modules/views/swap/ui";

import swapDaiData from "@/store/modules/views/swap/dai/data";
import swapDaiUI from "@/store/modules/views/swap/dai/ui";

import swapUsdtData from "@/store/modules/views/swap/usdt/data";
import swapUsdtUI from "@/store/modules/views/swap/usdt/ui";

import swapEthData from "@/store/modules/views/swap/eth/data";
import swapEthUI from "@/store/modules/views/swap/eth/ui";

import overcapData from "@/store/modules/views/market/overcap";
import marketData from "@/store/modules/views/market/data";
import marketUI from "@/store/modules/views/market/ui";

import insuranceData from "@/store/modules/views/insurance/data";

import wrapEthData from "@/store/modules/views/wrap/WETH";
import wrapData from "@/store/modules/views/wrap/data";
import wrapUI from "@/store/modules/views/wrap/ui";

import accountUI from "@/store/modules/views/account/ui";
import accountData from "@/store/modules/views/account/data";
import transaction from "@/store/modules/views/account/transaction";

import menuUI from "@/store/modules/views/menu/ui";

// Web3
import network from "@/store/modules/common/web3/network";
import walletAction from "@/store/modules/common/web3/action/wallet-action";
import contractAction from "@/store/modules/common/web3/action/contract-action";
import web3 from "@/store/modules/common/web3/web3";
import tokenAction from "@/store/modules/common/web3/action/token-action";
import dappDataAction from "@/store/modules/common/web3/action/dapp/dapp-data-action";
import dappUIAction from "@/store/modules/common/web3/action/dapp/dapp-ui-action";

//Market
import etsAction from "@/store/modules/common/web3/action/ets-action";

// Common
import gasPrice from "@/store/modules/common/gas-price";
import supplyData from "@/store/modules/common/supply";
import referral from "@/store/modules/common/referral";
import track from "@/store/modules/common/track";

import magicEye from "@/store/modules/magic-eye/magic-eye";

// Theme
import theme from "@/store/modules/theme/theme";
import deprecated from "@/store/modules/chains/deprecated";

import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    errorModal,
    waitingModal,
    successModal,
    investModal,
    swapModal,
    swapDaiModal,
    swapUsdtModal,
    swapEthModal,
    wrapModal,
    ethWrapModal,
    riskModal,
    insuranceRiskModal,
    insuranceInvestModal,
    bscInfoModal,

    dashboardData,
    dashboardUI,

    swapData,
    swapUI,

    swapDaiData,
    swapDaiUI,

    swapUsdtData,
    swapUsdcModal,
    swapUsdtUI,

    swapEthData,
    swapEthUI,

    wrapData,
    wrapEthData,
    wrapUI,

    overcapData,

    marketData,
    marketUI,

    insuranceData,

    accountUI,
    accountData,

    transaction,

    menuUI,

    network,
    walletAction,
    contractAction,
    web3,
    tokenAction,
    dappDataAction,
    dappUIAction,

    etsAction,

    gasPrice,
    supplyData,
    referral,
    track,

    theme,
    deprecated,

    magicEye
  },

  plugins: [createPersistedState({ paths: ["transaction"] })]
});
