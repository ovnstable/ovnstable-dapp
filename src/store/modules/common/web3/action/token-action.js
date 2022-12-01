import UsdPlusImage from "@/assets/usdPlus.json";
import WrappedUsdPlusImage from "@/assets/wUsdPlus.json";
import OvnImage from "@/assets/ovn.json";

const state = {};

const getters = {};

const actions = {
    async addUsdPlusToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.usdPlus.options.address,
                        symbol: process.env.VUE_APP_USD_TOKEN_NAME,
                        decimals: 6,
                        image: UsdPlusImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('USD+ successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addwUsdPlusToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.wUsdPlus.options.address,
                        symbol: process.env.VUE_APP_WRAPPED_USD_TOKEN_NAME,
                        decimals: 6,
                        image: WrappedUsdPlusImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('wUSD+ successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addEtsToken({commit, dispatch, getters, rootState}, etsData) {

        let etsImage = require("@/assets/" + etsData.iconName + '.json');

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts[etsData.tokenContract].options.address,
                        symbol: etsData.nameToken,
                        decimals: etsData.etsTokenDecimals,
                        image: etsImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.debug('ETS successfully added to wallet!')
                } else {
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
                if (success) {
                    console.log('OVN successfully added to wallet!')
                } else {
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
