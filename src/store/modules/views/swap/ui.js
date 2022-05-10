
const state = {

   isMintView: true,

    usdcApproved: false,
    usdPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    usdcApproved(state) {
        return state.usdcApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },
};

const actions = {

    async showRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', false)
    },

    async showMintView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', true)
    },


    approveUsdc({commit, dispatch, getters}) {
        commit('setUsdcApproved', true);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', true);
    },
};

const mutations = {

    setIsMintView(state, value) {
        state.isMintView = value;
    },

    setUsdcApproved(state, usdcApproved) {
        state.usdcApproved = usdcApproved;
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
