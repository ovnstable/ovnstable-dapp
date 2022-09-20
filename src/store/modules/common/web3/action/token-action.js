import UsdPlusImage from "@/assets/usdPlus.json";
import WrappedUsdPlusImage from "@/assets/wUsdPlus.json";
import UsdPlusWmaticImage from "@/assets/usdPlusWmatic.json";
import WmaticImageUsdc from "@/assets/wmaticUsdc.json";
import EtsMoonstoneImage from "@/assets/ets_moonstone.json";
import UsdPlusWbnbImage from "@/assets/usdPlusWbnb.json";
import BusdWbnbImage from "@/assets/busdWbnb.json";
import EtsRubyImage from "@/assets/ets_ruby.json";
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

    async addUsdPlusWmaticToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.usdPlusWmatic.options.address,
                        symbol: process.env.VUE_APP_USD_PLUS_WMATIC_TOKEN_NAME,
                        decimals: 6,
                        image: UsdPlusWmaticImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('USD+/WMATIC successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addWmaticUsdcToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.wmaticUsdc.options.address,
                        symbol: process.env.VUE_APP_WMATIC_USDC_TOKEN_NAME,
                        decimals: 6,
                        image: WmaticImageUsdc.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('ETS WMATIC/USDC successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addEtsMoonstoneToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.etsMoonstoneToken.options.address,
                        symbol: process.env.VUE_APP_ETS_MOONSTONE_TOKEN_NAME,
                        decimals: 6,
                        image: EtsMoonstoneImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('ETS MOONSTONE successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addUsdPlusWbnbToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.usdPlusWbnb.options.address,
                        symbol: process.env.VUE_APP_USD_PLUS_WBNB_TOKEN_NAME,
                        decimals: 6,
                        image: UsdPlusWbnbImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('USD+/WBNB successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addBusdWbnbToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.busdWbnb.options.address,
                        symbol: process.env.VUE_APP_BUSD_WBNB_TOKEN_NAME,
                        decimals: 6,
                        image: BusdWbnbImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('BUSD/WBNB successfully added to wallet!')
                } else {
                    throw new Error('Something went wrong.')
                }
            })
            .catch(console.error)
    },

    async addEtsRubyToken({commit, dispatch, getters, rootState}) {

        await rootState.web3.provider
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: rootState.web3.contracts.etsRubyToken.options.address,
                        symbol: process.env.VUE_APP_ETS_RUBY_TOKEN_NAME,
                        decimals: 6,
                        image: EtsRubyImage.image,
                    },
                },
            })
            .then((success) => {
                if (success) {
                    console.log('ETS RUBY successfully added to wallet!')
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
