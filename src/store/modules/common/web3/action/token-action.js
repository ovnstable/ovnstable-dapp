import UsdPlusImage from "@/assets/usdPlus.json";
import DaiPlusImage from "@/assets/daiPlus.json";
import UsdtPlusImage from "@/assets/usdtPlus.json";
import WrappedUsdPlusImage from "@/assets/wUsdPlus.json";
import PolygonInsurance from "@/assets/polygon_insurance.json";
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

        console.log('addUsdPlusToken: ', option)

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

    async addDaiPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.daiPlus.options.address,
            symbol: process.env.VUE_APP_DAI_TOKEN_NAME,
            decimals: 18,
            image: DaiPlusImage.image,
        };

        console.log('addDaiPlusToken: ', option)

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (success) {
                    console.log('Dai+ successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addUsdtPlusToken({commit, dispatch, getters, rootState}) {
        let option = {
            address: rootState.web3.contracts.usdtPlus.options.address,
            symbol: process.env.VUE_APP_USDT_TOKEN_NAME,
            decimals: 18,
            image: UsdtPlusImage.image,
        };

        console.log('addUsdtPlusToken: ', option)

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (success) {
                    console.log('Usdt+ successfully added to wallet!')
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

    async addInsuranceToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.insurance.polygon_token.options.address,
                        symbol: 'USD+ INS',
                        decimals: 6,
                        image: PolygonInsurance.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('USD+ INS successfully added to wallet!')
                } else {
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

        console.log('addETSToken: ', option)

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: option,
                },
            })
            .then((success) => {
                if (success) {
                    console.log('ETS successfully added to wallet!')
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
