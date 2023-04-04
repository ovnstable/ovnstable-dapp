
const state = {

    isUsdtMintView: true,

    assetUsdtApproved: false,
    usdtPlusApproved: false,
};

const getters = {

    isUsdtMintView(state) {
        return state.isUsdtMintView;
    },

    assetUsdtApproved(state) {
        return state.assetUsdtApproved;
    },

    usdtPlusApproved(state) {
        return state.usdtPlusApproved;
    },
};

const actions = {

    async showUsdtRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsUsdtMintView', false)
    },

    async showUsdtMintView({commit, dispatch, getters, rootState}){
        commit('setIsUsdtMintView', true)
    },


    approveUsdtAsset({commit, dispatch, getters}) {
        commit('setUsdtAssetApproved', true);
    },

    approveUsdtPlus({commit, dispatch, getters}) {
        commit('setUsdtPlusApproved', true);
    },
};

const mutations = {

    setIsUsdtMintView(state, value) {
        state.isUsdtMintView = value;
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
