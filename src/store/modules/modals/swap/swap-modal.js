const state = {
    isMintView: true,

    show: false,

    assetApproved: false,
    usdPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    assetApproved(state) {
        return state.assetApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },
};

const actions = {

    showSwapModal({commit, dispatch, getters}) {
        commit('setShow', true);
    },

    async showRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', false)
    },

    async showMintView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', true)
    },

    closeSwapModal({commit, dispatch, getters}) {
        commit('setShow', false);
    },

    approveAsset({commit, dispatch, getters}) {
        commit('setAssetApproved', true);
    },

    disapproveAsset({commit, dispatch, getters}) {
        commit('setAssetApproved', false);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', true);
    },

    disapproveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', false);
    },
};

const mutations = {

    setIsMintView(state, value) {
        state.isMintView = value;
    },

    setShow(state, show) {
        state.show = show;
    },

    setAssetApproved(state, assetApproved) {
        state.assetApproved = assetApproved;
    },

    setUsdPlusApproved(state, usdPlusApproved) {
        state.usdPlusApproved = usdPlusApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
