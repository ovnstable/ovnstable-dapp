
const state = {

    isEthMintView: true,

    assetEthApproved: false,
    ethPlusApproved: false,
};

const getters = {

    isEthMintView(state) {
        return state.isEthMintView;
    },

    assetEthApproved(state) {
        return state.assetEthApproved;
    },

    ethPlusApproved(state) {
        return state.ethPlusApproved;
    },
};

const actions = {

    async showEthRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsEthMintView', false)
    },

    async showEthMintView({commit, dispatch, getters, rootState}){
        commit('setIsEthMintView', true)
    },


    approveEthAsset({commit, dispatch, getters}) {
        commit('setEthAssetApproved', true);
    },

    approveEthPlus({commit, dispatch, getters}) {
        commit('setEthPlusApproved', true);
    },
};

const mutations = {

    setIsEthMintView(state, value) {
        state.isEthMintView = value;
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
