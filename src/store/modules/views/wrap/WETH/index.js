const state = {

    index: null,
    amountPlus: null,
    amountWrapPlus: null,
};

const getters = {

    index(state) {
        return state.index;
    },

    amountTokenPlus(state) {
        return state.amountPlus;
    },

    amountWrapTokenPlus(state) {
        return state.amountWrapPlus;
    },
};

const actions = {

    async refreshWrap({commit, dispatch, getters, rootState}) {
        console.log('WrapData: refreshWrap WETH');

        if (rootState.web3.contracts === null)
            return;

        dispatch('loadIndex');
        dispatch('loadAmountTokenPlus');
        dispatch('loadAmountWrapPlus');

        dispatch('accountData/refreshBalance', null, {root: true});
        dispatch('supplyData/refreshSupply', null, {root:true});
        dispatch('supplyData/refreshInsuranceSupply', null, {root:true});
    },

    async loadIndex({commit, dispatch, getters, rootState}) {

        let index = await rootState.web3.contracts.wEthPlus.methods.rate().call();
        commit('setIndex', index.substring(0, 3) / 100);

    },

    async loadAmountWrapPlus({commit, dispatch, getters, rootState}) {
        console.log('WrapData: loadAmountWrapPlus1');

        let utils = rootState.web3.web3.utils;
        let address = rootState.web3.contracts.ethPlus.options.address;
        let sum = utils.toWei("1", 'mwei');

        console.log(address, 'address: loadAmountWrapPlus');
        let value = await rootState.web3.contracts.marketWeth.methods.previewUnwrap(address, sum).call();
        console.log(value, 'WrapData: loadAmountWrapPlus');
        value = utils.fromWei(value, 'mwei');

        commit('updateAmountWrapPlus', value);
    },

    async loadAmountTokenPlus({commit, dispatch, getters, rootState}) {

        let utils = rootState.web3.web3.utils;

        let address = rootState.web3.contracts.ethPlus.options.address;
        let sum = utils.toWei("1", 'mwei');

        let value = await rootState.web3.contracts.marketWeth.methods.previewWrap(address, sum).call();
        console.log(value, 'WrapData: loadAmountTokenPlus');
        value = utils.fromWei(value, 'mwei');
        commit('updateAmountTokenPlus', value);
    },
}

const mutations = {

    setIndex(state, index) {
        state.index = index;
    },

    updateAmountTokenPlus(state, value) {
        state.amountPlus = value;
    },

    updateAmountWrapPlus(state, value) {
        state.amountWrapPlus = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
