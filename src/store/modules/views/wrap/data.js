const state = {

    index: null,
    amountPerUsdPlus: null,
    amountPerWUsdPlus: null,
};

const getters = {

    index(state) {
        return state.index;
    },

    amountPerUsdPlus(state) {
        return state.amountPerUsdPlus;
    },

    amountPerWUsdPlus(state) {
        return state.amountPerWUsdPlus;
    },
};

const actions = {

    async refreshWrap({commit, dispatch, getters, rootState}) {
        console.log('WrapData: refreshWrap');

        if (rootState.web3.contracts === null)
            return;

        dispatch('loadIndex');
        dispatch('loadAmountPerUsdPlus');
        dispatch('loadAmountWPerUsdPlus');

        dispatch('accountData/refreshBalance', null, {root: true});
        dispatch('supplyData/refreshSupply', null, {root:true});
        dispatch('supplyData/refreshInsuranceSupply', null, {root:true});
    },

    async loadIndex({commit, dispatch, getters, rootState}) {

        let index = await rootState.web3.contracts.wUsdPlus.methods.rate().call();
        commit('setIndex', index.substring(0, 3) / 100);

    },

    async loadAmountWPerUsdPlus({commit, dispatch, getters, rootState}) {

        let utils = rootState.web3.web3.utils;
        let address = rootState.web3.contracts.usdPlus.options.address;
        let sum = utils.toWei("1", 'mwei');

        let value = await rootState.web3.contracts.market.methods.previewUnwrap(address, sum).call();
        value = utils.fromWei(value, 'mwei');

        commit('setAmountPerWUsdPlus', value);
    },

    async loadAmountPerUsdPlus({commit, dispatch, getters, rootState}) {

        let utils = rootState.web3.web3.utils;

        let address = rootState.web3.contracts.usdPlus.options.address;
        let sum = utils.toWei("1", 'mwei');

        let value = await rootState.web3.contracts.market.methods.previewWrap(address, sum).call();
        value = utils.fromWei(value, 'mwei');
        commit('setAmountPerUsdPlus', value);
    },
}

const mutations = {

    setIndex(state, index) {
        state.index = index;
    },

    setAmountPerUsdPlus(state, value) {
        state.amountPerUsdPlus = value;
    },

    setAmountPerWUsdPlus(state, value) {
        state.amountPerWUsdPlus = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
