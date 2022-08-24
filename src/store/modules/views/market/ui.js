
const state = {

    showUsdPlusWmatic: true,
    showUsdPlusWbnb: true,

};

const getters = {

    showUsdPlusWmatic(state) {
        return state.showUsdPlusWmatic;
    },

    showUsdPlusWbnb(state) {
        return state.showUsdPlusWbnb;
    },

};

const actions = {

    async hideUsdPlusWmatic({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWmatic', false);
    },

    async hideUsdPlusWbnb({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWbnb', false);
    },

};

const mutations = {

    setShowUsdPlusWmatic(state, showUsdPlusWmatic) {
        state.showUsdPlusWmatic = showUsdPlusWmatic;
    },


    setShowUsdPlusWbnb(state, showUsdPlusWbnb) {
        state.showUsdPlusWbnb = showUsdPlusWbnb;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
