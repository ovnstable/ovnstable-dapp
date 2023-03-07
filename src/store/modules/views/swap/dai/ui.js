
const state = {

    isDaiMintView: true,

    assetDaiApproved: false,
    daiPlusApproved: false,
};

const getters = {

    isDaiMintView(state) {
        return state.isDaiMintView;
    },

    assetDaiApproved(state) {
        return state.assetDaiApproved;
    },

    daiPlusApproved(state) {
        return state.daiPlusApproved;
    },
};

const actions = {

    async showDaiRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsDaiMintView', false)
    },

    async showDaiMintView({commit, dispatch, getters, rootState}){
        commit('setIsDaiMintView', true)
    },


    approveDaiAsset({commit, dispatch, getters}) {
        commit('setDaiAssetApproved', true);
    },

    approveDaiPlus({commit, dispatch, getters}) {
        commit('setDaiPlusApproved', true);
    },
};

const mutations = {

    setIsDaiMintView(state, value) {
        state.isDaiMintView = value;
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
