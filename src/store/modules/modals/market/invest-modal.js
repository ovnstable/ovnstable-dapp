const state = {
    isMintView: true,

    show: false,
    showBusdWbnbModal: false,
    showWmaticUsdcModal: false,

    usdPlusWmaticApproved: false,
    wmaticUsdcApproved: false,
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

    showWmaticUsdcModal(state) {
        return state.showWmaticUsdcModal;
    },

    usdPlusWmaticApproved(state) {
        return state.usdPlusWmaticApproved;
    },

    wmaticUsdcApproved(state) {
        return state.wmaticUsdcApproved;
    },

    usdPlusWbnbApproved(state) {
        return state.usdPlusWbnbApproved;
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

    showWmaticUsdcModal({commit, dispatch, getters}) {
        commit('setShowWmaticUsdcModal', true);
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

    closeWmaticUsdcModal({commit, dispatch, getters}) {
        commit('setShowWmaticUsdcModal', false);
    },

    approveUsdPlusWmatic({commit, dispatch, getters}) {
        commit('setUsdPlusWmaticApproved', true);
    },

    approveWmaticUsdc({commit, dispatch, getters}) {
        commit('setWmaticUsdcApproved', true);
    },

    approveUsdPlusWbnb({commit, dispatch, getters}) {
        commit('setUsdPlusWbnbApproved', true);
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

    setShowWmaticUsdcModal(state, showWmaticUsdcModal) {
        state.showWmaticUsdcModal = showWmaticUsdcModal;
    },

    setUsdPlusWmaticApproved(state, usdPlusWmaticApproved) {
        state.usdPlusWmaticApproved = usdPlusWmaticApproved;
    },

    setWmaticUsdcApproved(state, wmaticUsdcApproved) {
        state.wmaticUsdcApproved = wmaticUsdcApproved;
    },

    setUsdPlusWbnbApproved(state, usdPlusWbnbApproved) {
        state.usdPlusWbnbApproved = usdPlusWbnbApproved;
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
