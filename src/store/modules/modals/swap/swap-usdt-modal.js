const state = {
    isMintView: true,

    show: false,

    assetUsdtApproved: false,
    usdtPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    assetUsdtApproved(state) {
        return state.assetUsdtApproved;
    },

    usdtPlusApproved(state) {
        return state.usdtPlusApproved;
    },
};

const actions = {

    showUsdtSwapModal({commit, dispatch, getters}) {
        commit('setUsdtShow', true);
    },

    closeUsdtSwapModal({commit, dispatch, getters}) {
        commit('setUsdtShow', false);
    },

    async showUsdtRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsUsdtMintView', false)
    },

    async showUsdtMintView({commit, dispatch, getters, rootState}){
        commit('setIsUsdtMintView', true)
    },

    approveAsset({commit, dispatch, getters}) {
        commit('setAssetUsdtApproved', true);
    },

    disapproveAsset({commit, dispatch, getters}) {
        commit('setAssetUsdtApproved', false);
    },

    approveUsdtPlus({commit, dispatch, getters}) {
        commit('setUsdtPlusApproved', true);
    },

    disapproveUsdtPlus({commit, dispatch, getters}) {
        commit('setUsdtPlusApproved', false);
    },
};

const mutations = {

    setIsUsdtMintView(state, value) {
        state.isMintView = value;
    },

    setUsdtShow(state, show) {
        state.show = show;
    },

    setAssetUsdtApproved(state, assetUsdtApproved) {
        state.assetUsdtApproved = assetUsdtApproved;
    },

    setUsdtPlusApproved(state, usdtPlusApproved) {
        state.usdtPlusApproved = usdtPlusApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
