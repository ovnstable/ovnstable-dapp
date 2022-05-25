const state = {

    loadingCurrentTotalData: true,
    loadingTotalUsdPlus: true,
    loadingPayouts: true,

};

const getters = {

    loadingCurrentTotalData(state) {
        return state.loadingCurrentTotalData;
    },
    loadingPayouts(state) {
        return state.loadingPayouts;
    },

    loadingTotalUsdPlus(state) {
        return state.loadingTotalUsdPlus;
    },

};

const actions = {


};

const mutations = {

    setLoadingCurrentTotalData(state, value) {
        state.loadingCurrentTotalData = value;
    },

    setLoadingTotalUsdPlus(state, value) {
        state.loadingTotalUsdPlus = value;
    },

    setLoadingPayouts(state, value) {
        state.loadingPayouts = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
