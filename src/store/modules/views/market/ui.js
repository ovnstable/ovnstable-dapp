
const state = {

    showUsdPlusWmatic: true,
    showWmaticUsdc: true,
    showEtsMoonstone: true,
    showUsdPlusWbnb: true,
    showBusdWbnb: true,

};

const getters = {

    showUsdPlusWmatic(state) {
        return state.showUsdPlusWmatic;
    },

    showWmaticUsdc(state) {
        return state.showWmaticUsdc;
    },

    showEtsMoonstone(state) {
        return state.showEtsMoonstone;
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

    async showUsdPlusWmatic({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWmatic', true);
    },

    async hideWmaticUsdc({commit, dispatch, getters, rootState}) {
        commit('setShowWmaticUsdc', false);
    },

    async showWmaticUsdc({commit, dispatch, getters, rootState}) {
        commit('setShowWmaticUsdc', true);
    },

    async hideEtsMoonstone({commit, dispatch, getters, rootState}) {
        commit('setShowEtsMoonstone', false);
    },

    async showEtsMoonstone({commit, dispatch, getters, rootState}) {
        commit('setShowEtsMoonstone', true);
    },

    async hideUsdPlusWbnb({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWbnb', false);
    },

    async showUsdPlusWbnb({commit, dispatch, getters, rootState}) {
        commit('setShowUsdPlusWbnb', true);
    },

    async hideBusdWbnb({commit, dispatch, getters, rootState}) {
        commit('setShowBusdWbnb', false);
    },

    async showBusdWbnb({commit, dispatch, getters, rootState}) {
        commit('setShowBusdWbnb', true);
    },

};

const mutations = {

    setShowUsdPlusWmatic(state, showUsdPlusWmatic) {
        state.showUsdPlusWmatic = showUsdPlusWmatic;
    },

    setShowWmaticUsdc(state, showWmaticUsdc) {
        state.showWmaticUsdc = showWmaticUsdc;
    },

    setShowEtsMoonstone(state, value) {
        state.showEtsMoonstone = value;
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
