const state = {
    isWrapView: true,

    show: false,

    usdcApproved: false,
    usdPlusApproved: false,
    wUsdPlusApproved: false,
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

    wUsdPlusApproved(state) {
        return state.wUsdPlusApproved;
    },

};

const actions = {

    showEthWrapModal({commit, dispatch, getters}) {
        commit('setShow', true);
    },

    async showEthUnwrapView({commit, dispatch, getters, rootState}){
        commit('setIsWrapView', false)
    },

    async showEthWrapView({commit, dispatch, getters, rootState}){
        commit('setIsWrapView', true)
    },

    closeEthWrapModal({commit, dispatch, getters}) {
        commit('setShow', false);
    },

    approveUsdc({commit, dispatch, getters}) {
        commit('setUsdcApproved', true);
    },

    disapproveUsdc({commit, dispatch, getters}) {
        commit('setUsdcApproved', false);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        console.log("approveUsdPlus")
        commit('setUsdPlusApproved', true);
    },

    disapproveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', false);
    },

    approveWUsdPlus({commit, dispatch, getters}) {
        commit('setWUsdPlusApproved', true);
    },

    disapproveWUsdPlus({commit, dispatch, getters}) {
        commit('setWUsdPlusApproved', false);
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
