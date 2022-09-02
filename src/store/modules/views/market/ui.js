
const state = {

    showUsdPlusWmatic: true,
    showUsdPlusWbnb: true,
    showBusdWbnb: true,

};

const getters = {

    showUsdPlusWmatic(state) {
        return state.showUsdPlusWmatic;
    },

    showUsdPlusWbnb(state) {
        return state.showUsdPlusWbnb;
    },

    showBusdWbnb(state) {
        return state.showBusdWbnb;
    },

};

const actions = {

    async hideUsdPlusWmatic({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWmatic', false);
    },

    async hideUsdPlusWbnb({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWbnb', false);
    },

    async hideBusdWbnb({commit, dispatch, getters, rootState}) {
        commit('setShowBusdWbnb', false);
    },

};

const mutations = {

    setShowUsdPlusWmatic(state, showUsdPlusWmatic) {
        state.showUsdPlusWmatic = showUsdPlusWmatic;
    },


    setShowUsdPlusWbnb(state, showUsdPlusWbnb) {
        state.showUsdPlusWbnb = showUsdPlusWbnb;
    },


    setShowBusdWbnb(state, showBusdWbnb) {
        state.showBusdWbnb = showBusdWbnb;
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
