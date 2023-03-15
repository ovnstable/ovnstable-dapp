const state = {
    isWrapView: true,

    show: false,

    usdcDisapproved: false,
    usdcApproved: false,
    usdPlusApproved: false,
    usdPlusDisapproved: false,
    wUsdPlusApproved: false,
    wUsdPlusDisapproved: false,
};

const getters = {

    isWrapView(state) {
        return state.isWrapView;
    },

    show(state) {
        return state.show;
    },

    usdcApproved(state) {
        return state.usdcApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },

    usdcDisapproved(state) {
        return state.usdcDisapproved;
    },

    usdPlusDisapproved(state) {
        return state.usdPlusDisapproved;
    },

    wUsdPlusApproved(state) {
        return state.wUsdPlusApproved;
    },

    wUsdPlusDisapproved(state) {
        return state.wUsdPlusDisapproved;
    },
};

const actions = {

    showWrapModal({commit, dispatch, getters}) {
        commit('setShow', true);
    },

    async showUnwrapView({commit, dispatch, getters, rootState}){
        commit('setIsWrapView', false)
    },

    async showWrapView({commit, dispatch, getters, rootState}){
        commit('setIsWrapView', true)
    },

    closeWrapModal({commit, dispatch, getters}) {
        commit('setShow', false);
    },

    approveUsdc({commit, dispatch, getters}) {
        commit('setUsdcApproved', true);
    },

    disapproveUsdc({commit, dispatch, getters}) {
        commit('setUsdcDisapproved', false);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', true);
    },

    disapproveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusDisapproved', false);
    },

    approveWUsdPlus({commit, dispatch, getters}) {
        commit('setWUsdPlusApproved', true);
    },

    disapproveWUsdPlus({commit, dispatch, getters}) {
        commit('setWUsdPlusDisapproved', true);
    },
};

const mutations = {

    setIsWrapView(state, value) {
        state.isWrapView = value;
    },

    setShow(state, show) {
        state.show = show;
    },

    setUsdcApproved(state, usdcApproved) {
        state.usdcApproved = usdcApproved;
    },

    setUsdPlusApproved(state, usdPlusApproved) {
        state.usdPlusApproved = usdPlusApproved;
    },


    setUsdcDisapproved(state, usdcApproved) {
        state.usdcApproved = usdcApproved;
    },

    setUsdPlusDisapproved(state, usdPlusDisapproved) {
        state.usdPlusDisapproved = usdPlusDisapproved;
    },

    setWUsdPlusApproved(state, wUsdPlusApproved) {
        state.wUsdPlusApproved = wUsdPlusApproved;
    },

    setWUsdPlusDisapproved(state, wUsdPlusDisapproved) {
        state.wUsdPlusDisapproved = wUsdPlusDisapproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
