const state = {
    isMintView: true,

    show: false,

    usdPlusWmaticApproved: false,
    usdPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    usdPlusWmaticApproved(state) {
        return state.usdPlusWmaticApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },
};

const actions = {

    showInvestModal({commit, dispatch, getters}, errorType) {
        commit('setShow', true);
    },

    async showRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', false)
    },

    async showMintView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', true)
    },

    closeInvestModal({commit, dispatch, getters}) {
        commit('setShow', false);
    },

    approveUsdPlusWmatic({commit, dispatch, getters}) {
        commit('setUsdPlusWmaticApproved', true);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', true);
    },
};

const mutations = {

    setIsMintView(state, value) {
        state.isMintView = value;
    },

    setShow(state, show) {
        state.show = show;
    },

    setUsdPlusWmaticApproved(state, usdPlusWmaticApproved) {
        state.usdPlusWmaticApproved = usdPlusWmaticApproved;
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
