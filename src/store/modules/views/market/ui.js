
const state = {

    showUsdPlusWmatic: true,
    showUsdPlusBnb: true,

};

const getters = {

    showUsdPlusWmatic(state) {
        return state.showUsdPlusWmatic;
    },

    showUsdPlusBnb(state) {
        return state.showUsdPlusBnb;
    },

};

const actions = {

    async hideUsdPlusWmatic({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWmatic', false);
    },

    async hideUsdPlusBnb({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusBnb', false);
    },

};

const mutations = {

    setShowUsdPlusWmatic(state, showUsdPlusWmatic) {
        state.showUsdPlusWmatic = showUsdPlusWmatic;
    },


    setShowUsdPlusBnb(state, showUsdPlusBnb) {
        state.showUsdPlusBnb = showUsdPlusBnb;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
