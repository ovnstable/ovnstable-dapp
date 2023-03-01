const state = {
    isMintView: true,

    show: false,
    showRedemptionRequest: false,
    showRedemptionRequestSuccess: false,

    insuranceTokenApproved: false,
    actionAssetApproved: false,
};

const getters = {

    isMintView(state) {
        return state.isMintView;
    },

    show(state) {
        return state.show;
    },

    showRedemptionRequest(state) {
        return state.showRedemptionRequest;
    },

    showRedemptionRequestSuccess(state) {
        return state.showRedemptionRequestSuccess;
    },

    insuranceTokenApproved(state) {
        return state.insuranceTokenApproved;
    },

    actionAssetApproved(state) {
        return state.actionAssetApproved;
    },
};

const actions = {

    showInvestModal({commit, dispatch, getters}) {
        commit('setInsuranceTokenApproved', false);
        commit('setShow', true);
    },

    closeInvestModal({commit, dispatch, getters}) {
        commit('setShow', false);
    },

    async showRedeemView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', false)
    },

    async showMintView({commit, dispatch, getters, rootState}){
        commit('setIsMintView', true)
    },

    showRedemptionRequestModal({commit, dispatch, getters}) {
        commit('setShowRedemptionRequest', true);
    },

    closeRedemptionRequestModal({commit, dispatch, getters}) {
        commit('setShowRedemptionRequest', false);
    },

    showRedemptionRequestSuccessModal({commit, dispatch, getters}) {
        commit('setShowRedemptionRequestSuccess', true);
    },

    closeRedemptionRequestSuccessModal({commit, dispatch, getters}) {
        commit('setShowRedemptionRequestSuccess', false);
    },

    approveInsuranceToken({commit, dispatch, getters}) {
        commit('setInsuranceTokenApproved', true);
    },

    disapproveInsuranceToken({commit, dispatch, getters}) {
        commit('setInsuranceTokenApproved', false);
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

    setShowRedemptionRequest(state, value) {
        state.showRedemptionRequest = value;
    },

    setShowRedemptionRequestSuccess(state, value) {
        state.showRedemptionRequestSuccess = value;
    },

    setInsuranceTokenApproved(state, value) {
        state.insuranceTokenApproved = value;
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
