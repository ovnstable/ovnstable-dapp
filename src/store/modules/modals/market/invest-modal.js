const state = {
    isMintView: true,

    show: false,
    showBusdWbnbModal: false,

    usdPlusWmaticApproved: false,
    usdPlusWbnbApproved: false,
    busdWbnbApproved: false,
    usdPlusApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    showBusdWbnbModal(state) {
        return state.showBusdWbnbModal;
    },

    usdPlusWmaticApproved(state) {
        return state.usdPlusWmaticApproved;
    },

    usdPlusWbnbApproved(state) {
        return state.usdPlusWmaticApproved;
    },

    busdWbnbApproved(state) {
        return state.busdWbnbApproved;
    },

    usdPlusApproved(state) {
        return state.usdPlusApproved;
    },
};

const actions = {

    showInvestModal({commit, dispatch, getters}) {
        commit('setShow', true);
    },

    showBusdWbnbModal({commit, dispatch, getters}) {
        commit('setShowBusdWbnbModal', true);
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

    closeBusdWbnbModal({commit, dispatch, getters}) {
        commit('setShowBusdWbnbModal', false);
    },

    approveUsdPlusWmatic({commit, dispatch, getters}) {
        commit('setUsdPlusWmaticApproved', true);
    },

    approveUsdPlusWbnb({commit, dispatch, getters}) {
        commit('setUsdPlusWmaticApproved', true);
    },

    approveBusdWbnb({commit, dispatch, getters}) {
        commit('setBusdWbnbApproved', true);
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

    setShowBusdWbnbModal(state, showBusdWbnbModal) {
        state.showBusdWbnbModal = showBusdWbnbModal;
    },

    setUsdPlusWmaticApproved(state, usdPlusWmaticApproved) {
        state.usdPlusWmaticApproved = usdPlusWmaticApproved;
    },

    setUsdPlusWbnbApproved(state, usdPlusWmaticApproved) {
        state.usdPlusWmaticApproved = usdPlusWmaticApproved;
    },

    setBusdWbnbApproved(state, busdWbnbApproved) {
        state.busdWbnbApproved = busdWbnbApproved;
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
