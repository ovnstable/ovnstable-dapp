const state = {

    showDeposit: false,
    showWithdraw: false,
    showClaim: false,

    lpApproved: false,
};

const getters = {

    showDeposit(state) {
        return state.showDeposit;
    },

    showWithdraw(state) {
        return state.showWithdraw;
    },

    showClaim(state) {
        return state.showClaim;
    },

    lpApproved(state) {
        return state.lpApproved;
    },
};

const actions = {

    async showDepositModal({commit, dispatch, getters, rootState}) {
        commit('setShowDeposit', true);
    },

    async hideDepositModal({commit, dispatch, getters, rootState}) {
        commit('setShowDeposit', false);
    },

    async showWithdrawModal({commit, dispatch, getters, rootState}) {
        commit('setShowWithdraw', true);
    },

    async hideWithdrawModal({commit, dispatch, getters, rootState}) {
        commit('setShowWithdraw', false);
    },

    async showClaimModal({commit, dispatch, getters, rootState}) {
        commit('setShowClaim', true);
    },

    async hideClaimModal({commit, dispatch, getters, rootState}) {
        commit('setShowClaim', false);
    },

    async approveLP({commit, dispatch, getters, rootState}) {
        commit('setLpApproved', true);
    },

};

const mutations = {


    setShowDeposit(state, showDeposit) {
        state.showDeposit = showDeposit;
    },

    setShowWithdraw(state, showWithdraw) {
        state.showWithdraw = showWithdraw;
    },

    setShowClaim(state, showClaim) {
        state.showClaim = showClaim;
    },

    setLpApproved(state, lpApproved) {
        state.lpApproved = lpApproved;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
