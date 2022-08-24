const state = {

    loadingCurrentTotalData: true,
    loadingTotalUsdPlus: true,
    loadingPayouts: true,

    showStats: true,
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

    showStats(state) {
        return state.showStats;
    },
};

const actions = {

    async hidePage({commit, dispatch, getters, rootState}) {
        commit('setShowStats', false);
    },

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

    setShowStats(state, showStats) {
        state.showStats = showStats;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
