const state = {

    showWrap: true,

    isWrapView: true,

    usdcApproved: false,
    usdPlusApproved: false,
    wUsdPlusApproved: false,
};

const getters = {

    showWrap(state) {
        return state.showWrap;
    },

    isWrapView(state) {
        return state.isWrapView;
    },

    usdcApproved(state) {
        return state.usdcApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },

    wUsdPlusApproved(state) {
        return state.wUsdPlusApproved;
    },
};

const actions = {

    async showUnWrapView({commit, dispatch, getters, rootState}) {
        commit('setIsWrapView', false)
    },

    async showWrapView({commit, dispatch, getters, rootState}) {
        commit('setIsWrapView', true)
    },


    approveUsdc({commit, dispatch, getters}) {
        commit('setUsdcApproved', true);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', true);
    },

    approveWUsdPlus({commit, dispatch, getters}) {
        commit('setWUsdPlusApproved', true);
    },

    async hidePage({commit, dispatch, getters, rootState}) {
        commit('setShowWrap', false);
    },

    async showPage({commit, dispatch, getters, rootState}) {
        commit('setShowWrap', true);
    },
};

const mutations = {

    setShowWrap(state, showWrap) {
        state.showWrap = showWrap;
    },

    setIsWrapView(state, value) {
        state.isWrapView = value;
    },

    setUsdcApproved(state, usdcApproved) {
        state.usdcApproved = usdcApproved;
    },

    setUsdPlusApproved(state, usdPlusApproved) {
        state.usdPlusApproved = usdPlusApproved;
    },

    setWUsdPlusApproved(state, wUsdPlusApproved) {
        state.wUsdPlusApproved = wUsdPlusApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
