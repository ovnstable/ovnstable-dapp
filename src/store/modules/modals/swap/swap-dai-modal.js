const state = {
    isMintView: true,

    show: false,

    assetDaiApproved: false,
    daiPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    assetDaiApproved(state) {
        return state.assetDaiApproved;
    },

    daiPlusApproved(state) {
        return state.daiPlusApproved;
    },
};

const actions = {

    showDaiSwapModal({commit, dispatch, getters}) {
        commit('setDaiShow', true);
    },

    closeDaiSwapModal({commit, dispatch, getters}) {
        commit('setDaiShow', false);
    },

    async showDaiRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsDaiMintView', false)
    },

    async showDaiMintView({commit, dispatch, getters, rootState}){
        commit('setIsDaiMintView', true)
    },

    approveAsset({commit, dispatch, getters}) {
        commit('setAssetDaiApproved', true);
    },

    disapproveAsset({commit, dispatch, getters}) {
        commit('setAssetDaiApproved', false);
    },

    approveDaiPlus({commit, dispatch, getters}) {
        commit('setDaiPlusApproved', true);
    },

    disapproveDaiPlus({commit, dispatch, getters}) {
        commit('setDaiPlusApproved', false);
    },
};

const mutations = {

    setIsDaiMintView(state, value) {
        state.isMintView = value;
    },

    setDaiShow(state, show) {
        state.show = show;
    },

    setAssetDaiApproved(state, assetDaiApproved) {
        state.assetDaiApproved = assetDaiApproved;
    },

    setDaiPlusApproved(state, daiPlusApproved) {
        state.daiPlusApproved = daiPlusApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
