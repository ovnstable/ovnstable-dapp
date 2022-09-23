const state = {
    isMintView: true,

    show: false,
    etsData: null,

    etsTokenApproved: false,
    usdPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    etsData(state) {
        return state.etsData;
    },

    etsTokenApproved(state) {
        return state.etsTokenApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },
};

const actions = {

    showInvestModal({commit, dispatch, getters}, etsData) {
        commit('setEtsData', etsData);
        commit('setEtsTokenApproved', false);
        commit('setShow', true);
    },

    closeInvestModal({commit, dispatch, getters}) {
        commit('setShow', false);
        commit('setEtsData', null);
    },

    async showRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', false)
    },

    async showMintView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', true)
    },

    approveEtsToken({commit, dispatch, getters}) {
        commit('setEtsTokenApproved', true);
    },

    approveUsdPlus({commit, dispatch, getters}) {
        commit('setUsdPlusApproved', true);
    },
};

const mutations = {

    setIsMintView(state, value) {
        state.isMintView = value;
    },

    setShow(state, value) {
        state.show = value;
    },

    setEtsData(state, value) {
        state.etsData = value;
    },

    setEtsTokenApproved(state, value) {
        state.etsTokenApproved = value;
    },

    setUsdPlusApproved(state, value) {
        state.usdPlusApproved = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
