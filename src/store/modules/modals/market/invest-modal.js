const state = {
    isMintView: true,

    show: false,
    etsData: null,

    etsTokenApproved: false,
    actionAssetApproved: false,
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

    actionAssetApproved(state) {
        return state.actionAssetApproved;
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

    disapproveEtsToken({commit, dispatch, getters}) {
        commit('setEtsTokenApproved', false);
    },

    approveActionAsset({commit, dispatch, getters}) {
        commit('setActionAssetApproved', true);
    },

    disapproveActionAsset({commit, dispatch, getters}) {
        commit('setActionAssetApproved', false);
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

    setActionAssetApproved(state, value) {
        state.actionAssetApproved = value;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
