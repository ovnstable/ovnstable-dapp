const state = {
    isMintView: true,

    show: false,

    assetEthApproved: false,
    ethPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    assetEthApproved(state) {
        return state.assetEthApproved;
    },

    ethPlusApproved(state) {
        return state.ethPlusApproved;
    },
};

const actions = {

    showEthSwapModal({commit, dispatch, getters}) {
        commit('setEthShow', true);
    },

    closeEthSwapModal({commit, dispatch, getters}) {
        commit('setEthShow', false);
    },

    async showEthRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsEthMintView', false)
    },

    async showEthMintView({commit, dispatch, getters, rootState}){
        commit('setIsEthMintView', true)
    },

    approveAsset({commit, dispatch, getters}) {
        commit('setAssetEthApproved', true);
    },

    disapproveAsset({commit, dispatch, getters}) {
        commit('setAssetEthApproved', false);
    },

    approveEthPlus({commit, dispatch, getters}) {
        commit('setEthPlusApproved', true);
    },

    disapproveEthPlus({commit, dispatch, getters}) {
        commit('setEthPlusApproved', false);
    },
};

const mutations = {

    setIsEthMintView(state, value) {
        state.isMintView = value;
    },

    setEthShow(state, show) {
        state.show = show;
    },

    setAssetEthApproved(state, assetEthApproved) {
        state.assetEthApproved = assetEthApproved;
    },

    setEthPlusApproved(state, ethPlusApproved) {
        state.ethPlusApproved = ethPlusApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
