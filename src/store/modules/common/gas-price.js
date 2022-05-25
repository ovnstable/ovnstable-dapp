const {axios} = require('@/plugins/http-axios');


const state = {

    show: false,

    gasPriceStation: {
        low: 10,
        standard: 20,
        fast: 30,
        ultra: 50,

        suggestBaseFee: 0,
        usdPrice: 0
    },

    gasPriceType: 'standard',
    gasPrice: 0,
    gasPriceGwei: '0',
};

const getters = {

    show(state) {
        return state.show;
    },

    gasPriceStation(state) {
        return state.gasPriceStation;
    },

    gasPrice(state) {
        return state.gasPrice;
    },

    gasPriceGwei(state) {
        return state.gasPriceGwei;
    },

    gasPriceType(state) {
        return state.gasPriceType;
    },
};

const actions = {

    async showGasSettings({commit, dispatch, getters, rootState}) {
        dispatch('refreshGasPrice');
        commit('setShow', true);
    },

    async hideGasSettings({commit, dispatch, getters, rootState}) {
        commit('setShow', false);
    },

    async refreshGasPrice({commit, dispatch, getters, rootState}) {

        axios.get('https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle').then(value => {

            let result = value.data.result;
            let price = {
                low: result.SafeGasPrice,
                standard: result.ProposeGasPrice,
                fast: result.FastGasPrice,
                ultra: result.FastGasPrice * 3,

                suggestBaseFee: result.suggestBaseFee,
                usdPrice: result.UsdPrice
            }
            commit('setGasPriceStation', price);

            let element = price[getters.gasPriceType];

            commit('setGasPrice', element)
            commit('setGasPriceGwei', rootState.web3.web3.utils.toWei(element + "", 'gwei'))
        }).catch(reason => {
            console.log('Error get gas price: ' + reason)
        })
    },
};

const mutations = {

    setShow(state, value) {
        state.show = value;
    },

    setGasPriceStation(state, value) {
        state.gasPriceStation = value;
    },

    setGasPriceType(state, value) {
        state.gasPriceType = value;
    },

    setGasPrice(state, value) {
        state.gasPrice = value;
    },


    setGasPriceGwei(state, value) {
        state.gasPriceGwei = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
