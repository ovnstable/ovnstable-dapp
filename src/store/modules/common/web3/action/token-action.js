import UsdPlusImage from "@/assets/usdPlus.json";
import DaiPlusImage from "@/assets/daiPlus.json";
import UsdtPlusImage from "@/assets/usdtPlus.json";
import EthPlusImage from "@/assets/ethPlus.json";
import wETHPlusImage from "@/assets/wEthPlus.json"
import WrappedUsdPlusImage from "@/assets/wUsdPlus.json";
import OptimismInsurance from "@/assets/optimism_insurance.json";
import OvnImage from "@/assets/ovn.json";

const state = {};

const getters = {};

const actions = {
    async addUsdPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.usdPlus.options.address,
            symbol: process.env.VUE_APP_USD_TOKEN_NAME,
            decimals: 6,
            image: UsdPlusImage.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addDaiPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.daiPlus.options.address,
            symbol: process.env.VUE_APP_DAI_TOKEN_NAME,
            decimals: 18,
            image: DaiPlusImage.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {                   
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addUsdtPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.usdtPlus.options.address,
            symbol: process.env.VUE_APP_USDT_TOKEN_NAME,
            decimals: 6,
            image: UsdtPlusImage.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addEthPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.ethPlus.options.address,
            symbol: process.env.VUE_APP_ETH_TOKEN_NAME,
            decimals: 18,
            image: EthPlusImage.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {                   
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addwEthPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.wEthPlus.options.address,
            symbol: process.env.VUE_APP_WRAPPED_ETH_TOKEN_NAME,
            decimals: 18,
            image: wETHPlusImage.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {             
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },



    async addwUsdPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.wUsdPlus.options.address,
            symbol: process.env.VUE_APP_WRAPPED_USD_TOKEN_NAME,
            decimals: 6,
            image: WrappedUsdPlusImage.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {                  
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addInsuranceToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.insurance.optimism_token.options.address,
            symbol: 'OVN INS',
            decimals: 18,
            image: OptimismInsurance.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {                
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addEtsToken({commit, dispatch, getters, rootState}, etsData) {


        let etsImage = require("@/assets/" + etsData.iconName + '.json');

        let option = {
            address: rootState.web3.contracts[etsData.tokenContract].options.address,
            symbol: etsData.nameToken,
            decimals: etsData.etsTokenDecimals,
            image: etsImage.image,
        };

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (!success) {                   
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addOvnToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.govToken.options.address,
                        symbol: process.env.VUE_APP_OVN_TOKEN_NAME,
                        decimals: 18,
                        image: OvnImage.image,
                    },
                },
            })
            .then((success) => {
                if (!success) {                 
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },
};

const mutations = {};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
